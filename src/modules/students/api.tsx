import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "../../../supabase";

export function useStudents() {
  const { toast } = useToast();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  async function fetchStudents(): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      setLoadingSubmit(true);
      const { data, error } = await supabase
        .from("students")
        .select()
        .order("name");

      if (error || !data) {
        setLoadingSubmit(false);
        console.log("error:", error);
        toast({
          description: "Erro ao buscar alunos",
        });
        return { error };
      } else {
        setLoadingSubmit(false);
        return { data, error };
      }
    } catch (error) {
      setLoadingSubmit(false);
      console.log("error:", error);
      toast({
        variant: "destructive",
        description: "Erro ao buscar alunos",
      });
      return { error };
    }
  }

  async function fetchStudentById(id: string): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      setLoadingSubmit(true);
      const { data, error } = await supabase
        .from("students")
        .select()
        .eq("id", id);

      if (error || !data) {
        setLoadingSubmit(false);
        console.log("error:", error);
        toast({
          description: "Erro ao buscar aluno",
        });
        return { error };
      } else {
        setLoadingSubmit(false);
        return { data: data[0], error };
      }
    } catch (error) {
      setLoadingSubmit(false);
      console.log("error:", error);
      toast({
        variant: "destructive",
        description: "Erro ao buscar aluno",
      });

      return { error };
    }
  }

  async function createStudents(values: any): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      setLoadingSubmit(true);
      const { data, error } = await supabase
        .from("students")
        .insert(values)
        .select();

      if (error || !data) {
        setLoadingSubmit(false);
        console.log("error:", error);
        toast({
          variant: "destructive",
          title: "Erro ao registrar aluno",
          description: error.message,
        });
        return { data, error };
      } else {
        setLoadingSubmit(false);
        toast({ description: "Aluno registrado com sucesso" });
        return { data, error };
      }
    } catch (error) {
      setLoadingSubmit(false);
      console.log("error:", error);
      toast({
        variant: "destructive",
        description: "Erro ao registrar aluno",
      });
      return { error };
    }
  }

  async function updateStudent(
    values: any,
    id: string,
    inBatch?: boolean,
  ): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      setLoadingSubmit(true);
      const { data, error } = await supabase
        .from("students")
        .update(values)
        .eq("id", id)
        .select();

      if (error || !data) {
        setLoadingSubmit(false);
        console.log("error:", error);
        toast({
          variant: "destructive",
          title: "Erro ao atualizar aluno",
          description: error.message,
        });
        return { data, error };
      } else {
        setLoadingSubmit(false);
        !inBatch && toast({ description: "Aluno atualizado com sucesso" });
        return { data, error };
      }
    } catch (error) {
      setLoadingSubmit(false);
      console.log("error:", error);
      toast({
        variant: "destructive",
        description: "Erro ao atualizar aluno",
      });
      return { error };
    }
  }

  async function deleteStudents(
    ids: string[]
  ): Promise<{ error?: Error | unknown }> {
    try {
      setLoadingSubmit(true);
      const deletePromises = ids.map(async (id) => {
        const { error } = await supabase.from("students").delete().eq("id", id);

        if (error) {
          setLoadingSubmit(false);
          toast({
            variant: "destructive",
            description: "Erro ao excluir aluno",
          });
          return { error };
        } else {
          setLoadingSubmit(false);
          toast({ description: "Aluno excluído com sucesso" });
        }
      });

      await Promise.all(deletePromises);

      return {};
    } catch (error) {
      setLoadingSubmit(false);
      toast({
        variant: "destructive",
        description: "Erro ao excluir aluno",
      });
      return { error };
    }
  }

  return {
    fetchStudents,
    fetchStudentById,
    createStudents,
    updateStudent,
    deleteStudents,
    loadingSubmit,
    setLoadingSubmit,
  };
}
