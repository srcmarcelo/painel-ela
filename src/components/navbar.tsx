'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, MenuIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';

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
  const { push } = useRouter();
  const {signOut} = useAuth();

  return (
    <header className='flex justify-around items-center w-full py-4 bg-primary text-white'>
      <div className='flex justify-center items-center space-x-1'>
        <Image src='/pet.ico' height={40} width={40} alt='ELA LOGO' />
        <p className='text-2xl font-serif'>ELA</p>
      </div>
      <ul className='flex justify-center items-center space-x-10 max-sm:hidden'>
        <NavbarItem href='/painel' label='Painel' />
        <NavbarItem href='/alunos' label='Alunos' />
        <NavbarItem href='/responsaveis' label='Responsáveis' />
        <NavbarItem href='/turmas' label='Turmas' />
      </ul>
      <div>
        <Button
          className='rounded-full bg-primary max-sm:hidden'
          variant='outline'
          onClick={() => signOut()}
        >
          SAIR
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center sm:hidden'>
            <MenuIcon className='h-8 w-8' />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => push('/painel')}>Painel</DropdownMenuItem>
            <DropdownMenuItem onClick={() => push('/alunos')}>Alunos</DropdownMenuItem>
            <DropdownMenuItem onClick={() => push('/responsaveis')}>Responsáveis</DropdownMenuItem>
            <DropdownMenuItem onClick={() => push('/turmas')}>Turmas</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className='mr-2 h-4 w-4' />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
