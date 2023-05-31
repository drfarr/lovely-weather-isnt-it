import { defineConfig } from "@playwright/test";

export default defineConfig({
  testMatch: "*/*.test.ts",
  use: {
    baseURL: "http://localhost:3000",
    extraHTTPHeaders: {
      "Content-Type": "application/json",
    },
    actionTimeout: 30 * 1000,
    navigationTimeout: 120 * 1000,

    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
});
