import { useToast } from '@/components/ui/use-toast';
import { supabase } from '../../../supabase';

export function useResponsibles() {
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

  async function fetchResponsibleById(id: string): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      const { data, error } = await supabase
        .from('responsibles')
        .select()
        .eq('id', id);

      if (error || !data) {
        console.log('error:', error);
        toast({
          description: 'Erro ao buscar responsável',
        });
        return { error };
      } else {
        return { data: data[0], error };
      }
    } catch (error) {
      console.log('error:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao buscar responsável',
      });
      return { error };
    }
  }

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

  async function upadteResponsible(
    values: any,
    id: string
  ): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      const { data, error } = await supabase
        .from('responsibles')
        .update(values)
        .eq('id', id)
        .select();

      if (error || !data) {
        console.log('error:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao atualizar responsável',
          description: error.message,
        });
        return { data, error };
      } else {
        toast({ description: 'Responsável atualizado com sucesso' });
        return { data, error };
      }
    } catch (error) {
      console.log('error:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao atualizar responsável',
      });
      return { error };
    }
  }

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

  return {
    fetchResponsibles,
    fetchResponsibleById,
    createResponsibles,
    upadteResponsible,
    deleteResponsibles,
  };
}
