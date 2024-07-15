import { auth } from "@/auth";
import QuotationForm from "@/components/quotation-page/quotation-form";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user.id)
    return (
      <div>
        <p>ไม่พบข้อมูล</p>
      </div>
    );
  return <QuotationForm mode="edit" id={params.id} />;
}
