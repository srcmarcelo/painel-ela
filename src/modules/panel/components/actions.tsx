'use client';

import ActionButton from '@/components/action-button';
import { AttendanceChart } from '@/components/attendances-chart';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Actions() {
  const { push } = useRouter();

  return (
    <div className='w-full flex flex-col justify-center items-center space-y-8'>
      <ActionButton
        content='Fazer matrícula'
        icon={<ArrowRight />}
        onClick={() => push('matricula')}
      />
      <AttendanceChart />
      <ActionButton
        content='Gerar declaração (Em breve)'
        icon={<ArrowRight />}
        onClick={() => {}}
      />
      <ActionButton
        content='Últimas ocorrências (Em breve)'
        icon={<ArrowRight />}
        onClick={() => {}}
      />
    </div>
  );
}
