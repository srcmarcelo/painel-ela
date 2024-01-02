'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../../supabase';
import { useParams } from 'next/navigation';
import { translate } from '@/lib/translate';
import { Button } from '@/components/ui/button';
import { StudentForm } from '@/modules/students/form';

export default function Page() {
  const [student, setStudent] = useState<any>();
  const [mother, setMother] = useState<any>();
  const [father, setFather] = useState<any>();
  const [responsible, setResponsible] = useState<any>();
  const [classroom, setClassroom] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);

  const params = useParams();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', params?.id);

      if (data?.[0].mother_id) {
        const { data: mothersData, error: mothersError } = await supabase
          .from('responsibles')
          .select('*')
          .eq('id', data?.[0].mother_id || '');
        setMother(mothersData?.[0]);
      }

      if (data?.[0].father_id) {
        const { data: fathersData, error: fathersError } = await supabase
          .from('responsibles')
          .select('*')
          .eq('id', data?.[0].father_id);
        setFather(fathersData?.[0]);
      }

      if (data?.[0].responsible_id) {
        const { data: responsiblesData, error: responsiblesError } =
          await supabase
            .from('responsibles')
            .select('*')
            .eq('id', data?.[0].responsible_id);
        setResponsible(responsiblesData?.[0]);
      }

      if (data?.[0].class_id) {
        const { data: classesData, error: classesError } = await supabase
          .from('classes')
          .select('*')
          .eq('id', data?.[0].class_id);
        setClassroom(classesData?.[0]);
      }

      if (error) throw error;

      setStudent(data?.[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className='py-6 px-12'>
      {loading ? (
        <div className='flex flex-col flex-1 w-full h-full justify-center items-center text-center'>
          Carregando...
        </div>
      ) : (
        <div className='flex flex-col w-full h-full'>
          <div className='flex justify-between items-center'>
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
              <StudentForm onSubmit={() => setEdit(false)} currentId={student?.id} />
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
    </main>
  );
}
