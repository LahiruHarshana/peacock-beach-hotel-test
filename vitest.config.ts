import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    env: {
      PEACOCK_PROTECT_SHARED_MEDIA: "1",
    },
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts", "tests/db/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
