"use client";
import { th } from "date-fns/locale";
import { useGetUserInfoWithoutIdQuery } from "@/redux/apiSlice";
import QuotationInfoItem from "./quotation-info-item";
import { Badge } from "../ui/badge";
import { Control, useWatch } from "react-hook-form";
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
import {
  formatBuddhistDate,
  formatPhoneNumber,
  formatTaxId,
  formatThaiDate,
  getAddDays,
} from "@/lib/utils2";
import { TAllUserInfo } from "@/redux/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { addYears, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
interface Props {
  editData?: TAllUserInfo;
  mode: "edit" | "add";
  grid_gap: string;
  control: Control<z.infer<typeof QuotationSchema>>;
  setIssetData: React.Dispatch<React.SetStateAction<IssetRequireData>>;
}

const UserInfoCard: React.FC<Props> = ({
  mode,
  grid_gap,
  control,
  setIssetData,
  editData,
}: Props) => {
  const date = new Date();
  const formatedDate = date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const dueDateWatch = useWatch({ control, name: "dueDate", defaultValue: 1 });
  const { data, isLoading, isError } = useGetUserInfoWithoutIdQuery(undefined, {
    skip: mode == "edit",
  });
  useEffect(() => {
    if (mode == "add" && data?.result && data.result.accountInfo) {
      setIssetData((prev) => ({
        ...prev,
        userInfo: true,
      }));
    }
  }, [data]);
  if (mode == "add" && isLoading) return <div>Loading...</div>;
  if (mode == "add" && !data?.result.name)
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
          headingText="วันที่เอกสาร"
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
        <div className="p-1 grid grid-cols-subgrid col-span-2">
          <FormField
            control={control}
            name="shipDate"
            render={({ field }) => (
              <FormItem className="space-y-0 grid grid-cols-subgrid col-span-2 items-center">
                <FormLabel>วันที่ส่งงาน</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          " pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(addYears(field.value, 543), "PPP", {
                            locale: th,
                          })
                        ) : (
                          <span>เลือกวันที่ส่งงาน</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      locale={th}
                      formatters={{
                        formatCaption: (month) =>
                          formatBuddhistDate(month, "LLLL yyyy", {
                            locale: th,
                          }),
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="p-1 grid grid-cols-subgrid col-start-3 col-span-2">
          <FormField
            control={control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="space-y-0 grid grid-cols-subgrid col-span-2 items-center">
                <FormLabel>ยืนยันใบเสนอราคาภายใน(วัน)</FormLabel>
                <FormControl>
                  <Input
                    className="disabled:opacity-100"
                    {...field}
                    placeholder="จำนวนวัน"
                    type="number"
                    min={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <QuotationInfoItem
          colSpan={2}
          headingText="วันที่ยืนยัน"
          content={getAddDays(date, dueDateWatch).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          gridGap={grid_gap}
        />
      </>
    ) : (
      <div>ไม่พบข้อมูล</div>
    )
  ) : (
    <>
      <div className="col-span-6 mb-4">
        <Badge variant={"secondary"} className="max-w-fit">
          ข้อมูลผู้ออกใบเสนอราคา
        </Badge>
      </div>
      <QuotationInfoItem
        colSpan={2}
        headingText="ชื่อ"
        content={editData?.name || ""}
        gridGap={grid_gap}
      />
      <QuotationInfoItem
        colSpan={2}
        headingText="เลขประจำตัวผู้เสียภาษีอากร"
        content={
          editData?.accountInfo.taxId != undefined
            ? formatTaxId(editData?.accountInfo.taxId)
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
          editData?.accountInfo.district
            ? editData?.accountInfo.address +
              " " +
              editData?.accountInfo.subDistrict +
              " " +
              editData?.accountInfo.district +
              " " +
              editData?.accountInfo.province +
              " " +
              editData?.accountInfo.zipCode
            : ""
        }
        gridGap={grid_gap}
      />
      <QuotationInfoItem
        colSpan={2}
        headingText="วันที่เอกสาร"
        content={
          editData?.createdAt != undefined
            ? formatThaiDate(editData.createdAt.toString())
            : ""
        }
        gridGap={grid_gap}
      />
      <QuotationInfoItem
        colSpan={2}
        headingText="เบอร์ติดต่อ"
        content={
          editData?.accountInfo.tel != undefined
            ? formatPhoneNumber(editData?.accountInfo.tel)
            : ""
        }
        gridGap={grid_gap}
      />
      <QuotationInfoItem
        colSpan={2}
        headingText="อีเมล์"
        content={editData?.email || ""}
        gridGap={grid_gap}
      />
      <div className="p-1 grid grid-cols-subgrid col-span-2">
        <FormField
          control={control}
          name="shipDate"
          render={({ field }) => (
            <FormItem className="space-y-0 grid grid-cols-subgrid col-span-2 items-center">
              <FormLabel>วันที่ส่งงาน</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        " pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(addYears(field.value, 543), "PPP", {
                          locale: th,
                        })
                      ) : (
                        <span>เลือกวันที่ส่งงาน</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus={true}
                    locale={th}
                    formatters={{
                      formatCaption: (month) =>
                        formatBuddhistDate(month, "LLLL yyyy", {
                          locale: th,
                        }),
                    }}
                    defaultMonth={field.value}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="p-1 grid grid-cols-subgrid col-start-3 col-span-2">
        <FormField
          control={control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="space-y-0 grid grid-cols-subgrid col-span-2 items-center">
              <FormLabel>ยืนยันใบเสนอราคาภายใน(วัน)</FormLabel>
              <FormControl>
                <Input
                  className="disabled:opacity-100"
                  {...field}
                  placeholder="จำนวนวัน"
                  type="number"
                  min={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <QuotationInfoItem
        colSpan={2}
        headingText="วันที่ยืนยัน"
        content={
          editData?.createdAt != undefined
            ? getAddDays(
                new Date(editData?.createdAt),
                dueDateWatch
              ).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : ""
        }
        gridGap={grid_gap}
      />
    </>
  );
};

export default UserInfoCard;
