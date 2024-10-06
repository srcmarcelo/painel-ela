import { PageHeader } from '@/components/page-header';
import NotifyDebtors from '@/modules/finances/components/notify-debtors';
import UpdateMonth from '@/modules/finances/components/update-month';
import StudentsInvoices from '@/modules/finances/studentsInvoices';

export default function Page() {
  return (
    <main className='flex flex-col items-center w-full justify-center p-6 px-24 overflow-hidden max-md:px-6'>
      <PageHeader
        title='Financeiro'
        subtitle='Controle de pagamento das mensalidades'
      >
        <UpdateMonth />
        <NotifyDebtors />
      </PageHeader>
      <StudentsInvoices />
    </main>
  );
}
