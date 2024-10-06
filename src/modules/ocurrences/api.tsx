import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "../../../supabase";
import { Occurrence } from "./schema";

export function useOccurrences() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  async function fetchOccurrences(): Promise<{
    data?: Occurrence[];
    error?: Error | unknown;
  }> {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("occurrences")
        .select()
        .order("created_at", { ascending: false });

      if (error) {
        setLoading(false);
        console.log("error:", error);
        toast({
          description: "Erro ao buscar ocorrências",
        });
        return { error };
      } else {
        setLoading(false);
        return { data };
      }
    } catch (error) {
      setLoading(false);
      console.log("error:", error);
      toast({
        variant: "destructive",
        description: "Erro ao buscar ocorrências",
      });
      return { error };
    }
  }

  async function fetchOccurrencesByStudentId(studentId: string): Promise<{
    data?: Occurrence[];
    error?: Error | unknown;
  }> {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("occurrences")
        .select()
        .eq("student_id", studentId)
        .order("created_at", { ascending: false });

      if (error) {
        setLoading(false);
        console.log("error:", error);
        toast({
          description: "Erro ao buscar ocorrências",
        });
        return { error };
      } else {
        setLoading(false);
        return { data };
      }
    } catch (error) {
      setLoading(false);
      console.log("error:", error);
      toast({
        variant: "destructive",
        description: "Erro ao buscar ocorrências",
      });
      return { error };
    }
  }

  async function createOccurence(values: any): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("occurrences")
        .insert(values)
        .select();

      if (error || !data) {
        setLoading(false);
        console.log("error:", error);
        toast({
          variant: "destructive",
          title: "Erro ao registrar ocorrência",
          description: error.message,
        });
        return { data, error };
      } else {
        setLoading(false);
        toast({ description: "Ocorrência registrada com sucesso" });
        return { data, error };
      }
    } catch (error) {
      setLoading(false);
      console.log("error:", error);
      toast({
        variant: "destructive",
        description: "Erro ao registrar ocorrência",
      });
      return { error };
    }
  }

  async function deleteOcurrences(
    ids: string[]
  ): Promise<{ error?: Error | unknown }> {
    try {
      setLoading(true);
      const deletePromises = ids.map(async (id) => {
        const { error } = await supabase
          .from("occurrences")
          .delete()
          .eq("id", id);

        if (error) {
          setLoading(false);
          toast({
            variant: "destructive",
            description: "Erro ao excluir ocorrência",
          });
          return { error };
        } else {
          setLoading(false);
          toast({ description: "Ocorrência excluída com sucesso" });
        }
      });
      setLoading(false);

      await Promise.all(deletePromises);

      return {};
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        description: "Erro ao excluir ocorrência",
      });
      return { error };
    }
  }

  const notifyOccurenceWhatsappMessage = async (
    to?: string,
    teacherName?: string,
    studentName?: string,
    body?: string
  ) => {
    if (!to || !teacherName || !studentName || !body) {
      return;
    }

    try {
      setLoading(true);
      await fetch("/api/send-whatsapp-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, teacherName, studentName, body }),
      });

      setLoading(false);

      toast({ description: "Mensagem do WhatsApp enviada com sucesso" });
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        description: "Erro ao enviar WhatsApp",
      });
    }
  };

  return {
    fetchOccurrences,
    fetchOccurrencesByStudentId,
    createOccurence,
    deleteOcurrences,
    notifyOccurenceWhatsappMessage,
    loading,
    setLoading,
  };
}
