import { auth } from "@/auth";
import SettingPage from "@/components/setting-page/setting-page";

export default async function Page() {
  const session = await auth();
  return <SettingPage id={session?.user.id} />;
}
