import { auth } from "@/auth";
import ClientForm from "@/components/client-page/client-form";
import Modal from "@/components/modal/modal";
export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user.id)
    return (
      <div>
        <p>ไม่พบข้อมูล</p>
      </div>
    );
  return (
    <Modal>
      <ClientForm mode="edit" isModalForm={true} id={params.id} />
    </Modal>
  );
}
