'use client';

import DataTable from '@/components/DataTable/data-table';
import { StudentsTableColumns } from '@/modules/students/columns';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../../supabase';
import { StudentForm } from '@/modules/students/form';

export default function Page() {
  const router = useRouter();

  const [classes, setClasses] = useState<any[]>([]);
  const [responsibles, setResponsibles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: classesData, error: classesError } = await supabase
          .from('classes')
          .select('*');
        const { data: responsibleData, error: responsiblesError } =
          await supabase.from('responsibles').select('*');
        if (classesError || responsiblesError)
          throw { classesError, responsiblesError };

        setClasses(classesData);
        setResponsibles(responsibleData);
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
        title='Cadastro de alunos'
        subtitle='Cadastrar alunos na plataforma'
        className='justify-center'
      />
      <StudentForm
        loading={loading}
        classes={classes}
        responsibles={responsibles}
      />
    </main>
  );
}
