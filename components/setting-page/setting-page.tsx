"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { UserInfoSchema } from "@/schemas";
import { useEffect, useTransition } from "react";
import { Button } from "../ui/button";
import ThAddressAutoComplete from "../ownUi/th-address-auto-complete";
import { Separator } from "../ui/separator";
import {
  useGetUserInfoQuery,
  useUpdateUserInfoMutation,
} from "@/redux/apiSlice";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
interface SettingPageProps {
  id?: string;
}
const SettingPage: React.FC<SettingPageProps> = ({ id }: SettingPageProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const {
    data: userInfoData,
    isFetching,
    isLoading,
  } = useGetUserInfoQuery(id ?? skipToken);
  const [
    useUpdateUserInfo,
    { isError, isLoading: isUpdateLoading, error: updateError },
  ] = useUpdateUserInfoMutation();
  const form = useForm<z.infer<typeof UserInfoSchema>>({
    resolver: zodResolver(UserInfoSchema),
    defaultValues: {
      address: "",
      district: "",
      name: "",
      province: "",
      subDistrict: "",
      taxId: "",
      tel: "",
      zipCode: "",
    },
  });
  const [isPending, startTranstion] = useTransition();
  // const watchAllFields = form.watch();
  // console.log(watchAllFields);
  // https://codevoweb.com/build-crud-app-with-reactjs-and-redux-toolkit/
  const onSubmit: SubmitHandler<z.infer<typeof UserInfoSchema>> = async (
    data
  ) => {
    if (data.taxId != "") {
      startTranstion(() => {
        useUpdateUserInfo({
          ...data,
          id: id || "",
        }).then((data) => {
          if (data.data?.result) {
            toast({
              title: data.data?.message || "สำเร็จ",
            });
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
    if (!isLoading) {
      if (userInfoData != undefined && userInfoData.email) {
        const { accountInfo, ...rest } = userInfoData;
        const newObject: z.infer<typeof UserInfoSchema> = {
          ...rest,
          ...(accountInfo ?? {
            province: "",
            address: "",
            district: "",
            subDistrict: "",
            taxId: "",
            tel: "",
            zipCode: "",
          }),
        };
        form.reset(newObject);
      }
    }
  }, [userInfoData]);

  if (!id) return null;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4 w-full md:w-1/2 grid gap-4 mx-auto">
      <h2 className="text-center font-semibold text-2xl">ตั้งค่าบัญชี</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="taxId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เลขบัตรประชาชน</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending || isUpdateLoading}
                      {...field}
                      placeholder="เลขบัตรประชาชน"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อ-นามสกุล</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending || isUpdateLoading}
                      {...field}
                      placeholder="ชื่อ   นามสกุล"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2 grid-cols-2 mt-2">
            <FormField
              control={form.control}
              name="tel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เบอร์โทรศัพท์</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending || isUpdateLoading}
                      {...field}
                      placeholder="เบอร์โทรศัพท์"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator className="my-6" />
          <div className="grid gap-2 mt-2">
            <ThAddressAutoComplete
              control={form.control}
              isLoading={isUpdateLoading}
              isPending={isPending}
              onSetFormValue={form.setValue}
            />
          </div>
          <div className="flex flex-row mt-6 justify-end gap-4">
            <Button
              onClick={() => router.back()}
              disabled={isPending || isUpdateLoading}
              variant={"outline"}
              type="button"
            >
              ย้อนหลับ
            </Button>
            <Button disabled={isPending || isUpdateLoading} type="submit">
              บันทึกข้อมูล
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SettingPage;
