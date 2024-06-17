import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return (
    <div>
      <pre>{JSON.stringify(session)}</pre>
    </div>
  );
}
