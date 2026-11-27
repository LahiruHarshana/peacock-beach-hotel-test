import { readFileSync } from "node:fs";
import { parse } from "dotenv";
import { MongoClient } from "mongodb";
import { COLLECTIONS } from "../src/lib/db/collections";
import { assertNamedEnvironment } from "../src/lib/security/database-target";

async function main() {
  const file = process.env.PEACOCK_ENV_FILE ?? ".env.local";
  const parsed = parse(readFileSync(file, "utf8"));
  const environment = parsed.PEACOCK_ENV === "production" ? "production" : "development";
  if (parsed.PEACOCK_ENV === "staging" || file === ".env.staging.local") {
    throw new Error("Do not revoke staging sessions from the development file. Use .env.staging.local only through an approved staging command.");
  }
  if (environment === "production" && process.env.PEACOCK_ALLOW_PRODUCTION !== "1") {
    throw new Error("Refusing production session changes without PEACOCK_ALLOW_PRODUCTION=1.");
  }
  assertNamedEnvironment(environment, parsed.MONGODB_URI ?? "", parsed.MONGODB_DB ?? "");
  const email = process.env.STAFF_EMAIL?.trim().toLowerCase();
  const action = process.env.STAFF_ACTION;
  const uri = parsed.MONGODB_URI;
  const dbName = parsed.MONGODB_DB;
  if (!email || !uri || !dbName || (action !== "disable" && action !== "revoke")) {
    throw new Error("Set STAFF_EMAIL and STAFF_ACTION=disable|revoke");
  }

  const client = new MongoClient(uri);
  await client.connect();
  const users = client.db(dbName).collection(COLLECTIONS.users);
  const update =
    action === "disable"
      ? { $set: { status: "DISABLED", updatedAt: new Date() }, $inc: { tokenVersion: 1 } }
      : { $inc: { tokenVersion: 1 }, $set: { updatedAt: new Date() } };
  const result = await users.updateOne({ emailNormalized: email }, update);
  if (result.matchedCount === 0) throw new Error("Staff user not found");
  console.log(`${action} applied for ${email}. Existing sessions no longer match.`);
  await client.close();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Staff update failed");
  process.exit(1);
});
