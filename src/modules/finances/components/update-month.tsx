'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useStudents } from '@/modules/students/api';
import { useData } from '@/lib/data/context';
import { Student } from '@/modules/students/schema';
import { toast } from '@/components/ui/use-toast';

export default function UpdateMonth() {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState<string>('');
  const [isPaid, setIsPaid] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const { students, loadStudents } = useData();
  const { updateStudent } = useStudents();

  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const onChangePaid = async (
    student: Student,
    index: number,
    isPaid: boolean
  ) => {
    const newInvoices = student.invoices.map((value, invoiceIndex) =>
      invoiceIndex === index ? isPaid : value
    );
    const { error } = await updateStudent(
      { invoices: newInvoices },
      student.id,
      true
    );

    if (error) return false;
    return true;
  };

  const onConfirm = async (month: string, isPaid: boolean) => {
    const index = months.findIndex((value) => value === month);

    if (index === -1) return;

    try {
      const results = await Promise.all(
        students.map((student: Student) => onChangePaid(student, index, isPaid))
      );

      const allSuccessful = results.every((result) => result);

      if (allSuccessful) {
        toast({
          title: 'Atualização bem-sucedida',
          description: 'Todos os alunos foram atualizados com sucesso.',
        });
      } else {
        toast({
          title: 'Atualização parcial',
          description: 'Alguns alunos não puderam ser atualizados.',
          variant: 'destructive',
        });
      }

      loadStudents();
    } catch (error) {
      console.error('Error updating students:', error);
      toast({
        title: 'Erro na atualização',
        description: 'Ocorreu um erro ao atualizar os alunos.',
        variant: 'destructive',
      });
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(month, isPaid);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      setMonth('');
      setIsPaid(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Atualizar mês</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Atualizar mês</DialogTitle>
          <DialogDescription>
            Atualizar o status para todos os alunos de uma vez só
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='month' className='text-right'>
              Mês
            </Label>
            <Select onValueChange={(value) => setMonth(value)} value={month}>
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder='Selecione um mês' />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='status' className='text-right'>
              Status
            </Label>
            <Select
              onValueChange={(value) => setIsPaid(value === 'true')}
              value={isPaid.toString()}
            >
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder='Selecione o status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='true'>Pago</SelectItem>
                <SelectItem value='false'>Não pago</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading || !month}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Atualizando...
              </>
            ) : (
              'Confirmar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
