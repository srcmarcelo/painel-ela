'use client';

import { Cross2Icon, TrashIcon } from '@radix-ui/react-icons';

import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { DataTableViewOptions } from './data-table-view-options';
import { useDataTableContext } from './data-table-context';

export function DataTableToolbar({
  placeholder,
  searchId,
  onDelete,
}: {
  placeholder?: string;
  searchId: string;
  onDelete?: (ids: string[]) => void;
}) {
  const { table } = useDataTableContext();
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedItems = table.getSelectedRowModel().rows;

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          key={searchId}
          id={searchId}
          placeholder={placeholder}
          value={(table.getColumn(searchId)?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn(searchId)?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px] max-[400px]:w-full'
        />
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Limpar
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <div className='space-x-2 items-center flex'>
        {selectedItems?.length > 0 && onDelete && (
          <Button
            size='sm'
            variant='outline'
            onClick={() => {
              onDelete?.(selectedItems.map((item: any) => item.original.id));
              table.resetRowSelection();
            }}
          >
            <TrashIcon className='h-4 w-4' />
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
