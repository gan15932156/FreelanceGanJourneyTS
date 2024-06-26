"use client";

import { TableProps } from "@/redux/types";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import TableComponent from "./table/table-component";
import TablePagination from "./table/table-pagination";
import { useEffect } from "react";
export default function ManageTable<TData, TValue>({
  paginatedTableData,
  columns,
  pagination,
  setPaginationInput,
}: TableProps<TData, TValue>) {
  const table = useReactTable({
    data: paginatedTableData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableMultiSort: true,
    sortDescFirst: true,
    manualPagination: true,
    rowCount: paginatedTableData?.total_filtered,
    onPaginationChange: (updater) => {
      if (typeof updater !== "function") return;
      const data: TData | any =
        paginatedTableData?.data[paginatedTableData.data.length - 1];
      const newPageInfo = updater(table.getState().pagination);
      setPaginationInput((prev) => ({
        ...prev,
        pagination: { ...newPageInfo },
        cursor: { ...data },
        oldPageIndex: table.getState().pagination.pageIndex,
      }));
    },
    state: {
      pagination,
    },
  });
  useEffect(() => {
    if (setPaginationInput) {
      setPaginationInput((prev) => ({
        ...prev,
        pagination: {
          pageIndex: 0,
          pageSize: pagination?.pageSize || 8,
        },
      }));
    }
    // console.log("dada");
  }, [setPaginationInput]);
  return (
    <div>
      <TableComponent table={table} />
      <TablePagination table={table} />
    </div>
  );
}
