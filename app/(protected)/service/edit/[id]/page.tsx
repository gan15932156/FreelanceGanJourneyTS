import { auth } from "@/auth";
import ServiceForm from "@/components/service-page/service-form";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user.id)
    return (
      <div>
        <p>ไม่พบข้อมูล</p>
      </div>
    );

  return <ServiceForm mode="edit" isModalForm={false} id={params.id} />;
}
