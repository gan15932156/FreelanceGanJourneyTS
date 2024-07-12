import { currentUser } from "@/lib/auth";
import db from "@/lib/prisma";
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
    if (!parsedBody.success) {
      return NextResponse.json(
        { result: {}, message: "ไม่สามารถบันทึกข้อมูลได้" },
        { status: 422 }
      );
    }
    const { services, isUseVAT, taxAmount, note, qId, clientId } =
      parsedBody.data;
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
        userId: session.id,
        clientId,
        quotationServices: {
          create: [...reqServices],
        },
      },
      include: {
        quotationServices: true, // Include all posts in the returned object
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
