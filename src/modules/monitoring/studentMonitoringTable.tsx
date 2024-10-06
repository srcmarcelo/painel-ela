import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo } from "react";
import { useMonitoring } from "./api";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Monitoring, MonitoringStatuses } from "./types";

const BadgeColor: Record<MonitoringStatuses, string> = {
  [MonitoringStatuses.needsSupport]: "red",
  [MonitoringStatuses.inProgress]: "yellow",
  [MonitoringStatuses.satisfactoryProgress]: "green",
  [MonitoringStatuses.exceedsExpectation]: "purple",
  [MonitoringStatuses.notStarted]: "gray",
};

export function MonitoringSelect({
  value,
  row,
  statusIndex,
  onValueChange,
}: {
  value: MonitoringStatuses;
  row: Monitoring;
  statusIndex: number;
  onValueChange: (value: MonitoringStatuses) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger customSelect={true}>
        <Badge variant={BadgeColor[value] as any}>
          <div className="truncate w-40 text-center">{value}</div>
        </Badge>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={MonitoringStatuses.needsSupport}>
            Precisa de apoio
          </SelectItem>
          <SelectItem value={MonitoringStatuses.inProgress}>
            Em progresso
          </SelectItem>
          <SelectItem value={MonitoringStatuses.satisfactoryProgress}>
            Progresso satisfatório
          </SelectItem>
          <SelectItem value={MonitoringStatuses.exceedsExpectation}>
            Supera expectativas
          </SelectItem>
          <SelectItem value={MonitoringStatuses.notStarted}>
            Não iniciado
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function MonitoringTable({
  studentId,
  classId,
}: {
  studentId?: string;
  classId?: string;
}) {
  const {
    fetchMonitoringAreas,
    fetchMonitoringByStudentId,
    monitoring,
    setMonitoring,
    createMonitoring,
    updateMonitoring,
  } = useMonitoring();

  useMemo(() => {
    fetchMonitoringAreas().then((res) => {
      const areas = res?.data ?? [];
      if (studentId && classId) {
        fetchMonitoringByStudentId(studentId).then((res) => {
          const response = res?.data ?? [];
          setMonitoring(
            areas.map((item) => {
              const monitoringRow = response.find(
                (res) => item.id === res.area_id
              );
              if (monitoringRow) {
                return monitoringRow;
              }
              return {
                area: item.value,
                area_id: item.id,
                class_id: classId,
                student_id: studentId,
                area_name: item.name,
                year: new Date().getFullYear(),
                status: Array.from({ length: 4 }).map(
                  () => MonitoringStatuses.notStarted
                ),
              };
            })
          );
        });
      }
    });
  }, [studentId]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Área</TableHead>

          <TableHead className="text-center">1ª UNIDADE</TableHead>
          <TableHead className="text-center">2ª UNIDADE</TableHead>
          <TableHead className="text-center">3ª UNIDADE</TableHead>
          <TableHead className="text-center">4ª UNIDADE</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {monitoring.map((data) => (
          <TableRow key={data.id}>
            <TableCell className="font-medium">{data.area_name}</TableCell>
            {Array.from({ length: 4 }).map((value, index) => {
              return (
                <TableCell key={`${data.area_id}#${value}`}>
                  <div className="flex justify-center">
                    <MonitoringSelect
                      value={data.status[index]}
                      row={data}
                      statusIndex={index}
                      onValueChange={(value) => {
                        if (data.id) {
                          updateMonitoring(data, index, value);
                          return;
                        }

                        createMonitoring(data, index, value);
                      }}
                    />
                  </div>
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
