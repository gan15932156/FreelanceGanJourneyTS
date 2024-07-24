"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { searchParamsSchema } from "@/schemas";
import { useGetQuotationsQuery } from "@/redux/apiSlice";
import { useMemo } from "react";
import { getQuotationColumns } from "@/data/table-columns/quotation-column";
import { useDataTable } from "@/hook/use-data-table";
import ManageTable from "../manage/manage-table";

export default function ManageQuotation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParamsSchema.parse(Object.fromEntries(searchParams));
  const { data, isLoading, isError } = useGetQuotationsQuery(search);
  const columns = useMemo(() => getQuotationColumns(), []);
  const { table } = useDataTable({
    data: data?.result.data || [],
    columns,
    pageCount: data?.result.total,
    defaultPerPage: 2,
    defaultSort: "createdAt.desc",
  });
  if (isLoading) return <div>Loading...</div>;
  return !isLoading && !isError ? (
    <div className="flex  w-full mx-auto flex-col mt-4">
      <div className="flex flex-col">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex items-center justify-center md:flex-row flex-col gap-4 flex-wrap">
            <div className="ml-auto flex items-center gap-2">
              <Button
                size="sm"
                className="h-8 gap-1"
                onClick={() => router.push("/quotation/add")}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  ออกใบเสนอราคา
                </span>
              </Button>
            </div>
          </div>
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>ข้อมูลใบเสนอราคา</CardTitle>
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
}
