import { currentUser } from "@/lib/auth";
import db from "@/lib/prisma";
import { ClientSchemaWithoutExtras } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await currentUser();
  if (!session?.id)
    return NextResponse.json(
      { result: {}, message: "ไม่ได้รับอนุญาติ" },
      { status: 401 }
    );
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        {
          message: "ไม่พบข้อมูล",
        },
        { status: 401 }
      );
    }
    const service = await db.client.findUnique({ where: { id } });
    return NextResponse.json(
      {
        result: service,
        message: "สำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await currentUser();
  if (!session?.id)
    return NextResponse.json(
      { result: {}, message: "ไม่ได้รับอนุญาติ" },
      { status: 401 }
    );
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        {
          message: "ไม่สามารถบันทึกข้อมูลได้",
        },
        { status: 401 }
      );
    }
    const body: unknown = await req.json();
    const parsedBody = ClientSchemaWithoutExtras.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { result: {}, message: "ไม่สามารถบันทึกข้อมูลได้" },
        { status: 422 }
      );
    }
    const {
      name,
      tel,
      address,
      taxId,
      province,
      district,
      subDistrict,
      zipCode,
      email,
      contactName,
      contactTel,
      contactEmail,
      isLP,
    } = parsedBody.data;
    const client = await db.client.update({
      where: {
        id,
      },
      data: {
        name,
        tel,
        address,
        taxId,
        province,
        district,
        subDistrict,
        zipCode,
        email,
        contactName,
        contactTel,
        contactEmail,
        isLP,
      },
    });
    return NextResponse.json(
      {
        result: client,
        message: "สำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
