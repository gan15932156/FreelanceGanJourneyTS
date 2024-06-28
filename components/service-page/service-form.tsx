"use client";

import { IService } from "@/redux/types";
import { ServiceSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
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
  useUpdateServiceMutation,
} from "@/redux/apiSlice";
import { useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
interface ServiceFormProps {
  mode: "edit" | "add";
  data?: IService;
  id?: string;
  isModalForm: boolean;
}
const initialData: IService = {
  name: "",
  desc: "",
  price: 0,
  note: "",
};
const ServiceForm: React.FC<ServiceFormProps> = ({
  mode,
  data,
  id,
  isModalForm,
}: ServiceFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof ServiceSchema>>({
    mode: "onBlur",
    resolver: zodResolver(ServiceSchema),
    defaultValues: data && mode == "edit" ? data : initialData,
  });
  const { toast } = useToast();
  const [useCreateService, { isError, isLoading, error }] =
    useCreateServiceMutation();
  const [useUpdateService, { isLoading: updateLoading }] =
    useUpdateServiceMutation();
  const [isPending, startTranstion] = useTransition();
  const onSubmit: SubmitHandler<z.infer<typeof ServiceSchema>> = async (
    data
  ) => {
    if (mode == "edit") {
      // ##note please check data is diffence from remote data
      if (
        confirm(
          "การเปลี่ยนแปลงข้อมูลบริการหลังจากบันทึกข้อมูลนี้ ระบบจะสร้างข้อมูลบริการเพิ่มแทนการเปลี่ยนแปลงข้อมูลเดิม"
        )
      ) {
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
        console.log("back to edit");
      }
    } else {
      startTranstion(() => {
        useCreateService({
          ...data,
          userId: id,
        }).then((data) => {
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
  return (
    // isModalForm
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
                      disabled={isPending || isLoading}
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
                      disabled={isPending || isLoading}
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
                      disabled={isPending || isLoading}
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
                      disabled={isPending || isLoading}
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
              disabled={isPending || isLoading}
              variant={"outline"}
              type="button"
            >
              ย้อนหลับ
            </Button>
            <Button disabled={isPending || isLoading} type="submit">
              บันทึกข้อมูล
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ServiceForm;
