'use client';

import { ColumnDef } from '@tanstack/react-table';

import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import { translate } from '@/lib/translate';
import Link from 'next/link';
import { User } from './schema';
import { parseISODateWithOffset } from '@/lib/utils';

export function StaffTableColumns(): ColumnDef<User>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='translate-y-[2px]'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-[2px]'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Funcionário(a)' />
      ),
      cell: ({ row }) => {
        return (
          <div className='flex space-x-2'>
            <span className='max-w-[500px] truncate font-medium'>
              <Link
                className='w-full h-full underline'
                href={{
                  pathname: `/responsaveis/${row.original.id}`,
                }}
              >
                {row.getValue('name') || '-'}
              </Link>
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Email' />
      ),
      cell: ({ row }) => {
        return (
          <div className='flex space-x-2'>
            <span className='max-w-[500px] truncate font-medium'>
              {row.getValue('email') || '-'}
            </span>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'cpf',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CPF' />
      ),
      cell: ({ row }) => {
        return (
          <div className='flex space-x-2'>
            <span className='max-w-[500px] truncate font-medium'>
              {row.getValue('cpf') || '-'}
            </span>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Função' />
      ),
      cell: ({ row }) => {
        const value: string = row.getValue('role');
        return (
          <div className='flex space-x-2'>
            <span className='max-w-[500px] truncate font-medium'>
              {translate.user_types[value] || '-'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Cadastrado(a) em' />
      ),
      cell: ({ row }) => {
        const date = parseISODateWithOffset(row.getValue('created_at'));

        return (
          <div className='flex space-x-2'>
            <span className='max-w-[500px] truncate font-medium'>
              {date && format(date, 'dd/MM/yyyy')}
            </span>
          </div>
        );
      },
    },
  ];
}
