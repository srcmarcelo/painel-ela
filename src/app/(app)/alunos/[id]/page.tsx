"use client";

import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { useData } from "@/lib/data/context";
import { translate } from "@/lib/translate";
import { parseISODateWithOffset } from "@/lib/utils";
import { MonitoringTable } from "@/modules/monitoring/studentMonitoringTable";
import StudentOccurrences from "@/modules/ocurrences/components/student-occurrences";
import StudentsScores from "@/modules/scores/studentScores";
import StudentAbsences from "@/modules/students/components/student-absences";
import { StudentForm } from "@/modules/students/form";
import { format } from "date-fns";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function Page() {
  const [edit, setEdit] = useState<boolean>(false);

  const { students, responsibles, classes, loading } = useData();

  const params = useParams();
  const router = useRouter();

  const student = useMemo(() => {
    return students.find((e) => e.id === params.id);
  }, [params.id, students]);

  const mother = useMemo(() => {
    return student
      ? responsibles.find((e) => e.id === student.mother_id)
      : undefined;
  }, [responsibles, student]);

  const father = useMemo(() => {
    return student
      ? responsibles.find((e) => e.id === student.father_id)
      : undefined;
  }, [responsibles, student]);

  const responsible = useMemo(() => {
    return student
      ? responsibles.find((e) => e.id === student.responsible_id)
      : undefined;
  }, [responsibles, student]);

  const classroom = useMemo(() => {
    return student
      ? classes?.find((e) => e.id === student.class_id)
      : undefined;
  }, [classes, student]);

  return (
    <div className="py-6 px-12">
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col w-full h-full">
          <div className="flex justify-between items-center max-sm:flex-col max-sm:text-center max-sm:space-y-2">
            <h1 className="font-medium text-3xl">{student?.name}</h1>
            <div className="flex flex-row space-x-2">
              <Button
                onClick={() => setEdit(!edit)}
                variant={edit ? "outline" : "default"}
              >
                {edit ? "Cancelar" : "Editar"}
              </Button>
              <Button onClick={() => router.back()} variant="outline">
                Voltar
              </Button>
            </div>
          </div>

          <div className="mt-4">
            {edit ? (
              <StudentForm
                onSubmit={() => setEdit(false)}
                currentId={student?.id}
              />
            ) : (
              <div className="border rounded-md p-4 space-y-4">
                {classroom && (
                  <div>
                    <p className="text-muted-foreground">Turma</p>
                    <Link
                      className="w-full h-full underline"
                      href={{
                        pathname: `/turmas/${classroom.id}`,
                      }}
                    >
                      <p>{`${classroom.grade} - ${
                        translate.period[classroom.period]
                      }`}</p>
                    </Link>
                  </div>
                )}
                {mother && (
                  <div>
                    <p className="text-muted-foreground">Mãe</p>
                    <Link
                      className="w-full h-full underline"
                      href={{
                        pathname: `/responsaveis/${mother.id}`,
                      }}
                    >
                      <p>{mother.name}</p>
                    </Link>
                  </div>
                )}
                {father && (
                  <div>
                    <p className="text-muted-foreground">Pai</p>
                    <Link
                      className="w-full h-full underline"
                      href={{
                        pathname: `/responsaveis/${father.id}`,
                      }}
                    >
                      <p>{father.name}</p>
                    </Link>
                  </div>
                )}
                {responsible && (
                  <div>
                    <p className="text-muted-foreground">Responsável</p>
                    <Link
                      className="w-full h-full underline"
                      href={{
                        pathname: `/responsaveis/${responsible.id}`,
                      }}
                    >
                      <p>{responsible.name}</p>
                    </Link>
                  </div>
                )}
                {student && (
                  <div>
                    <p className="text-muted-foreground">Data de nascimento</p>
                    <p>
                      {format(
                        parseISODateWithOffset(student.date_of_birth),
                        "dd/MM/yyyy"
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8">
            <StudentAbsences studentId={student?.id} />
          </div>

          <div className="mt-8">
            <StudentOccurrences student={student} />
          </div>

          <div className="mt-8">
            {classroom?.type === "elementary" ? (
              <StudentsScores
                studentId={student?.id}
                classId={student?.class_id}
              />
            ) : (
              <MonitoringTable
                studentId={student?.id}
                classId={student?.class_id}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
