"use client";

import { useRouter } from "next/navigation";
interface LoginButtonProps {
  message: string;
}
export default function LoginButton({ message }: LoginButtonProps) {
  const router = useRouter();
  return (
    <button className="underline" onClick={() => router.push("/auth/login")}>
      {message}
    </button>
  );
}
