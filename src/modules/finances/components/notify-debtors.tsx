'use client';

import { useMemo, useState } from 'react';
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
import { Loader2 } from 'lucide-react';
import { useData } from '@/lib/data/context';
import { Student } from '@/modules/students/schema';
import { toast } from '@/components/ui/use-toast';
import { Responsible } from '@/modules/responsibles/schema';

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

const pendingPaymentNotify = async (debtor: {
  responsibles: Responsible[];
  student: Student;
  monthsInDebt: string[];
}) => {
  try {
    const requests = debtor.responsibles.map((responsible) => {
      const description =
        debtor.monthsInDebt.length === 1
          ? `no mês de ${debtor.monthsInDebt[0]}`
          : `nos meses de ${debtor.monthsInDebt.slice(0, -1).join(', ')} e ${
              debtor.monthsInDebt[debtor.monthsInDebt.length - 1]
            }`;

      return fetch('/api/pending-payment-notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: responsible.phone,
          responsibleName: responsible.name,
          studentName: debtor.student.name,
          description,
        }),
      })
        .then((response) => ({
          to: responsible.phone,
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
        }))
        .catch((error) => ({
          to: responsible.phone,
          status: 'failed',
          ok: false,
          statusText: error.message,
        }));
    });

    const results = await Promise.all(requests);

    return results.map((result) => result.status);
  } catch (error) {
    console.log('An unexpected error occurred:', error);
    throw error;
  }
};

export default function NotifyDebtors() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { students, loadStudents, responsibles } = useData();

  const debtors: {
    responsibles: Responsible[];
    student: Student;
    monthsInDebt: string[];
  }[] = useMemo(() => {
    const currentIndexMonth = new Date().getMonth();
    const studentsWithDebt = students.filter(
      (student: Student) =>
        student.invoices.filter((invoice: boolean) => !invoice).length >
        months.length - currentIndexMonth
    );

    return studentsWithDebt.map((student: Student) => ({
      responsibles: responsibles.filter(
        (responsible: Responsible) =>
          responsible.id === student.responsible_id ||
          (responsible.id === student.mother_id &&
            student.mother_id !== student.responsible_id) ||
          (responsible.id === student.father_id &&
            student.father_id !== student.responsible_id)
      ),
      student: student,
      monthsInDebt: months.filter(
        (_, index) => index <= currentIndexMonth && !student.invoices[index]
      ),
    }));
  }, [students, responsibles]);

  const onConfirm = async () => {
    try {
      const results = await Promise.all(
        debtors.map((debtor) => {
          return pendingPaymentNotify(debtor);
        })
      );

      const allSuccessful = results.every((result) => result);

      if (allSuccessful) {
        toast({
          title: 'Mensagens enviadas com sucesso',
          description: 'Todos os devedores foram notificados.',
        });
      } else {
        toast({
          title: 'Mensagens não enviadas',
          description: 'Alguns devedores não puderam ser notificados.',
          variant: 'destructive',
        });
      }

      loadStudents();
    } catch (error) {
      console.error('Error updating students:', error);
      toast({
        title: 'Erro ao enviar mensagens',
        description: 'Ocorreu um erro ao enviar as mensagens.',
        variant: 'destructive',
      });
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='destructive'>Notificar pendentes</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {debtors.length > 0
              ? `Notificar responsáveis de ${debtors.length} ${
                  debtors.length > 1 ? 'alunos' : 'aluno'
                }`
              : 'Nenhum devedor encontrado'}
          </DialogTitle>
          <DialogDescription>
            {debtors.length > 0
              ? 'Uma mensagem será enviada para os responsáveis dos alunos que possuem mensalidades em atraso:'
              : 'Não há alunos com mensalidades em atraso no momento.'}
          </DialogDescription>
        </DialogHeader>
        {debtors.length > 0 ? (
          <div className='grid gap-4 max-h-[50vh] overflow-y-auto pr-2'>
            {debtors.map((debtor) => (
              <div
                key={debtor.student.id}
                className='border border-gray-200 rounded-md p-4 shadow-sm'
              >
                <h3 className='text-lg font-semibold mb-2'>
                  {debtor.student.name}
                </h3>
                <p className='text-sm text-gray-600 mb-1'>
                  <span className='font-medium'>Responsáveis:</span>{' '}
                  {debtor.responsibles
                    .map((responsible) => responsible.name)
                    .join(', ')}
                </p>
                <p className='text-sm text-gray-600'>
                  <span className='font-medium'>Meses em atraso:</span>{' '}
                  {debtor.monthsInDebt.join(', ')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-center text-gray-500 my-4'>
            Todos os pagamentos estão em dia
          </p>
        )}
        <DialogFooter>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            {debtors.length > 0 ? 'Cancelar' : 'Fechar'}
          </Button>
          {debtors.length > 0 && (
            <Button onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Enviando mensagens...
                </>
              ) : (
                'Confirmar'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
