'use client';

import { ColumnDef } from '@tanstack/react-table';

import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import { DataTableRowActions } from '@/components/DataTable/data-table-row-actions';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Student } from './schema';
import { parseISODateWithOffset } from '@/lib/utils';

export const StudentsTableColumns: ColumnDef<Student>[] = [
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
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Código' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('code')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Aluno' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate font-medium'>
            {row.getValue('name')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'class_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Turma' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate font-medium'>
            {row.getValue('class_name')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'responsible_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Responsável' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate font-medium'>
            {row.getValue('responsible_name')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'mother_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mãe' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate font-medium'>
            {row.getValue('mother_name')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'father_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pai' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate font-medium'>
            {row.getValue('father_name')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'date_of_birth',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Data de nascimento' />
    ),
    cell: ({ row }) => {
      const date = parseISODateWithOffset(row.getValue('date_of_birth'));

      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate font-medium'>
            {date && format(date, 'dd/MM/yyyy')}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <DataTableRowActions label='Abrir menu'>
          <DropdownMenuItem className='cursor-pointer' onClick={() => null}>
            Visualizar
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer' onClick={() => null}>
            Deletar
          </DropdownMenuItem>
        </DataTableRowActions>
      );
    },
  },
];
