import { useToast } from '@/components/ui/use-toast';
import { supabase } from '../../../supabase';

export function useFetchStudents() {
  const { toast } = useToast();

  async function fetchStudents(): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      const { data, error } = await supabase.from('students').select();

      if (error || !data) {
        console.log('error:', error);
        toast({
          description: 'Erro ao buscar alunos',
        });
        return { error };
      } else {
        return { data, error };
      }
    } catch (error) {
      console.log('error:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao buscar alunos',
      });
      return { error };
    }
  }

  return { fetchStudents };
}

export function useCreateStudents() {
  const { toast } = useToast();

  async function createStudents(values: any): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert(values)
        .select();

      if (error || !data) {
        console.log('error:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao registrar aluno',
          description: error.message,
        });
        return { data, error };
      } else {
        toast({ description: 'Aluno registrado com sucesso' });
        return { data, error };
      }
    } catch (error) {
      console.log('error:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao registrar aluno',
      });
      return { error };
    }
  }

  return { createStudents };
}

export function useDeleteStudents() {
  const { toast } = useToast();

  async function deleteStudents(
    ids: string[]
  ): Promise<{ error?: Error | unknown }> {
    try {
      const deletePromises = ids.map(async (id) => {
        const { error } = await supabase.from('students').delete().eq('id', id);

        if (error) {
          toast({
            variant: 'destructive',
            description: 'Erro ao excluir aluno',
          });
          return { error };
        } else {
          toast({ description: 'Aluno excluído com sucesso' });
        }
      });

      await Promise.all(deletePromises);

      return {};
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Erro ao excluir aluno',
      });
      return { error };
    }
  }

  return { deleteStudents };
}
