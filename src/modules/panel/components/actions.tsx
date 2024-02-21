'use client';

import ActionButton from '@/components/action-button';
import { ArrowRight } from 'lucide-react';
import React from 'react';

export default function Actions() {
  return (
    <div className='w-full flex flex-col space-y-12'>
      <ActionButton content='Fazer matrícula' icon={<ArrowRight />} onClick={() => {}} />
      <ActionButton content='Estoque de livros' icon={<ArrowRight />} onClick={() => {}} />
      <ActionButton content='Gerar declaração' icon={<ArrowRight />} onClick={() => {}} />
    </div>
  );
}
