"use client";

import { IService } from "@/redux/types";
import { ServiceSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  useCreateServiceMutation,
  useGetServiceQuery,
  useUpdateServiceMutation,
} from "@/redux/apiSlice";
import { useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { skipToken } from "@reduxjs/toolkit/query";

interface ServiceFormProps {
  mode: "edit" | "add";
  isModalForm: boolean;
  id?: string;
}
const initialData: IService = {
  name: "",
  desc: "",
  price: 0,
  note: "",
};
const ServiceForm: React.FC<ServiceFormProps> = ({
  mode,
  isModalForm,
  id,
}: ServiceFormProps) => {
  const { data, isLoading: dataLoading } = useGetServiceQuery(id ?? skipToken);
  const router = useRouter();
  const form = useForm<z.infer<typeof ServiceSchema>>({
    mode: "onBlur",
    resolver: zodResolver(ServiceSchema),
    defaultValues: initialData,
  });
  const { toast } = useToast();
  const [useCreateService, { isLoading }] = useCreateServiceMutation();
  const [useUpdateService, { isLoading: updateLoading }] =
    useUpdateServiceMutation();
  const [isPending, startTranstion] = useTransition();
  const onSubmit: SubmitHandler<z.infer<typeof ServiceSchema>> = async (
    data
  ) => {
    if (mode == "edit") {
      startTranstion(() => {
        useUpdateService({ ...data, id }).then((data) => {
          if (data.data?.result) {
            toast({ title: data.data.message || "สำเร็จ" });
            router.back();
          } else {
            toast({
              variant: "destructive",
              title: data.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
            });
          }
        });
      });
    } else {
      startTranstion(() => {
        useCreateService(data).then((data) => {
          if (data.data?.result) {
            form.reset(initialData);
            toast({
              title: data.data?.message || "สำเร็จ",
            });
            router.back();
          } else {
            toast({
              variant: "destructive",
              title: data.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
            });
          }
        });
      });
    }
  };
  useEffect(() => {
    if (mode == "edit" && !dataLoading && data) {
      form.reset(data.result);
    }
  }, [data]);
  if (mode == "edit" && dataLoading) return <div>Loading...</div>;
  if (mode == "edit" && !dataLoading && !data?.result)
    return <div>ไม่พบข้อมูล</div>;
  return (
    <div
      className={cn(
        `p-4 w-full grid gap-4 mx-auto`,
        !isModalForm && "md:w-3/4"
      )}
    >
      <h2 className="text-center font-semibold text-2xl">ฟอร์มข้อมูลบริการ</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อบริการ/งาน</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending || isLoading || updateLoading}
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
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ราคา(หน่วยเงินบาท)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending || isLoading || updateLoading}
                      {...field}
                      placeholder="ราคา"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รายละเอียดงาน</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isPending || isLoading || updateLoading}
                      {...field}
                      placeholder="รายละเอียด1,รายละเอียด2"
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    ระบบจะแสดงเป็นรายการ กรุณาแบ่งข้อความด้วยตัวคอมม่า(,)
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>หมายเหตุ</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isPending || isLoading || updateLoading}
                      {...field}
                      placeholder="หมายเหตุ1,หมายเหตุ2"
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    ระบบจะแสดงเป็นรายการ กรุณาแบ่งข้อความด้วยตัวคอมม่า(,)
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row mt-6 justify-end gap-4">
            <Button
              onClick={() => router.back()}
              disabled={isPending || isLoading || updateLoading}
              variant={"outline"}
              type="button"
            >
              ย้อนหลับ
            </Button>
            <Button
              disabled={isPending || isLoading || updateLoading}
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

export default ServiceForm;
