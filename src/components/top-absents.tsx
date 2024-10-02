'use client';

import { Student } from '@/modules/students/schema';
import { Avatar } from './avatar';
import { useData } from '@/lib/data/context';
import { useEffect, useMemo, useState } from 'react';
import { useClasses } from '@/modules/classes/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { translate } from '@/lib/translate';
import Link from 'next/link';

type StudentWithAbsences = {
  student?: Student;
  absenceCount: number;
};

type StudentAbsence = {
  student_id: string;
  absence_count: number;
};

function getTop10StudentsWithMostAbsences(
  absences: StudentAbsence[],
  students: Student[]
): StudentWithAbsences[] {
  const sortedStudentsWithAbsences = absences.map((absence) => {
    return {
      student: students.find((student) => student.id === absence.student_id),
      absenceCount: absence.absence_count,
    };
  });

  return sortedStudentsWithAbsences;
}

export function TopAbsents() {
  const { students, loading: loadingData, classes } = useData();
  const { fetchAbsences } = useClasses();

  const [absences, setAbsences] = useState<StudentAbsence[]>([]);
  const [loadingAbsences, setLoadingAbsences] = useState<boolean>(false);

  useEffect(() => {
    const fetchDataAbsences = async () => {
      setLoadingAbsences(true);
      const { data, error } = await fetchAbsences();

      if (!error && data) setAbsences(data);
      setLoadingAbsences(false);
    };

    fetchDataAbsences();
  }, []);

  const loading = useMemo(
    () => loadingAbsences || loadingData,
    [loadingAbsences, loadingData]
  );

  const sortedStudents = useMemo(
    () => (loading ? [] : getTop10StudentsWithMostAbsences(absences, students)),
    [loading, absences, students]
  );

  const AbesentStudent = ({ student }: { student: StudentWithAbsences }) => {
    if (!student) return;

    const classroom = classes.find(
      (classroom) => classroom.id === student?.student?.class_id
    );

    return (
      <div className='flex items-center justify-start'>
        <div className='w-10'>
          <Avatar />
        </div>
        <div className='mr-4 space-y-1 flex-1'>
          <Link
            className='w-full h-full flex flex-col items-start justify-center p-1 hover:bg-slate-300 hover:rounded'
            href={{
              pathname: `/alunos/${student?.student?.id}`,
            }}
          >
            <p className='text-sm font-medium leading-none'>
              {student?.student?.name}
            </p>
            {classroom && (
              <p className='text-sm text-muted-foreground'>{`${
                classroom.grade
              } - ${translate.period[classroom.period]}`}</p>
            )}
          </Link>
        </div>
        <div className='font-medium text-red-500 text-center'>
          {student.absenceCount} faltas
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='text-base sm:text-xl'>
            Alunos faltosos
          </CardTitle>
          <CardDescription>
            Top 10 alunos mais faltosos desde 01/08/2024
          </CardDescription>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='space-y-8'>
            <div className='flex items-center'>Carregando...</div>
          </div>
        </CardContent>
      </Card>
    );

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-base sm:text-xl'>Alunos faltosos</CardTitle>
        <CardDescription>
          Top 10 alunos mais faltosos desde 01/08/2024
        </CardDescription>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='space-y-8'>
          <AbesentStudent student={sortedStudents[0]} />
          <AbesentStudent student={sortedStudents[1]} />
          <AbesentStudent student={sortedStudents[2]} />
          <AbesentStudent student={sortedStudents[3]} />
          <AbesentStudent student={sortedStudents[4]} />
          <AbesentStudent student={sortedStudents[5]} />
          <AbesentStudent student={sortedStudents[6]} />
          <AbesentStudent student={sortedStudents[7]} />
          <AbesentStudent student={sortedStudents[8]} />
          <AbesentStudent student={sortedStudents[9]} />
        </div>
      </CardContent>
    </Card>
  );
}
