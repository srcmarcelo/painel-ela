import { MyForm, Option, formFields } from '@/lib/ts-form';
import React, { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { FileText, Loader } from 'lucide-react';
import { translate } from '@/lib/translate';
import { useRouter } from 'next/navigation';
import { useStudents } from './api';
import { useClasses } from '../classes/api';
import { useResponsibles } from '../responsibles/api';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { parseISODateWithOffset } from '@/lib/utils';

const StudentSchema = z.object({
  name: formFields.text.describe('Nome'),
  mother: formFields.select_option.describe('Mãe').optional(),
  father: formFields.select_option.describe('Pai').optional(),
  responsible: formFields.select_option.describe('Responsável').optional(),
  classroom: formFields.select_option.describe('Turma').optional(),
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

  const { createStudents, fetchStudentById, upadteStudent } = useStudents();
  const { fetchClasses } = useClasses();
  const { fetchResponsibles } = useResponsibles();

  const [classes, setClasses] = useState<any[]>([]);
  const [responsibles, setResponsibles] = useState<any[]>([]);
  const [student, setStudent] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: classesData, error: classesError } = await fetchClasses();
        const { data: responsibleData, error: responsiblesError } =
          await fetchResponsibles();
        if (currentId) {
          const { data: studentData } = await fetchStudentById(currentId);
          setStudent(studentData);
        }

        if (classesError || responsiblesError)
          throw { classesError, responsiblesError };

        setClasses(classesData);
        setResponsibles(responsibleData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = useMemo(() => {
    const formatedValues = student
      ? {
          name: student.name,
          mother: student.mother_id,
          father: student.father_id,
          responsible: student.responsible_id,
          classroom: student.class_id,
          date_of_birth: format(
            parseISODateWithOffset(student.date_of_birth),
            'dd/MM/yyyy',
            {
              locale: ptBR,
            }
          ),
        }
      : {};

    return formatedValues;
  }, [student]);

  const onSubmit = async (values: z.infer<typeof StudentSchema>) => {
    const parsedDateOfBirth = parse(
      values.date_of_birth,
      'dd/MM/yyyy',
      new Date()
    );

    const formattedValues = {
      name: values.name,
      date_of_birth: parsedDateOfBirth,
      responsible_id: values.responsible,
      mother_id: values.mother,
      father_id: values.father,
      class_id: values.classroom,
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
      defaultValues={defaultValues as any}
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
