'use client';

import DataTable from '@/components/DataTable/data-table';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { ResponsiblesTableColumns } from '@/modules/responsibles/columns';
import { useResponsibles } from '@/modules/responsibles/api';
import { useData } from '@/lib/data/context';
import Loader from '@/components/loader';

export default function Page() {
  const router = useRouter();
  const { students, responsibles, loading, loadResponsibles } = useData();

  const { deleteResponsibles } = useResponsibles();

  const onDelete = async (ids: string[]) => {
    await deleteResponsibles(ids);
    loadResponsibles();
  };

  return (
    <div className='flex flex-col items-center w-full justify-center overflow-auto p-12 px-24 max-md:px-3 max-md:py-6'>
      <PageHeader
        title='Responsáveis'
        subtitle='Responsáveis cadastrados na plataforma'
      >
        <Button
          size='sm'
          className='relative'
          onClick={() => router.push('/responsaveis/cadastro')}
        >
          <PlusIcon className='h-5 w-5 mr-2' />
          <p className='m-0 whitespace-nowrap inline-block'>
            Cadastrar responsável
          </p>
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
          return loading ? <Loader /> : null;
        }}
      />
    </div>
  );
}
