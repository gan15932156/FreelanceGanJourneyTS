import * as z from "zod";
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});
export const UserInfoSchema = z.object({
  name: z.string().min(1, {
    message: "โปรดกรอกชื่อ-นามสกุล",
  }),
  tel: z.string().min(9, {
    message: "โปรดกรอกเบอร์โทรศัพท์",
  }),
  address: z.string().min(2, {
    message: "โปรดกรอกที่อยู่",
  }),
  taxId: z.string().min(13, {
    message: "โปรดกรอกเลขบัตรประชาชน",
  }),
  province: z.string().min(1, {
    message: "โปรดกรอกจังหวัด",
  }),
  district: z.string().min(1, {
    message: "โปรดกรอกอำเภอ",
  }),
  subDistrict: z.string().min(1, {
    message: "โปรดกรอกตำบล",
  }),
  zipCode: z.string(),
});
