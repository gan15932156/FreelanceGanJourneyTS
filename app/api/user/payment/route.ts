import { UserPaymentSchemaWithoutExtras } from "@/schemas";
import { currentUser } from "@/lib/auth";
import db from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await currentUser();
  if (!session?.id)
    return NextResponse.json(
      { result: { data: {} }, message: "ไม่ได้รับอนุญาต" },
      { status: 401 }
    );
  try {
    const userPayment = await db.userPayment.findUnique({
      where: {
        userId: session.id,
      },
    });
    return NextResponse.json(
      { result: { data: userPayment }, message: "สำเร็จ" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { result: { data: {} }, message: error },
      { status: 400 }
    );
  }
}
export async function POST(req: NextRequest) {
  const session = await currentUser();
  if (!session?.id)
    return NextResponse.json(
      { result: { data: {} }, message: "ไม่ได้รับอนุญาต" },
      { status: 401 }
    );
  try {
    const body: unknown = await req.json();
    const parsedBody = UserPaymentSchemaWithoutExtras.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { result: { data: {} }, message: "ไม่สามารถบันทึกข้อมูลได้" },
        { status: 422 }
      );
    }
    const { desc } = parsedBody.data;
    const upsertUser = await db.userPayment.upsert({
      where: {
        userId: session.id,
      },
      update: {
        desc,
      },
      create: {
        desc,
        userId: session.id,
      },
    });
    return NextResponse.json(
      { result: { data: upsertUser }, message: "สำเร็จ" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { result: { data: {} }, message: error },
      { status: 400 }
    );
  }
}
