import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  shared: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    JWT_SECRET: z.string(),
    DOMAIN: z.string(),
    NEXT_PUBLIC_API_URL: z
      .string()
      .min(1)
      .url()
      .default("http://localhost:5001"),
    NEXT_PUBLIC_URL: z.string().min(1).url().default("http://localhost:3000"),
  },
  client: {},
  server: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    DOMAIN: process.env.DOMAIN,
  },
  skipValidation: true,
});
