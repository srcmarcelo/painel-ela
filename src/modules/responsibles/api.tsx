import { useToast } from '@/components/ui/use-toast';
import { supabase } from '../../../supabase';

export function useFetchResponsibles() {
  const { toast } = useToast();

  async function fetchResponsibles(): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      const { data, error } = await supabase.from('responsibles').select();

      if (error || !data) {
        console.log('error:', error);
        toast({
          description: 'Erro ao buscar responsáveis',
        });
        return { error };
      } else {
        return { data, error };
      }
    } catch (error) {
      console.log('error:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao buscar responsáveis',
      });
      return { error };
    }
  }

  return { fetchResponsibles };
}

export function useCreateResponsibles() {
  const { toast } = useToast();

  async function createResponsibles(
    values: any
  ): Promise<{ data?: any; error?: Error | unknown }> {
    try {
      const { data, error } = await supabase
        .from('responsibles')
        .insert(values)
        .select();

      if (error || !data) {
        console.log('error:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao registrar responsável',
          description: error.message,
        });
        return { data, error };
      } else {
        toast({ description: 'Responsável registrado com sucesso' });
        return { data, error };
      }
    } catch (error) {
      console.log('error:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao registrar responsável',
      });
      return { error };
    }
  }

  return { createResponsibles };
}

export function useDeleteResponsibles() {
  const { toast } = useToast();

  async function deleteResponsibles(
    ids: string[]
  ): Promise<{ error?: Error | unknown }> {
    try {
      const deletePromises = ids.map(async (id) => {
        const { error } = await supabase
          .from('responsibles')
          .delete()
          .eq('id', id);

        if (error) {
          toast({
            variant: 'destructive',
            title: 'Erro ao excluir responsável',
            description: error.message,
          });
          return { error };
        } else {
          toast({ description: 'Responsável excluído com sucesso' });
        }
      });

      await Promise.all(deletePromises);

      return {};
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Erro ao excluir responsável',
      });
      return { error };
    }
  }

  return { deleteResponsibles };
}
