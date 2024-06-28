import db from "@/lib/prisma";
import { Service } from "@prisma/client";
import { notFound } from "next/navigation";

export async function getServiceById(
  id: string
): Promise<Partial<Service> | null> {
  const service = await db.service.findUnique({
    where: { id: id },
    select: {
      name: true,
      desc: true,
      note: true,
      price: true,
    },
  });
  if (!service) {
    notFound();
  }
  return service;
}
