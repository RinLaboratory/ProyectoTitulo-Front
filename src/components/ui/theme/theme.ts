import { extendTheme } from "@chakra-ui/react";
import type { ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "system", // o "dark"
  useSystemColorMode: false,
};

interface TTheme {
  config: ThemeConfig;
  semanticTokens: {
    colors: Record<string, string | object>;
  };
}

export const theme = extendTheme({
  config,
  semanticTokens: {
    colors: {
      error: "red.500",
      success: "green.500",
      primary: {
        default: "red.500",
        _dark: "red.400",
      },
      secondary: {
        default: "red.800",
        _dark: "red.700",
      },
    },
  },
}) as TTheme;
