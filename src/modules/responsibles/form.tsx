import { MyForm, Option, formFields } from '@/lib/ts-form';
import React, { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { FileText, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useResponsibles } from './api';
import { useStudents } from '../students/api';

const ResponsibleSchema = z.object({
  name: formFields.text.describe('Nome'),
  cpf: formFields.text_cpf.describe('CPF').optional(),
  phone: formFields.text_phone.describe('Telefone').optional(),
  email: formFields.text.describe('Email').email('Email inválido').optional(),
  responsible_type: formFields.select_option.describe('Tipo'),
  children: formFields.multi_select.describe('Crianças').optional(),
});

export function ResponsibleForm({
  currentId,
  onSubmit: _onSubmit,
}: {
  currentId?: string;
  onSubmit?: (values: any) => void;
}) {
  const router = useRouter();
  const { createResponsibles, fetchResponsibleById, upadteResponsible } =
    useResponsibles();
  const { fetchStudents } = useStudents();

  const [students, setStudents] = useState<any[]>([]);
  const [responsible, setResponsible] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: studentsData, error: studentsError } =
          await fetchStudents();
        if (currentId) {
          const { data: responsibleData } = await fetchResponsibleById(
            currentId
          );
          setResponsible(responsibleData);
        }

        if (studentsError) throw studentsError;

        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = useMemo(() => {
    const formattedValues = responsible || {};

    Object.keys(formattedValues).forEach((key: any) => {
      if (formattedValues[key] === null) {
        delete formattedValues[key];
      }
    });
    return formattedValues;
  }, [responsible]);

  const onSubmit = async (values: z.infer<typeof ResponsibleSchema>) => {
    const formattedValues: any = values || {};

    Object.keys(formattedValues).forEach((key: any) => {
      if (formattedValues[key] === null) {
        delete formattedValues[key];
      }
    });
  
    const { error } = currentId
      ? await upadteResponsible(formattedValues, currentId)
      : await createResponsibles(formattedValues);

    if (!error) {
      router.push('/responsaveis');
    }
  };

  const studentsData: Option[] =
    students?.map((student): Option => {
      return {
        label: student.name,
        value: student.id,
      };
    }) || [];

  const responsibleTypes: Option[] = [
    { label: 'Mãe', value: 'mother' },
    { label: 'Pai', value: 'father' },
    { label: 'Outro', value: 'other' },
  ];

  return loading ? (
    <div className='flex flex-1 justify-center items-center'>
      <Loader />
    </div>
  ) : (
    <MyForm
      formProps={{ id: 'responsible_form' }}
      renderAfter={() => (
        <Button type='submit'>
          <FileText className='h-5 w-5' />
          Salvar
        </Button>
      )}
      schema={ResponsibleSchema}
      props={{
        responsible_type: {
          options: responsibleTypes,
        } as any,
        children: {
          options: studentsData,
        } as any,
      }}
      defaultValues={defaultValues as any}
      onSubmit={onSubmit}
    >
      {({ name, cpf, phone, email, responsible_type, children }) => {
        return (
          <div className='space-y-8 py-4 w-full mb-4'>
            <div className='grid grid-cols-2 gap-3 w-full max-md:grid-cols-1'>
              <div>{name}</div>
              <div>{email}</div>
            </div>
            <div className='grid grid-cols-3 gap-3 w-full max-md:grid-cols-1'>
              <div>{cpf}</div>
              <div>{phone}</div>
              <div>{responsible_type}</div>
            </div>
            <div className='w-full'>
              <div>{children}</div>
            </div>
          </div>
        );
      }}
    </MyForm>
  );
}
