import { currentUser } from "@/lib/auth";
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
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await currentUser();
  if (!session)
    return NextResponse.json({ message: "ไม่ได้รับอนุญาติ" }, { status: 401 });
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
    const body = await req.json();
    const service = await db.service.update({
      where: {
        id,
      },
      data: { ...body },
    });
    return NextResponse.json(
      {
        result: {
          data: service,
        },
        message: "สำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
