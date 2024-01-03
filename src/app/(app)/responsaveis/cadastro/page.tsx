'use client';

import { PageHeader } from '@/components/page-header';
import { ResponsibleForm } from '@/modules/responsibles/form';

export default function Page() {
  return (
    <div className='flex flex-col items-center w-full justify-center overflow-auto p-12 px-24 max-md:px-3 max-md:py-3'>
      <PageHeader
        title='Cadastro de responsáveis'
        subtitle='Cadastrar responsáveis na plataforma'
        className='justify-center'
      />
      <ResponsibleForm />
    </div>
  );
}
