import { auth } from "@/auth";
import SettingPage from "@/components/setting-page/setting-page";

export default async function Page() {
  const session = await auth();
  return (
    <SettingPage
      name={session?.user.name}
      email={session?.user.email}
      id={session?.user.id}
    />
  );
}
