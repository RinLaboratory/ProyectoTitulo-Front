"use server";

import { cookies } from "next/headers";
import { fetcher } from "~/utils/fetcher";
import type { TSafeUser } from "~/utils/validators";

export async function getAccountInfo(): Promise<TSafeUser | undefined> {
  const cookieStore = await cookies();

  const isTokenAvailable = !!cookieStore.get("jwt")?.value;

  if (!isTokenAvailable) return;

  const userData = await fetcher<TSafeUser | undefined>(`/getCurrentUser`);

  return userData;
}
