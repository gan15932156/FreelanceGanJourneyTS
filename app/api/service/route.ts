import { currentUser } from "@/lib/auth";
import db from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // ## protected api route ##
  const session = await currentUser();
  if (!session)
    return NextResponse.json({ message: "ไม่ได้รับอนุญาติ" }, { status: 401 });
  try {
    const searchParams = req.nextUrl.searchParams;
    // https://www.prisma.io/docs/orm/prisma-client/queries/pagination#cursor-based-pagination
    // https://redux-toolkit.js.org/rtk-query/usage/pagination
    // https://tanstack.com/table/latest/docs/framework/react/examples/pagination-controlled
    // https://medium.com/@clee080/how-to-do-server-side-pagination-column-filtering-and-sorting-with-tanstack-react-table-and-react-7400a5604ff2

    const page =
        searchParams.get("page") != null
          ? parseInt(searchParams.get("page") || "1")
          : 1,
      limit = 8,
      lastCursor = searchParams.get("lastCursor"),
      skip = searchParams.get("skip")
        ? parseInt(searchParams.get("skip") as string)
        : 1,
      direction = searchParams.get("direction") || "f";
    const total = await db.service.count({
      where: {
        userId: session.id,
      },
    });
    if (direction == "f") {
      let result2 = await db.service.findMany({
        take: limit,
        ...(lastCursor != "" && {
          skip,
          cursor: {
            id: lastCursor as string,
          },
        }),
        where: {
          userId: session.id,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
          // ...orderBy,
        ],
      });

      return NextResponse.json(
        {
          result: {
            data: result2,
            page,
            limit,
            total,
            total_filtered: total,
          },
          message: "สำเร็จ",
        },
        { status: 200 }
      );
    } else {
      let result2 = await db.service.findMany({
        take: limit,
        ...(skip != 0 && { skip }),
        where: {
          userId: session.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(
        {
          result: {
            data: result2,
            page,
            limit,
            total,
            total_filtered: total,
          },
          message: "สำเร็จ",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
export async function POST(req: NextRequest) {
  const session = await currentUser();
  if (!session)
    return NextResponse.json({ message: "ไม่ได้รับอนุญาติ" }, { status: 401 });
  try {
    const body = await req.json();
    if (body.userId) {
      const result = await db.service.create({ data: body });
      return NextResponse.json({ result, message: "สำเร็จ" }, { status: 201 });
    }
    return NextResponse.json(
      { message: "ไม่สามารถบันทึกข้อมูลได้" },
      { status: 400 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
