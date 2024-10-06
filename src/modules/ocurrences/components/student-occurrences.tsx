import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth/context";
import { useData } from "@/lib/data/context";
import { parseISODateWithOffset } from "@/lib/utils";
import { Student } from "@/modules/students/schema";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useOccurrences } from "../api";
import { Occurrence, occurrenceType } from "../schema";
import { CreateOcurrenceModal } from "./create-occurence-modal";

type BadgeVariantType = {
  [key in occurrenceType]: "success" | "destructive" | "default";
};

type BadgeLabelType = {
  [key in occurrenceType]: string;
};

function DeleteConfirm({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" className="h-8 w-8">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja deletar a ocorrência?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Candelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function StudentOccurrences({ student }: { student?: Student }) {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);

  const {
    fetchOccurrencesByStudentId,
    deleteOcurrences,
    createOccurence,
    notifyOccurenceWhatsappMessage,
    loading,
  } = useOccurrences();

  const { responsibles, staff } = useData();
  const { user } = useAuth();

  const userName = staff.find((member) => user?.email === member.email)?.name;

  async function fetchOccurrences() {
    if (!student?.id) return;
    const { data, error } = await fetchOccurrencesByStudentId(student.id);

    if (!error && data) setOccurrences(data);
  }

  async function handleDelete(id: string) {
    const { error } = await deleteOcurrences([id]);

    if (!error) fetchOccurrences();
  }

  async function handleCreate(values: any) {
    if (!student?.id) return;

    const formattedValues = {
      student_id: student.id,
      type: values.type,
      description: values.description,
    };
    const { error } = await createOccurence(formattedValues);

    if (!error) {
      if (values.notifyResponsibles) {
        const responsible = responsibles.find(
          (responsible) => responsible.id === student.responsible_id
        );

        const numbersToNotify = [responsible?.phone];

        if (student.mother_id && student.mother_id !== responsible?.id) {
          const mother = responsibles.find(
            (responsible) => responsible.id === student.mother_id
          );
          numbersToNotify.push(mother?.phone);
        }

        if (student.father_id && student.father_id !== responsible?.id) {
          const father = responsibles.find(
            (responsible) => responsible.id === student.father_id
          );
          numbersToNotify.push(father?.phone);
        }

        numbersToNotify.forEach((number) => {
          notifyOccurenceWhatsappMessage(
            number,
            userName,
            student.name,
            values.description
          );
        });
      }

      fetchOccurrences();
    }
  }

  useEffect(() => {
    fetchOccurrences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student]);

  const BadgeVariant: BadgeVariantType = {
    good: "success",
    bad: "destructive",
    other: "default",
  };

  const BadgeLabel: BadgeLabelType = {
    good: "Positiva",
    bad: "Negativa",
    other: "Neutra",
  };

  return (
    <div className="border rounded-lg">
      <div className="flex p-2 items-center justify-between">
        <div className="text-base flex items-center">
          <p className="mr-2">Ocorrências:</p>{" "}
          <p className="text-primary font-semibold text-lg mr-2">
            {occurrences.length}
          </p>
        </div>
        <CreateOcurrenceModal onSubmit={handleCreate} loading={loading} />
      </div>
      <Accordion type="single" collapsible className="w-full p-0 rounded-lg">
        <AccordionItem
          value="occurrences"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="flex justify-between items-center w-full px-2 py-2 text-base font-medium text-left rounded-lg hover:no-underline hover:bg-gray-200">
            <div className="flex items-center">
              <p className="mr-2 text-muted-foreground text-sm">Positivas:</p>{" "}
              <p className="text-green-600">
                {
                  occurrences.filter((occurrence) => occurrence.type === "good")
                    .length
                }
              </p>
              <p className="ml-2 mr-2 text-muted-foreground text-sm">
                Negativas:{" "}
              </p>
              <p className="text-red-600">
                {
                  occurrences.filter((occurrence) => occurrence.type === "bad")
                    .length
                }
              </p>
              <p className="ml-2 mr-2 text-muted-foreground text-sm">
                Outras:{" "}
              </p>
              {
                occurrences.filter((occurrence) => occurrence.type === "other")
                  .length
              }
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white p-0 rounded-lg">
            <div className="overflow-x-auto">
              {occurrences.length === 0 ? (
                <div className="w-full text-base text-center text-muted-foreground py-2">
                  Sem ocorrências
                </div>
              ) : (
                <Table className="min-w-full divide-y divide-gray-200">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </TableHead>
                      <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </TableHead>
                      <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </TableHead>
                      <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" />
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white divide-y divide-gray-200">
                    {occurrences.map((occurrence) => (
                      <TableRow key={occurrence.id}>
                        <TableCell className="px-6 py-4 text-sm text-gray-900 text-center">
                          {occurrence.description}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          <Badge variant={BadgeVariant[occurrence.type]}>
                            {BadgeLabel[occurrence.type]}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          {format(
                            parseISODateWithOffset(
                              occurrence.date as unknown as string
                            ),
                            "dd/MM/yyyy",
                            {
                              locale: ptBR,
                            }
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm text-gray-900 text-center">
                          <DeleteConfirm
                            onConfirm={() => handleDelete(occurrence.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
