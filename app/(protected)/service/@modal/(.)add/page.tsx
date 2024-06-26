import { auth } from "@/auth";
import Modal from "@/components/modal/modal";
import ServiceForm from "@/components/service-page/service-form";

export default async function Page() {
  const session = await auth();
  return (
    <Modal>
      <ServiceForm mode="add" id={session?.user.id} isModalForm={true} />
    </Modal>
  );
}
