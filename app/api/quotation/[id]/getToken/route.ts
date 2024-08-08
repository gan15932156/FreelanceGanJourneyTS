import { currentUser } from "@/lib/auth";
import db from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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
        {
          result: "",
          message: "ไม่พบข้อมูล",
        },
        { status: 404 }
      );
    }
    const token = await db.quotationNotifyToken.findUnique({
      where: {
        quotationId: id,
      },
    });
    if (!token) {
      return NextResponse.json(
        { result: "", message: "ไม่พบข้อมูล" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { result: token.token, message: "สำเร็จ" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
