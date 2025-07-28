import "~/styles/globals.scss";
import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}
