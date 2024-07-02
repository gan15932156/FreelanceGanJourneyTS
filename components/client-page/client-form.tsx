"use client";
import * as z from "zod";
import {
  ClientSchema,
  ClientSchemaWithoutExtras,
  TClientSchema,
} from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useToast } from "../ui/use-toast";
import { useEffect, useTransition } from "react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  useCreateClientMutation,
  useGetClientQuery,
  useUpdateClientMutation,
} from "@/redux/apiSlice";
import ThAddressAutoComplete from "../ownUi/th-address-auto-complete";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { skipToken } from "@reduxjs/toolkit/query";
interface ClientFormProps {
  mode: "edit" | "add";
  isModalForm: boolean;
  id?: string;
}
const initialData: TClientSchema = {
  name: "",
  address: "",
  district: "",
  email: "",
  province: "",
  subDistrict: "",
  taxId: "",
  tel: "",
  zipCode: "",
  isActive: true,
  isLP: true,
  contactEmail: "",
  contactName: "",
  contactTel: "",
};
const ClientForm: React.FC<ClientFormProps> = ({
  mode,
  id,
  isModalForm,
}: ClientFormProps) => {
  const { data, isLoading: dataLoading } = useGetClientQuery(id ?? skipToken);
  const router = useRouter();
  const form = useForm<z.infer<typeof ClientSchemaWithoutExtras>>({
    mode: "onBlur",
    resolver: zodResolver(ClientSchemaWithoutExtras),
    defaultValues: initialData,
  });
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const sub = form.watch("isLP");
  const [useUpdateClient, { isLoading: updateClientLoading }] =
    useUpdateClientMutation();
  const [useCreateClient, { isLoading: createClientLoading }] =
    useCreateClientMutation();
  const onSubmit: SubmitHandler<
    z.infer<typeof ClientSchemaWithoutExtras>
  > = async (data) => {
    if (mode == "edit") {
      startTransition(() => {
        useUpdateClient(data).then((data) => {
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
      startTransition(() => {
        useCreateClient(data).then((data) => {
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
        !isModalForm && "md:w-1/2"
      )}
    >
      <h2 className="text-center font-semibold text-2xl">ฟอร์มข้อมูลลูกค้า</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Badge className="max-w-fit" variant="secondary">
            ส่วนลูกค้า
          </Badge>
          <div className="grid grid-cols-1">
            <FormField
              control={form.control}
              name="isLP"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      className="flex flex-row space-y-1"
                      onValueChange={(value) => {
                        field.onChange(value == "นิติบุคคล" ? true : false);
                      }}
                      defaultValue={field.value ? "นิติบุคคล" : "บุคคลธรรมดา"}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="นิติบุคคล" />
                        </FormControl>
                        <FormLabel className="font-normal">นิติบุคคล</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="บุคคลธรรมดา" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          บุคคลธรรมดา
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อลูกค้า</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        isPending || createClientLoading || updateClientLoading
                      }
                      {...field}
                      placeholder="ชื่อลูกค้า"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เลขประจำตัวผู้เสียภาษีอากร</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        isPending || createClientLoading || updateClientLoading
                      }
                      {...field}
                      placeholder="เลขประจำตัวผู้เสียภาษีอากร"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1">
            <ThAddressAutoComplete
              control={form.control}
              isLoading={createClientLoading}
              isPending={isPending}
              onSetFormValue={form.setValue}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="tel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เบอร์ติดต่อ</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        isPending || createClientLoading || updateClientLoading
                      }
                      {...field}
                      placeholder="เบอร์ติดต่อ"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>อีเมล์</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        isPending || createClientLoading || updateClientLoading
                      }
                      {...field}
                      placeholder="อีเมล์"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <Badge className="max-w-fit" variant="secondary">
            ส่วนผู้ติดต่อ
          </Badge>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อผู้ติดต่อ</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        isPending ||
                        createClientLoading ||
                        !sub ||
                        updateClientLoading
                      }
                      {...field}
                      placeholder="ชื่อผู้ติดต่อ"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactTel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เบอร์โทรผู้ติดต่อ</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        isPending ||
                        createClientLoading ||
                        !sub ||
                        updateClientLoading
                      }
                      {...field}
                      placeholder="เบอร์โทรผู้ติดต่อ"
                      type="text"
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
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>อีเมล์ผู้ติดต่อ</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        isPending ||
                        createClientLoading ||
                        !sub ||
                        updateClientLoading
                      }
                      {...field}
                      placeholder="อีเมล์ผู้ติดต่อ"
                      type="email"
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
              disabled={isPending || createClientLoading || updateClientLoading}
              variant={"outline"}
              type="button"
            >
              ย้อนหลับ
            </Button>
            <Button
              disabled={isPending || createClientLoading || updateClientLoading}
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

export default ClientForm;
