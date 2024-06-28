"use client";
import { File, ListFilter, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import { searchParamsSchema } from "@/schemas";
import { useGetServicesQuery } from "@/redux/apiSlice";
import { useMemo } from "react";
import { getServiceColumns } from "@/data/table-columns/service-column";
import { useDataTable } from "@/hook/use-data-table";
import ManageTable from "../manage/manage-table";

const ManageService = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParamsSchema.parse(Object.fromEntries(searchParams));
  const { data, isLoading, isError } = useGetServicesQuery(search);
  const columns = useMemo(() => getServiceColumns(), []);
  const { table } = useDataTable({
    data: data?.result.data || [],
    columns,
    pageCount: data?.result.total,
    defaultPerPage: 2,
    defaultSort: "createdAt.desc",
  });
  if (isLoading) return <div>Loading...</div>;
  return !isLoading && !isError ? (
    <div className="flex min-h-screen w-full mx-auto flex-col mt-4">
      <div className="flex flex-col">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex items-center justify-center md:flex-row flex-col gap-4 flex-wrap">
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      กรอง
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem checked>
                    Active
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              <Button
                size="sm"
                className="h-8 gap-1"
                onClick={() => router.push("/service/add")}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  เพิ่มข้อมูลบริการ
                </span>
              </Button>
            </div>
          </div>
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>ข้อมูลบริการ</CardTitle>
            </CardHeader>
            <CardContent>
              {/* table here!!! */}
              <ManageTable table={table} />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  ) : (
    <div>Something went wrong!!!</div>
  );
};

export default ManageService;
