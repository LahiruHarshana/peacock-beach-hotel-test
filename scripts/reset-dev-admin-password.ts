import { readFileSync } from "node:fs";
import { parse } from "dotenv";
import { MongoClient } from "mongodb";
import { COLLECTIONS } from "../src/lib/db/collections";
import { hashPassword } from "../src/lib/auth/password";
import { assertNamedEnvironment } from "../src/lib/security/database-target";

async function main() {
  const file = process.env.PEACOCK_ENV_FILE ?? ".env.local";
  const parsed = parse(readFileSync(file, "utf8"));
  const environment = parsed.PEACOCK_ENV === "production" ? "production" : "development";
  if (environment === "production") {
    throw new Error("Refusing to reset admin password in production.");
  }
  assertNamedEnvironment(environment, parsed.MONGODB_URI ?? "", parsed.MONGODB_DB ?? "");
  const email = (parsed.BOOTSTRAP_ADMIN_EMAIL ?? "admin@peacockbeach.local").trim().toLowerCase();
  const password = process.env.DEV_ADMIN_PASSWORD?.trim();
  if (!password || password.length < 12) {
    throw new Error("Set DEV_ADMIN_PASSWORD to a new password (at least 12 characters).");
  }

  const client = new MongoClient(parsed.MONGODB_URI!);
  await client.connect();
  const db = client.db(parsed.MONGODB_DB!);
  const passwordHash = await hashPassword(password);
  const result = await db.collection(COLLECTIONS.users).updateOne(
    { emailNormalized: email },
    {
      $set: { passwordHash, status: "ACTIVE", updatedAt: new Date() },
      $inc: { tokenVersion: 1 },
    },
  );
  await client.close();

  if (result.matchedCount === 0) {
    throw new Error(`No staff user found for ${email}. Run pnpm db:seed-admin first.`);
  }
  console.log(`Updated password for ${email}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
