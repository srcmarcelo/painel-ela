"use client";

import DataTable from "@/components/DataTable/data-table";
import { AlertDestroyConfirm } from "@/components/destroy-confirm";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useData } from "@/lib/data/context";
import { useStudents } from "@/modules/students/api";
import { StudentsTableColumns } from "@/modules/students/columns";
import { Student } from "@/modules/students/schema";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const { students, responsibles, classes, loading, loadStudents } = useData();

  const [open, setOpen] = useState(false);
  const [student, setStudent] = useState<Student | undefined>();
  const { deleteStudents } = useStudents();

  const onDelete = async (ids: string[]) => {
    await deleteStudents(ids);
    loadStudents();
  };

  return (
    <>
      <AlertDestroyConfirm
        open={open}
        setOpen={setOpen}
        title={`Você tem certeza que deseja excluir o aluno:`}
        entityName={student?.name}
        onConfirm={() => {
          if (student?.id) {
            onDelete([student.id]);
          }
        }}
      />
      <div className="flex flex-col items-center w-full justify-center overflow-auto p-12 px-24 max-md:px-3 max-md:py-6">
        <PageHeader title="Alunos" subtitle="Alunos cadastrados na plataforma">
          <Button
            size="sm"
            className="relative"
            onClick={() => router.push("/alunos/cadastro")}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            <p className="m-0 whitespace-nowrap inline-block">
              Cadastrar aluno
            </p>
          </Button>
        </PageHeader>
        <DataTable
          data={students || []}
          columns={StudentsTableColumns(
            responsibles,
            classes,
            setOpen,
            setStudent
          )}
          body={<DataTable.Body />}
          isLoading={loading}
          toolbar={
            <DataTable.Toolbar
              placeholder="Buscar aluno..."
              searchId="name"
              onDelete={(ids) => {
                onDelete(ids);
              }}
            />
          }
          pagination={<DataTable.Pagination />}
        />
      </div>
    </>
  );
}
