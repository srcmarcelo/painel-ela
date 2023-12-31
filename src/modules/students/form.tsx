import { MyForm, Option, formFields } from '@/lib/ts-form';
import React from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { FileText, Loader } from 'lucide-react';
import { translate } from '@/lib/translate';
import { useCreateStudents } from './api';
import { useRouter } from 'next/navigation';

const StudentSchema = z.object({
  name: formFields.text.describe('Nome'),
  mother: formFields.select_option.describe('Mãe').optional(),
  father: formFields.select_option.describe('Pai').optional(),
  responsible: formFields.select_option.describe('Responsável').optional(),
  classroom: formFields.select_option.describe('Turma').optional(),
  date_of_birth: formFields.date_picker.describe('Data de nascimento'),
});

export function StudentForm({
  currentId,
  loading,
  classes,
  responsibles,
  onSubmit: _onSubmit,
}: {
  currentId?: string;
  loading: boolean;
  classes: any[];
  responsibles: any[];
  onSubmit?: (values: any) => void;
}) {
  const router = useRouter();
  const { createStudents } = useCreateStudents();

  const onSubmit = async (values: z.infer<typeof StudentSchema>) => {
    const formattedValues = {
      name: values.name,
      date_of_birth: values.date_of_birth,
      responsible_id: values.responsible,
      mother_id: values.mother,
      father_id: values.father,
      class_id: values.classroom,
    };
    await createStudents(formattedValues);
    router.push('/alunos');
  };

  const classesData: Option[] =
    classes?.map((classroom): Option => {
      return {
        label: `${classroom.grade} - ${translate.period[classroom.period]}`,
        value: classroom.id,
      };
    }) || [];

  const responsiblesData: Option[] =
    responsibles?.map((responsible): Option => {
      return {
        label: responsible.name,
        value: responsible.id,
      };
    }) || [];

  return loading ? (
    <div className='flex flex-1 justify-center items-center'>
      <Loader />
    </div>
  ) : (
    <MyForm
      formProps={{ id: 'student_form' }}
      renderAfter={() => (
        <Button type='submit'>
          <FileText className='h-5 w-5' />
          Salvar
        </Button>
      )}
      schema={StudentSchema}
      props={{
        classroom: {
          options: classesData,
        } as any,
        mother: {
          options: responsiblesData,
        } as any,
        father: {
          options: responsiblesData,
        } as any,
        responsible: {
          options: responsiblesData,
        } as any,
      }}
      // defaultValues={defaultValues as any}
      onSubmit={onSubmit}
    >
      {({ name, classroom, mother, father, responsible, date_of_birth }) => {
        return (
          <div className='space-y-8 py-4 w-full mb-4'>
            <div className='grid grid-cols-3 gap-3 w-full'>
              <div>{name}</div>
              <div>{date_of_birth}</div>
              <div>{classroom}</div>
            </div>
            <div className='grid grid-cols-3 gap-3 w-full'>
              <div>{mother}</div>
              <div>{father}</div>
              <div>{responsible}</div>
            </div>
          </div>
        );
      }}
    </MyForm>
  );
}
