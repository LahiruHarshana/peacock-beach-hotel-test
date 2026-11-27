import {
  DATABASE_NAMES,
  assertDatabaseAlignment,
  databaseNameFromUri,
  isProductionDatabase,
} from "@/lib/security/database-target";

const ALLOWED_SUFFIXES = ["_ci", "_e2e", "_staging"] as const;

const BLOCKED_NAMES = new Set([
  "peacock_beach",
  DATABASE_NAMES.development,
  DATABASE_NAMES.production,
  "peacock_beach_production",
  "admin",
]);

/** Refuse automated tests against development or production data. */
export function assertSafeTestDatabase(uri: string, dbName: string): void {
  const name = dbName.trim().toLowerCase();
  const uriDatabase = databaseNameFromUri(uri);
  if ((uriDatabase && isProductionDatabase(uriDatabase)) || isProductionDatabase(name)) {
    throw new Error("Refusing tests against a production database.");
  }
  if (uriDatabase && uriDatabase !== dbName) {
    throw new Error(
      `Refusing tests: the URI database "${uriDatabase}" does not match MONGODB_DB "${dbName}".`,
    );
  }
  const allowed = ALLOWED_SUFFIXES.some((suffix) => name.endsWith(suffix));
  if (!allowed || BLOCKED_NAMES.has(name)) {
    throw new Error(
      `Refusing tests against database "${dbName}". Use ${DATABASE_NAMES.ci}, ${DATABASE_NAMES.e2e}, or ${DATABASE_NAMES.staging}.`,
    );
  }
  if (name === DATABASE_NAMES.staging) {
    assertDatabaseAlignment(uri, dbName);
    if (process.env.PEACOCK_ALLOW_ATLAS_STAGING !== "1") {
      throw new Error(
        "Staging tests stay disabled until PEACOCK_ALLOW_ATLAS_STAGING=1 is set for peacock_beach_staging.",
      );
    }
  }
  const atlas = /mongodb\+srv:/i.test(uri);
  if (atlas && name !== DATABASE_NAMES.staging) {
    throw new Error("Refusing an Atlas connection unless the database is peacock_beach_staging.");
  }
}

export function resolveIsolatedTestDatabase(kind: "ci" | "e2e" = "ci") {
  const uri = process.env.MONGODB_URI_TEST ?? "mongodb://127.0.0.1:27017";
  const dbName =
    kind === "e2e"
      ? (process.env.MONGODB_DB_E2E ?? "peacock_beach_e2e")
      : (process.env.MONGODB_DB_TEST ?? "peacock_beach_ci");
  assertSafeTestDatabase(uri, dbName);
  return { uri, dbName };
}
