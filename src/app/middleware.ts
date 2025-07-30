import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { env } from "~/env/shared";

const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/logout",
  "/reset-password",
  "/reset-password/(.*)",
  "/forgot-password",
  "/_next", // no bloquear assets
];

function isPublic(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => new RegExp(`^${route}$`).test(pathname));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Guardar pathname actual para layout
  const res = NextResponse.next();
  res.cookies.set("next-url", pathname);

  if (isPublic(pathname)) {
    return res;
  }

  const token = req.cookies.get("jwt")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    verify(token, env.JWT_SECRET);
    return res;
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|fonts|images|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
