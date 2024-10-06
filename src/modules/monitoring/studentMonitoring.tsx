import { MonitoringTable } from "./studentMonitoringTable";

export default function StudentMonitoring({
  studentId,
  classId,
}: {
  studentId?: string;
  classId?: string;
}) {
  return (
    <div className="rounded-md border">
      <div className="flex justify-center items-center">
        <MonitoringTable studentId={studentId} classId={classId} />
      </div>
      <div className="flex w-full rounded-md">
        <div
          onClick={() => alert("Em breve")}
          className="w-full flex justify-center items-center bg-gray-400 text-white rounded-b-md cursor-pointer py-2"
        >
          IMPRIMIR (em breve)
        </div>
      </div>
    </div>
  );
}
