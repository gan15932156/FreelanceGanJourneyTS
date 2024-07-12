"use client";
import { useGetUserInfoWithoutIdQuery } from "@/redux/apiSlice";
import QuotationInfoItem from "./quotation-info-item";
import { Badge } from "../ui/badge";
import { Control } from "react-hook-form";
import * as z from "zod";
import { QuotationSchema } from "@/schemas";
import { IssetRequireData } from "./quotation-form";
import { useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { formatPhoneNumber, formatTaxId } from "@/lib/utils2";
interface Props {
  mode: "edit" | "add";
  grid_gap: string;
  control: Control<z.infer<typeof QuotationSchema>>;
  issetData: IssetRequireData;
  setIssetData: React.Dispatch<React.SetStateAction<IssetRequireData>>;
}

const UserInfoCard: React.FC<Props> = ({
  mode,
  grid_gap,
  control,
  issetData,
  setIssetData,
}: Props) => {
  const date = new Date();
  const formatedDate = date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const { data, isLoading, isError } = useGetUserInfoWithoutIdQuery();
  useEffect(() => {
    if (mode == "add" && data?.result && data.result.accountInfo) {
      setIssetData((prev) => ({
        ...prev,
        userInfo: true,
      }));
    }
  }, [data]);
  if (mode == "add" && isLoading) return <div>Loading...</div>;
  if (!data?.result)
    return (
      <div className="col-span-4">
        <p>ไม่พบข้อมูล ไม่สามารถสร้างใบเสนอราคาได้</p>
      </div>
    );

  return mode == "add" ? (
    data?.result && !isLoading && !isError ? (
      <>
        <div className="col-span-6 mb-4">
          <Badge variant={"secondary"} className="max-w-fit">
            ข้อมูลผู้ออกใบเสนอราคา
          </Badge>
        </div>
        <QuotationInfoItem
          colSpan={2}
          headingText="ชื่อ"
          content={data.result.name}
          gridGap={grid_gap}
        />
        <QuotationInfoItem
          colSpan={2}
          headingText="เลขประจำตัวผู้เสียภาษีอากร"
          content={
            data.result.accountInfo?.taxId != undefined
              ? formatTaxId(data.result.accountInfo.taxId)
              : ""
          }
          gridGap={grid_gap}
        />
        <div className="p-1 grid grid-cols-subgrid col-span-2">
          <FormField
            control={control}
            name="qId"
            render={({ field }) => (
              <FormItem className="space-y-0 grid grid-cols-subgrid col-span-2 items-center">
                <FormLabel>เลขที่</FormLabel>
                <FormControl>
                  <Input
                    className="disabled:opacity-100"
                    {...field}
                    disabled={true}
                    placeholder="เลขที่"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <QuotationInfoItem
          colSpan={4}
          colSpanContent={"col-[2_/_span_3]"}
          headingText="ที่อยู่"
          content={
            data.result.accountInfo
              ? data.result.accountInfo.address +
                " " +
                data.result.accountInfo.subDistrict +
                " " +
                data.result.accountInfo.district +
                " " +
                data.result.accountInfo.province +
                " " +
                data.result.accountInfo.zipCode
              : ""
          }
          gridGap={grid_gap}
        />
        <QuotationInfoItem
          colSpan={2}
          headingText="วันที่"
          content={formatedDate}
          gridGap={grid_gap}
        />
        <QuotationInfoItem
          colSpan={2}
          headingText="เบอร์ติดต่อ"
          content={
            data.result.accountInfo?.tel != undefined
              ? formatPhoneNumber(data.result.accountInfo.tel)
              : ""
          }
          gridGap={grid_gap}
        />
        <QuotationInfoItem
          colSpan={2}
          headingText="อีเมล์"
          content={data.result.email}
          gridGap={grid_gap}
        />
      </>
    ) : (
      <div>ไม่พบข้อมูล</div>
    )
  ) : (
    <div>Let edit</div>
  );
};

export default UserInfoCard;

// ## MAKE GRID ITEM TO REUSABLE COMPONENT ##
