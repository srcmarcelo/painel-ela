import { useToast } from '@/components/ui/use-toast';
import { supabase } from '../../../supabase';

export function useStaff() {
  const { toast } = useToast();

  async function fetchStaff(): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      const { data, error } = await supabase.from('staff').select();

      if (error || !data) {
        console.log('error:', error);
        toast({
          description: 'Erro ao buscar funcionários',
        });
        return { error };
      } else {
        return { data, error };
      }
    } catch (error) {
      console.log('error:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao buscar funcionários',
      });
      return { error };
    }
  }

  return {
    fetchStaff,
  };
}
