"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStudents } from "../students/api";
import { Student } from "../students/schema";

export default function StudentsInvoicesTable({
  students,
  loadStudents,
}: {
  students: Student[];
  loadStudents: () => void;
}) {
  const { updateStudent } = useStudents();
  const onChangePaid = async (student: Student, index: number) => {
    const newInvoices = student.invoices.map((paid, invoiceIndex) =>
      invoiceIndex === index ? !paid : paid
    );
    await updateStudent({ invoices: newInvoices }, student.id);
    loadStudents();
  };

  return (
    <div className="max-w-full overflow-x-auto">
      <Table className="min-w-max table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center sticky left-0 bg-white z-10 w-36 sm:w-48">
              ALUNO
            </TableHead>
            {[
              "JAN",
              "FEV",
              "MAR",
              "ABR",
              "MAI",
              "JUN",
              "JUL",
              "AGO",
              "SET",
              "OUT",
              "NOV",
              "DEZ",
            ].map((month) => (
              <TableHead key={month} className="text-center">
                {month}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-center sticky left-0 bg-white w-36 sm:w-48">
                  {student.name}
                </TableCell>
                {student.invoices?.map((paid, invoiceIndex) => (
                  <TableCell key={invoiceIndex} className="text-center">
                    {paid ? (
                      <Badge
                        variant="success"
                        className="text-[10px] cursor-pointer"
                        onClick={() => onChangePaid(student, invoiceIndex)}
                      >
                        PAGO
                      </Badge>
                    ) : (
                      <Badge
                        variant="destructive"
                        className="text-[10px] cursor-pointer"
                        onClick={() => onChangePaid(student, invoiceIndex)}
                      >
                        NÃO
                      </Badge>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-center col-span-full">
                <div className="text-center w-full justify-center items-center">
                  Sem alunos
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
