import { auth } from "@/auth";
import ManageQuotation from "@/components/quotation-page/manage-quotation";
import React from "react";

export default async function Page() {
  const session = await auth();
  if (!session?.user.id) return null;
  return <ManageQuotation />;
}
