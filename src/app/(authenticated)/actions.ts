"use server";

import { cookies } from "next/headers";
import type { TSafeUser } from "~/utils/validators";
import * as http from "~/utils/http";

export async function getAccountInfo(): Promise<TSafeUser | undefined> {
  const cookieStore = await cookies();

  const isTokenAvailable = !!cookieStore.get("jwt")?.value;

  if (!isTokenAvailable) return;

  try {
    const userData = await http.get<TSafeUser | undefined>(`/users/current`);
    return userData;
  } catch {
    return undefined;
  }
}
