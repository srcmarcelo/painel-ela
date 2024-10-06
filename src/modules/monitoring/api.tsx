import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { v4 } from "uuid";
import { supabase } from "../../../supabase";
import { Monitoring, MonitoringAreas, MonitoringStatuses } from "./types";

export function useMonitoring() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [monitoring, setMonitoring] = useState<Monitoring[]>([]);

  async function fetchMonitoringAreas(): Promise<{
    data?: MonitoringAreas[];
    error?: Error | unknown;
  }> {
    try {
      let { data, error } = await supabase.from("monitoring_areas").select("*");

      if (error || !data) {
        console.log("error:", error);
        toast({
          description: "Erro ao buscar áreas",
        });
        return { error };
      } else {
        return { data, error };
      }
    } catch (error) {
      console.log("error:", error);
      toast({
        variant: "destructive",
        description: "Erro ao buscar áreas",
      });
      return { error };
    }
  }

  async function fetchMonitoringByStudentId(id: string): Promise<{
    data?: Monitoring[];
    error?: Error | unknown;
  }> {
    try {
      let { data, error } = await supabase
        .from("monitoring")
        .select()
        .eq("student_id", id);

      if (error || !data) {
        console.log("error:", error);
        toast({
          description: "Erro ao buscar áreas",
        });
        return { error };
      } else {
        return { data, error };
      }
    } catch (error) {
      console.log("error:", error);
      toast({
        variant: "destructive",
        description: "Erro ao buscar áreas",
      });
      return { error };
    }
  }

  async function createMonitoring(
    row: Monitoring,
    statusIndex: number,
    value: MonitoringStatuses
  ): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    const prevMonitoring = monitoring;
    const rowStatuses = [...row.status];
    rowStatuses[statusIndex] = value;
    const newId = v4();
    try {
      setLoading(true);

      setMonitoring((prev) => {
        return prev.map((item, index) => {
          if (item.area_id === row.area_id) {
            const currStatuses = [...item.status];
            currStatuses[statusIndex] = value;
            return { ...item, id: newId, status: currStatuses };
          }
          return item;
        });
      });

      const { data, error } = await supabase
        .from("monitoring")
        .insert({
          ...row,
          status: rowStatuses,
          id: newId,
          created_at: new Date(),
        })
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
      setMonitoring(prevMonitoring);
      console.log("error:", error);
      toast({
        variant: "destructive",
        description: "Erro ao registrar nota",
      });
      return { error };
    }
  }

  async function updateMonitoring(
    row: Monitoring,
    statusIndex: number,
    value: MonitoringStatuses
  ): Promise<{
    data?: any;
    error?: Error | unknown;
  }> {
    const prevMonitoring = monitoring;
    const rowStatuses = [...row.status];
    rowStatuses[statusIndex] = value;
    try {
      setLoading(true);

      setMonitoring((prev) => {
        return prev.map((item, index) => {
          if (item.id === row.id) {
            const currStatuses = [...item.status];
            currStatuses[statusIndex] = value;
            return { ...item, status: currStatuses };
          }
          return item;
        });
      });
      const { data, error } = await supabase
        .from("monitoring")
        .update({ ...row, status: rowStatuses })
        .eq("id", row.id)
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
      setMonitoring(prevMonitoring);
      setLoading(true);
      console.log("error:", error);
      toast({
        variant: "destructive",
        description: "Erro ao atualizar nota",
      });
      return { error };
    }
  }

  return {
    fetchMonitoringAreas,
    fetchMonitoringByStudentId,
    monitoring,
    setMonitoring,
    loading,
    createMonitoring,
    updateMonitoring,
  };
}
