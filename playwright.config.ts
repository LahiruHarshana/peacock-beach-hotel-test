// CI installs Chromium with `pnpm exec playwright install --with-deps chromium`.
// A machine-local PLAYWRIGHT_BROWSERS_PATH is a developer workaround only. This config does not set it.
import { defineConfig, devices } from "@playwright/test";
import { resolveIsolatedTestDatabase } from "./src/lib/security/test-database";

const isolated = resolveIsolatedTestDatabase("e2e");
const e2eSecret = "e2e-only-auth-secret-not-for-production-xx";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  globalSetup: "./tests/e2e/global-setup.ts",
  timeout: 60_000,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
    env: {
      ...process.env,
      APP_URL: "http://127.0.0.1:3000",
      PEACOCK_ENV: "development",
      PEACOCK_PROTECT_SHARED_MEDIA: "1",
      MONGODB_URI: isolated.uri,
      MONGODB_DB: isolated.dbName,
      AUTH_SECRET: e2eSecret,
      CLOUDINARY_CLOUD_NAME: "ci-test",
      CLOUDINARY_API_KEY: "ci-test-key",
      CLOUDINARY_API_SECRET: "ci-test-secret",
      TRUSTED_PROXY_HOPS: "0",
      NODE_ENV: "development",
    },
  },
});
