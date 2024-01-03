'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import Link from 'next/link';
import { Student } from '../students/schema';

export function ClassStudentsTableColumns(): ColumnDef<Student>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title='Alunos'
          className='flex text-center justify-center items-center'
        />
      ),
      cell: ({ row }) => {
        return (
          <div className='flex text-center justify-center items-center'>
            <span className='flex text-center justify-center items-center truncate font-medium'>
              <Link
                className='w-full h-full underline text-center'
                href={{
                  pathname: `/alunos/${row.original.id}`,
                }}
              >
                {row.getValue('name')}
              </Link>
            </span>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
