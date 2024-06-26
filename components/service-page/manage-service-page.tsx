"use client";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { File, ListFilter, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";
import { useGetServicesQuery } from "@/redux/apiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import { IService, PaginationInput } from "@/redux/types";
import ManageTable from "../manage/manage-table";
interface ManageServicePageProps {
  id?: string;
}
const serviceColumns: ColumnDef<IService>[] = [
  {
    header: "ชื่อบริการ/งาน",
    accessorKey: "name",
  },
  {
    header: "ราคา/หน่วย",
    accessorKey: "price",
  },
];
const ManageService: React.FC<ManageServicePageProps> = ({
  id,
}: ManageServicePageProps) => {
  // sorting state of the table
  // const [sorting, setSorting] = useState<SortingState>([]);
  const [paginationInput, setPaginationInput] = useState<
    PaginationInput<IService>
  >({
    pagination: {
      pageIndex: 0,
      pageSize: 8,
    },
    cursor: {
      id: "",
      price: 0,
      desc: "",
      name: "",
    },
    oldPageIndex: null,
  });
  const {
    data: serviceData,
    isLoading,
    isError,
  } = useGetServicesQuery(
    {
      pagination: paginationInput.pagination,
      lastCursor: paginationInput.cursor?.id || "",
      oldPageIndex: paginationInput.oldPageIndex,
    } ?? skipToken
  );
  const router = useRouter();
  // useEffect(() => {
  //   console.log(sorting);
  // }, [sorting]);
  if (id == "") return null;
  if (isLoading) return <div>Loading</div>;
  return !isLoading && !isError ? (
    <div className="flex min-h-screen w-full mx-auto flex-col mt-4">
      <div className="flex flex-col">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex items-center justify-center md:flex-row flex-col gap-4 flex-wrap">
            {/* <div className="relative  md:w-[300px] w-full mx-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 "
              />
            </div> */}
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
              <ManageTable
                columns={serviceColumns}
                paginatedTableData={serviceData?.result}
                pagination={paginationInput.pagination}
                setPaginationInput={setPaginationInput}
              />
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
