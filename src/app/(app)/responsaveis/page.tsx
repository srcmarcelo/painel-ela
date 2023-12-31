'use client';

import DataTable from '@/components/DataTable/data-table';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '../../../../supabase';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { ResponsiblesTableColumns } from '@/modules/responsibles/columns';
import { useDeleteResponsibles } from '@/modules/responsibles/api';

export default function Page() {
  const router = useRouter();

  const [students, setStudents] = useState<any[]>([]);
  const [responsibles, setResponsibles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { deleteResponsibles } = useDeleteResponsibles();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*');
      const { data: responsiblesData, error: responsiblesError } =
        await supabase.from('responsibles').select('*');
      if (studentsError || responsiblesError)
        throw { studentsError, responsiblesError };

      setStudents(studentsData);
      setResponsibles(responsiblesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onDelete = async (ids: string[]) => {
    await deleteResponsibles(ids);
    fetchData();
  };

  return (
    <main className='flex flex-col items-center w-screen justify-center p-12 px-24 overflow-hidden max-md:px-3 max-md:py-3'>
      <PageHeader title='Responsáveis' subtitle='Responsáveis cadastrados na plataforma'>
        <Button
          size='sm'
          className='relative'
          onClick={() => router.push('/responsaveis/cadastro')}
        >
          <PlusIcon className='h-5 w-5 mr-2' />
          <p className='m-0 whitespace-nowrap inline-block'>Cadastrar responsável</p>
        </Button>
      </PageHeader>
      <DataTable
        data={responsibles || []}
        columns={ResponsiblesTableColumns(students, onDelete)}
        body={!loading && <DataTable.Body />}
        toolbar={
          <DataTable.Toolbar
            placeholder='Buscar por nome...'
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
