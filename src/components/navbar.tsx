'use client';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import React from 'react';

const NavbarItem = ({ href, label }: { href: string; label: string }) => {
  const pathName = usePathname();

  return (
    <li>
      <a href={href} className={cn(pathName === href ? 'underline' : '')}>
        {label}
      </a>
    </li>
  );
};

export function Navbar() {
  return (
    <header className='w-full py-4 bg-primary text-white text-lg max-sm:text-base'>
      <ul className='flex justify-center items-center space-x-10 max-sm:space-x-4'>
        <NavbarItem href='/' label='Painel' />
        <NavbarItem href='/alunos' label='Alunos' />
        <NavbarItem href='/responsaveis' label='Responsáveis' />
        <NavbarItem href='/turmas' label='Turmas' />
      </ul>
    </header>
  );
}
