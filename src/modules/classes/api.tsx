import { useToast } from '@/components/ui/use-toast';
import { supabase } from '../../../supabase';

export function useClasses() {
  const { toast } = useToast();

  async function fetchClasses(): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      const { data, error } = await supabase.from('classes').select();

      if (error || !data) {
        console.log('error:', error);
        toast({
          description: 'Erro ao buscar turmas',
        });
        return { error };
      } else {
        return { data, error };
      }
    } catch (error) {
      console.log('error:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao buscar turmas',
      });
      return { error };
    }
  }

  return { fetchClasses };
}
