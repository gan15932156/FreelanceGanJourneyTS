import Modal from "@/components/modal/modal";
import ServiceForm from "@/components/service-page/service-form";

export default function Page() {
  return (
    <Modal>
      <ServiceForm mode="add" isModalForm={true} />
    </Modal>
  );
}
