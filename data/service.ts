import db from "@/lib/prisma";
import { Service } from "@prisma/client";

export async function getServiceById(
  id: string
): Promise<Partial<Service> | null> {
  try {
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
      return null;
    }
    return service;
  } catch (error) {
    return null;
  }
}
