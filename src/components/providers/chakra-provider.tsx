"use client";

import {
  ChakraProvider as BaseChakraProvider,
  ColorModeScript,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { theme } from "../ui/theme/theme";

export function ChakraProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BaseChakraProvider theme={theme}>{children}</BaseChakraProvider>
    </>
  );
}
