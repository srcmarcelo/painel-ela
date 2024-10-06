"use client";

import { Spinner } from "@/components/Spinner";
import StatisticCard from "@/components/statistic-card";
import { useData } from "@/lib/data/context";
import { cn } from "@/lib/utils";
import { useOccurrences } from "@/modules/ocurrences/api";
import { Occurrence } from "@/modules/ocurrences/schema";
import { BookMarkedIcon, Users2Icon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ClassNameValue } from "tailwind-merge";

function LoadingCard() {
  return (
    <div className="w-12 h-8 flex justify-center items-center">
      <Spinner className="w-5 h-5" />
    </div>
  );
}

export default function Cards({ classname }: { classname: ClassNameValue }) {
  const { students, responsibles, loading: loadingData, staff } = useData();
  const { fetchOccurrences } = useOccurrences();

  const [occurrences, setOcurrences] = useState<Occurrence[]>([]);
  const [loadingOccurrences, setLoadingOccurrences] = useState<boolean>(false);

  useEffect(() => {
    const fetchDataOccurrences = async () => {
      setLoadingOccurrences(true);
      const { data, error } = await fetchOccurrences();

      if (!error && data) setOcurrences(data);
      setLoadingOccurrences(false);
    };

    fetchDataOccurrences();
  }, []);

  const loading = useMemo(
    () => loadingOccurrences || loadingData,
    [loadingOccurrences, loadingData]
  );

  return (
    <div
      className={cn(
        "flex w-full justify-between items-center max-sm:flex-col max-sm:space-y-4",
        classname
      )}
    >
      <StatisticCard
        title="Alunos"
        icon={<Users2Icon color="grey" size={18} />}
        href="/alunos"
        content={
          <>
            <div className={cn("font-bold", loading ? "text-lg" : "text-2xl")}>
              {loading ? <LoadingCard /> : students.length}
            </div>
            <p className="text-xs text-muted-foreground">cadastrados</p>
          </>
        }
      />

      <StatisticCard
        title="Responsáveis"
        href="/responsaveis"
        icon={<Users2Icon color="grey" size={18} />}
        content={
          <>
            <div className={cn("font-bold", loading ? "text-lg" : "text-2xl")}>
              {loading ? <LoadingCard /> : responsibles.length}
            </div>
            <p className="text-xs text-muted-foreground">cadastrados</p>
          </>
        }
      />

      <StatisticCard
        title="Funcionários"
        icon={<Users2Icon color="grey" size={18} />}
        content={
          <>
            <div className={cn("font-bold", loading ? "text-lg" : "text-2xl")}>
              {loading ? <LoadingCard /> : staff.length}
            </div>
            <p className="text-xs text-muted-foreground">cadastrados</p>
          </>
        }
      />

      <StatisticCard
        title="Ocorrências"
        icon={<BookMarkedIcon color="grey" size={18} />}
        content={
          <>
            <div className={cn("font-bold", loading ? "text-lg" : "text-2xl")}>
              {loading ? <LoadingCard /> : occurrences.length}
            </div>
            <p className="text-xs text-muted-foreground">no ano</p>
          </>
        }
      />
    </div>
  );
}
