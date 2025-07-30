"use server";

import { cookies } from "next/headers";
import { env } from "~/env/env";
import { fetcher } from "~/utils/fetcher";
import type { TSafeUser } from "~/utils/validators";

export async function getAccountInfo(): Promise<TSafeUser | undefined> {
  const cookieStore = await cookies();

  const isTokenAvailable = !!cookieStore.get("jwt")?.value;

  if (!isTokenAvailable) return;

  const userData = await fetcher<TSafeUser | undefined>(
    `${env.NEXT_PUBLIC_API_URL}/getCurrentUser`,
  );

  return userData;
}
