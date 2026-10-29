import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  testIgnore: "**/admin.spec.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  expect: { timeout: 10000 },
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${process.env.BTS_TEST_PORT || 3000}`,
    channel: "chrome",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: `npm run start -- --hostname 127.0.0.1 --port ${process.env.BTS_TEST_PORT || 3000}`,
    url: `http://127.0.0.1:${process.env.BTS_TEST_PORT || 3000}/en`,
    timeout: 60000,
    reuseExistingServer: false,
    env: { NEXT_TELEMETRY_DISABLED: "1", BTS_DATABASE_PATH: "", ADMIN_USERNAME: "", ADMIN_PASSWORD_HASH: "", ADMIN_SESSION_SECRET: "" },
  },
});
