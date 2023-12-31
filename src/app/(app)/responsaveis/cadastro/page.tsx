'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../../supabase';
import { ResponsibleForm } from '@/modules/responsibles/form';

export default function Page() {
  const router = useRouter();

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: responsibleData, error: studentsError } =
          await supabase.from('students').select('*');
        if (studentsError)
          throw  studentsError;

        setStudents(responsibleData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <main className='flex flex-col items-center w-screen justify-center p-12 px-24 overflow-hidden max-md:px-3 max-md:py-3'>
      <PageHeader
        title='Cadastro de responsáveis'
        subtitle='Cadastrar responsáveis na plataforma'
        className='justify-center'
      />
      <ResponsibleForm
        loading={loading}
        students={students}
      />
    </main>
  );
}
