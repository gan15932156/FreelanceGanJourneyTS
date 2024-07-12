"use client";

import { QuotationSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "../ui/use-toast";
import { useEffect, useState, useTransition } from "react";
import { Form } from "../ui/form";
import UserInfoCard from "./user-info-card";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  useCreateQuotationMutation,
  useGetGeneratedQidQuery,
} from "@/redux/apiSlice";
import ClientInfoSelectionbox from "./clientInfo-selectionbox";
import ServiceQuotationTable from "./services-quotation-table";
import { Badge } from "../ui/badge";
import QuotationDesc from "./quotation-desc";
interface QuotationFormProps {
  mode: "edit" | "add";
  id?: string;
}
export interface IssetRequireData {
  userInfo: boolean;
  client: boolean;
  payment: boolean;
  services: boolean;
  clientId: string;
}
const initialData: z.infer<typeof QuotationSchema> = {
  qId: "",
  services: [],
  isUseVAT: false,
  taxAmount: 0,
};
const GRID_GAP: string = "gap-1";

const QuotationForm: React.FC<QuotationFormProps> = ({
  mode,
  id,
}: QuotationFormProps) => {
  const {
    data: qidData,
    isLoading: qidLoading,
    isError: qidError,
  } = useGetGeneratedQidQuery();
  const [uesCreateQuotation, { isLoading: createQuotationLoading }] =
    useCreateQuotationMutation();
  const router = useRouter();
  const form = useForm<z.infer<typeof QuotationSchema>>({
    mode: "onBlur",
    resolver: zodResolver(QuotationSchema),
    defaultValues: initialData,
  });
  const [issetData, setIssetData] = useState<IssetRequireData>({
    userInfo: false,
    client: false,
    clientId: "",
    payment: false,
    services: false,
  });
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const onSubmit: SubmitHandler<z.infer<typeof QuotationSchema>> = async (
    data
  ) => {
    let requireDataErrorMsg = "";
    let validateErrorMsg = "";
    if (!issetData.userInfo) {
      requireDataErrorMsg += "\n ข้อมูลที่อยู่ของท่าน";
    }
    if (!issetData.payment) {
      requireDataErrorMsg += "\n ข้อมูลการชำระเงินของท่าน";
    }
    if (!issetData.client) {
      requireDataErrorMsg += "\n ข้อมูลลูกค้า";
    }
    if (!issetData.services) {
      requireDataErrorMsg += "\n ข้อมูลบริการ";
    }
    if (issetData.clientId == "") {
      validateErrorMsg += "กรุณาเลือกลูกค้า";
    }
    if (requireDataErrorMsg != "") {
      requireDataErrorMsg =
        "ไม่พบข้อมูล กรุณาเพิ่มข้อมูล ดังต่อไปนี้ " + requireDataErrorMsg;
      validateErrorMsg += "\n " + requireDataErrorMsg;
    }
    if (requireDataErrorMsg == "" && validateErrorMsg == "") {
      if (mode == "add") {
        startTransition(() => {
          uesCreateQuotation({ ...data, clientId: issetData.clientId }).then(
            (data) => {
              if (data.data?.result) {
                form.reset(initialData);
                toast({
                  title: data.data?.message || "สำเร็จ",
                });
                router.replace("/quotation");
              } else {
                toast({
                  variant: "destructive",
                  title: data.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
                });
              }
            }
          );
        });
      } else {
        // edit
      }
    } else {
      toast({
        description: validateErrorMsg,
      });
    }
  };
  useEffect(() => {
    if (mode == "add" && !qidLoading && !qidError) {
      form.reset({ qId: qidData?.result, services: [] });
    }
  }, [qidData]);
  return (
    <div className="w-[90%] grid gap-4 mx-auto">
      <h2 className="text-center font-semibold text-2xl">ใบเสนอราคา</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "p-2 grid grid-cols-[100px_1fr_200px_1fr_100px_200px] ",
            GRID_GAP
          )}
        >
          <UserInfoCard
            mode={mode}
            grid_gap={GRID_GAP}
            control={form.control}
            issetData={issetData}
            setIssetData={setIssetData}
          />
          <Separator className="col-span-6 my-4" />
          <ClientInfoSelectionbox
            mode={mode}
            grid_gap={GRID_GAP}
            setIssetData={setIssetData}
          />
          <Separator className="col-span-6 my-4" />
          <ServiceQuotationTable
            mode={mode}
            grid_gap={GRID_GAP}
            control={form.control}
            issetData={issetData}
            setIssetData={setIssetData}
          />
          {form.formState.errors?.services?.message && (
            <div className="col-span-6 ">
              <Badge className="animate-bounce" variant="destructive">
                {form.formState.errors?.services?.message}
              </Badge>
            </div>
          )}
          <Separator className="col-span-6 my-4" />
          <QuotationDesc
            mode={mode}
            setIssetData={setIssetData}
            grid_gap={GRID_GAP}
            control={form.control}
          />
          <div className="col-span-4 flex flex-row gap-2 mt-4">
            <Button
              className="ml-auto"
              onClick={() => router.back()}
              variant={"outline"}
              type="button"
            >
              ย้อนหลับ
            </Button>
            <Button type="submit">บันทึกข้อมูล</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default QuotationForm;
