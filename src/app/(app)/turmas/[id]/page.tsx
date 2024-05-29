'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { translate } from '@/lib/translate';
import { Button } from '@/components/ui/button';
import { useData } from '@/lib/data/context';
import Loader from '@/components/loader';
import DataTable from '@/components/DataTable/data-table';
import { StudentsTableColumns } from '@/modules/students/columns';
import Attendance from '@/modules/classes/components/attendance';

export default function Page() {
  const { students, responsibles, classes, loading } = useData();

  const params = useParams();
  const router = useRouter();

  const classroom = useMemo(() => {
    return classes.find((e) => e.id === params.id);
  }, [classes, params.id]);

  const classStudents = students?.filter(
    (student) => student.class_id === params.id
  );

  return (
    <div className='py-6 px-12 max-sm:px-3'>
      {loading ? (
        <Loader />
      ) : (
        <div className='flex flex-col w-full h-full'>
          <div className='flex justify-between items-center max-sm:flex-col max-sm:text-center max-sm:space-y-2'>
            <h1 className='font-medium text-3xl'>{`${classroom?.grade} - ${
              classroom?.period && translate.period[classroom?.period]
            }`}</h1>
            <div className='flex flex-row space-x-2'>
              <Button onClick={() => router.back()} variant='outline'>
                Voltar
              </Button>
            </div>
          </div>

          <div className='mt-4'>
            <div className='border rounded-md p-4 space-y-4'>
              {classroom && (
                <div>
                  {classroom.teacher ? (
                    <>
                      <p className='text-muted-foreground'>Professora</p>
                      <p>{classroom.teacher}</p>
                    </>
                  ) : (
                    <p>Sem professora cadastrada</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className='mt-8'>
            <DataTable
              data={classStudents || []}
              columns={StudentsTableColumns(responsibles, classes)}
              body={!loading && <DataTable.Body />}
              pagination={<DataTable.Pagination />}
              loadingComponent={() => {
                return loading ? <Loader /> : null;
              }}
            />
          </div>

          <div className='mt-8'>
            <Attendance classId={`${params.id}`} students={classStudents}  />
          </div>
        </div>
      )}
    </div>
  );
}
