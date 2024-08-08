"use client";

import { getQuotationPDF } from "@/actions/pdfGenerate";
import {
  useGetQuotationTokenWithDataQuery,
  useVerifyQuotationTokenQuery,
} from "@/redux/apiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";

const Page = ({ params }: { params: { token: string } }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [verifeidToken, setverifiedToken] = useState<boolean>(false);
  const {
    data: veritedToken,
    isLoading: verifyTokenLoading,
    isError: verifyTokenError,
  } = useVerifyQuotationTokenQuery(params.token ?? skipToken);
  // const {
  //   data: quotationData,
  //   isLoading: quotationLoading,
  //   isError: quotationError,
  // } = useGetQuotationTokenWithDataQuery(params.token, {
  //   skip: !verifeidToken,
  // });
  useEffect(() => {
    if (!verifyTokenLoading && !verifyTokenError && veritedToken?.result) {
      setverifiedToken(true);
    }
  }, [veritedToken]);
  useEffect(() => {
    const getPDF = async () => {
      try {
        const result = await getQuotationPDF(params.token);
        if (result) {
          setPdfUrl(result);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (verifeidToken) {
      getPDF();
    }
  }, [verifeidToken]);

  if (params.token == "" || !params.token)
    return (
      <div>
        <p>ไม่พบข้อมูล</p>
      </div>
    );
  if (verifyTokenLoading) return <div className="animate-spin">Loading...</div>;
  return verifeidToken ? (
    <div className="w-full flex flex-col gap-2 items-center justify-center">
      {pdfUrl && <iframe className="mx-auto w-3/4 aspect-video" src={pdfUrl} />}
    </div>
  ) : (
    <div>
      <p>ไม่พบข้อมูล</p>
    </div>
  );
};

export default Page;
