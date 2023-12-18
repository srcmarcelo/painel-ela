import * as React from 'react';

import {
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

export type DataTableProps<TData extends RowData, TValue = unknown> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
};

export function useDataTable<TData extends RowData, TValue = unknown>(
  props: DataTableProps<TData, TValue>,
) {
  const { data, columns } = props;
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return {
    table,
    data,
    columns,
  };
}

type DataTableContextValue<
  TData extends RowData = any,
  TValue = unknown,
> = ReturnType<typeof useDataTable<TData, TValue>>;

const DataTableContext = React.createContext<DataTableContextValue>(
  {} as DataTableContextValue,
);

export function DataTableProvider<TData extends RowData, TValue = unknown>(
  props: DataTableProps<TData, TValue> & { children: React.ReactNode },
) {
  const { children, ...rest } = props;

  const value = useDataTable<TData, TValue>(rest);

  return (
    <DataTableContext.Provider value={value as DataTableContextValue}>
      {props.children}
    </DataTableContext.Provider>
  );
}

export function useDataTableContext<TData extends RowData, TValue = unknown>() {
  const value = React.useContext(DataTableContext) as DataTableContextValue<
    TData,
    TValue
  >;

  return value;
}
