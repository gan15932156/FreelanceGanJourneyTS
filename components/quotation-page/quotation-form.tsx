"use client";
import _ from "lodash";
import {
  QuotationSchema,
  QuotationServiceSchemaWithMode,
  StatusEnumSchema,
} from "@/schemas";
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
  useGetQuotationQuery,
  useUpdateQuotationMutation,
} from "@/redux/apiSlice";
import ClientInfoSelectionbox from "./clientInfo-selectionbox";
import ServiceQuotationTable from "./services-quotation-table";
import { Badge } from "../ui/badge";
import QuotationDesc from "./quotation-desc";
import { skipToken } from "@reduxjs/toolkit/query";
import { isEqual } from "date-fns";
import { Link2, Mail, Printer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
  dueDate: 1,
};
const GRID_GAP: string = "gap-1";

const QuotationForm: React.FC<QuotationFormProps> = ({
  mode,
  id,
}: QuotationFormProps) => {
  const { data: quotationData, isLoading: quotationLoading } =
    useGetQuotationQuery(id ?? skipToken);
  const {
    data: qidData,
    isLoading: qidLoading,
    isError: qidError,
  } = useGetGeneratedQidQuery(undefined, {
    skip: mode == "edit",
  });
  const [uesCreateQuotation, { isLoading: createQuotationLoading }] =
    useCreateQuotationMutation();
  const [useUPdateQuotation, { isLoading: updateLoading }] =
    useUpdateQuotationMutation();
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
        if (
          quotationData?.result.status.toString() == StatusEnumSchema.enum.DRAFT
        ) {
          let updateData = {};
          if (!_.isEqual(quotationData?.result.isUseVAT, data.isUseVAT)) {
            updateData = {
              ...updateData,
              isUseVAT: data.isUseVAT,
            };
          }
          if (!_.isEqual(quotationData?.result.note || undefined, data.note)) {
            updateData = {
              ...updateData,
              note: data.note,
            };
          }
          if (!_.isEqual(quotationData?.result.taxAmount, data.taxAmount)) {
            updateData = {
              ...updateData,
              taxAmount: data.taxAmount,
            };
          }
          if (!_.isEqual(quotationData?.result.clientId, issetData.clientId)) {
            updateData = {
              ...updateData,
              clientId: issetData.clientId,
            };
          }
          if (!_.isEqual(quotationData?.result.dueDate, data.dueDate)) {
            updateData = {
              ...updateData,
              dueDate: data.dueDate,
            };
          }
          if (
            data.shipDate != undefined &&
            quotationData.result.shipDate != undefined &&
            !isEqual(quotationData?.result.shipDate, data.shipDate)
          ) {
            updateData = {
              ...updateData,
              shipDate: data.shipDate,
            };
          }
          let updateService: z.infer<typeof QuotationServiceSchemaWithMode>[] =
            [];
          let deleteService: string[] = [];
          data.services
            .filter((f) => f.isEdit == true)
            .forEach((service) => {
              const foundData = quotationData?.result.quotationServices.find(
                (e) => e.id == service.id
              );
              if (foundData && foundData.id != undefined) {
                const { createdAt, updatedAt, ...original } = foundData;
                const {
                  createdAt: createdAt2,
                  updatedAt: updatedAt2,
                  isEdit,
                  ...compareData
                } = service;
                if (!_.isEqual(original, compareData)) {
                  updateService.push({ ...compareData, isEdit: true });
                }
              }
            });
          quotationData?.result.quotationServices.forEach((service) => {
            const found = data.services.find((f) => f.id == service.id);
            if (found && found.isEdit == true) {
            } else {
              if (service.id != undefined) {
                deleteService.push(service.id);
              }
            }
          });
          updateData = {
            ...updateData,
            ...(updateService.length > 0 && {
              services: updateService,
            }),
            // qId: data.qId,
          };
          const body = {
            update: updateData,
            add: data.services.filter((f) => f.isEdit == false),
            delete: deleteService,
            id: id || "",
          };
          if (
            !_.isEmpty(body.update) ||
            body.add.length > 0 ||
            body.delete.length > 0
          ) {
            startTransition(() => {
              useUPdateQuotation({
                ...body,
                update: {
                  ...body.update,
                  qId: data.qId,
                },
              }).then((data) => {
                if (data.data?.result) {
                  toast({ title: data.data.message || "สำเร็จ" });
                } else {
                  toast({
                    variant: "destructive",
                    title: data.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
                  });
                }
              });
            });
          }
        }
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
  useEffect(() => {
    if (
      mode == "edit" &&
      !quotationLoading &&
      quotationData?.result &&
      quotationData?.result.id != undefined
    ) {
      setIssetData((prev) => ({
        ...prev,
        clientId: quotationData.result.clientId,
        payment: true,
        userInfo: true,
      }));
      const qid = quotationData.result.qId;
      const newQid =
        qid.substring(0, qid.length - 1) +
        (Number(qid.substring(qid.length - 1)) + 1);
      const resetService: z.infer<typeof QuotationServiceSchemaWithMode>[] =
        quotationData.result.quotationServices.map((serivce) => ({
          ...serivce,
          isEdit: true,
        }));
      const resetData = {
        qId: newQid,
        isUseVAT: quotationData.result.isUseVAT,
        dueDate: quotationData.result.dueDate,
        taxAmount: quotationData.result.taxAmount,
        services: resetService,
        ...(quotationData.result.shipDate != undefined && {
          shipDate: new Date(quotationData.result.shipDate),
        }),
      };
      form.reset(resetData);
    }
  }, [quotationData]);
  if (mode == "edit" && quotationLoading) return <div>Loading...</div>;
  if (
    mode == "edit" &&
    !quotationLoading &&
    quotationData?.result &&
    quotationData?.result.id == undefined
  )
    return <div>ไม่พบข้อมูล</div>;
  return (
    <div className="w-[90%] grid gap-4 mx-auto">
      <h2 className="text-center font-semibold text-2xl">ใบเสนอราคา</h2>
      <div className="mt-2 w-full flex flex-row gap-2 justify-end items-center">
        {mode == "edit" &&
          (quotationData?.result.status.toString() ==
            StatusEnumSchema.enum.DRAFT ||
            quotationData?.result.status.toString() ==
              StatusEnumSchema.enum.SENT ||
            quotationData?.result.status.toString() ==
              StatusEnumSchema.enum.ACCEPTED) && (
            <Button size={"sm"} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              พิมพ์
            </Button>
          )}
        {mode == "edit" &&
          quotationData?.result.status.toString() ==
            StatusEnumSchema.enum.DRAFT && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={"sm"} variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  ส่ง
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>ช่องทาง</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>อีเมล์</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link2 className="mr-2 h-4 w-4" />
                    <span>ลิงค์</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
      </div>
      <Separator />
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
            setIssetData={setIssetData}
            editData={
              mode == "edit" && quotationData?.result?.user != undefined
                ? {
                    ...quotationData?.result?.user,
                    createdAt: quotationData.result.createdAt,
                  }
                : undefined
            }
          />
          <Separator className="col-span-6 my-4" />
          <ClientInfoSelectionbox
            mode={mode}
            grid_gap={GRID_GAP}
            setIssetData={setIssetData}
            clientId={
              mode == "edit" && quotationData?.result?.clientId != undefined
                ? quotationData?.result?.clientId
                : undefined
            }
          />
          <Separator className="col-span-6 my-4" />
          <ServiceQuotationTable
            control={form.control}
            setIssetData={setIssetData}
          />
          {(form.formState.errors?.services?.message ||
            form.formState.errors?.services?.root?.message) && (
            <div className="col-span-6 ">
              <Badge className="animate-bounce max-w-fit" variant="destructive">
                {form.formState.errors?.services?.message ??
                  form.formState.errors?.services?.root?.message}
              </Badge>
            </div>
          )}
          <Separator className="col-span-6 my-4" />
          <QuotationDesc
            editData={
              mode == "edit" &&
              quotationData?.result?.user.paymentInfo != undefined
                ? quotationData?.result?.user.paymentInfo.desc
                : undefined
            }
            mode={mode}
            setIssetData={setIssetData}
            control={form.control}
          />
          <div className="col-span-4 flex flex-row gap-2 mt-4">
            <Button
              disabled={createQuotationLoading || isPending || updateLoading}
              className="ml-auto"
              onClick={() => router.back()}
              variant={"outline"}
              type="button"
            >
              ย้อนหลับ
            </Button>
            <Button
              disabled={createQuotationLoading || isPending || updateLoading}
              type="submit"
            >
              บันทึกข้อมูล
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default QuotationForm;
