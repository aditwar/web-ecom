'use server'

import { revalidateTag } from "next/cache"

// REVALIDATE termasuk hanya bisa di server
export const tagRevalidate = async (tag: string) => {
  revalidateTag(tag);
};