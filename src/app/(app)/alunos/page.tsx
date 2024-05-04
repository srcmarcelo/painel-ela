'use client';

import DataTable from '@/components/DataTable/data-table';
import { StudentsTableColumns } from '@/modules/students/columns';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useStudents } from '@/modules/students/api';
import { useData } from '@/lib/data/context';
import Loader from '@/components/loader';

export default function Page() {
  const router = useRouter();
  const { students, responsibles, classes, loading, loadStudents } = useData();

  const { deleteStudents } = useStudents();

  const onDelete = async (ids: string[]) => {
    await deleteStudents(ids);
    loadStudents();
  };

  return (
    <div className='flex flex-col items-center w-full justify-center overflow-auto p-12 px-24 max-md:px-3 max-md:py-3'>
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
        data={students || []}
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
          return loading ? <Loader /> : null;
        }}
      />
    </div>
  );
}
