import { cookies } from "next/headers";
import post from "../../../utils/post";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default async function handler(req: NextRequest) {
  const body = (await req.json()) as { email: string; password: string };
  const { email, password } = body;
  const BACKEND_URL = process.env.BACKEND_URL;
  const DOMAIN = process.env.DOMAIN;
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
  return NextResponse.json(response);
}
