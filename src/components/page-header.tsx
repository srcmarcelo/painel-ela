'use client';
import { cn } from '@/lib/utils';
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader(props: PageHeaderProps) {
  const { title, subtitle, children, className } = props;

  return (
    <div
      className={cn(
        'w-full flex flex-row justify-between items-center mb-10 gap-2',
        className
      )}
    >
      <div>
        <h1 className='text-3xl font-bold mb-2'>{title}</h1>
        <p className='text-gray-500'>{subtitle}</p>
      </div>
      <div className='flex space-x-2 max-sm:flex-col gap-2 max-[400px]:flex-col items-center'>
        {children}
      </div>
    </div>
  );
}
