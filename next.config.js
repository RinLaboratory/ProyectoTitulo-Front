import path from "node:path";
import { fileURLToPath } from "node:url";
import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
const jiti = createJiti(fileURLToPath(import.meta.url));
jiti("./src/env/shared");

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(import.meta.dirname, "styles")],
  },
  eslint: {
    dirs: ["pages", "components", "ducks", "redux"],
  },
};

export default config;
