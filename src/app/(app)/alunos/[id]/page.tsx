'use client';

import React, { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { translate } from '@/lib/translate';
import { Button } from '@/components/ui/button';
import { StudentForm } from '@/modules/students/form';
import { useData } from '@/lib/context';

export default function Page() {
  const [edit, setEdit] = useState<boolean>(false);

  const { students, responsibles, classes, loading } = useData();

  const params = useParams();

  const student = useMemo(() => {
    return students.find((e) => e.id === params.id);
  }, [params.id, students]);

  const mother = useMemo(() => {
    return student
      ? responsibles.find((e) => e.id === student.mother_id)
      : undefined;
  }, [responsibles, student]);

  const father = useMemo(() => {
    return student
      ? responsibles.find((e) => e.id === student.father_id)
      : undefined;
  }, [responsibles, student]);

  const responsible = useMemo(() => {
    return student
      ? responsibles.find((e) => e.id === student.responsible_id)
      : undefined;
  }, [responsibles, student]);

  const classroom = useMemo(() => {
    return student
      ? classes.find((e) => e.id === student.class_id)
      : undefined;
  }, [classes, student]);

  return (
    <div className='py-6 px-12'>
      {loading ? (
        <div className='flex flex-col flex-1 w-full h-full justify-center items-center text-center'>
          Carregando...
        </div>
      ) : (
        <div className='flex flex-col w-full h-full'>
          <div className='flex justify-between items-center max-sm:flex-col max-sm:text-center max-sm:space-y-2'>
            <h1 className='font-medium text-3xl'>{student?.name}</h1>
            <Button
              onClick={() => setEdit(!edit)}
              variant={edit ? 'outline' : 'default'}
            >
              {edit ? 'Voltar' : 'Editar'}
            </Button>
          </div>
          <div className='mt-4'>
            {edit ? (
              <StudentForm
                onSubmit={() => setEdit(false)}
                currentId={student?.id}
              />
            ) : (
              <div className='border rounded-md p-4 space-y-4'>
                {classroom && (
                  <div>
                    <p className='text-muted-foreground'>Turma</p>
                    <p>{`${classroom.grade} - ${
                      translate.period[classroom.period]
                    }`}</p>
                  </div>
                )}
                {mother && (
                  <div>
                    <p className='text-muted-foreground'>Mãe</p>
                    <p>{mother.name}</p>
                  </div>
                )}
                {father && (
                  <div>
                    <p className='text-muted-foreground'>Pai</p>
                    <p>{father.name}</p>
                  </div>
                )}
                {responsible && (
                  <div>
                    <p className='text-muted-foreground'>Responsável</p>
                    <p>{responsible.name}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
