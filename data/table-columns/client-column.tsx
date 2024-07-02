import TableHeader from "@/components/manage/table/table-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TClientSchema } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";

export function getClientColumns(): ColumnDef<TClientSchema>[] {
  return [
    {
      header: ({ column }) => (
        <TableHeader column={column} title="ชื่อลูกค้า" />
      ),
      accessorKey: "name",
    },
    {
      header: ({ column }) => (
        <TableHeader column={column} title="เบอร์ติดต่อ" />
      ),
      accessorKey: "tel",
      enableMultiSort: false,
      enableSorting: false,
    },
    {
      header: ({ column }) => <TableHeader column={column} title="อีเมล์" />,
      accessorKey: "email",
      enableMultiSort: false,
      enableSorting: false,
    },
    {
      header: ({ column }) => (
        <TableHeader column={column} title="ชื่อผู้ติดต่อ" />
      ),
      accessorKey: "contactName",
      enableMultiSort: false,
      enableSorting: false,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <MoreHorizontalIcon className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 ">
              <DropdownMenuItem asChild className=" cursor-pointer">
                <Link
                  className="flex flex-row gap-2"
                  href={`/client/edit/${row.original.id}`}
                >
                  <Edit className="size-4" />
                  แก้ไข
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
