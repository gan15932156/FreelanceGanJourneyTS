import db from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    if (!token) {
      return NextResponse.json(
        {
          result: {},
          message: "ไม่พบข้อมูล",
        },
        { status: 404 }
      );
    }
    const tokenWithQuotationData = await db.quotationNotifyToken.findUnique({
      where: { token },
      include: {
        quotation: {
          select: {
            id: true,
            qId: true,
            clientId: true,
            createdAt: true,
            updatedAt: true,
            dueDate: true,
            isUseVAT: true,
            note: true,
            shipDate: true,
            signDate: true,
            status: true,
            taxAmount: true,
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
        },
      },
    });
    return NextResponse.json(
      { result: tokenWithQuotationData, message: "สำเร็จ" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
