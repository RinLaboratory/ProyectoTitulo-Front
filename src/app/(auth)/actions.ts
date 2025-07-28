"use server";

import { cookies } from "next/headers";
import { env } from "~/env/env";
import post from "~/utils/post";

export default async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const BACKEND_URL = env.NEXT_PUBLIC_API_URL;
  const DOMAIN = env.DOMAIN;
  const response = await post(`${BACKEND_URL}/login`, {
    email,
    password,
  });
  if (response.status === "success") {
    const jwt = response.token ?? "";
    (await cookies()).set("jwt", jwt, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 86400,
      domain: DOMAIN,
      path: "/",
    });
  }
  return response;
}
