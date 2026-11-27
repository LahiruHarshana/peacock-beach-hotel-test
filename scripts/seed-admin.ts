import { readFileSync } from "node:fs";
import { parse } from "dotenv";
import { MongoClient } from "mongodb";
import { randomBytes } from "crypto";
import { COLLECTIONS } from "../src/lib/db/collections";
import { hashPassword } from "../src/lib/auth/password";
import { assertNamedEnvironment } from "../src/lib/security/database-target";

async function main() {
  const file = process.env.PEACOCK_ENV_FILE ?? ".env.local";
  const parsed = parse(readFileSync(file, "utf8"));
  const environment = parsed.PEACOCK_ENV === "production" ? "production" : "development";
  if (parsed.PEACOCK_ENV === "staging" || file === ".env.staging.local") {
    throw new Error("Do not seed staging from this script. Create named staff accounts after pnpm staging:preflight.");
  }
  if (environment === "production" && process.env.PEACOCK_ALLOW_PRODUCTION !== "1") {
    throw new Error("Refusing production seed without PEACOCK_ALLOW_PRODUCTION=1.");
  }
  assertNamedEnvironment(environment, parsed.MONGODB_URI ?? "", parsed.MONGODB_DB ?? "");
  const uri = parsed.MONGODB_URI;
  const dbName = parsed.MONGODB_DB;
  const email = parsed.BOOTSTRAP_ADMIN_EMAIL;
  if (!uri || !dbName || !email) {
    throw new Error("MONGODB_URI, MONGODB_DB, BOOTSTRAP_ADMIN_EMAIL required");
  }

  const password = randomBytes(12).toString("base64url");
  const passwordHash = await hashPassword(password);
  const emailNormalized = email.trim().toLowerCase();

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const existing = await db.collection(COLLECTIONS.users).findOne({ emailNormalized });
  if (existing) {
    console.log(`Owner already exists for ${emailNormalized}. No changes made.`);
    await client.close();
    return;
  }

  await db.collection(COLLECTIONS.users).insertOne({
    emailNormalized,
    name: "Hotel Owner",
    role: "OWNER",
    status: "ACTIVE",
    passwordHash,
    tokenVersion: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log(`Created OWNER ${emailNormalized}`);
  console.log(`One-time password (store securely, not in git): ${password}`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
