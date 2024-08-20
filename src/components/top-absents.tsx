'use client';

import { Student } from '@/modules/students/schema';
import { Avatar } from './avatar';
import { Absence } from '@/modules/classes/schema';
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
  student: Student;
  absenceCount: number;
};

function getTop5StudentsWithMostAbsences(
  absences: Absence[],
  students: Student[]
): StudentWithAbsences[] {
  // Create a map to count absences by student_id
  const absenceCountMap: Record<string, number> = {};

  absences.forEach((absence) => {
    if (absence.student_id in absenceCountMap) {
      absenceCountMap[absence.student_id]++;
    } else {
      absenceCountMap[absence.student_id] = 1;
    }
  });

  // Sort the students by the number of absences in descending order and map to StudentWithAbsences
  const sortedStudentsWithAbsences = students
    .filter((student) => absenceCountMap[student.id] !== undefined) // Only include students with absences
    .map((student) => ({
      student,
      absenceCount: absenceCountMap[student.id] || 0,
    }))
    .sort((a, b) => b.absenceCount - a.absenceCount);

  // Return the top 5 students with their absence counts
  return sortedStudentsWithAbsences.slice(0, 5);
}

export function TopAbsents() {
  const { students, loading: loadingData, classes } = useData();
  const { fetchAbsences } = useClasses();

  const [absences, setAbsences] = useState<Absence[]>([]);
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
    () => (loading ? [] : getTop5StudentsWithMostAbsences(absences, students)),
    [loading, absences, students]
  );

  const AbesentStudent = ({ student }: { student: StudentWithAbsences }) => {
    if (!student) return;

    const classroom = classes.find(
      (classroom) => classroom.id === student.student.class_id
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
              pathname: `/alunos/${student.student.id}`,
            }}
          >
            <p className='text-sm font-medium leading-none'>
              {student.student.name}
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
            Top 5 alunos mais faltosos desde 01/08/2024
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
          Top 5 alunos mais faltosos desde 01/08/2024
        </CardDescription>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='space-y-8'>
          <AbesentStudent student={sortedStudents[0]} />
          <AbesentStudent student={sortedStudents[1]} />
          <AbesentStudent student={sortedStudents[2]} />
          <AbesentStudent student={sortedStudents[3]} />
          <AbesentStudent student={sortedStudents[4]} />
        </div>
      </CardContent>
    </Card>
  );
}
