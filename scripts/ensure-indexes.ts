import { readFileSync } from "node:fs";
import { parse } from "dotenv";
import { MongoClient } from "mongodb";
import { ensureDatabaseIndexes } from "../src/lib/db/indexes";
import { assertNamedEnvironment, redactConnectionError } from "../src/lib/security/database-target";

async function main() {
  const file = process.env.PEACOCK_ENV_FILE ?? ".env.local";
  if (file === ".env.staging.local") {
    throw new Error("Use pnpm staging:indexes for peacock_beach_staging.");
  }
  const parsed = parse(readFileSync(file, "utf8"));
  const environment = parsed.PEACOCK_ENV === "production" ? "production" : "development";
  if (environment === "production" && process.env.PEACOCK_ALLOW_PRODUCTION !== "1") {
    throw new Error("Refusing production index changes without PEACOCK_ALLOW_PRODUCTION=1.");
  }
  assertNamedEnvironment(environment, parsed.MONGODB_URI ?? "", parsed.MONGODB_DB ?? "");
  const client = new MongoClient(parsed.MONGODB_URI ?? "", { serverSelectionTimeoutMS: 8000 });
  try {
    await client.connect();
    const db = client.db(parsed.MONGODB_DB);
    if (db.databaseName !== parsed.MONGODB_DB) {
      throw new Error("Connected database name did not match MONGODB_DB.");
    }
    await ensureDatabaseIndexes(db);
    console.log(`Indexes ensured on ${db.databaseName}.`);
  } catch (error) {
    throw new Error(redactConnectionError(error));
  } finally {
    await client.close().catch(() => undefined);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
