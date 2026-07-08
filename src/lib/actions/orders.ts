'use server';

import db from "@/lib/db";

export async function userOrderExists(email: string, eventId: number) {
  return (
    (await db.order.findFirst({
      where: { author: { email }, eventId },
      select: { id: true },
    })) != null
  );
}
