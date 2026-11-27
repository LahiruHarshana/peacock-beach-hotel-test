import { randomBytes } from "node:crypto";
import { MongoClient, type Collection, type Document } from "mongodb";
import { hashPassword, verifyPassword } from "../src/lib/auth/password";
import { COLLECTIONS } from "../src/lib/db/collections";
import { resolveStaffAccess } from "../src/lib/security/staff-access";
import { DATABASE_NAMES, redactConnectionError } from "../src/lib/security/database-target";
import { loadStagingConfig, pingStagingDatabase } from "./staging-env";

async function main() {
  const config = loadStagingConfig();
  const confirmed = await pingStagingDatabase(config);
  if (confirmed !== DATABASE_NAMES.staging) {
    throw new Error("Refusing authentication check because the database is not peacock_beach_staging.");
  }

  const email = `staging-session-check-${Date.now()}@peacock.test`;
  const password = randomBytes(18).toString("base64url");
  const passwordHash = await hashPassword(password);
  const client = new MongoClient(config.uri, { serverSelectionTimeoutMS: 8000 });
  let users: Collection<Document> | null = null;
  try {
    await client.connect();
    users = client.db(confirmed).collection(COLLECTIONS.users);
    await users.insertOne({
      emailNormalized: email,
      name: "Staging session check",
      role: "EDITOR",
      status: "ACTIVE",
      passwordHash,
      tokenVersion: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const stored = await users.findOne({ emailNormalized: email, status: "ACTIVE" });
    if (!stored || typeof stored.passwordHash !== "string") {
      throw new Error("Staging authentication probe could not be read back.");
    }
    const authenticated = await verifyPassword(password, stored.passwordHash);
    if (!authenticated) throw new Error("Staging password verification failed.");

    await users.updateOne({ emailNormalized: email }, { $inc: { tokenVersion: 1 } });
    const revoked = await users.findOne({ emailNormalized: email });
    const decision = resolveStaffAccess({
      status: typeof revoked?.status === "string" ? revoked.status : null,
      role: typeof revoked?.role === "string" ? revoked.role : null,
      recordTokenVersion: typeof revoked?.tokenVersion === "number" ? revoked.tokenVersion : 0,
      sessionTokenVersion: 0,
    });
    if (decision.ok || decision.reason !== "revoked") {
      throw new Error("Revoked staging session was still accepted.");
    }
    console.log("Staging authentication and session revocation check passed.");
    console.log("Probe account removed. No password was printed.");
  } catch (error) {
    throw new Error(redactConnectionError(error));
  } finally {
    await users?.deleteOne({ emailNormalized: email }).catch(() => undefined);
    await client.close().catch(() => undefined);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Staging authentication check failed");
  process.exit(1);
});
