"use client";
import { type Table as TanstackTable } from "@tanstack/react-table";
import TableComponent from "./table/table-component";
import TablePagination from "./table/table-pagination";
interface Props<TData> {
  table: TanstackTable<TData>;
}
export default function ManageTable<TData>({ table }: Props<TData>) {
  return (
    <div>
      <TableComponent table={table} />
      <TablePagination table={table} />
    </div>
  );
}
