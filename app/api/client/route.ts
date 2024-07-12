import { ClientSchemaWithoutExtras } from "./../../../schemas/index";
import { currentUser } from "@/lib/auth";
import db from "@/lib/prisma";
import { TClientSchema } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await currentUser();
  if (!session)
    return NextResponse.json({
      result: { data: [], total: 0 },
      message: "ไม่ได้รับอนุญาต",
    });
  try {
    const searchParams = req.nextUrl.searchParams,
      offset = parseInt(searchParams.get("offset") as string),
      limit = parseInt(searchParams.get("limit") as string) || 2,
      sort = searchParams.get("sort");
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof TClientSchema | undefined, "asc" | "desc" | undefined];
    const [clients, totalClient] = await db.$transaction([
      db.client.findMany({
        where: { userId: session.id },
        skip: offset,
        take: limit,
        orderBy: {
          [column as string]: order,
        },
      }),
      db.client.count({ where: { userId: session.id } }),
    ]);
    const pageCount = Math.ceil(totalClient / limit);
    return NextResponse.json(
      {
        result: {
          data: clients,
          total: pageCount,
        },
        message: "สำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        result: {
          data: [],
          total: 0,
        },
        message: error,
      },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await currentUser();
  if (!session?.id)
    return NextResponse.json(
      { result: {}, message: "ไม่ได้รับอนุญาต" },
      { status: 401 }
    );
  try {
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
      taxId,
      address,
      district,
      email,
      isLP,
      province,
      subDistrict,
      tel,
      contactEmail,
      contactName,
      contactTel,
      zipCode,
    } = parsedBody.data;
    const result = await db.client.create({
      data: {
        name,
        taxId,
        address,
        district,
        email,
        isLP,
        province,
        subDistrict,
        tel,
        contactEmail,
        contactName,
        contactTel,
        zipCode,
        userId: session.id,
      },
    });
    return NextResponse.json({ result, message: "สำเร็จ" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ result: {}, message: error }, { status: 400 });
  }
}
