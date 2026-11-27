import { readFileSync } from "node:fs";
import { parse } from "dotenv";
import { MongoClient } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import { TEST_MEDIA_NAMESPACE, writableMediaNamespace } from "../src/lib/media/policy";
import {
  DATABASE_NAMES,
  assertNamedEnvironment,
  redactConnectionError,
} from "../src/lib/security/database-target";

const STAGING_FILE = ".env.staging.local";

export type StagingConfig = {
  uri: string;
  dbName: string;
  appUrl: string;
  authSecret: string;
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  trustedProxyHops: string;
};

export function loadStagingConfig(file = STAGING_FILE): StagingConfig {
  if (file !== STAGING_FILE) {
    throw new Error("Staging commands only read .env.staging.local.");
  }
  let text = "";
  try {
    text = readFileSync(file, "utf8");
  } catch {
    throw new Error(
      "Missing .env.staging.local. Copy .env.staging.example and fill it with staging credentials. .env.local is not used.",
    );
  }
  const parsed = parse(text);
  const uri = parsed.MONGODB_URI ?? "";
  const dbName = parsed.MONGODB_DB ?? "";
  assertNamedEnvironment("staging", uri, dbName);
  if (parsed.PEACOCK_ENV && parsed.PEACOCK_ENV !== "staging") {
    throw new Error("PEACOCK_ENV in .env.staging.local must be staging.");
  }
  if (!parsed.APP_URL || !parsed.AUTH_SECRET || parsed.AUTH_SECRET.length < 32) {
    throw new Error("Staging APP_URL and a 32-character AUTH_SECRET are required.");
  }
  if (writableMediaNamespace("staging") !== TEST_MEDIA_NAMESPACE) {
    throw new Error("Staging uploads must stay in the peacock-test namespace.");
  }
  if (!parsed.CLOUDINARY_CLOUD_NAME || /REPLACE|TODO|YOUR_|example/i.test(parsed.CLOUDINARY_CLOUD_NAME)) {
    throw new Error("Staging Cloudinary cloud name is not configured.");
  }
  if (!parsed.CLOUDINARY_API_KEY || !parsed.CLOUDINARY_API_SECRET || /REPLACE|TODO/i.test(parsed.CLOUDINARY_API_KEY)) {
    throw new Error("Staging Cloudinary API key and secret are required.");
  }
  return {
    uri,
    dbName,
    appUrl: parsed.APP_URL,
    authSecret: parsed.AUTH_SECRET,
    cloudName: parsed.CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: parsed.CLOUDINARY_API_KEY,
    apiSecret: parsed.CLOUDINARY_API_SECRET,
    trustedProxyHops: parsed.TRUSTED_PROXY_HOPS ?? "0",
  };
}

export async function pingStagingDatabase(config: StagingConfig) {
  if (config.dbName !== DATABASE_NAMES.staging) {
    throw new Error("Refusing to connect because the database is not peacock_beach_staging.");
  }
  const client = new MongoClient(config.uri, { serverSelectionTimeoutMS: 8000 });
  try {
    await client.connect();
    const db = client.db(config.dbName);
    await db.command({ ping: 1 });
    return db.databaseName;
  } catch (error) {
    throw new Error(`MongoDB ping failed: ${redactConnectionError(error)}`);
  } finally {
    await client.close().catch(() => undefined);
  }
}

export async function pingStagingCloudinary(config: StagingConfig) {
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
  });
  try {
    const result = await cloudinary.api.ping();
    return result.status === "ok" ? "ok" : "unexpected";
  } catch (error) {
    const detail =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error && "error" in error
          ? String((error as { error?: { message?: string } }).error?.message ?? "rejected")
          : "rejected";
    const safe = detail.replace(/mongodb(?:\+srv)?:\/\/\S+/gi, "mongodb://redacted").slice(0, 180);
    throw new Error(`Cloudinary ping failed: ${safe}`);
  }
}
