import db from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // ## protected api route ##
  // const session = await currentUser();
  // if (!session)
  //   return NextResponse.json({ message: "ไม่พบข้อมูล" }, { status: 401 });
  try {
    const result = await db.service.findMany({
      where: {
        userId: params.id,
      },
    });
    return NextResponse.json(
      {
        result: {
          data: result,
        },
        message: "สำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
