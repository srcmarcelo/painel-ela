import { MyForm, Option, formFields } from '@/lib/ts-form';
import React, { useMemo } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { FileText, Loader } from 'lucide-react';
import { translate } from '@/lib/translate';
import { useRouter } from 'next/navigation';
import { useStudents } from './api';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { parseISODateWithOffset } from '@/lib/utils';
import { useData } from '@/lib/context';
import { Student } from './schema';

const StudentSchema = z.object({
  name: formFields.text.describe('Nome'),
  mother_id: formFields.select_option.describe('Mãe').optional(),
  father_id: formFields.select_option.describe('Pai').optional(),
  responsible_id: formFields.select_option.describe('Responsável').optional(),
  class_id: formFields.select_option.describe('Turma').optional(),
  date_of_birth: formFields.date_input.describe('Data de nascimento'),
});

export function StudentForm({
  currentId,
  onSubmit: _onSubmit,
}: {
  currentId?: string;
  onSubmit?: (values: any) => void;
}) {
  const router = useRouter();

  const { createStudents, upadteStudent } = useStudents();

  const { students, responsibles, classes, loading } = useData();

  const defaultValues = useMemo(() => {
    const student: Student | undefined = students.find(
      (e) => e.id === currentId
    );

    const formatedValues = student
      ? {
          name: student.name,
          mother: student.mother_id,
          father: student.father_id,
          responsible: student.responsible_id,
          classroom: student.class_id,
          date_of_birth: format(
            parseISODateWithOffset(student.date_of_birth as unknown as string),
            'dd/MM/yyyy',
            {
              locale: ptBR,
            }
          ),
        }
      : {};

    return formatedValues;
  }, [currentId, students]);

  const onSubmit = async (values: z.infer<typeof StudentSchema>) => {
    const parsedDateOfBirth = parse(
      values.date_of_birth,
      'dd/MM/yyyy',
      new Date()
    );

    const formattedValues = {
      ...values,
      date_of_birth: parsedDateOfBirth,
    };

    const { error } = currentId
      ? await upadteStudent(formattedValues, currentId)
      : await createStudents(formattedValues);

    if (!error) {
      router.push('/alunos');
    }
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
        class_id: {
          options: classesData,
        } as any,
        mother_id: {
          options: responsiblesData,
        } as any,
        father_id: {
          options: responsiblesData,
        } as any,
        responsible_id: {
          options: responsiblesData,
        } as any,
      }}
      defaultValues={defaultValues as any}
      onSubmit={onSubmit}
    >
      {({
        name,
        class_id,
        mother_id,
        father_id,
        responsible_id,
        date_of_birth,
      }) => {
        return (
          <div className='space-y-8 py-4 w-full mb-4'>
            <div className='grid grid-cols-3 gap-3 w-full'>
              <div>{name}</div>
              <div>{date_of_birth}</div>
              <div>{class_id}</div>
            </div>
            <div className='grid grid-cols-3 gap-3 w-full'>
              <div>{mother_id}</div>
              <div>{father_id}</div>
              <div>{responsible_id}</div>
            </div>
          </div>
        );
      }}
    </MyForm>
  );
}
