import ClientForm from "@/components/client-page/client-form";
export default function Page() {
  return (
    <>
      <ClientForm mode="add" isModalForm={false} />
    </>
  );
}
