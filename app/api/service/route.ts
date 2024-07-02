import { currentUser } from "@/lib/auth";
import db from "@/lib/prisma";
import { IService } from "@/redux/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // ## protected api route ##
  const session = await currentUser();
  if (!session)
    return NextResponse.json(
      { result: { data: [], total: 0 }, message: "ไม่ได้รับอนุญาติ" },
      { status: 401 }
    );
  try {
    const searchParams = req.nextUrl.searchParams,
      page = parseInt(searchParams.get("page") as string) || 1,
      offset = parseInt(searchParams.get("offset") as string),
      limit = parseInt(searchParams.get("limit") as string) || 2,
      sort = searchParams.get("sort");

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof IService | undefined, "asc" | "desc" | undefined];
    const [services, totalService] = await db.$transaction([
      db.service.findMany({
        where: { userId: session.id },
        skip: offset,
        take: limit,
        orderBy: {
          [column as string]: order,
        },
      }),
      db.service.count({ where: { userId: session.id } }),
    ]);
    const pageCount = Math.ceil(totalService / limit);

    return NextResponse.json(
      {
        result: {
          data: services,
          total: pageCount,
        },
        message: "สำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        result: {
          data: [],
          total: 0,
        },
        message: error,
      },
      { status: 400 }
    );
  }
}
export async function POST(req: NextRequest) {
  const session = await currentUser();
  if (!session)
    return NextResponse.json(
      { result: {}, message: "ไม่ได้รับอนุญาติ" },
      { status: 401 }
    );
  try {
    const body = await req.json();
    if (session.id) {
      const result = await db.service.create({
        data: { ...body, userId: session.id },
      });
      return NextResponse.json({ result, message: "สำเร็จ" }, { status: 201 });
    }
    return NextResponse.json(
      { result: {}, message: "ไม่สามารถบันทึกข้อมูลได้" },
      { status: 400 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ result: {}, message: error }, { status: 400 });
  }
}
