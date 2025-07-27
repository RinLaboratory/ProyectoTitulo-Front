import "~/styles/globals.scss";
import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import NavBar from "~/components/NavBar/NavBar";

const blockedPages = new Set([
  "/login",
  "/signup",
  "/logout",
  "/reset-password",
  "/forgot-password",
]);

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = (await cookies()).get("next-url")?.value ?? "";

  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          {!blockedPages.has(pathname) && <NavBar />}
          <div className="super">
            <div className="main">{children}</div>
          </div>
        </ChakraProvider>
      </body>
    </html>
  );
}
