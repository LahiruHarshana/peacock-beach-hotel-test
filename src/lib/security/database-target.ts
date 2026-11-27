export const DATABASE_NAMES = {
  development: "peacock_beach_dev",
  staging: "peacock_beach_staging",
  production: "peacock_beach_prod",
  ci: "peacock_beach_ci",
  e2e: "peacock_beach_e2e",
} as const;

export type AppEnvironment = keyof typeof DATABASE_NAMES;

const PRODUCTION_NAMES = new Set([
  DATABASE_NAMES.production,
  "peacock_beach_production",
  "peacock_beach",
  "admin",
]);

export function databaseNameFromUri(uri: string): string | null {
  const withoutQuery = uri.split("?")[0] ?? "";
  const match = withoutQuery.match(/^mongodb(?:\+srv)?:\/\/(?:[^@/]+@)?[^/]+\/([^/?]+)/i);
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export function assertDatabaseAlignment(uri: string, dbName: string): void {
  const fromUri = databaseNameFromUri(uri);
  if (!fromUri) {
    throw new Error(
      `MONGODB_URI has no database name. Put "${dbName}" in the URI path and keep MONGODB_DB set to the same name.`,
    );
  }
  if (fromUri !== dbName) {
    throw new Error(
      `MONGODB_URI selects "${fromUri}" but MONGODB_DB is "${dbName}". They must name the same database.`,
    );
  }
}

export function assertNamedEnvironment(environment: AppEnvironment, uri: string, dbName: string): void {
  assertDatabaseAlignment(uri, dbName);
  const expected = DATABASE_NAMES[environment];
  if (dbName !== expected) {
    throw new Error(`The ${environment} configuration must use ${expected}.`);
  }
}

export function assertProductionConfiguration(input: {
  appUrl: string;
  uri: string;
  dbName: string;
  authSecret: string;
}): void {
  assertNamedEnvironment("production", input.uri, input.dbName);
  if (!input.appUrl.startsWith("https://")) {
    throw new Error("Production APP_URL must use https.");
  }
  if (input.authSecret.length < 32 || /generate|ci-only|replace|changeme/i.test(input.authSecret)) {
    throw new Error("Production AUTH_SECRET must be a unique value of at least 32 characters.");
  }
}

export function isProductionDatabase(dbName: string): boolean {
  const name = dbName.trim().toLowerCase();
  return PRODUCTION_NAMES.has(name) || name.includes("prod");
}

export function redactConnectionError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown error";
  return message.replace(/mongodb(?:\+srv)?:\/\/\S+/gi, "mongodb://redacted");
}
