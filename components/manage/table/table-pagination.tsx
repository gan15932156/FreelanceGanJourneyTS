"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Table } from "@tanstack/react-table";

interface Props<TData> {
  table: Table<TData>;
}
export default function TablePagination<TData>({ table }: Props<TData>) {
  return (
    <Pagination>
      <PaginationContent>
        {table.getCanPreviousPage() && (
          <PaginationItem className="bg-violet-300 rounded-md hover:cursor-pointer">
            <PaginationPrevious onClick={() => table.previousPage()} />
          </PaginationItem>
        )}

        {table.getState().pagination.pageIndex + 1 >= 4 && (
          <PaginationItem className="bg-violet-300 rounded-md hover:cursor-pointer">
            <PaginationLink onClick={() => table.setPageIndex(0)}>
              1
            </PaginationLink>
          </PaginationItem>
        )}
        {table.getState().pagination.pageIndex + 1 >= 5 && (
          <PaginationItem className="bg-violet-300 rounded-md hover:cursor-pointer">
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {table.getState().pagination.pageIndex + 1 - 2 > 0 && (
          <PaginationItem className="bg-violet-300 rounded-md hover:cursor-pointer">
            <PaginationLink
              onClick={() =>
                table.setPageIndex(table.getState().pagination.pageIndex - 2)
              }
            >
              {table.getState().pagination.pageIndex + 1 - 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {table.getState().pagination.pageIndex + 1 - 1 > 0 && (
          <PaginationItem className="bg-violet-300 rounded-md hover:cursor-pointer">
            <PaginationLink
              onClick={() =>
                table.setPageIndex(table.getState().pagination.pageIndex - 1)
              }
            >
              {table.getState().pagination.pageIndex + 1 - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem className="bg-violet-100 rounded-md">
          <PaginationLink>
            {table.getState().pagination.pageIndex + 1}
          </PaginationLink>
        </PaginationItem>
        {table.getState().pagination.pageIndex + 1 + 1 <=
          table?.getPageCount() && (
          <PaginationItem className="bg-violet-300 rounded-md hover:cursor-pointer">
            <PaginationLink
              onClick={() =>
                table.setPageIndex(table.getState().pagination.pageIndex + 1)
              }
            >
              {table.getState().pagination.pageIndex + 1 + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {table.getState().pagination.pageIndex + 1 + 2 <=
          table?.getPageCount() && (
          <PaginationItem className="bg-violet-300 rounded-md hover:cursor-pointer">
            <PaginationLink
              onClick={() =>
                table.setPageIndex(table.getState().pagination.pageIndex + 2)
              }
            >
              {table.getState().pagination.pageIndex + 1 + 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {table.getState().pagination.pageIndex + 1 + 2 <
          table?.getPageCount() - 1 && (
          <PaginationItem className="bg-violet-300 rounded-md">
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {table.getState().pagination.pageIndex + 1 + 2 <
          table?.getPageCount() && (
          <>
            <PaginationItem className="bg-violet-300 rounded-md hover:cursor-pointer">
              <PaginationLink
                onClick={() => table.setPageIndex(table?.getPageCount())}
              >
                {table?.getPageCount()}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        {table.getCanNextPage() && (
          <PaginationItem className="bg-violet-300 rounded-md hover:cursor-pointer">
            <PaginationNext onClick={() => table.nextPage()} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
