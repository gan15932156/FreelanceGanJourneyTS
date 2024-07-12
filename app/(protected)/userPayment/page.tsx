"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  useGetUserPaymentInfoQuery,
  useUpdateUserPaymentInfoMutation,
} from "@/redux/apiSlice";
import {
  TUserPaymentSchemaWithoutExtras,
  UserPaymentSchemaWithoutExtras,
} from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
const initialData: TUserPaymentSchemaWithoutExtras = {
  desc: "",
};
export default function Page() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTranstion] = useTransition();
  const {
    data: userPaymentData,
    isLoading: userPaymentLoading,
    isError: userPaymentError,
  } = useGetUserPaymentInfoQuery();
  const [
    useUpdateUSerPaymentInfo,
    { isLoading: updateUserPaymentLoading, isError: updateUserpaymentError },
  ] = useUpdateUserPaymentInfoMutation();
  const form = useForm<TUserPaymentSchemaWithoutExtras>({
    mode: "onBlur",
    resolver: zodResolver(UserPaymentSchemaWithoutExtras),
    defaultValues: initialData,
  });
  const onSubmit: SubmitHandler<TUserPaymentSchemaWithoutExtras> = async (
    data
  ) => {
    startTranstion(() => {
      useUpdateUSerPaymentInfo(data).then((data) => {
        if (data.data?.result) {
          toast({
            title: data.data.message || "สำเร็จ",
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
  useEffect(() => {
    if (!userPaymentLoading && !userPaymentError && userPaymentData) {
      form.reset(userPaymentData.result.data);
    }
  }, [userPaymentData]);
  if (userPaymentLoading) return <div>Loading...</div>;
  return (
    <div className="p-4 w-full md:w-1/2 grid gap-4 mx-auto">
      <h2 className="text-center font-semibold text-2xl">ข้อมูลการเงิน</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2 grid-cols-1 ">
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รายละเอียดข้อมูลการเงิน</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isPending || updateUserPaymentLoading}
                      {...field}
                      placeholder="รายละเอียด"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row mt-6 justify-end gap-4">
            <Button
              onClick={() => router.back()}
              disabled={isPending || updateUserPaymentLoading}
              variant={"outline"}
              type="button"
            >
              ย้อนหลับ
            </Button>
            <Button
              disabled={isPending || updateUserPaymentLoading}
              type="submit"
            >
              บันทึกข้อมูล
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
