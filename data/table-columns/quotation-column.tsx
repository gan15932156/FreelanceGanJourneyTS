import TableHeader from "@/components/manage/table/table-header";
import QuotationCellAction from "@/components/quotation-page/quotation-cell-action";
import { formatThaiDate, getThaiCurrentFormat } from "@/lib/utils2";
import { TQuotationDisplay } from "@/redux/types";
import { ColumnDef } from "@tanstack/react-table";
const statusTextMap: { [key: string]: string } = {
  DRAFT: "ร่าง",
  SENT: "ส่งแล้ว",
  ACCEPTED: "ยอมรับ",
  REJECTED: "ปฏิเสธ",
  EXPIRED: "หมดอายุ",
  CANCELLED: "ยกเลิก",
  EDIT: "กรุณาแก้ไข",
};
function getTotal(payload: TQuotationDisplay["quotationServices"]) {
  let total = 0;
  for (const item of payload) {
    total = total + item.price * item.qty;
  }
  return total;
}
export function getQuotationColumns(): ColumnDef<TQuotationDisplay>[] {
  return [
    {
      header: ({ column }) => <TableHeader column={column} title="เลขที่" />,
      accessorKey: "qId",
    },
    {
      header: ({ column }) => (
        <TableHeader column={column} title="ชื่อลูกค้า" />
      ),
      accessorKey: "client.name",
    },
    {
      header: ({ column }) => (
        <TableHeader column={column} title="วันเซ็นสัญญา" />
      ),
      accessorKey: "signDate",
      cell: ({ cell, row }) => {
        return (
          <div>
            {row.original.signDate
              ? formatThaiDate(row.original.signDate?.toString())
              : "N/A"}
          </div>
        );
      },
    },
    {
      header: ({ column }) => (
        <TableHeader column={column} title="ภาษีมูลค่าเพิ่ม" />
      ),
      accessorKey: "isUseVAT",
      cell: ({ cell, row }) => {
        return <div>{row.original.isUseVAT ? "ใช่" : "ไม่ใช่"}</div>;
      },
      enableSorting: false,
      enableMultiSort: false,
    },
    {
      header: ({ column }) => (
        <TableHeader column={column} title="ภาษีหัก ณ ที่จ่าย" />
      ),
      accessorKey: "taxAmount",
      cell: ({ cell, row }) => {
        return (
          <div>
            {row.original.taxAmount ? row.original.taxAmount + "%" : "ไม่หัก"}
          </div>
        );
      },
    },
    {
      header: ({ column }) => (
        <TableHeader column={column} title="ยอดสุทธิ(บาท)" />
      ),
      accessorKey: "totalAmount",
      cell: ({ cell, row }) => {
        let total: number = 0;
        let vatAmount: number = 0;
        let taxAmount: number = 0;
        let netTotal: number = 0;
        if (row.original.quotationServices.length > 0) {
          total = getTotal(row.original.quotationServices);
          if (row.original.isUseVAT) {
            vatAmount = total * (7 / 100);
          }
          if (row.original.taxAmount != 0) {
            taxAmount = (total + vatAmount) * (row.original.taxAmount / 100);
          }
          netTotal = total + vatAmount + taxAmount;
        }
        return (
          <div>{netTotal !== 0 ? getThaiCurrentFormat(netTotal) : "-"}</div>
        );
      },
      enableSorting: false,
      enableMultiSort: false,
    },
    {
      header: ({ column }) => <TableHeader column={column} title="สถานะ" />,
      accessorKey: "status",
      cell: ({ cell, row }) => {
        return <div>{statusTextMap[row.original.status] || "Unknown"}</div>;
      },
      enableSorting: false,
      enableMultiSort: false,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        return <QuotationCellAction row={row} />;
      },
    },
  ];
}
