"use client";
import * as z from "zod";
import { Control } from "react-hook-form";
import { QuotationSchema } from "@/schemas";
import { IssetRequireData } from "./quotation-form";
import { Badge } from "../ui/badge";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useGetUserPaymentInfoQuery } from "@/redux/apiSlice";
import { useEffect } from "react";
import QuotationInfoItem from "./quotation-info-item";
interface Props {
  mode: "add" | "edit";
  grid_gap: string;
  control: Control<z.infer<typeof QuotationSchema>>;
  setIssetData: React.Dispatch<React.SetStateAction<IssetRequireData>>;
}
const QuotationDesc: React.FC<Props> = ({
  mode,
  grid_gap,
  control,
  setIssetData,
}: Props) => {
  const {
    data: userPaymentData,
    isLoading: userPaymentLoading,
    isError: userPaymentError,
  } = useGetUserPaymentInfoQuery();
  useEffect(() => {
    if (mode == "add" && userPaymentData?.result.data != undefined) {
      setIssetData((prev) => ({
        ...prev,
        payment: true,
      }));
    }
  }, [userPaymentData]);
  if (mode == "add" && userPaymentLoading) return <div>Loading...</div>;
  if (userPaymentData?.result.data.id == undefined)
    return (
      <div className="col-span-4">
        <p>ไม่พบข้อมูล ไม่สามารถสร้างใบเสนอราคาได้</p>
      </div>
    );
  return mode == "add" ? (
    userPaymentData.result.data.id != undefined &&
    !userPaymentLoading &&
    !userPaymentError ? (
      <>
        <div className="col-span-6 mb-4">
          <Badge variant={"secondary"} className="max-w-fit">
            รายละเอียด
          </Badge>
        </div>
        <div className="p-1 grid grid-cols-subgrid col-span-6">
          <FormField
            control={control}
            name="note"
            render={({ field }) => (
              <FormItem className="space-y-0 grid grid-cols-subgrid col-span-full items-center">
                <FormLabel>หมายเหตุ</FormLabel>
                <FormControl>
                  <Textarea
                    className="col-span-2"
                    {...field}
                    placeholder="หมายเหตุ1,หมายเหตุ2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="items-center p-1 grid grid-cols-[120px_1fr] col-span-3 gap-4">
          <p className="col-span-1 col-start-1 text-sm font-medium leading-none">
            ข้อมูลการชำระเงิน
          </p>
          <p className="min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
            {userPaymentData.result.data.id != undefined
              ? userPaymentData.result.data.desc
              : ""}
          </p>
        </div>
        {/* <QuotationInfoItem
          colSpan={4}
          colSpanContent={"col-[2_/_span_3]"}
          headingText="ข้อมูลการชำระเงิน"
          content={
            userPaymentData.result.data.id != undefined
              ? userPaymentData.result.data.desc
              : ""
          }
          gridGap={grid_gap}
        /> */}
      </>
    ) : (
      <>
        <div className="col-span-6 mb-4">
          <Badge variant={"secondary"} className="max-w-fit">
            ข้อมูลบริการ
          </Badge>
        </div>
        <p>รายละเอียด</p>
      </>
    )
  ) : (
    <div>edit</div>
  );
};

export default QuotationDesc;
