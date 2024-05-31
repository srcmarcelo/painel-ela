import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { parseISODateWithOffset } from '@/lib/utils';
import { useClasses } from '@/modules/classes/api';
import { Absence } from '@/modules/classes/schema';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import React, { useEffect, useState } from 'react';

export default function StudentAbsences({ studentId }: { studentId?: string }) {
  const { fetchAbsencesByStudentId } = useClasses();
  const [absences, setAbsences] = useState<Absence[]>([]);

  async function fetchAbsences() {
    if (!studentId) return;
    const { data, error } = await fetchAbsencesByStudentId(studentId);

    if (!error && data) setAbsences(data);
  }

  useEffect(() => {
    fetchAbsences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  return (
    <Accordion type='single' collapsible className='w-full p-0 rounded-lg'>
      <AccordionItem
        value='absences'
        className='border rounded-lg overflow-hidden'
      >
        <AccordionTrigger className='flex justify-between items-center w-full px-4 py-2 text-lg font-medium text-left rounded-lg hover:no-underline hover:bg-gray-200'>
          <div className='flex items-center'>
            <p className='mr-2 text-muted-foreground text-base'>Faltas:</p>{' '}
            {absences.length}
            <p className='ml-4 mr-2 text-muted-foreground text-base'>
              Justificadas:{' '}
            </p>
            {absences.filter((absence) => absence.justified).length}
          </div>
        </AccordionTrigger>
        <AccordionContent className='bg-white p-0 rounded-lg'>
          <div className='overflow-x-auto'>
            {absences.length === 0 ? (
              <div className='w-full text-base text-center text-muted-foreground py-2'>
                Sem faltas
              </div>
            ) : (
              <Table className='min-w-full divide-y divide-gray-200'>
                <TableHeader className='bg-gray-50'>
                  <TableRow>
                    <TableHead className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Data
                    </TableHead>
                    <TableHead className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Justificada
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='bg-white divide-y divide-gray-200'>
                  {absences.map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center'>
                        {format(
                          parseISODateWithOffset(
                            absence.date as unknown as string
                          ),
                          'dd/MM/yyyy',
                          {
                            locale: ptBR,
                          }
                        )}
                      </TableCell>
                      <TableCell className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center'>
                        <Badge
                          variant={
                            absence.justified ? 'success' : 'destructive'
                          }
                        >
                          {absence.justified ? 'Sim' : 'Não'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
