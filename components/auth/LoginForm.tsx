"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import * as z from "zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import RegisterButton from "./register-button";
export default function LoginForm() {
  const [error, setError] = useState<string | undefined>("");
  // const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTranstion] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    // setSuccess("");
    startTranstion(() => {
      login(values).then((data) => {
        setError(data?.error);
      });
    });
  };
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                        placeholder="m@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                        placeholder="******"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2 mt-6">
              <FormError message={error} />
              {/* <FormSuccess message={success} /> */}
              <Button disabled={isPending} type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account? <RegisterButton />
        </div>
      </CardContent>
    </Card>
  );
}
