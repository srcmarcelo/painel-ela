import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { OccurrenceForm } from "../form";

export function CreateOcurrenceModal({
  onSubmit,
  loading,
}: {
  onSubmit: (values: any) => void;
  loading?: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="w-8 h-8">
          <PlusIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar ocorrência</DialogTitle>
          <DialogDescription>Registre algo sobre o aluno</DialogDescription>
        </DialogHeader>
        <OccurrenceForm onSubmit={onSubmit} />
        <DialogFooter>
          <DialogClose>
            <Button
              type="submit"
              form="occurrence_form"
              isLoading={loading}
              loadingText="Salvando..."
            >
              Salvar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
