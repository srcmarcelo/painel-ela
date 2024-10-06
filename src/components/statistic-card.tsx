import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function StatisticCard({
  title,
  content,
  icon,
  href,
  loading,
}: {
  title: string;
  content: React.ReactNode;
  icon: React.ReactNode;
  href?: string;
  loading?: boolean;
}) {
  const router = useRouter();

  return (
    <Card
      className={cn("w-44 ", { "hover:bg-muted cursor-pointer": !!href })}
      onClick={() => {
        if (!!href) {
          router.push(href);
        }
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
