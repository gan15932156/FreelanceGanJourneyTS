"use client";

import { QuotationSchema, QuotationServiceSchemaWithMode } from "@/schemas";
import { Control, useFieldArray, useWatch } from "react-hook-form";
import * as z from "zod";
import { IssetRequireData } from "./quotation-form";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { X } from "lucide-react";
import { getThaiCurrencyCall, getThaiCurrentFormat } from "@/lib/utils2";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useGetAllServiceByIdQuery } from "@/redux/apiSlice";
import { useEffect } from "react";
import { IService } from "@/redux/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
interface Props {
  control: Control<z.infer<typeof QuotationSchema>>;
  setIssetData: React.Dispatch<React.SetStateAction<IssetRequireData>>;
}
interface SubtotalProps {
  control: Control<z.infer<typeof QuotationSchema>>;
  index: number;
}
interface TotalFooterProps {
  control: Control<z.infer<typeof QuotationSchema>>;
}
type getTotalType = {
  data: z.infer<typeof QuotationServiceSchemaWithMode>[];
};
function getTotal(payload: getTotalType["data"]) {
  let total = 0;
  for (const item of payload) {
    total = total + item.price * item.qty;
  }

  return total;
}
const TotalFooter: React.FC<TotalFooterProps> = ({
  control,
}: TotalFooterProps) => {
  const data = useWatch({
    control,
    name: ["services", "isUseVAT", "taxAmount"],
  });
  let total: number = 0;
  let vatAmount: number = 0;
  let taxAmount: number = 0;
  let netTotal: number = 0;
  if (data[0].length > 0) {
    total = getTotal(data[0]);
    if (data[1]) {
      vatAmount = total * (7 / 100);
    }
    if (data[2] != 0) {
      taxAmount = (total + vatAmount) * (data[2] / 100);
    }
    netTotal = total + vatAmount + taxAmount;
  }
  return (
    <>
      <TableRow>
        <TableCell colSpan={2}></TableCell>
        <TableCell colSpan={2} className="text-left font-bold py-1">
          ราคารวม
        </TableCell>
        <TableCell className="text-right py-1">
          {total !== 0 ? getThaiCurrentFormat(total) : "-"}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}></TableCell>
        <TableCell colSpan={2} className="text-right py-1">
          <FormField
            control={control}
            name="isUseVAT"
            render={({ field }) => (
              <FormItem className="space-y-0 flex flex-row items-center justify-start">
                <FormLabel className="font-bold mr-2">VAT 7%</FormLabel>
                <FormControl>
                  <Checkbox
                    className="mr-4"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell className="text-right py-1">
          {vatAmount !== 0 ? getThaiCurrentFormat(vatAmount) : "-"}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}></TableCell>
        <TableCell colSpan={2} className="text-right py-1">
          <FormField
            control={control}
            name="taxAmount"
            render={({ field }) => (
              <FormItem className="space-y-0 flex flex-row justify-start gap-2 items-center">
                <FormLabel className="font-bold mr-2">
                  ภาษีหัก ณ ที่จ่าย(%)
                </FormLabel>
                <FormControl>
                  <Input
                    className="max-w-20 py-1 px-2 h-6 text-right"
                    min={0}
                    {...field}
                    type="number"
                    value={field.value ?? 0} // Ensure value is always set, falling back to 0 if undefined
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell className="text-right py-1">
          {taxAmount !== 0 ? getThaiCurrentFormat(taxAmount) : "-"}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2} className="font-semibold text-right max-w-2">
          {getThaiCurrencyCall(netTotal)}
        </TableCell>
        <TableCell colSpan={2} className="text-left font-bold py-1">
          รวมทั้งสิ้น
        </TableCell>
        <TableCell className="text-right py-1">
          {netTotal !== 0 ? getThaiCurrentFormat(netTotal) : "-"}
        </TableCell>
      </TableRow>
    </>
  );
};
const SubTotal: React.FC<SubtotalProps> = ({
  control,
  index,
}: SubtotalProps) => {
  const services = useWatch({ control, name: "services" });
  const service = services?.[index];
  const subtotal = service.price * service.qty;
  return <div>{subtotal}</div>;
};
const ServiceQuotationTable: React.FC<Props> = ({
  control,
  setIssetData,
}: Props) => {
  const {
    data: serviceData,
    isLoading: serviceLoading,
    isError: serviceError,
  } = useGetAllServiceByIdQuery();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });
  const handleOnChange = (id: string) => {
    const data = serviceData?.result.find((f) => f.id == id);
    if (data != undefined && data?.id != undefined) {
      const { name, desc, note, price, id } = data;
      append({ name, desc, price, qty: 1, isEdit: false, note, id });
    }
  };
  useEffect(() => {
    if (serviceData?.result && serviceData.result.length > 0) {
      setIssetData((prev) => ({
        ...prev,
        services: true,
      }));
    }
  }, [serviceData]);
  if (serviceLoading) return <div>Loading...</div>;
  return !serviceLoading && !serviceError ? (
    <>
      <div className="col-span-6 ">
        <Badge variant={"secondary"} className="max-w-fit">
          ข้อมูลบริการ
        </Badge>
      </div>
      <div className="col-span-6">
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%] ">บริการ</TableHead>
              <TableHead className="min-w-4 text-right">หน่วย</TableHead>
              <TableHead className="min-w-8 text-right">ราคาต่อหน่วย</TableHead>
              <TableHead className="min-w-8 text-right">
                จำนวนเงิน(บาท)
              </TableHead>
              <TableHead className="text-center">action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <FormField
                      control={control}
                      name={`services.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="space-y-0 grid grid-cols-subgrid col-span-2 items-center">
                          <FormLabel>บริการ</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="บริการ"
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`services.${index}.desc`}
                      render={({ field }) => (
                        <FormItem className="space-y-0 grid grid-cols-subgrid col-span-2 items-center">
                          <FormLabel>รายละเอียดงาน</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="รายละเอียดงาน"
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`services.${index}.note`}
                      render={({ field }) => (
                        <FormItem className="space-y-0 grid grid-cols-subgrid col-span-2 items-center">
                          <FormLabel>หมายเหตุ</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="หมายเหตุ1,หมายเหตุ2"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <FormField
                    control={control}
                    name={`services.${index}.qty`}
                    render={({ field }) => (
                      <FormItem className="space-y-0 grid grid-cols-subgrid col-span-2 items-center">
                        <FormControl>
                          <Input
                            min={1}
                            className="text-right"
                            {...field}
                            placeholder="จำนวนบริการ"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <FormField
                    control={control}
                    name={`services.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="space-y-0 grid grid-cols-subgrid col-span-2 items-center">
                        <FormControl>
                          <Input
                            min={1}
                            className="text-right"
                            {...field}
                            placeholder="ราคา"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <SubTotal control={control} index={index} />
                </TableCell>
                <TableCell className="text-center">
                  <X
                    className="cursor-pointer mx-auto"
                    onClick={() => remove(index)}
                  />
                </TableCell>
              </TableRow>
            ))}
            {serviceData?.result && (
              <TableRow>
                <TableCell colSpan={1}>
                  <Select onValueChange={handleOnChange}>
                    <SelectTrigger className="w-1/2 bg-slate-50">
                      <SelectValue
                        placeholder="+ เพิ่มบริการ"
                        aria-label={"+ เพิ่มบริการ"}
                      >
                        + เพิ่มบริการ
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>บริการ</SelectLabel>
                        {serviceData.result.map((service: IService) => (
                          <SelectItem
                            key={service.id}
                            value={service.id as string}
                          >
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TotalFooter control={control} />
          </TableFooter>
        </Table>
      </div>
    </>
  ) : (
    <>
      <div className="col-span-6 mb-4">
        <Badge variant={"secondary"} className="max-w-fit">
          ข้อมูลบริการ
        </Badge>
      </div>
      <p>ไม่พบข้อมูล</p>
    </>
  );
};

export default ServiceQuotationTable;
