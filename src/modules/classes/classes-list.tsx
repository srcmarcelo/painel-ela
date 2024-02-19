'use client';

import React, { useMemo } from 'react';
import { Loader } from 'lucide-react';
import { translate } from '@/lib/translate';
import DataTable from '@/components/DataTable/data-table';
import { ClassStudentsTableColumns } from './columns';
import useSupabaseBrowser from '@/utils/supabase-browser';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { getClasses } from '@/queries/getClasses';
import { getStudents } from '@/queries/getStudents';

export function ClassesList() {
  const supabase = useSupabaseBrowser();
  const { data: classes, isLoading: loadingClasses } = useQuery(
    getClasses(supabase),
    { refetchOnWindowFocus: false, refetchOnMount: false }
  );
  const { data: students, isLoading: loadingStudents } = useQuery(
    getStudents(supabase)
  );

  const loading = useMemo(
    () => loadingClasses || loadingStudents,
    [loadingClasses, loadingStudents]
  );

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
