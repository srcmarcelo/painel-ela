export enum MonitoringStatuses {
  inProgress = "Em progresso",
  needsSupport = "Precisa de suporte",
  satisfactoryProgress = "Progresso satisfatório",
  exceedsExpectation = "Supera expectativas",
  notStarted = "Não iniciado",
}

export type MonitoringAreas = {
  id: string;
  created_at: Date;
  name: string;
  value: string;
};

export type Monitoring = {
  id?: string;
  created_at?: Date;
  student_id: string;
  class_id: string;
  area: string;
  area_id: string;
  area_name: string;
  year: number;
  status: MonitoringStatuses[];
};
