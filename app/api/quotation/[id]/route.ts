import { currentUser } from "@/lib/auth";
import db from "@/lib/prisma";
import { QuotationRequestSchema, StatusEnumSchema } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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
          message: "ไม่พบข้อมูล",
        },
        { status: 401 }
      );
    }
    const quotation = await db.quotation.findUnique({
      where: { id },
      include: {
        user: {
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
            paymentInfo: {
              select: {
                desc: true,
              },
            },
          },
        },
        quotationServices: true,
      },
    });
    return NextResponse.json(
      {
        result: quotation,
        message: "สำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
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
    const parsedBody = QuotationRequestSchema.safeParse(body);
    if (!parsedBody.success) {
      console.log(JSON.stringify(parsedBody.error));
      return NextResponse.json(
        { result: {}, message: "ไม่สามารถบันทึกข้อมูลได้" },
        { status: 422 }
      );
    }
    const {
      update: { services, id: quptationId, createdAt, ...restUpdate },
      delete: deleteServices,
      add: createServices,
    } = parsedBody.data;
    const updateServices =
      services?.map(({ createdAt, qId, updatedAt, isEdit, id, ...rest }) => ({
        data: rest,
        where: { id },
      })) || [];
    const addServices = createServices?.map(
      ({ name, price, desc, note, qty }) => ({ name, price, desc, note, qty })
    );
    const deleteService2 = deleteServices?.map((f) => ({ id: f })) || [];

    const [isHaveToken, quotationStatus] = await db.$transaction([
      db.quotationNotifyToken.findUnique({
        where: {
          quotationId: id,
        },
      }),
      db.quotation.findUnique({
        where: {
          id,
        },
        select: {
          status: true,
        },
      }),
    ]);
    if (
      isHaveToken &&
      quotationStatus?.status.toString() == StatusEnumSchema.enum.EDIT
    ) {
      const [service] = await db.$transaction([
        db.quotation.update({
          where: {
            id,
          },
          data: {
            ...restUpdate,
            status: StatusEnumSchema.enum.DRAFT,
            quotationServices: {
              ...(updateServices.length > 0 && { updateMany: updateServices }),
              ...(addServices != undefined &&
                addServices.length > 0 && { create: addServices }),
              ...(deleteService2 != undefined &&
                deleteService2.length > 0 && { deleteMany: deleteService2 }),
            },
          },
        }),
        db.quotationNotifyToken.delete({ where: { quotationId: id } }),
      ]);
      return NextResponse.json(
        {
          result: service,
          message: "สำเร็จ",
        },
        { status: 200 }
      );
    } else {
      const service = await db.quotation.update({
        where: {
          id,
        },
        data: {
          ...restUpdate,
          quotationServices: {
            ...(updateServices.length > 0 && { updateMany: updateServices }),
            ...(addServices != undefined &&
              addServices.length > 0 && { create: addServices }),
            ...(deleteService2 != undefined &&
              deleteService2.length > 0 && { deleteMany: deleteService2 }),
          },
        },
      });
      return NextResponse.json(
        {
          result: service,
          message: "สำเร็จ",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
