import { currentUser } from "@/lib/auth";
import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await currentUser();
  if (!session?.id)
    return NextResponse.json(
      { result: {}, message: "ไม่ได้รับอนุญาต" },
      { status: 401 }
    );
  try {
    const userInfo = await db.user.findUnique({
      where: {
        id: session.id,
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
    return NextResponse.json(
      {
        result: userInfo,
        message: "สำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ result: {}, message: error }, { status: 400 });
  }
}
