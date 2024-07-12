import { currentUser } from "@/lib/auth";
import db from "@/lib/prisma";
import { formatDate } from "@/lib/utils2";
import { NextResponse } from "next/server";

export async function GET() {
  // ## protected api route ##
  const session = await currentUser();
  if (!session) {
    return NextResponse.json(
      { result: "", message: "ไม่ได้รับอนุญาต" },
      { status: 401 }
    );
  }
  try {
    const quotationCount = await db.quotation.count();
    const date: Date = new Date();
    const formattedDate = formatDate(date);
    const [day, month, year] = formattedDate.split(" ");
    const qId: string = `QUT${year}${month}${day}${quotationCount + 1}_1`;
    return NextResponse.json(
      {
        result: qId,
        message: "สำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating quotation ID:", error);
    return NextResponse.json(
      {
        result: "",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
