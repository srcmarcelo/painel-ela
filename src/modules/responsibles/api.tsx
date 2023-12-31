import { useToast } from '@/components/ui/use-toast';
import { supabase } from '../../../supabase';

export function useCreateResponsibles() {
  const { toast } = useToast();

  async function createResponsibles(values: any) {
    try {
      const { data, error } = await supabase
        .from('responsibles')
        .insert(values)
        .select();

      if (error || !data) {
        console.log('error:', error);
        toast({
          description: 'Erro ao registrar responsável',
        });
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
        const { error } = await supabase.from('responsibles').delete().eq('id', id);

        if (error) {
          toast({
            variant: 'destructive',
            description: 'Erro ao excluir responsável',
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
