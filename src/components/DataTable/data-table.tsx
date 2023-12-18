'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { DataTableToolbar } from './data-table-toolbar';
import { DataTablePagination } from './data-table-pagination';
import { DataTableBody } from './data-table-body';
import { DataTableProvider } from './data-table-context';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  toolbar?: React.ReactNode;
  body?: React.ReactNode;
  pagination?: React.ReactNode;
  loadingComponent?: () => JSX.Element | null;
}

function DataTable<TData, TValue>({
  columns,
  data,
  body,
  toolbar,
  pagination,
  loadingComponent,
}: DataTableProps<TData, TValue>) {

  return (
    <DataTableProvider columns={columns} data={data}>
      <div className="space-y-4 w-full">
        {toolbar}
        {loadingComponent?.()}
        {body}
        {pagination}
      </div>
    </DataTableProvider>
  );
}

DataTable.Toolbar = DataTableToolbar;
DataTable.Body = DataTableBody;
DataTable.Pagination = DataTablePagination;

export default DataTable;
