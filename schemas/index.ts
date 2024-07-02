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
  note: z.string().optional(),
});

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
});
export const getSearchSchema = searchParamsSchema;
export type GetServiceSchema = z.infer<typeof getSearchSchema>;

export const ClientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "กรุณากรอกชื่อลูกค้า" }),
  tel: z.string().min(9, {
    message: "กรุณากรอกเบอร์โทรศัพท์",
  }),
  address: z.string().min(2, {
    message: "กรุณากรอกที่อยู่",
  }),
  taxId: z.string().min(13, {
    message: "กรุณากรอกเลขประจําตัวผู้เสียภาษี",
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
  zipCode: z.string().optional(),
  email: z.string().email({
    message: "กรุณากรอกอีเมล์",
  }),
  contactName: z
    .string()
    .min(2, { message: "กรุณากรอกชื่อผู้ติดต่อ" })
    .optional()
    .or(z.literal("")),
  contactTel: z
    .string()
    .min(9, { message: "กรุณากรอกเบอร์ผู้ติดต่อ" })
    .optional()
    .or(z.literal("")),
  contactEmail: z
    .string()
    .email({
      message: "กรุณากรอกอีเมล์",
    })
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
  isLP: z.boolean().default(true),
  userId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type TClientSchema = z.infer<typeof ClientSchema>;

// Omit the specific properties
export const ClientSchemaWithoutExtras = ClientSchema.omit({
  createdAt: true,
  updatedAt: true,
  userId: true,
  isActive: true,
});
export type TClientSchemaWithoutExtras = z.infer<
  typeof ClientSchemaWithoutExtras
>;
export const UserPaymentSchema = z.object({
  id: z.string().optional(),
  desc: z.string().min(2, {
    message: "กรุณากรอกรายละเอียดการเงิน",
  }),
  userId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type TUserPaymentSchema = z.infer<typeof UserPaymentSchema>;
export const UserPaymentSchemaWithoutExtras = UserPaymentSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});
export type TUserPaymentSchemaWithoutExtras = z.infer<
  typeof UserPaymentSchemaWithoutExtras
>;
