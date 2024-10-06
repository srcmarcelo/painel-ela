import { Student } from '@/modules/students/schema';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useClasses } from '../api';
import { Absence, Attendance } from '../schema';
import { cn } from '@/lib/utils';
import { convertToGMT3 } from '@/utils/convertToGMT3';
import Link from 'next/link';

interface AttendanceFormProps {
  classId: string;
  students: Student[];
}

interface StudentRecord {
  [studentId: string]: boolean;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({
  classId,
  students,
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [attendance, setAttendance] = useState<StudentRecord>({});
  const [justified, setJustified] = useState<StudentRecord>({});
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const [registeredAttendance, setRegisteredAttendance] = useState<
    Attendance | undefined
  >();
  const [registeredAbsences, setRegisteredAbsences] = useState<Absence[]>([]);

  const {
    fetchAttendanceByClassAndDate,
    createAttendance,
    updateAttendance,
    fetchAbsencesByClassAndDate,
    createAbsences,
    updateAbsences,
    deleteAbsences,
  } = useClasses();

  const fetchAttendance = async () => {
    if (!date) return;
    const { data } = await fetchAttendanceByClassAndDate(
      classId,
      format(date, 'yyyy-MM-dd')
    );
    const currentAttendance = data?.find(
      (item) =>
        item.class_id === classId && item.date === format(date, 'yyyy-MM-dd')
    );
    if (currentAttendance) {
      setRegisteredAttendance(currentAttendance);
      const transformedObjectAttendance: StudentRecord =
        currentAttendance.attended_students.reduce(
          (attendance: StudentRecord, studentId) => {
            attendance[studentId] = true;
            return attendance;
          },
          {}
        );
      const { data } = await fetchAbsencesByClassAndDate(
        classId,
        format(date, 'yyyy-MM-dd')
      );
      if (data) {
        const transformedObject: StudentRecord = data.reduce(
          (justified: StudentRecord, absence: Absence) => {
            justified[absence.student_id] = absence.justified;
            return justified;
          },
          {}
        );
        setJustified(transformedObject);
        setRegisteredAbsences(data);
      }

      setAttendance(transformedObjectAttendance);
    } else {
      setRegisteredAttendance(undefined);
      setRegisteredAbsences([]);
      setAttendance({});
      setJustified({});
    }
  };

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, date]);

  const handleCheckboxChange = (studentId: string) => {
    setAttendance({ ...attendance, [studentId]: !attendance[studentId] });
  };

  const handleJustifyCheckboxChange = (studentId: string) => {
    setJustified({ ...justified, [studentId]: !justified[studentId] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmation(true);
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    const gmt3Date = convertToGMT3(date);
    let generalError;

    const attendedStudentsIds = students
      .filter((student) => attendance[student.id])
      .map((student) => student.id);

    const absentStudentsIds = students
      .filter((student) => !attendance[student.id])
      .map((student) => student.id);

    if (registeredAttendance) {
      const createAbsencesStudentsIds = absentStudentsIds.filter(
        (id) => !registeredAttendance.absent_students.includes(id)
      );

      const deleteAbsencesStudentsIds =
        registeredAttendance.absent_students.filter(
          (id) => !absentStudentsIds.includes(id)
        );

      const updateAbsencesStudentsIds =
        registeredAttendance.absent_students.filter(
          (id) =>
            absentStudentsIds.includes(id) &&
            registeredAbsences.find((absence) => absence.student_id === id)
              ?.justified !== justified[id]
        );

      if (createAbsencesStudentsIds.length > 0) {
        const { error: batchError } = await createAbsences(
          createAbsencesStudentsIds.map((id) => {
            return {
              date: gmt3Date,
              student_id: id,
              justified: justified[id],
              class_id: classId,
            };
          })
        );

        generalError = batchError;
      }

      if (updateAbsencesStudentsIds.length > 0) {
        const { error: batchError } = await updateAbsences(
          updateAbsencesStudentsIds.map((id) => {
            return {
              id: registeredAbsences.find(
                (absence) => absence.student_id === id
              )?.id,
              date: gmt3Date,
              student_id: id,
              justified: justified[id],
              class_id: classId,
            };
          })
        );

        generalError = batchError;
      }

      if (deleteAbsencesStudentsIds.length > 0) {
        const { error: batchError } = await deleteAbsences(
          registeredAbsences
            .filter((absence) =>
              deleteAbsencesStudentsIds.includes(absence.student_id)
            )
            .map((absence) => absence.id)
        );

        generalError = batchError;
      }

      const { error: updateError } = await updateAttendance(
        {
          attended_students: attendedStudentsIds,
          absent_students: absentStudentsIds,
        },
        registeredAttendance.id
      );

      generalError = updateError;
    } else {
      const { error: createError } = await createAttendance({
        date: gmt3Date,
        class_id: classId,
        attended_students: attendedStudentsIds,
        absent_students: absentStudentsIds,
      });

      generalError = createError;

      if (absentStudentsIds) {
        const { error: batchError } = await createAbsences(
          absentStudentsIds.map((id) => {
            return {
              date: gmt3Date,
              student_id: id,
              justified: justified[id],
              class_id: classId,
            };
          })
        );

        generalError = batchError;
      }
    }

    if (!generalError) {
      setConfirmation(false);
      fetchAttendance();
    }
  };

  function AttendanceConfirmation() {
    const absentStudents = students.filter(
      (student) => !attendance[student.id]
    );

    return (
      <Dialog
        open={confirmation}
        onOpenChange={(open) => {
          !open && setConfirmation(open);
        }}
      >
        <DialogContent className='max-h-screen overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Confirmação</DialogTitle>
            <DialogDescription>
              Confirme as informações da chamada e indique as faltas
              justificadas.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConfirm} id='confirmation-form'>
            <div className='flex w-full space-x-4 justify-start items-center'>
              <div>Data:</div>
              <div className='border p-2 rounded-md'>
                {date && format(date, 'dd/MM/yyyy')}
              </div>
            </div>

            <div className='flex w-full space-x-4 justify-center items-center mt-4'>
              <h2 className='text-destructive font-semibold'>Faltas</h2>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno ausente</TableHead>
                  <TableHead>Justificada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {absentStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Switch
                        checked={justified[student.id] || false}
                        onCheckedChange={() =>
                          handleJustifyCheckboxChange(student.id)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                Cancelar
              </Button>
            </DialogClose>

            <Button form='confirmation-form' type='submit'>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className='rounded-md border p-2'>
      <AttendanceConfirmation />

      <form onSubmit={handleSubmit}>
        <div className='text-center'>
          <div className='flex w-full space-x-4 justify-center items-center mb-2'>
            <div>Data da chamada:</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] pl-3 text-left font-normal',
                    registeredAttendance
                      ? 'border-green-500 text-green-500'
                      : 'border-red-500 text-red-500'
                  )}
                >
                  {date ? (
                    format(date, 'dd/MM/yyyy')
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  locale={ptBR}
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <p className='text-gray-500'>
            Clique no nome do aluno para ver informações e registrar ocorrências
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead>Presente</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.code}</TableCell>
                <TableCell>
                  <Link
                    className='w-full h-full underline text-center'
                    href={{
                      pathname: `/alunos/${student.id}`,
                    }}
                  >
                    {student.name.toUpperCase()}
                  </Link>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={attendance[student.id] || false}
                    onCheckedChange={() => handleCheckboxChange(student.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          type='submit'
          className='w-full flex justify-center items-center bg-primary text-white rounded-b-md cursor-pointer py-2'
        >
          {registeredAttendance ? 'Atualizar' : 'Enviar'}
        </Button>
      </form>
    </div>
  );
};

export default AttendanceForm;
