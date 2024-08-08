"use server";

import { thSarabunFont } from "@/fonts/thsarabun-font";
import { thSarabunFontBold } from "@/fonts/THSarabunNewBold";
import db from "@/lib/prisma";
import {
  formatPhoneNumber,
  formatTaxId,
  getAddDays,
  getThaiCurrencyCall,
  getThaiCurrentFormatNosign,
} from "@/lib/utils2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const rowSpace = 8;
const firstColumnHeadingX = 20;
const secondColumnHeadingX = 130;

export async function getQuotationPDF(token: string) {
  if (!token) return null;

  const quotationData = await db.quotationNotifyToken.findUnique({
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
          client: true,
          quotationServices: true,
        },
      },
    },
  });

  if (!quotationData) return null;

  let total = 0;
  let vatAmount = 0;
  let taxAmount = 0;
  let netTotal = 0;

  const bodyData = quotationData.quotation.quotationServices.map((item) => {
    const netPrice = item.price * item.qty;
    total += netPrice;
    return {
      name: `${item.name}${item.desc ? `\n รายละเอียด: ${item.desc}` : ""}${
        item.note ? `\n หมายเหตุ: ${item.note}` : ""
      }`,
      qty: item.qty,
      price: getThaiCurrentFormatNosign(item.price),
      netPrice: netPrice !== 0 ? getThaiCurrentFormatNosign(netPrice) : "-",
    };
  });

  if (quotationData.quotation.isUseVAT) {
    vatAmount = total * 0.07;
  }

  if (
    quotationData.quotation.taxAmount &&
    quotationData.quotation.taxAmount !== 0
  ) {
    taxAmount = (total + vatAmount) * (quotationData.quotation.taxAmount / 100);
  }

  netTotal = total + vatAmount + taxAmount;

  const pdf = new jsPDF();
  pdf.setProperties({ title: "ใบเสนอราคา" });
  pdf.addFileToVFS("THSarabun.ttf", thSarabunFont);
  pdf.addFileToVFS("THSarabunBold.ttf", thSarabunFontBold);
  pdf.addFont("THSarabun.ttf", "THSarabun", "normal");
  pdf.addFont("THSarabunBold.ttf", "THSarabun", "bold");
  pdf.setFont("THSarabun", "bold");
  pdf.setFontSize(20);

  const pageWidth = pdf.internal.pageSize.getWidth();
  const titleText = "ใบเสนอราคา";
  const titleWidth = pdf.getTextDimensions(titleText).w;
  const titleXPosition = (pageWidth - titleWidth) / 2;

  pdf.text(titleText, titleXPosition, rowSpace * 2);

  // Quotation Issuer Section
  pdf.setFontSize(12);
  pdf.setFont("THSarabun", "bold");
  pdf.text("ผู้ออกใบเสนอราคา", firstColumnHeadingX, rowSpace * 5);

  pdf.setFontSize(14);
  pdf.setFont("THSarabun", "normal");
  pdf.text(
    quotationData.quotation.user.name ?? "",
    firstColumnHeadingX,
    rowSpace * 6
  );

  pdf.text(
    quotationData.quotation.user.accountInfo
      ? `${quotationData.quotation.user.accountInfo.address} ${quotationData.quotation.user.accountInfo.subDistrict} ${quotationData.quotation.user.accountInfo.district} ${quotationData.quotation.user.accountInfo.province} ${quotationData.quotation.user.accountInfo.zipCode}`
      : "",
    firstColumnHeadingX,
    rowSpace * 7
  );

  pdf.text(
    `เลขประจําตัวผู้เสียภาษี ${
      quotationData.quotation.user.accountInfo?.taxId
        ? formatTaxId(quotationData.quotation.user.accountInfo.taxId)
        : ""
    }`,
    firstColumnHeadingX,
    rowSpace * 8
  );

  pdf.text(
    `เบอร์ติดต่อ ${
      quotationData.quotation.user.accountInfo?.tel
        ? formatPhoneNumber(quotationData.quotation.user.accountInfo.tel)
        : ""
    }`,
    firstColumnHeadingX,
    rowSpace * 9
  );

  pdf.text(
    `อีเมล์ ${quotationData.quotation.user.email}`,
    firstColumnHeadingX,
    rowSpace * 10
  );

  // Date Section
  pdf.text(`เลขที่ ${quotationData.quotation.qId}`, 160, 10);
  pdf.text(
    `วันที่เอกสาร ${quotationData.quotation.createdAt.toLocaleDateString(
      "th-TH",
      { year: "numeric", month: "long", day: "numeric" }
    )}`,
    160,
    18
  );

  pdf.text(
    `วันที่ส่งงาน ${
      quotationData.quotation.shipDate
        ? quotationData.quotation.shipDate.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : ""
    }`,
    160,
    26
  );

  // Client Section
  pdf.setFontSize(12);
  pdf.setFont("THSarabun", "bold");
  pdf.text("เสนอต่อ", secondColumnHeadingX, rowSpace * 5);

  pdf.setFontSize(14);
  pdf.setFont("THSarabun", "normal");
  pdf.text(
    quotationData.quotation.client.name,
    secondColumnHeadingX,
    rowSpace * 6
  );

  pdf.text(
    quotationData.quotation.client
      ? `${quotationData.quotation.client.address} ${quotationData.quotation.client.subDistrict} ${quotationData.quotation.client.district} ${quotationData.quotation.client.province} ${quotationData.quotation.client.zipCode}`
      : "",
    secondColumnHeadingX,
    rowSpace * 7
  );

  pdf.text(
    `เลขประจําตัวผู้เสียภาษี ${
      quotationData.quotation.client.taxId
        ? formatTaxId(quotationData.quotation.client.taxId)
        : ""
    }`,
    secondColumnHeadingX,
    rowSpace * 8
  );

  pdf.text(
    `เบอร์ติดต่อ ${
      quotationData.quotation.client.tel
        ? formatPhoneNumber(quotationData.quotation.client.tel)
        : ""
    }`,
    secondColumnHeadingX,
    rowSpace * 9
  );

  pdf.text(
    `อีเมล์ ${quotationData.quotation.client.email}`,
    secondColumnHeadingX,
    rowSpace * 10
  );

  if (
    quotationData.quotation.client.isLP &&
    quotationData.quotation.client.contactName
  ) {
    pdf.text(
      `ผู้ติดต่อ ${quotationData.quotation.client.contactName} ${
        quotationData.quotation.client.contactTel
          ? formatPhoneNumber(quotationData.quotation.client.contactTel)
          : ""
      }`,
      secondColumnHeadingX,
      rowSpace * 11
    );

    if (quotationData.quotation.client.contactEmail) {
      pdf.text(
        quotationData.quotation.client.contactEmail,
        secondColumnHeadingX + 10,
        rowSpace * 12
      );
    }
  }

  // Draw Line Separator
  pdf.setLineWidth(0.2);
  pdf.setDrawColor(189, 195, 199);
  pdf.line(20, rowSpace * 12.5, 190, rowSpace * 12.5);

  // Footer Data
  const footerData = [
    ["", "", "ราคารวม", getThaiCurrentFormatNosign(total)],
    ...(quotationData.quotation.isUseVAT
      ? [["", "", "VAT 7%", getThaiCurrentFormatNosign(vatAmount)]]
      : []),
    ...(quotationData.quotation.taxAmount &&
    quotationData.quotation.taxAmount !== 0
      ? [
          [
            "",
            "",
            `ภาษีหัก ณ ที่จ่าย ${quotationData.quotation.taxAmount}`,
            getThaiCurrentFormatNosign(taxAmount),
          ],
        ]
      : []),
    [
      getThaiCurrencyCall(netTotal),
      "",
      `รวมทั้งสิ้น`,
      getThaiCurrentFormatNosign(netTotal),
    ],
  ];

  let tableHeight;

  autoTable(pdf, {
    columnStyles: {
      qty: { cellWidth: 10, halign: "right", fontSize: 14 },
      price: { cellWidth: 30, halign: "right", fontSize: 14 },
      netPrice: { cellWidth: 40, halign: "right", fontSize: 14 },
      name: { fontSize: 14 },
    },
    styles: {
      font: "THSarabun",
      fontStyle: "normal",
    },
    headStyles: {
      fontStyle: "bold",
      halign: "center",
      fillColor: [212, 212, 212],
      textColor: [0, 0, 0],
    },
    footStyles: {
      fillColor: [212, 212, 212],
      textColor: [0, 0, 0],
      fontSize: 12,
      cellPadding: { bottom: 1, top: 1, left: 0, right: 2 },
      fontStyle: "bold",
      halign: "right",
    },
    showFoot: "lastPage",
    startY: rowSpace * 13,
    columns: [
      { header: "บริการ", dataKey: "name" },
      { header: "หน่วย", dataKey: "qty" },
      { header: "ราคาต่อหน่วย", dataKey: "price" },
      { header: "จำนวนเงิน(บาท)", dataKey: "netPrice" },
    ],
    body: [...bodyData],
    foot: [...footerData],
    didDrawPage: (data) => {
      tableHeight = data.cursor?.y;
    },
  });

  // Payment Info and Notes
  pdf.text(
    `การชำระเงิน ${quotationData.quotation.user.paymentInfo?.desc}`,
    firstColumnHeadingX,
    tableHeight ? tableHeight + 10 : 20
  );

  pdf.text(
    `หมายเหตุ ยืนยันราคาภายวันที่ ${
      quotationData.quotation.createdAt
        ? getAddDays(
            new Date(quotationData.quotation.createdAt),
            quotationData.quotation.dueDate
          ).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : ""
    }${
      quotationData.quotation.note ? "\n" + quotationData.quotation.note : ""
    }`,
    firstColumnHeadingX,
    tableHeight ? tableHeight + 20 : 30
  );

  return pdf.output("datauristring");
}
