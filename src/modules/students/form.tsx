import { Button } from '@/components/ui/button';
import { useData } from '@/lib/data/context';
import { translate } from '@/lib/translate';
import { MyForm, Option, formFields } from '@/lib/ts-form';
import { parseISODateWithOffset } from '@/lib/utils';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { z } from 'zod';
import { useStudents } from './api';
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
  onSubmit?: () => void;
}) {
  const router = useRouter();

  const { createStudents, updateStudent, loadingSubmit } = useStudents();

  const { students, responsibles, classes, loading, loadStudents } = useData();

  const defaultValues = useMemo(() => {
    const student: Student | undefined = students.find(
      (e) => e.id === currentId
    );

    const formattedValues: any = student
      ? {
          ...student,
          date_of_birth: format(
            parseISODateWithOffset(student.date_of_birth as unknown as string),
            'dd/MM/yyyy',
            {
              locale: ptBR,
            }
          ),
        }
      : {};

    Object.keys(formattedValues).forEach((key: any) => {
      if (formattedValues[key] === null) {
        delete formattedValues[key];
      }
    });

    return formattedValues;
  }, [currentId, students]);

  const onSubmit = async (values: z.infer<typeof StudentSchema>) => {
    const parsedDateOfBirth = parse(
      values.date_of_birth,
      'dd/MM/yyyy',
      new Date()
    );

    const formattedValues: { [key: string]: string | Date | null } = {
      ...values,
      date_of_birth: parsedDateOfBirth,
    };

    Object.keys(formattedValues).forEach((key: any) => {
      if (formattedValues[key] === null) {
        delete formattedValues[key];
      }
    });

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

    const { error } = currentId
      ? await updateStudent(formattedValues, currentId)
      : await createStudents({
          ...formattedValues,
          invoices,
        });

    if (!error) {
      loadStudents();
      _onSubmit?.();
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

  return loading ? (
    <div className='flex flex-1 justify-center items-center'>
      <Loader />
    </div>
  ) : (
    <MyForm
      formProps={{ id: 'student_form' }}
      renderAfter={() => (
        <Button
          type='submit'
          isLoading={loading}
          loadingText='Salvando...'
          className='gap-2'
        >
          <FileText className='h-5 w-5 ' />
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
            <div className='grid grid-cols-3 gap-3 w-full max-md:grid-cols-1'>
              <div>{name}</div>
              <div>{date_of_birth}</div>
              <div>{class_id}</div>
            </div>
            <div className='grid grid-cols-3 gap-3 w-full max-md:grid-cols-1'>
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
