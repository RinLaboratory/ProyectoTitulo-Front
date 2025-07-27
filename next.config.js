import path from "node:path";
import { fileURLToPath } from "url";
import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
const jiti = createJiti(fileURLToPath(import.meta.url));
jiti("./src/env/env");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(import.meta.dirname, "styles")],
  },
  eslint: {
    dirs: ["pages", "components", "ducks", "redux"],
  },
};

export default config;
