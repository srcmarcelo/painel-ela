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

export default function Page() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('students').select('*');
        if (error) throw error;

        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const [search, setSearch] = useState('');

  return (
    <main className='flex flex-col items-center w-screen justify-center p-12 px-24 overflow-hidden max-md:px-3 max-md:py-3'>
      <PageHeader title='Alunos' subtitle='Alunos cadastrados na plataforma'>
        <Button
          size='sm'
          className='relative'
          onClick={() => router.push('/students/new')}
        >
          <PlusIcon className='h-5 w-5 mr-2' />
          <p className='m-0 whitespace-nowrap inline-block'>Adicionar Aluno</p>
        </Button>
      </PageHeader>
      <DataTable
        data={data || []}
        columns={StudentsTableColumns}
        body={!loading && <DataTable.Body />}
        toolbar={
          <DataTable.Toolbar
            placeholder='Buscar aluno...'
            searchId='name'
            onDelete={() => null}
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
