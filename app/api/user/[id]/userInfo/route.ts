import db from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userInfo = await db.user.findUnique({
      where: {
        id: params.id,
      },
      select: {
        email: true,
        name: true,
        accountInfo: {
          select: {
            province: true,
            address: true,
            district: true,
            subDistrict: true,
            taxId: true,
            tel: true,
            zipCode: true,
          },
        },
      },
    });
    return NextResponse.json({ ...userInfo });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.taxId) {
      const result = await db.user.update({
        where: {
          id: body.id,
        },
        data: {
          accountInfo: {
            upsert: {
              create: {
                tel: body.tel || "",
                address: body.address || "",
                taxId: body.taxId || "",
                province: body.province || "",
                district: body.district || "",
                subDistrict: body.subDistrict || "",
                zipCode: body.zipCode || "",
              },
              update: {
                tel: body.tel || "",
                address: body.address || "",
                taxId: body.taxId || "",
                province: body.province || "",
                district: body.district || "",
                subDistrict: body.subDistrict || "",
                zipCode: body.zipCode || "",
              },
            },
          },
        },
        include: {
          accountInfo: true,
        },
      });
      return NextResponse.json({ result, message: "สำเร็จ" }, { status: 201 });
    }
    return NextResponse.json({ message: "ไม่พบข้อมูลผู้ใช้" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
