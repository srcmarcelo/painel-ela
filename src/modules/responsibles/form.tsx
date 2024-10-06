import { Button } from "@/components/ui/button";
import { useData } from "@/lib/data/context";
import { MyForm, Option, formFields } from "@/lib/ts-form";
import { FileText, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { v4 } from "uuid";
import { z } from "zod";
import { useStudents } from "../students/api";
import { useResponsibles } from "./api";

const ResponsibleSchema = z.object({
  name: formFields.text.describe("Nome"),
  cpf: formFields.text_cpf.describe("CPF").optional(),
  phone: formFields.text_phone.describe("Telefone").optional(),
  email: formFields.text.describe("Email").email("Email inválido").optional(),
  responsible_type: formFields.select_option.describe("Tipo"),
  children: formFields.multi_select.describe("Crianças").optional(),
});

export function ResponsibleForm({
  currentId,
  onSubmit: _onSubmit,
}: {
  currentId?: string;
  onSubmit?: (values: any) => void;
}) {
  const router = useRouter();
  const { createResponsibles, updateResponsible, loadingSubmit } =
    useResponsibles();
  const { updateStudent } = useStudents();
  const { students, responsibles, loading, loadResponsibles } = useData();

  const defaultValues = useMemo(() => {
    const formattedValues: any = currentId
      ? responsibles.find((e) => e.id === currentId)
      : {};

    Object.keys(formattedValues).forEach((key: any) => {
      if (formattedValues[key] === null) {
        delete formattedValues[key];
      }
    });

    return formattedValues;
  }, [currentId, responsibles]);

  const onSubmit = async (values: z.infer<typeof ResponsibleSchema>) => {
    const formattedValues: any = values || {};

    const uuid = currentId || v4();

    Object.keys(formattedValues).forEach((key: any) => {
      if (formattedValues[key] === null) {
        delete formattedValues[key];
      }
    });

    formattedValues.children.forEach((childId: string) => {
      const child = students.find((student) => childId === student.id);

      if (formattedValues.responsible_type === "mother") {
        if (child?.mother_id !== uuid) {
          updateStudent({ mother_id: uuid }, childId);
        }
      }

      if (formattedValues.responsible_type === "father") {
        if (child?.father_id !== uuid) {
          updateStudent({ father_id: uuid }, childId);
        }
      }
    });

    const { error } = currentId
      ? await updateResponsible(formattedValues, uuid)
      : await createResponsibles({ id: uuid, ...formattedValues });

    if (!error) {
      loadResponsibles();
      router.push("/responsaveis");
    }
  };

  const studentsData: Option[] = (
    students?.map((student): Option => {
      return {
        label: student.name.toUpperCase(),
        value: student.id,
      };
    }) || []
  ).sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });

  const responsibleTypes: Option[] = [
    { label: "Mãe", value: "mother" },
    { label: "Pai", value: "father" },
    { label: "Outro", value: "other" },
  ];

  return loading ? (
    <div className="flex flex-1 justify-center items-center">
      <Loader />
    </div>
  ) : (
    <MyForm
      formProps={{ id: "responsible_form" }}
      renderAfter={() => (
        <Button
          type="submit"
          isLoading={loadingSubmit}
          loadingText="Salvando..."
          className="gap-2"
        >
          <FileText className="h-5 w-5 " />
          Salvar
        </Button>
      )}
      schema={ResponsibleSchema}
      props={{
        responsible_type: {
          options: responsibleTypes,
        } as any,
        children: {
          options: studentsData,
        } as any,
      }}
      defaultValues={defaultValues as any}
      onSubmit={onSubmit}
    >
      {({ name, cpf, phone, email, responsible_type, children }) => {
        return (
          <div className="space-y-8 py-4 w-full mb-4">
            <div className="grid grid-cols-2 gap-3 w-full max-md:grid-cols-1">
              <div>{name}</div>
              <div>{email}</div>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full max-md:grid-cols-1">
              <div>{cpf}</div>
              <div>{phone}</div>
              <div>{responsible_type}</div>
            </div>
            <div className="w-full">
              <div>{children}</div>
            </div>
          </div>
        );
      }}
    </MyForm>
  );
}
