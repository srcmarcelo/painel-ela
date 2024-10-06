import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "../../../supabase";

export function useScores() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // async function fetchStudents(): Promise<{
  //   data?: any;
  //   error?: Error | unknown;
  // }> {
  //   try {
  //     const { data, error } = await supabase.from('students').select();

  //     if (error || !data) {
  //       console.log('error:', error);
  //       toast({
  //         description: 'Erro ao buscar alunos',
  //       });
  //       return { error };
  //     } else {
  //       return { data, error };
  //     }
  //   } catch (error) {
  //     console.log('error:', error);
  //     toast({
  //       variant: 'destructive',
  //       description: 'Erro ao buscar alunos',
  //     });
  //     return { error };
  //   }
  // }

  async function fetchScoresByStudentId(id: string): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("scores")
        .select()
        .eq("student_id", id);

      if (error || !data) {
        setLoading(false);
        console.log("error:", error);
        toast({
          description: "Erro ao buscar notas",
        });
        return { error };
      } else {
        setLoading(false);
        return { data: data, error };
      }
    } catch (error) {
      setLoading(false);
      console.log("error:", error);
      toast({
        variant: "destructive",
        description: "Erro ao buscar notas",
      });
      return { error };
    }
  }

  // async function fetchStudentById(id: string): Promise<{
  //   data?: any;
  //   error?: Error | unknown;
  // }> {
  //   try {
  //     const { data, error } = await supabase
  //       .from('students')
  //       .select()
  //       .eq('id', id);

  //     if (error || !data) {
  //       console.log('error:', error);
  //       toast({
  //         description: 'Erro ao buscar aluno',
  //       });
  //       return { error };
  //     } else {
  //       return { data: data[0], error };
  //     }
  //   } catch (error) {
  //     console.log('error:', error);
  //     toast({
  //       variant: 'destructive',
  //       description: 'Erro ao buscar aluno',
  //     });
  //     return { error };
  //   }
  // }

  async function createScore(values: any): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("scores")
        .insert(values)
        .select();

      if (error || !data) {
        setLoading(false);
        console.log("error:", error);
        toast({
          variant: "destructive",
          title: "Erro ao registrar nota",
          description: error.message,
        });
        return { data, error };
      } else {
        toast({ description: "Nota registrada com sucesso" });
        return { data, error };
      }
    } catch (error) {
      setLoading(false);
      console.log("error:", error);
      toast({
        variant: "destructive",
        description: "Erro ao registrar nota",
      });
      return { error };
    }
  }

  async function updateScore(
    values: any,
    id: string
  ): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("scores")
        .update(values)
        .eq("id", id)
        .select();

      if (error || !data) {
        setLoading(false);
        console.log("error:", error);
        toast({
          variant: "destructive",
          title: "Erro ao atualizar nota",
          description: error.message,
        });
        return { data, error };
      } else {
        setLoading(true);
        toast({ description: "Nota atualizada com sucesso" });
        return { data, error };
      }
    } catch (error) {
      setLoading(true);
      console.log("error:", error);
      toast({
        variant: "destructive",
        description: "Erro ao atualizar nota",
      });
      return { error };
    }
  }

  // async function deleteStudents(
  //   ids: string[]
  // ): Promise<{ error?: Error | unknown }> {
  //   try {
  //     const deletePromises = ids.map(async (id) => {
  //       const { error } = await supabase.from('students').delete().eq('id', id);

  //       if (error) {
  //         toast({
  //           variant: 'destructive',
  //           description: 'Erro ao excluir aluno',
  //         });
  //         return { error };
  //       } else {
  //         toast({ description: 'Aluno excluído com sucesso' });
  //       }
  //     });

  //     await Promise.all(deletePromises);

  //     return {};
  //   } catch (error) {
  //     toast({
  //       variant: 'destructive',
  //       description: 'Erro ao excluir aluno',
  //     });
  //     return { error };
  //   }
  // }

  return {
    // fetchScores,
    // fetchScoreById,
    fetchScoresByStudentId,
    createScore,
    updateScore,
    // deleteScores,
    loading,
  };
}
