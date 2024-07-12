"use client";

import { useGetAllClientByIdQuery } from "@/redux/apiSlice";
import { IssetRequireData } from "./quotation-form";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import QuotationInfoItem from "./quotation-info-item";
import { TClientSchema } from "@/schemas";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { formatPhoneNumber } from "@/lib/utils2";

interface Props {
  mode: "edit" | "add";
  grid_gap: string;
  setIssetData: React.Dispatch<React.SetStateAction<IssetRequireData>>;
}
interface MockClient {
  id: string;
  name: string;
  tel: string;
  email: string;
  address: string;
  taxId: string;
  contactInfo: string;
}
const ClientInfoSelectionbox: React.FC<Props> = ({
  mode,
  grid_gap,
  setIssetData,
}: Props) => {
  const [mockClientData, setMockClientData] = useState<MockClient>();
  const {
    data: clientData,
    isLoading: clientLoading,
    isError: clientError,
  } = useGetAllClientByIdQuery();
  const handleOnChange = (e: string) => {
    const data = clientData?.result.find((f) => f.id == e);
    if (data != undefined && data.id != undefined) {
      const id = data.id;
      const address =
        data.address +
        " " +
        data.subDistrict +
        " " +
        data.district +
        " " +
        data.province +
        " " +
        data.zipCode;
      const contact = `${
        data.contactName != undefined ? data.contactName : ""
      } ${
        data.contactTel != undefined ? formatPhoneNumber(data.contactTel) : ""
      } ${data.contactEmail != undefined ? data.contactEmail : ""}`;
      setMockClientData({
        id,
        name: data.name,
        tel: data.tel || "",
        email: data.email || "",
        address,
        contactInfo: contact,
        taxId: data.taxId,
      });
      setIssetData((prev) => ({
        ...prev,
        clientId: id,
      }));
    }
  };
  useEffect(() => {
    if (mode == "add" && clientData?.result && clientData.result.length > 0) {
      setIssetData((prev) => ({
        ...prev,
        client: true,
      }));
    }
  }, [clientData]);
  if (mode == "add" && clientLoading) return <div>Loading...</div>;
  if (!clientData?.result)
    return (
      <div className="col-span-4">
        <p>ไม่พบข้อมูล ไม่สามารถสร้างใบเสนอราคาได้</p>
      </div>
    );
  return mode == "add" ? (
    clientData.result.length > 0 && !clientLoading && !clientError ? (
      <>
        <div className="col-span-6 ">
          <Badge variant={"secondary"} className="max-w-fit">
            ข้อมูลลูกค้า
          </Badge>
        </div>
        {clientData.result.length > 0 && (
          <div className="col-span-6 my-4">
            <Select value={mockClientData?.id} onValueChange={handleOnChange}>
              <SelectTrigger className="w-1/4">
                <SelectValue placeholder="เลือกลูกค้า" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>ลูกค้า</SelectLabel>
                  {clientData.result.map((client: TClientSchema) => (
                    <SelectItem key={client.id} value={client.id as string}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        <QuotationInfoItem
          colSpan={2}
          headingText="ชื่อลูกค้า"
          content={mockClientData?.name || ""}
          gridGap={grid_gap}
        />
        <QuotationInfoItem
          colSpan={4}
          headingText="เลขผู้เสียภาษี"
          content={mockClientData?.taxId || ""}
          gridGap={grid_gap}
        />
        <QuotationInfoItem
          colSpan={6}
          colSpanContent={"col-[2_/_span_3]"}
          headingText="ที่อยู่"
          content={mockClientData?.address || ""}
          gridGap={grid_gap}
        />
        <QuotationInfoItem
          colSpan={2}
          headingText="เบอร์ติดต่อ"
          content={
            mockClientData?.tel != undefined
              ? formatPhoneNumber(mockClientData?.tel)
              : ""
          }
          gridGap={grid_gap}
        />
        <QuotationInfoItem
          colSpan={4}
          headingText="อีเมล์"
          content={mockClientData?.email || ""}
          gridGap={grid_gap}
        />
        <QuotationInfoItem
          colSpan={2}
          headingText="ผู้ติดต่อ"
          content={mockClientData?.contactInfo || ""}
          gridGap={grid_gap}
        />
      </>
    ) : (
      <>
        <div className="col-span-6 mb-4">
          <Badge variant={"secondary"} className="max-w-fit">
            ข้อมูลลูกค้า
          </Badge>
        </div>
        <p>ไม่พบข้อมูล</p>
      </>
    )
  ) : (
    <div>let edit</div>
  );
};

export default ClientInfoSelectionbox;
