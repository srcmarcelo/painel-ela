"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/DataTable/data-table-column-header";
import { DataTableRowActions } from "@/components/DataTable/data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { translate } from "@/lib/translate";
import Link from "next/link";
import { Responsible } from "./schema";

export function ResponsiblesTableColumns(
  students: { id: string; name: string }[],
  setOpen: (item: boolean) => void,
  setResponsible: (item: Responsible) => void
): ColumnDef<Responsible>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Código" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("code")}</div>,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Responsável" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              <Link
                className="w-full h-full underline"
                href={{
                  pathname: `/responsaveis/${row.original.id}`,
                }}
              >
                {row.getValue("name") || "-"}
              </Link>
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "cpf",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CPF" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("cpf") || "-"}
            </span>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Telefone" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("phone") || "-"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("email") || "-"}
            </span>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "responsible_type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo" />
      ),
      cell: ({ row }) => {
        const value: string = row.getValue("responsible_type");
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {translate.responsible_types[value] || "-"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "children",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Crianças" />
      ),
      cell: ({ row }) => {
        const childrenIds: string[] = row.getValue("children");
        const children = students.filter((student) =>
          childrenIds?.includes(student.id)
        );

        return (
          <div className="flex flex-col space-y-1">
            {children.length > 0 ? (
              children.map((child, index) => (
                <Link
                  key={index}
                  className="w-full h-full underline"
                  href={{
                    pathname: `/alunos/${child.id}`,
                  }}
                >
                  <span className="max-w-[500px] truncate font-medium">
                    {child.name}
                  </span>
                </Link>
              ))
            ) : (
              <span className="max-w-[500px] truncate font-medium">-</span>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DataTableRowActions label="Abrir menu">
            <DropdownMenuItem className="cursor-pointer" onClick={() => null}>
              <Link
                className="w-full h-full"
                href={{
                  pathname: `/responsaveis/${row.original.id}`,
                }}
              >
                Visualizar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-destructive"
              onClick={() => {
                setResponsible(row.original);
                setOpen(true);
              }}
            >
              Deletar
            </DropdownMenuItem>
          </DataTableRowActions>
        );
      },
    },
  ];
}
