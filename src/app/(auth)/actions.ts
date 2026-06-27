"use server";

import { cookies } from "next/headers";
import { env } from "~/env/shared";
import * as http from "~/utils/http";

function shouldUseSecureCookie() {
  try {
    return new URL(env.NEXT_PUBLIC_URL).protocol === "https:";
  } catch {
    return env.NODE_ENV === "production";
  }
}

function getCookieDomain() {
  const domain = env.DOMAIN?.trim();
  if (!domain) return undefined;

  const normalizedDomain = domain.startsWith(".") ? domain.slice(1) : domain;
  const isLocalDomain =
    normalizedDomain === "localhost" ||
    normalizedDomain.endsWith(".localhost") ||
    normalizedDomain.includes(":") ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(normalizedDomain);

  return isLocalDomain ? undefined : domain;
}

export default async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const response = await http.post<{ token: string }>(`/auth/login`, {
      email,
      password,
    });
    const jwt = response.token;
    const cookieStore = await cookies();
    const secure = shouldUseSecureCookie();
    const domain = getCookieDomain();

    cookieStore.set("jwt", jwt, {
      httpOnly: true,
      maxAge: 86400,
      secure,
      sameSite: secure ? "strict" : "lax",
      ...(domain ? { domain } : {}),
      path: "/",
    });
    return true;
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err instanceof Error) {
        if (err.message.includes("invalid credentials")) {
          return false;
        }
      }
    }
    return undefined;
  }
}
