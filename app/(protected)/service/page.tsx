import { auth } from "@/auth";
import ManageService from "@/components/service-page/manage-service-page";
export default async function Page() {
  const session = await auth();
  if (!session?.user.id) return null;
  return <ManageService />;
}
