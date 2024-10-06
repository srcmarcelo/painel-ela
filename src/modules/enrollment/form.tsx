'use client';

import { PageHeader } from '@/components/page-header';
import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { useData } from '@/lib/data/context';
import { translate } from '@/lib/translate';
import { MyForm, Option, formFields } from '@/lib/ts-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parse } from 'date-fns';
import { FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import { z } from 'zod';
import { useResponsibles } from '../responsibles/api';
import { useStudents } from '../students/api';

const RegistrationSchema = z.object({
  name: formFields.text.describe('Nome'),
  class_id: formFields.select_option.describe('Turma').optional(),
  date_of_birth: formFields.date_input.describe('Data de nascimento'),
  responsible_registered: formFields.switch
    .describe('Responsável já cadastrado?')
    .optional(),
  responsible_id: formFields.select_option.describe('Responsável').optional(),
  responsible_name: formFields.text.describe('Nome do responsável').optional(),
  cpf: formFields.text_cpf.describe('CPF').optional(),
  phone: formFields.text_phone.describe('Telefone').optional(),
  email: formFields.text.describe('Email').email('Email inválido').optional(),
  responsible_type: formFields.select_option.describe('Tipo'),
});

export function EnrollmentForm({
  onSubmit: _onSubmit,
}: {
  onSubmit?: () => void;
}) {
  const { createStudents } = useStudents();
  const { createResponsibles, updateResponsible, loadingSubmit } =
    useResponsibles();

  const EnrollmentFormRef = useForm<z.infer<typeof RegistrationSchema>>({
    resolver: zodResolver(RegistrationSchema),
  });

  const { responsibles, classes, loading, loadResponsibles, loadStudents } =
    useData();

  const onSubmit = async (values: z.infer<typeof RegistrationSchema>) => {
    const studentUUID = v4();
    const responsibleUUID = values.responsible_id || v4();

    if (values.responsible_registered && !values.responsible_id) {
      throw new Error('Responsável precisa ser fornecido');
    }

    const parsedDateOfBirth = parse(
      values.date_of_birth,
      'dd/MM/yyyy',
      new Date()
    );

    const invoicesMonths = [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ];

    const currentIndexMonth = new Date().getMonth();

    const invoices = invoicesMonths.map(
      (_, index) => index <= currentIndexMonth
    );

    const studentFormattedValues: {
      [key: string]: any;
    } = {
      id: studentUUID,
      name: values.name,
      class_id: values.class_id,
      date_of_birth: parsedDateOfBirth,
      responsible_id: responsibleUUID,
      invoices,
    };

    const reponsibleFormattedValues: {
      [key: string]: any;
    } = {
      id: responsibleUUID,
      cpf: values.cpf,
      name: values.responsible_name,
      phone: values.phone,
      email: values.email,
      responsible_type: values.responsible_type,
      children: [studentUUID],
    };

    if (values.responsible_type === 'mother') {
      studentFormattedValues.mother_id = responsibleUUID;
    } else if (values.responsible_type === 'father') {
      studentFormattedValues.father_id = responsibleUUID;
    }

    Object.keys(studentFormattedValues).forEach((key: any) => {
      if (
        studentFormattedValues[key] === null ||
        !studentFormattedValues[key]
      ) {
        delete studentFormattedValues[key];
      }
    });

    Object.keys(reponsibleFormattedValues).forEach((key: any) => {
      if (
        reponsibleFormattedValues[key] === null ||
        !reponsibleFormattedValues[key]
      ) {
        delete reponsibleFormattedValues[key];
      }
    });

    if (values.responsible_registered) {
      const { error } = await createStudents(studentFormattedValues);
      const { error: responsibleError } = await updateResponsible(
        {
          children: [
            ...(responsibles.find((r) => r.id === responsibleUUID)?.children ||
              []),
            studentUUID,
          ],
        },
        responsibleUUID
      );

      if (!error && !responsibleError) {
        EnrollmentFormRef.reset();
        loadResponsibles();
        loadStudents();
      }
    } else {
      const { error } = await createStudents(studentFormattedValues);
      const { error: responsibleError } = await createResponsibles(
        reponsibleFormattedValues
      );

      if (!error && !responsibleError) {
        EnrollmentFormRef.reset();
        loadResponsibles();
        loadStudents();
      }
    }
  };

  const classesData: Option[] =
    classes?.map((classroom): Option => {
      return {
        label: `${classroom.grade} - ${translate.period[classroom.period]}`,
        value: classroom.id,
      };
    }) || [];

  const responsiblesData: Option[] = (
    responsibles?.map((responsible): Option => {
      return {
        label: responsible.name.toUpperCase(),
        value: responsible.id,
      };
    }) || []
  ).sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });

  const responsibleTypes: Option[] = [
    { label: 'Mãe', value: 'mother' },
    { label: 'Pai', value: 'father' },
    { label: 'Outro', value: 'other' },
  ];

  return loading ? (
    <div className='flex flex-1 justify-center items-center'>
      <Spinner />
    </div>
  ) : (
    <MyForm
      formProps={{ id: 'enrollment_form' }}
      renderAfter={() => (
        <Button
          type='submit'
          className='gap-2'
          isLoading={loadingSubmit}
          loadingText='Salvando...'
        >
          <FileText className='h-5 w-5' />
          Salvar
        </Button>
      )}
      form={EnrollmentFormRef}
      schema={RegistrationSchema}
      props={{
        class_id: {
          options: classesData,
        } as any,
        responsible_type: {
          options: responsibleTypes,
        } as any,
        responsible_id: {
          options: responsiblesData,
        } as any,
      }}
      onSubmit={onSubmit}
    >
      {({
        name,
        class_id,
        date_of_birth,
        responsible_registered,
        responsible_id,
        responsible_name,
        cpf,
        phone,
        email,
        responsible_type,
      }) => {
        const hasResponsible = EnrollmentFormRef.watch().responsible_registered;

        return (
          <div className='space-y-8 py-4 w-full mb-4'>
            <PageHeader
              title='Aluno'
              subtitle='Dados do aluno'
              className='justify-center'
            />
            <div className='grid grid-cols-3 gap-3 w-full max-md:grid-cols-1'>
              <div>{name}</div>
              <div>{date_of_birth}</div>
              <div>{class_id}</div>
              <div>{responsible_registered}</div>
            </div>
            <PageHeader
              title='Responsável'
              subtitle='Dados do responsável'
              className='justify-center'
            />
            {hasResponsible ? (
              <div className='grid grid-cols-3 gap-3 w-full max-md:grid-cols-1'>
                <div>{responsible_id}</div>
                <div>{responsible_type}</div>
              </div>
            ) : (
              <>
                <div className='grid grid-cols-2 gap-3 w-full max-md:grid-cols-1'>
                  <div>{responsible_name}</div>
                  <div>{email}</div>
                </div>
                <div className='grid grid-cols-3 gap-3 w-full max-md:grid-cols-1'>
                  <div>{cpf}</div>
                  <div>{phone}</div>
                  <div>{responsible_type}</div>
                </div>
              </>
            )}
          </div>
        );
      }}
    </MyForm>
  );
}
