'use client';

import DataTable from '@/components/DataTable/data-table';
import { StudentsTableColumns } from '@/modules/students/columns';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '../../../../supabase';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useStudents } from '@/modules/students/api';

export default function Page() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [responsibles, setResponsibles] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { deleteStudents } = useStudents();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('students').select('*');
      const { data: responsiblesData, error: responsiblesError } =
        await supabase.from('responsibles').select('*');
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*');
      if (error || responsiblesError || classesError)
        throw { error, responsiblesError, classesError };

      setData(data);
      setResponsibles(responsiblesData);
      setClasses(classesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onDelete = async (ids: string[]) => {
    await deleteStudents(ids);
    fetchData();
  };

  return (
    <main className='flex flex-col items-center w-screen justify-center p-12 px-24 overflow-hidden max-md:px-3 max-md:py-3'>
      <PageHeader title='Alunos' subtitle='Alunos cadastrados na plataforma'>
        <Button
          size='sm'
          className='relative'
          onClick={() => router.push('/alunos/cadastro')}
        >
          <PlusIcon className='h-5 w-5 mr-2' />
          <p className='m-0 whitespace-nowrap inline-block'>Cadastrar aluno</p>
        </Button>
      </PageHeader>
      <DataTable
        data={data || []}
        columns={StudentsTableColumns(responsibles, classes, onDelete)}
        body={!loading && <DataTable.Body />}
        toolbar={
          <DataTable.Toolbar
            placeholder='Buscar aluno...'
            searchId='name'
            onDelete={(ids) => {
              onDelete(ids);
            }}
          />
        }
        pagination={<DataTable.Pagination />}
        loadingComponent={() => {
          return loading ? (
            <div className='flex flex-1 justify-center items-center animate-pulse'>
              Carregando...
            </div>
          ) : null;
        }}
      />
    </main>
  );
}
