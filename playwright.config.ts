import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const desktopViewport = { width: 1280, height: 800 };

// Visual snapshots run only on mobile-safari and desktop-chrome.
const noVisual = /visual\.spec\.ts/;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "mobile-safari", use: { ...devices["iPhone 13"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] }, testIgnore: noVisual },
    {
      name: "narrow",
      use: { ...devices["Desktop Chrome"], viewport: { width: 320, height: 640 } },
      testIgnore: noVisual,
    },
    { name: "desktop-chrome", use: { ...devices["Desktop Chrome"], viewport: desktopViewport } },
    {
      name: "desktop-firefox",
      use: { ...devices["Desktop Firefox"], viewport: desktopViewport },
      testIgnore: noVisual,
    },
    {
      name: "desktop-webkit",
      use: { ...devices["Desktop Safari"], viewport: desktopViewport },
      testIgnore: noVisual,
    },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    env: {
      PAYMENT_PROVIDER: "mock",
      SIGNUP_PROVIDER: "stub",
      NEXT_PUBLIC_GA_ID: "G-TEST",
    },
  },
});
