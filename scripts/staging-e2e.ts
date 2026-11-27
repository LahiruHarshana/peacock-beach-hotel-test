import { spawnSync } from "node:child_process";
import { loadStagingConfig, pingStagingDatabase } from "./staging-env";

async function main() {
  const config = loadStagingConfig();
  const databaseName = await pingStagingDatabase(config);
  const child = spawnSync("pnpm", ["exec", "playwright", "test", "-c", "playwright.staging.config.ts"], {
    stdio: "inherit",
    env: {
      ...process.env,
      PEACOCK_ALLOW_ATLAS_STAGING: "1",
      PEACOCK_ENV: "staging",
      PEACOCK_PROTECT_SHARED_MEDIA: "1",
      MONGODB_URI_TEST: config.uri,
      MONGODB_DB_E2E: databaseName,
      APP_URL: "http://127.0.0.1:3000",
    },
  });
  process.exit(child.status ?? 1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Staging browser tests failed");
  process.exit(1);
});
