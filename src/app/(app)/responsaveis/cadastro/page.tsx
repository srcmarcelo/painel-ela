'use client';

import { PageHeader } from '@/components/page-header';
import { ResponsibleForm } from '@/modules/responsibles/form';

export default function Page() {
  return (
    <main className='flex flex-col items-center w-screen justify-center p-12 px-24 overflow-hidden max-md:px-3 max-md:py-3'>
      <PageHeader
        title='Cadastro de responsáveis'
        subtitle='Cadastrar responsáveis na plataforma'
        className='justify-center'
      />
      <ResponsibleForm />
    </main>
  );
}
