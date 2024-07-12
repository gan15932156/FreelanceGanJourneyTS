import { currentUser } from "@/lib/auth";
import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await currentUser();
  if (!session)
    return NextResponse.json({
      result: [],
      message: "ไม่ได้รับอนุญาต",
    });
  try {
    const data = await db.service.findMany({
      where: {
        userId: session.id,
      },
      select: {
        id: true,
        desc: true,
        name: true,
        note: true,
        price: true,
        userId: true,
      },
    });
    return NextResponse.json(
      {
        result: data,
        message: "สำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error get clients data:", error);
    return NextResponse.json(
      {
        result: [],
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
