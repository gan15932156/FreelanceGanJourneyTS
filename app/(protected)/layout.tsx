import MobileNav from "@/components/main-layout/mobileNav";
import Sidebar from "@/components/main-layout/sidebar";
import React from "react";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <MobileNav />
        {children}
      </div>
    </div>
  );
}
