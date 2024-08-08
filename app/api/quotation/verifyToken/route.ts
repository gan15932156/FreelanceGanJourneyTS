import { currentUser } from "@/lib/auth";
import db from "@/lib/prisma";
import { QuotationVerifyTokenSchema } from "@/schemas";
import { isAfter } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await currentUser();
  if (!session?.id) {
    return NextResponse.json(
      {
        result: false,
        message: "ไม่ได้รับอนุญาต",
      },
      { status: 401 }
    );
  }
  try {
    const body: unknown = await req.json();
    const parsedBody = QuotationVerifyTokenSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { result: false, message: "ไม่พบโทเค็น" },
        { status: 422 }
      );
    }
    const tokenResult = await db.quotationNotifyToken.findUnique({
      where: { token: parsedBody.data.token },
    });
    if (!tokenResult || isAfter(new Date(), new Date(tokenResult.expiresAt))) {
      return NextResponse.json(
        {
          result: false,
          message: "สำเร็จ",
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        result: true,
        message: "สำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { result: false, message: error },
      { status: 400 }
    );
  }
}
