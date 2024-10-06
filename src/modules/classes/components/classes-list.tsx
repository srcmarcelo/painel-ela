"use client";

import { Spinner } from "@/components/Spinner";
import { useData } from "@/lib/data/context";
import { translate } from "@/lib/translate";
import { useRouter } from "next/navigation";

export function ClassesList() {
  const { students, classes, loading } = useData();
  const { push } = useRouter();

  return loading ? (
    <div className="flex h-72 flex-1 justify-center items-center">
      <Spinner className="h-12 w-12" />
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {classes?.map((classroom, index) => {
        const classStudents = students?.filter(
          (student) => student.class_id === classroom.id
        );

        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 transform hover:scale-105 cursor-pointer"
            onClick={() => push(`/turmas/${classroom.id}`)}
          >
            <div className="px-6 py-4">
              <div className="flex items-center">
                <span className="font-bold text-xl text-gray-800">
                  {classroom.grade}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {translate.period[classroom.period]}
                </span>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="text-base text-gray-600">
                <p className="font-semibold">Alunos:</p>
                <p className="mt-1">{classStudents.length}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
