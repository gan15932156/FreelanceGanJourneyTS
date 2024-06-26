import { auth } from "@/auth";
import ServiceForm from "@/components/service-page/service-form";

export default async function Page() {
  const session = await auth();
  return (
    <>
      <ServiceForm mode="add" id={session?.user.id} isModalForm={false} />
    </>
  );
}
