"use client";

import { Spinner } from "@/components/Spinner";
import { useData } from "@/lib/data/context";
import { translate } from "@/lib/translate";
import StudentsInvoicesTable from "./studentsInvoicesTable";

export default function StudentsInvoices() {
  const { classes, students, loadStudents, loading, loadingClasses } =
    useData();

  if (loadingClasses) {
    return (
      <div className="w-full h-64 flex justify-center items-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="rounded-md border p-4 max-w-full">
      {classes.map((classroom) => {
        const classStudents = students.filter(
          (student) => student.class_id === classroom.id
        );

        return (
          classStudents.length > 0 && (
            <div
              key={classroom.id}
              className="mb-12 flex flex-col justify-center items-center w-full"
            >
              <h2 className="text-lg font-semibold mb-4">
                {`${classroom.grade} - ${translate.period[classroom.period]}`}
              </h2>
              <StudentsInvoicesTable
                students={classStudents}
                loadStudents={loadStudents}
              />
            </div>
          )
        );
      })}
    </div>
  );
}
