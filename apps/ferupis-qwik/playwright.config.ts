import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:8790";

export default defineConfig({
  testDir: "./e2e",
  outputDir: "../../.tmp/playwright/test-results",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ["line"],
        [
          "html",
          { outputFolder: "../../.tmp/playwright/report", open: "never" },
        ],
      ]
    : "list",
  use: {
    baseURL,
    locale: "it-IT",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run e2e.serve",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
