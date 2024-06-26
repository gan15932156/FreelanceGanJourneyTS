import { auth } from "@/auth";
import ManageService from "@/components/service-page/manage-service-page";

export default async function Page() {
  const session = await auth();
  return <ManageService id={session?.user.id} />;
}
