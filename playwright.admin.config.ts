import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e", testMatch: "admin.spec.ts", workers: 1, fullyParallel: false,
  timeout: 120000, expect: { timeout: 10000 }, reporter: "list",
  use: { channel: "chrome", baseURL: "http://127.0.0.1:3101", viewport: { width: 1440, height: 1000 }, trace: "retain-on-failure" },
});
