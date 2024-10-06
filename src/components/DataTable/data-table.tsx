"use client";

import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";
import { DataTableBody } from "./data-table-body";
import { DataTableProvider } from "./data-table-context";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  toolbar?: React.ReactNode;
  body?: React.ReactNode;
  pagination?: React.ReactNode;
  className?: ClassNameValue;
  disableAutoPagination?: boolean;
  loadingComponent?: () => JSX.Element | null;
  isLoading?: boolean;
}

function DataTable<TData, TValue>({
  columns,
  data,
  body,
  toolbar,
  pagination,
  className,
  disableAutoPagination,
  loadingComponent,
  isLoading,
}: DataTableProps<TData, TValue>) {
  return (
    <DataTableProvider
      columns={columns}
      data={data}
      isLoading={isLoading}
      disableAutoPagination={disableAutoPagination}
    >
      <div className={cn("space-y-4 w-full", className)}>
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
