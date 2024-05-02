'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { EnrollmentForm } from '@/modules/enrollment/form';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <div className='flex flex-col items-center w-full justify-between overflow-auto p-12 px-24 max-md:px-3 max-md:py-3'>
      <PageHeader
        title='Matrícula'
        subtitle='Faça o cadastro do aluno e seu responsável'
        className='justify-between'
      >
        <Button onClick={() => router.back()} variant='outline'>
          Voltar
        </Button>
      </PageHeader>
      <EnrollmentForm />
    </div>
  );
}
