// Shared helpers for the Playwright suite.
import type { Page, Route } from "@playwright/test";

/**
 * Stub the API endpoints the SPA hits at runtime so tests stay deterministic
 * and don't reach out to Railway. Pass `overrides` to alter individual
 * responses per-test.
 */
export async function stubApi(
  page: Page,
  overrides: Partial<Record<string, (route: Route) => Promise<void>>> = {},
): Promise<void> {
  // Default 401 for /auth/me — most tests start as anon.
  await page.route("**/api/auth/me", overrides["/api/auth/me"] ?? (async (route) => {
    await route.fulfill({ status: 401, contentType: "application/json", body: '{"error":"Не авторизован"}' });
  }));

  // Public pricing — match prod defaults so the LK page renders the same.
  await page.route("**/api/pricing", overrides["/api/pricing"] ?? (async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ prices: { kids: 5500, teens: 7000, adults: 8500, cyber: 11000, trial: 500 } }),
    });
  }));

  // Class sessions list — empty by default.
  await page.route("**/api/class-sessions", overrides["/api/class-sessions"] ?? (async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
  }));

  // Reviews — empty by default (we hide the form anyway via env flag).
  await page.route("**/api/reviews", overrides["/api/reviews"] ?? (async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
  }));

  // Settings (groupMax)
  await page.route("**/api/settings", overrides["/api/settings"] ?? (async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: '{"groupMax":8}' });
  }));
}

/**
 * Tag the page so analytics.ts knows we're in a test (cheap signal we can
 * read from window if needed).
 */
export async function markE2E(page: Page): Promise<void> {
  await page.addInitScript(() => {
    (window as unknown as { __E2E__: boolean }).__E2E__ = true;
  });
}
