import { auth } from "@/auth";
import ManageClient from "@/components/client-page/manage-client-page";
export default async function Page() {
  const session = await auth();
  if (!session?.user.id) return null;
  return <ManageClient />;
}
