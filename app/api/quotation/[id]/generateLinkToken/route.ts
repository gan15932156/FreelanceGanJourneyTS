import { currentUser } from "@/lib/auth";
import db from "@/lib/prisma";
import { getAddDays } from "@/lib/utils2";
import { StatusEnumSchema } from "@/schemas";
import { nanoid } from "@reduxjs/toolkit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await currentUser();
  if (!session?.id)
    return NextResponse.json(
      { result: "", message: "ไม่ได้รับอนุญาต" },
      { status: 401 }
    );
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { result: "", message: "ไม่สามารถสร้างโทเค็นได้" },
        { status: 401 }
      );
    }
    const quotationData = await db.quotation.findUnique({
      where: {
        id,
      },
    });
    if (!quotationData) {
      return NextResponse.json(
        { result: "", message: "ไม่สามารถสร้างโทเค็นได้" },
        { status: 404 }
      );
    }
    // const expiresAt = getAddDays(
    //   new Date(quotationData.createdAt),
    //   quotationData.dueDate
    // );
    const expiresAt =
      quotationData.shipDate != undefined
        ? new Date(quotationData.shipDate)
        : getAddDays(new Date(quotationData.createdAt), quotationData.dueDate);
    const [token, updatedQuotation] = await db.$transaction([
      db.quotationNotifyToken.create({
        data: {
          expiresAt,
          token: nanoid(),
          quotationId: id,
        },
      }),
      db.quotation.update({
        where: {
          id,
        },
        data: {
          status: StatusEnumSchema.enum.SENT,
        },
      }),
    ]);
    return NextResponse.json(
      { result: token.token, message: "สำเร็จ" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
