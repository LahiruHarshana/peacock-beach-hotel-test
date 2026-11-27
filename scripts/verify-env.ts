import { readFileSync } from "node:fs";
import { parse } from "dotenv";
import {
  assertNamedEnvironment,
  assertProductionConfiguration,
  type AppEnvironment,
} from "../src/lib/security/database-target";

const file = process.env.PEACOCK_ENV_FILE ?? ".env.local";

function main() {
  if (file === ".env.staging.local") {
    throw new Error("Use pnpm staging:preflight for the staging file.");
  }
  const parsed = parse(readFileSync(file, "utf8"));
  const environment = (parsed.PEACOCK_ENV ?? "development") as AppEnvironment;
  if (environment !== "development" && environment !== "production") {
    throw new Error("PEACOCK_ENV must be development or production for this file.");
  }
  if (environment === "production" && process.env.PEACOCK_ALLOW_PRODUCTION !== "1") {
    throw new Error("Refusing production verification without PEACOCK_ALLOW_PRODUCTION=1.");
  }
  if (environment === "production") {
    assertProductionConfiguration({
      appUrl: parsed.APP_URL ?? "",
      uri: parsed.MONGODB_URI ?? "",
      dbName: parsed.MONGODB_DB ?? "",
      authSecret: parsed.AUTH_SECRET ?? "",
    });
  } else {
    assertNamedEnvironment(environment, parsed.MONGODB_URI ?? "", parsed.MONGODB_DB ?? "");
    if ((parsed.AUTH_SECRET ?? "").length < 32) {
      throw new Error("AUTH_SECRET must be at least 32 characters.");
    }
  }
  console.log(`Environment file checked: ${file}`);
  console.log(`Role: ${environment}`);
  console.log(`Database: ${parsed.MONGODB_DB}`);
  console.log("URI database matches MONGODB_DB.");
  console.log("Secrets were not printed.");
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : "Environment validation failed");
  process.exit(1);
}
