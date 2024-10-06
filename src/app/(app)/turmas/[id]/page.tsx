"use client";

import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { useData } from "@/lib/data/context";
import { translate } from "@/lib/translate";
import Attendance from "@/modules/classes/components/attendance";
import { useStudents } from "@/modules/students/api";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

export default function Page() {
  const { students, classes, loading } = useData();

  const params = useParams();
  const router = useRouter();

  const classroom = useMemo(() => {
    return classes.find((e) => e.id === params.id);
  }, [classes, params.id]);

  const classStudents = students?.filter(
    (student) => student.class_id === params.id
  );

  return (
    <>
      <div className="py-6 px-12 max-sm:px-3">
        {loading ? (
          <div className="w-full h-52 flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col w-full h-full">
            <div className="flex justify-between items-center max-sm:flex-col max-sm:text-center max-sm:space-y-2">
              <h1 className="font-medium text-3xl">{`${classroom?.grade} - ${
                classroom?.period && translate.period[classroom?.period]
              }`}</h1>
              <div className="flex flex-row space-x-2">
                <Button onClick={() => router.back()} variant="outline">
                  Voltar
                </Button>
              </div>
            </div>

            <div className="mt-8">
              <Attendance classId={`${params.id}`} students={classStudents} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
