'use client';

import React, { useEffect, useState } from 'react';
import { useClasses } from './api';
import { Loader } from 'lucide-react';
import { useStudents } from '../students/api';
import { translate } from '@/lib/translate';
import DataTable from '@/components/DataTable/data-table';
import { ClassStudentsTableColumns } from './columns';
import { useData } from '@/lib/context';

export function ClassesList() {
  const { classes, students, loading } = useData();

  return loading ? (
    <div className='flex flex-1 justify-center items-center'>
      <Loader />
    </div>
  ) : (
    <div className='flex flex-wrap justify-center items-center w-full'>
      {classes.map((classroom, index) => {
        const classStudents: any[] = students.filter(
          (student: any) => student.class_id === classroom.id
        );

        return (
          <div
            key={index}
            className='flex flex-col w-72 h-72 p-2 rounded-sm m-2'
          >
            <h1>
              {classroom?.grade} - {translate.period[classroom.period]}
            </h1>
            <DataTable
              data={classStudents || []}
              columns={ClassStudentsTableColumns()}
              body={!loading && <DataTable.Body />}
              className='h-full overflow-auto'
            />
          </div>
        );
      })}
    </div>
  );
}
