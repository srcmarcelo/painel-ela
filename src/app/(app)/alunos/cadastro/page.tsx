'use client';

import { PageHeader } from '@/components/page-header';
import { StudentForm } from '@/modules/students/form';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <div className='flex flex-col items-center w-full justify-center overflow-auto p-12 px-24 max-md:px-3 max-md:py-3'>
      <PageHeader
        title='Cadastro de alunos'
        subtitle='Cadastrar alunos na plataforma'
        className='justify-center'
      />
      <StudentForm onSubmit={() => router.push('/alunos')} />
    </div>
  );
}
