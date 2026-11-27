import { defineConfig, devices } from "@playwright/test";
import { loadStagingConfig } from "./scripts/staging-env";

const staging = loadStagingConfig();

export default defineConfig({
  testDir: "tests/e2e",
  testMatch: /admin-workflow\.spec\.ts/,
  fullyParallel: false,
  globalSetup: "./tests/e2e/staging-global-setup.ts",
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
      APP_URL: "http://127.0.0.1:3000",
      MONGODB_URI: staging.uri,
      MONGODB_DB: staging.dbName,
      AUTH_SECRET: staging.authSecret,
      CLOUDINARY_CLOUD_NAME: staging.cloudName,
      CLOUDINARY_API_KEY: staging.apiKey,
      CLOUDINARY_API_SECRET: staging.apiSecret,
      TRUSTED_PROXY_HOPS: staging.trustedProxyHops,
      PEACOCK_ENV: "staging",
      PEACOCK_PROTECT_SHARED_MEDIA: "1",
      NODE_ENV: "development",
    },
  },
});
