'use client';

import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, MenuIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import Link from 'next/link';
import { useData } from '@/lib/data/context';
import { SHORTNAME } from '../../infos';
// import { AnnouncementModal } from './announcement-modal';

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
  const { signOut, user } = useAuth();
  const { staff } = useData();

  const userInfo = staff.find((member) => user?.email === member.email);

  return (
    <header className='flex justify-around items-center w-full py-4 bg-primary text-white'>
      <Link
        href={{
          pathname: `/painel`,
        }}
      >
        <div className='flex justify-center items-center space-x-1'>
          <p className='text-2xl font-serif'>{SHORTNAME}</p>
        </div>
      </Link>
      <ul className='flex justify-center items-center space-x-10 max-sm:hidden'>
        <NavbarItem href='/painel' label='Painel' />
        <NavbarItem href='/alunos' label='Alunos' />
        <NavbarItem href='/responsaveis' label='Responsáveis' />
        <NavbarItem href='/turmas' label='Turmas' />
        {/* <NavbarItem href='/financeiro' label='Financeiro' /> */}
        {userInfo && ['developer', 'admin'].includes(userInfo.role) && (
          <NavbarItem href='/funcionarios' label='Funcionários' />
        )}
      </ul>
      <div className='flex'>
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center'>
            <MenuIcon className='h-8 w-8' />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{userInfo?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => push('/painel')}>
              Painel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => push('/alunos')}>
              Alunos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => push('/responsaveis')}>
              Responsáveis
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => push('/turmas')}>
              Turmas
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => push('/financeiro')}>
              Financeiro
            </DropdownMenuItem> */}
            {userInfo && ['developer', 'admin'].includes(userInfo.role) && (
              <DropdownMenuItem onClick={() => push('/funcionarios')}>
                Funcionários
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className='mr-2 h-4 w-4' />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* {
          ['admin', 'developer'].includes(`${userInfo?.role}`) && (
            <AnnouncementModal />
          )
        } */}
      </div>
    </header>
  );
}
