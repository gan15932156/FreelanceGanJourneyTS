"use client";

import { useRouter } from "next/navigation";

export default function RegisterButton() {
  const router = useRouter();
  return (
    <button className="underline" onClick={() => router.push("/auth/register")}>
      Sign up
    </button>
  );
}
