import { useToast } from '@/components/ui/use-toast';
import { supabase } from '../../../supabase';
import { Occurrence } from './schema';

export function useOccurrences() {
  const { toast } = useToast();

  async function fetchOccurrencesByStudentId(studentId: string): Promise<{
    data?: Occurrence[];
    error?: Error | unknown;
  }> {
    try {
      const { data, error } = await supabase
        .from('occurrences')
        .select()
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('error:', error);
        toast({
          description: 'Erro ao buscar ocorrências',
        });
        return { error };
      } else {
        return { data };
      }
    } catch (error) {
      console.log('error:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao buscar ocorrências',
      });
      return { error };
    }
  }

  async function createOccurence(values: any): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      const { data, error } = await supabase
        .from('occurrences')
        .insert(values)
        .select();

      if (error || !data) {
        console.log('error:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao registrar ocorrência',
          description: error.message,
        });
        return { data, error };
      } else {
        toast({ description: 'Ocorrência registrada com sucesso' });
        return { data, error };
      }
    } catch (error) {
      console.log('error:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao registrar ocorrência',
      });
      return { error };
    }
  }

  async function deleteOcurrences(
    ids: string[]
  ): Promise<{ error?: Error | unknown }> {
    try {
      const deletePromises = ids.map(async (id) => {
        const { error } = await supabase.from('occurrences').delete().eq('id', id);

        if (error) {
          toast({
            variant: 'destructive',
            description: 'Erro ao excluir ocorrência',
          });
          return { error };
        } else {
          toast({ description: 'Ocorrência excluída com sucesso' });
        }
      });

      await Promise.all(deletePromises);

      return {};
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Erro ao excluir ocorrência',
      });
      return { error };
    }
  }

  return {
    fetchOccurrencesByStudentId,
    createOccurence,
    deleteOcurrences,
  };
}
