"use server";

import { cookies } from "next/headers";
import { env } from "~/env/shared";
import * as http from "~/utils/http";

export default async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const DOMAIN = env.DOMAIN;
  const response = await http.post<{ token: string }>(`/auth/login`, {
    email,
    password,
  });
  const jwt = response.token;
  const cookieStore = await cookies();

  cookieStore.set("jwt", jwt, {
    httpOnly: true,
    maxAge: 86400,
    ...(env.NODE_ENV === "development"
      ? { secure: false, sameSite: "lax", domain: DOMAIN }
      : { secure: true, sameSite: "strict", domain: DOMAIN }),
    path: "/",
  });
  return true;
}
