'use client';

import React from 'react';
import { Loader } from 'lucide-react';
import { translate } from '@/lib/translate';
import DataTable from '@/components/DataTable/data-table';
import { ClassStudentsTableColumns } from '../columns';
import { useData } from '@/lib/data/context';

export function ClassesList() {
  const { students, classes, loading } = useData();

  return loading ? (
    <div className='flex flex-1 justify-center items-center'>
      <Loader />
    </div>
  ) : (
    <div className='flex flex-wrap justify-center items-center w-full'>
      {classes?.map((classroom, index) => {
        const classStudents: any[] | undefined = students?.filter(
          (student) => student.class_id === classroom.id
        );

        return (
          <div
            key={index}
            className='flex flex-col w-96 h-72 p-2 rounded-sm m-2'
          >
            <h1>
              {classroom?.grade} - {translate.period[classroom.period]}
            </h1>
            <DataTable
              data={classStudents || []}
              columns={ClassStudentsTableColumns()}
              body={!loading && <DataTable.Body />}
              className='h-full overflow-auto max-w-xs'
            />
          </div>
        );
      })}
    </div>
  );
}
