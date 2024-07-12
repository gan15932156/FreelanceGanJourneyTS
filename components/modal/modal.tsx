"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Dialog, DialogContent, DialogOverlay } from "../ui/dialog";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const closeModal = () => {
    router.back();
  };
  const handleOpenChange = () => {};
  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={closeModal}>
      <DialogOverlay>
        <DialogContent className="overflow-y-scroll max-h-screen">
          {children}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
