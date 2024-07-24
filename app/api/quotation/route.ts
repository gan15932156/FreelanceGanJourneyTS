import { currentUser } from "@/lib/auth";
import db from "@/lib/prisma";
import { TQuotationDisplay } from "@/redux/types";
import { QuotationSchemaWithoutEdit } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await currentUser();
  if (!session?.id) {
    return NextResponse.json(
      {
        result: {},
        message: "ไม่ได้รับอนุญาต",
      },
      { status: 401 }
    );
  }
  try {
    const body: unknown = await req.json();
    const parsedBody = QuotationSchemaWithoutEdit.safeParse(body);
    console.log(JSON.stringify(parsedBody.error));
    if (!parsedBody.success) {
      return NextResponse.json(
        { result: {}, message: "ไม่สามารถบันทึกข้อมูลได้" },
        { status: 422 }
      );
    }
    const {
      services,
      isUseVAT,
      taxAmount,
      note,
      qId,
      clientId,
      dueDate,
      shipDate,
    } = parsedBody.data;
    const reqServices = services.map((service) => {
      const { name, price, desc, note, qty } = service;
      return { name, price, desc, note, qty };
    });
    // console.log(parsedBody);
    const result = await db.quotation.create({
      data: {
        isUseVAT,
        taxAmount,
        note,
        qId,
        dueDate,
        shipDate,
        userId: session.id,
        clientId,
        quotationServices: {
          create: [...reqServices],
        },
      },
      include: {
        quotationServices: true,
      },
    });
    return NextResponse.json(
      {
        result,
        message: "สำเร็จ",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ result: {}, message: error }, { status: 400 });
  }
}
export async function GET(req: NextRequest) {
  const session = await currentUser();
  if (!session)
    return NextResponse.json({
      result: { data: [], total: 0 },
      message: "ไม่ได้รับอนุญาต",
    });
  try {
    const searchParams = req.nextUrl.searchParams,
      offset = parseInt(searchParams.get("offset") as string) || 0,
      limit = parseInt(searchParams.get("limit") as string) || 2,
      sort = searchParams.get("sort");
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof TQuotationDisplay | undefined, "asc" | "desc" | undefined];
    const [quotations, totalQuotation] = await db.$transaction([
      db.quotation.findMany({
        where: { userId: session.id },
        include: {
          client: {
            select: {
              name: true,
            },
          },
          quotationServices: true,
        },
        skip: offset,
        take: limit,
        orderBy: {
          [column as string]: order,
        },
      }),
      db.quotation.count({ where: { userId: session.id } }),
    ]);
    const pageCount = Math.ceil(totalQuotation / limit);
    return NextResponse.json(
      {
        result: {
          data: quotations,
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
