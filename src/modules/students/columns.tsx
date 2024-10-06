"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/DataTable/data-table-column-header";
import { DataTableRowActions } from "@/components/DataTable/data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { translate } from "@/lib/translate";
import { parseISODateWithOffset } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import { Student } from "./schema";

export function StudentsTableColumns(
  responsibles: { id: string; name: string }[],
  classes: { id: string; grade: string; period: string }[],
  setOpen?: (item: boolean) => void,
  setStudent?: (item: Student) => void
): ColumnDef<Student>[] {
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
        <DataTableColumnHeader column={column} title="Aluno" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              <Link
                className="w-full h-full underline"
                href={{
                  pathname: `/alunos/${row.original.id}`,
                }}
              >
                {row.getValue("name")}
              </Link>
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "class_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Turma" />
      ),
      cell: ({ row }) => {
        const classroom = classes?.find(
          (e) => e.id === row.getValue("class_id")
        );

        return (
          <div className="flex space-x-2">
            {classroom ? (
              <Link
                className="w-full h-full underline"
                href={{
                  pathname: `/turmas/${classroom.id}`,
                }}
              >
                <span className="max-w-[500px] truncate font-medium">
                  {`${classroom.grade} - ${translate.period[classroom.period]}`}
                </span>
              </Link>
            ) : (
              <span className="font-medium">-</span>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "responsible_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Responsável" />
      ),
      cell: ({ row }) => {
        const responsibleName = responsibles.find(
          (e) => e.id === row.getValue("responsible_id")
        )?.name;

        return (
          <div className="flex space-x-2">
            <Link
              className="w-full h-full underline"
              href={{
                pathname: `/responsaveis/${row.getValue("responsible_id")}`,
              }}
            >
              <span className="max-w-[500px] truncate font-medium">
                {responsibleName}
              </span>
            </Link>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "date_of_birth",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de nascimento" />
      ),
      cell: ({ row }) => {
        const date = parseISODateWithOffset(row.getValue("date_of_birth"));

        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {date && format(date, "dd/MM/yyyy")}
            </span>
          </div>
        );
      },
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
                  pathname: `/alunos/${row.original.id}`,
                }}
              >
                Visualizar
              </Link>
            </DropdownMenuItem>
            {
              <DropdownMenuItem
                className="cursor-pointer text-destructive"
                onClick={() => {
                  setOpen?.(true);
                  setStudent?.(row.original);
                }}
              >
                Deletar
              </DropdownMenuItem>
            }
          </DataTableRowActions>
        );
      },
    },
  ];
}
