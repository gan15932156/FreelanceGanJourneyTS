import ClientForm from "@/components/client-page/client-form";
import Modal from "@/components/modal/modal";

export default function Page() {
  return (
    <Modal>
      <ClientForm mode="add" isModalForm={true} />
    </Modal>
  );
}
