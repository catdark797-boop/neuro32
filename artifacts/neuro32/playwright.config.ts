import { defineConfig, devices } from "@playwright/test";

/**
 * E2E suite for the Нейро 32 SPA.
 *
 * Strategy:
 *   - We boot `vite preview` against the production-like build (so we test
 *     the same chunks shipped to нейро32.рф, not Vite's dev server).
 *   - All `/api/*` calls are mocked via `page.route()` inside individual
 *     specs — we deliberately do NOT hit Railway from CI to keep tests
 *     fast, deterministic, and free of polluting the live applications
 *     table with synthetic submissions.
 *
 * To run:
 *   pnpm --filter @workspace/neuro32 run e2e        # full suite, headless
 *   pnpm --filter @workspace/neuro32 run e2e:ui     # interactive watcher
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    // Disable Sentry / Y.Metrika beacons during tests — we don't want
    // synthetic clicks polluting prod analytics.
    extraHTTPHeaders: { "x-e2e": "1" },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    // Build once + serve. The pnpm `--` forwarding is unreliable, so we
    // invoke vite preview directly with the port we want to bind.
    command: "pnpm run build && npx vite preview --config vite.config.ts --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
  },
});
