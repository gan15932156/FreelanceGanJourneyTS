import { auth } from "@/auth";
import ClientForm from "@/components/client-page/client-form";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user.id)
    return (
      <div>
        <p>ไม่พบข้อมูล</p>
      </div>
    );
  return <ClientForm mode="edit" isModalForm={false} id={params.id} />;
}
