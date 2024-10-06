"use client";

import DataTable from "@/components/DataTable/data-table";
import { PageHeader } from "@/components/page-header";
import { useData } from "@/lib/data/context";
import { StaffTableColumns } from "@/modules/staff/columns";

export default function Page() {
  const { staff, loading } = useData();

  return (
    <div className="flex flex-col items-center w-full justify-center overflow-auto p-12 px-24 max-md:px-3 max-md:py-6">
      <PageHeader
        title="Funcionários"
        subtitle="Equipe cadastrada na plataforma"
      />
      <DataTable
        disableAutoPagination
        data={staff || []}
        columns={StaffTableColumns()}
        body={<DataTable.Body />}
        isLoading={loading}
        toolbar={
          <DataTable.Toolbar placeholder="Buscar por nome..." searchId="name" />
        }
      />
    </div>
  );
}
