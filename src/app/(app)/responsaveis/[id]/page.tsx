'use client';

import React, { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { translate } from '@/lib/translate';
import { Button } from '@/components/ui/button';
import { ResponsibleForm } from '@/modules/responsibles/form';
import { useData } from '@/lib/context';

export default function Page() {
  const [edit, setEdit] = useState<boolean>(false);

  const { students, responsibles, loading } = useData();
  const params = useParams();

  const responsible = useMemo(() => {
    return responsibles.find((e) => e.id === params.id);
  }, [params.id, responsibles]);

  const children = useMemo(() => {
    const childrenIds: string[] | undefined = responsible?.children;
    return childrenIds?.length && childrenIds?.length > 0
      ? students.filter((student) => childrenIds?.includes(student.id))
      : [];
  }, [responsible?.children, students]);

  return (
    <div className='py-6 px-12'>
      {loading ? (
        <div className='flex flex-col flex-1 w-full h-full justify-center items-center text-center'>
          Carregando...
        </div>
      ) : (
        <div className='flex flex-col w-full h-full'>
          <div className='flex justify-between items-center max-sm:flex-col max-sm:text-center max-sm:space-y-2'>
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
                  <p className='text-muted-foreground'>Tipo</p>
                  <p>
                    {responsible
                      ? translate.responsible_types[
                          responsible?.responsible_type
                        ]
                      : '-'}
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
    </div>
  );
}
