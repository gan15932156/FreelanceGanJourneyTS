"use client";
import { TQuotationDisplay, TQuotationUpdateStatusSchema } from "@/redux/types";
import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Check, Edit, FilePlus, MoreHorizontalIcon, X } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { useUpdateQuotationStatusMutation } from "@/redux/apiSlice";
import { StatusEnumSchema } from "@/schemas";
import { useToast } from "../ui/use-toast";

interface Props {
  row: Row<TQuotationDisplay>;
}
const QuotationCellAction: React.FC<Props> = ({ row }: Props) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [useUpdate, { isLoading }] = useUpdateQuotationStatusMutation();
  const rowStatus = row.original.status.toString();
  const handleUpdate = (data: TQuotationUpdateStatusSchema) => {
    startTransition(() => {
      useUpdate(data).then((data) => {
        if (data.data?.result) {
          toast({
            title: data.data?.message || "สำเร็จ",
          });
        } else {
          toast({
            variant: "destructive",
            title: data.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
          });
        }
      });
    });
  };
  const handleRejectUpdate = () => {
    // if (confirm("ยืนยันการเปลี่ยนสถานะเป็น ยกเลิก")) {
    //   handleUpdate({
    //     id: row.original.id,
    //     status: StatusEnumSchema.enum.QS4,
    //   });
    // }
  };
  if (isPending || isLoading) return null;
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
            href={`/quotation/edit/${row.original.id}`}
          >
            <Edit className="size-4" />
            แก้ไข/ดู
          </Link>
        </DropdownMenuItem>
        {/* {rowStatus == "QS1" && (
          <DropdownMenuItem asChild className=" cursor-pointer">
            <p
              className="flex flex-row gap-2"
              onClick={() =>
                handleUpdate({
                  id: row.original.id,
                  status: StatusEnumSchema.enum.QS2,
                })
              }
            >
              <Check className="size-4" />
              ยืนยัน
            </p>
          </DropdownMenuItem>
        )}
        {rowStatus == "QS2" && (
          <DropdownMenuItem asChild className=" cursor-pointer">
            <p className="flex flex-row gap-2" onClick={() => {}}>
              <FilePlus className="size-4" />
              ออกใบแจ้งหนี้
            </p>
          </DropdownMenuItem>
        )}
        {(rowStatus == "QS1" || rowStatus == "QS2") && (
          <DropdownMenuItem asChild className=" cursor-pointer">
            <p className="flex flex-row gap-2" onClick={handleRejectUpdate}>
              <X className="size-4" />
              ยกเลิก
            </p>
          </DropdownMenuItem>
        )} */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuotationCellAction;
