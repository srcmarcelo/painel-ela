'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../../../supabase';
import { useParams } from 'next/navigation';
import { translate } from '@/lib/translate';
import { useStudents } from '@/modules/students/api';
import { Button } from '@/components/ui/button';
import { ResponsibleForm } from '@/modules/responsibles/form';

export default function Page() {
  const { fetchStudents } = useStudents();

  const [responsible, setResponsible] = useState<any>();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);

  const params = useParams();

  const fetchData = async () => {
    setLoading(true);
    console.log('params:', params);
    try {
      const { data, error } = await supabase
        .from('responsibles')
        .select('*')
        .eq('id', params?.id);

      if (data?.[0].children?.length > 0) {
        const { data } = await fetchStudents();
        setStudents(data);
      }

      if (error) throw error;

      setResponsible(data?.[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const children = useMemo(() => {
    const childrenIds: string[] = responsible?.children;
    return students.filter((student) => childrenIds.includes(student.id));
  }, [responsible?.children, students]);

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
            <h1 className='font-medium text-3xl'>{responsible?.name}</h1>
            <Button
              onClick={() => setEdit(!edit)}
              variant={edit ? 'outline' : 'default'}
            >
              {edit ? 'Voltar' : 'Editar'}
            </Button>
          </div>
          <div className='mt-4'>
            {edit ? (
              <ResponsibleForm
                onSubmit={() => setEdit(false)}
                currentId={responsible?.id}
              />
            ) : (
              <div className='border rounded-md p-4 space-y-4'>
                <div>
                  <p className='text-muted-foreground'>Email</p>
                  <p>
                    {translate.responsible_types[responsible?.responsible_type]}
                  </p>
                </div>
                {responsible?.cpf && (
                  <div>
                    <p className='text-muted-foreground'>CPF</p>
                    <p>{responsible.cpf}</p>
                  </div>
                )}
                {responsible?.phone && (
                  <div>
                    <p className='text-muted-foreground'>Telefone</p>
                    <p>{responsible.phone}</p>
                  </div>
                )}
                {responsible?.email && (
                  <div>
                    <p className='text-muted-foreground'>Email</p>
                    <p>{responsible.email}</p>
                  </div>
                )}
                {children.length > 0 && (
                  <div>
                    <p className='text-muted-foreground'>Crianças</p>
                    <div className='flex flex-col space-y-1'>
                      {children.map((child, index) => (
                        <span
                          key={index}
                          className='max-w-[500px] truncate font-medium'
                        >
                          {child.name}
                        </span>
                      ))}
                    </div>
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
