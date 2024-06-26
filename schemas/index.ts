import * as z from "zod";
export const LoginSchema = z.object({
  email: z.string().email({
    message: "กรุณากรอกอีเมล์",
  }),
  password: z.string().min(1, {
    message: "กรุณากรอกรหัสผ่าน",
  }),
});
export const RegisterSchema = z.object({
  email: z.string().email({
    message: "กรุณากรอกอีเมล์",
  }),
  password: z.string().min(6, {
    message: "กรุณากรอกรหัสผ่านอย่างน้อย 6 ตัว",
  }),
  name: z.string().min(1, {
    message: "กรุณากรอกชื่อ-นามสกุล",
  }),
});
export const UserInfoSchema = z.object({
  name: z.string().min(1, {
    message: "กรุณากรอกชื่อ-นามสกุล",
  }),
  tel: z.string().min(9, {
    message: "กรุณากรอกเบอร์โทรศัพท์",
  }),
  address: z.string().min(2, {
    message: "กรุณากรอกที่อยู่",
  }),
  taxId: z.string().min(13, {
    message: "กรุณากรอกเลขบัตรประชาชน",
  }),
  province: z.string().min(1, {
    message: "กรุณากรอกจังหวัด",
  }),
  district: z.string().min(1, {
    message: "กรุณากรอกอำเภอ",
  }),
  subDistrict: z.string().min(1, {
    message: "กรุณากรอกตำบล",
  }),
  zipCode: z.string(),
});

export const ServiceSchema = z.object({
  name: z.string().min(2, {
    message: "กรุณากรอกชื่อบริการ/งาน",
  }),
  price: z.coerce
    .number()
    .positive({ message: "กรุณากรอกจำนวนเต็มบวกเท่านั้น" })
    .min(1, {
      message: "กรุณากรอกราคา",
    }),
  desc: z.string().min(1, {
    message: "กรุณากรอกรายละเอียดงาน",
  }),
  note: z.string(),
});
