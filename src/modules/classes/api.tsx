import { useToast } from '@/components/ui/use-toast';
import { supabase } from '../../../supabase';
import { Absence, Attendance } from './schema';

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

  async function fetchAttendanceByClassAndDate(
    classId: string,
    date: string
  ): Promise<{
    data?: Attendance[];
    error?: Error | unknown;
  }> {
    try {
      const { data, error } = await supabase
        .from('attendances')
        .select()
        .eq('class_id', classId)
        .eq('date', date);

      if (error) {
        console.log('error:', error);
        toast({
          description: 'Erro ao buscar chamada',
        });
        return { error };
      } else if (data.length > 0) {
        return { data };
      } else {
        return {};
      }
    } catch (error) {
      console.log('error:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao buscar chamada',
      });
      return { error };
    }
  }

  async function createAttendance(values: any): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      const { data, error } = await supabase
        .from('attendances')
        .insert(values)
        .select();

      if (error || !data) {
        console.log('error:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao registrar chamada',
          description: error.message,
        });
        return { data, error };
      } else {
        toast({ description: 'Chamada registrada com sucesso' });
        return { data, error };
      }
    } catch (error) {
      console.log('error:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao registrar chamada',
      });
      return { error };
    }
  }

  async function updateAttendance(
    values: any,
    id: string
  ): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      const { data, error } = await supabase
        .from('attendances')
        .update(values)
        .eq('id', id)
        .select();

      if (error || !data) {
        console.log('error:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao atualizar chamada',
          description: error.message,
        });
        return { data, error };
      } else {
        toast({ description: 'Chamada atualizada com sucesso' });
        return { data, error };
      }
    } catch (error) {
      console.log('error:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao atualizar chamada',
      });
      return { error };
    }
  }

  async function fetchAbsencesByClassAndDate(
    classId: string,
    date: string
  ): Promise<{
    data?: Absence[];
    error?: Error | unknown;
  }> {
    try {
      const { data, error } = await supabase
        .from('absences')
        .select()
        .eq('class_id', classId)
        .eq('date', date);

      if (error) {
        console.log('error:', error);
        toast({
          description: 'Erro ao buscar faltas',
        });
        return { error };
      } else {
        return { data };
      }
    } catch (error) {
      console.log('error:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao buscar faltas',
      });
      return { error };
    }
  }

  async function createAbsences(
    absences: any[]
  ): Promise<{ error?: Error | unknown }> {
    try {
      const createPromises = absences.map(async (absence) => {
        const { error } = await supabase
          .from('absences')
          .insert(absence)
          .select();

        if (error) {
          return { error };
        }
      });

      await Promise.all(createPromises);

      toast({ description: 'Faltas registradas com sucesso' });

      return {};
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Erro ao registrar faltas',
      });
      return { error };
    }
  }

  async function updateAbsences(absences: any[]): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    try {
      const createPromises = absences.map(async (absence) => {
        const { error } = await supabase
          .from('absences')
          .update(absence)
          .eq('id', absence.id)
          .select();

        if (error) {
          return { error };
        }
      });

      await Promise.all(createPromises);

      toast({ description: 'Faltas atualizadas com sucesso' });

      return {};
    } catch (error) {
      console.log('error:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao atualizar faltas',
      });
      return { error };
    }
  }

  async function deleteAbsences(
    ids: string[]
  ): Promise<{ error?: Error | unknown }> {
    try {
      const createPromises = ids.map(async (id) => {
        const { error } = await supabase.from('absences').delete().eq('id', id);

        if (error) {
          return { error };
        }
      });

      await Promise.all(createPromises);

      toast({ description: 'Faltas excluidas com sucesso' });

      return {};
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Erro ao excluir faltas',
      });
      return { error };
    }
  }

  async function fetchAbsencesByStudentId(studentId: string): Promise<{
    data?: Absence[];
    error?: Error | unknown;
  }> {
    try {
      const { data, error } = await supabase
        .from('absences')
        .select()
        .eq('student_id', studentId)
        .order('date', { ascending: false });

      if (error) {
        console.log('error:', error);
        toast({
          description: 'Erro ao buscar faltas',
        });
        return { error };
      } else {
        return { data };
      }
    } catch (error) {
      console.log('error:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao buscar faltas',
      });
      return { error };
    }
  }

  return {
    fetchClasses,
    fetchAttendanceByClassAndDate,
    createAttendance,
    updateAttendance,
    fetchAbsencesByClassAndDate,
    updateAbsences,
    deleteAbsences,
    createAbsences,
    fetchAbsencesByStudentId,
  };
}
