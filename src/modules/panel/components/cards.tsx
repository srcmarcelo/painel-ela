'use client';

import StatisticCard from '@/components/statistic-card';
import { useData } from '@/lib/data/context';
import { cn } from '@/lib/utils';
import React from 'react';
import { ClassNameValue } from 'tailwind-merge';

export default function Cards({ classname }: { classname: ClassNameValue }) {
  const { students, responsibles, loading } = useData();

  return (
    <div
      className={cn(
        'flex w-full justify-between items-center max-sm:flex-col max-sm:space-y-4',
        classname
      )}
    >
      <StatisticCard
        title='Alunos'
        icon={
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='h-4 w-4 text-muted-foreground'
          >
            <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
            <circle cx='9' cy='7' r='4' />
            <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
          </svg>
        }
        content={
          <>
            <div className={cn('font-bold', loading ? 'text-lg' : 'text-2xl')}>
              {loading ? 'carregando...' : students.length}
            </div>
            <p className='text-xs text-muted-foreground'>cadastrados</p>
          </>
        }
      />

      <StatisticCard
        title='Responsáveis'
        icon={
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='h-4 w-4 text-muted-foreground'
          >
            <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
            <circle cx='9' cy='7' r='4' />
            <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
          </svg>
        }
        content={
          <>
            <div className={cn('font-bold', loading ? 'text-lg' : 'text-2xl')}>
              {loading ? 'carregando...' : responsibles.length}
            </div>
            <p className='text-xs text-muted-foreground'>cadastrados</p>
          </>
        }
      />

      <StatisticCard
        title='Funcionários'
        icon={
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='h-4 w-4 text-muted-foreground'
          >
            <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
            <circle cx='9' cy='7' r='4' />
            <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
          </svg>
        }
        content={
          <>
            <div className={cn('font-bold', loading ? 'text-lg' : 'text-2xl')}>
              {loading ? 'carregando...' : 0}
            </div>
            <p className='text-xs text-muted-foreground'>cadastrados</p>
          </>
        }
      />
    </div>
  );
}
