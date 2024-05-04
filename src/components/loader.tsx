import { cn } from '@/lib/utils';
import React from 'react';

export default function Loader({className}: {className?: string}) {
  return (
    <div className={cn('flex flex-1 justify-center items-center animate-pulse', className)}>
      Carregando...
    </div>
  );
}
