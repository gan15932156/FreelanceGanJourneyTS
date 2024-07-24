import { currentUser } from "@/lib/auth";
import db from "@/lib/prisma";
import { StatusEnumSchema, StatusEnumSchemaObj } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await currentUser();
  if (!session?.id)
    return NextResponse.json(
      { result: {}, message: "ไม่ได้รับอนุญาต" },
      { status: 401 }
    );
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
    const body: unknown = await req.json();
    const parsedBody = StatusEnumSchemaObj.safeParse(body);
    // if change status == QS2
    // edit signDate

    if (!parsedBody.success) {
      return NextResponse.json(
        { result: {}, message: "ไม่สามารถบันทึกข้อมูลได้" },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { result: {}, message: "ไม่สามารถบันทึกข้อมูลได้" },
      { status: 200 }
    );
    // if (parsedBody.data.status == StatusEnumSchema.enum.QS2) {
    //   const updatedStatus = await db.quotation.update({
    //     where: {
    //       id,
    //     },
    //     data: {
    //       status: StatusEnumSchema.enum.QS2,
    //       signDate: new Date(),
    //     },
    //   });
    //   return NextResponse.json(
    //     {
    //       result: updatedStatus,
    //       message: "สำเร็จ",
    //     },
    //     { status: 200 }
    //   );
    // } else if (parsedBody.data.status == StatusEnumSchema.enum.QS4) {
    //   const updatedStatus = await db.quotation.update({
    //     where: {
    //       id,
    //     },
    //     data: {
    //       status: StatusEnumSchema.enum.QS4,
    //     },
    //   });
    //   return NextResponse.json(
    //     {
    //       result: updatedStatus,
    //       message: "สำเร็จ",
    //     },
    //     { status: 200 }
    //   );
    // } else {
    //   return NextResponse.json(
    //     { result: {}, message: "ไม่สามารถบันทึกข้อมูลได้" },
    //     { status: 400 }
    //   );
    // }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
