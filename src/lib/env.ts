import "server-only";
import { z } from "zod";
import { assertProductionConfiguration } from "@/lib/security/database-target";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url(),
  MONGODB_URI: z.string().min(1),
  MONGODB_DB: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  BOOTSTRAP_ADMIN_EMAIL: z.string().email().optional(),
  TRUSTED_PROXY_HOPS: z
    .enum(["0", "1", "2", "3", "4", "5"])
    .default("0")
    .transform((value) => Number(value)),
});

export type ServerEnv = z.infer<typeof envSchema>;

let cached: ServerEnv | null = null;

export function getEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid environment: ${parsed.error.message}`);
  }
  if (process.env.PEACOCK_ENV === "production") {
    assertProductionConfiguration({
      appUrl: parsed.data.APP_URL,
      uri: parsed.data.MONGODB_URI,
      dbName: parsed.data.MONGODB_DB,
      authSecret: parsed.data.AUTH_SECRET,
    });
  }
  cached = parsed.data;
  return cached;
}
