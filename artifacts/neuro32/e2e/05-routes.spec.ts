import { expect, test } from "@playwright/test";
import { stubApi, markE2E } from "./helpers";

test.describe("Routing & SPA fallback", () => {
  test.beforeEach(async ({ page }) => {
    await markE2E(page);
    await stubApi(page);
  });

  for (const path of ["/kids", "/teens", "/adults", "/cyber", "/about", "/contact", "/offer", "/privacy", "/reviews"] as const) {
    test(`${path} renders without errors`, async ({ page }) => {
      await page.goto(path);
      // Page-meta hook should set a meaningful title (not just "Vite + React").
      const title = await page.title();
      expect(title.length).toBeGreaterThan(5);
      // No global error boundary visible.
      await expect(page.getByText(/Что-то пошло не так/i)).toHaveCount(0);
    });
  }

  test("unknown route shows 404 page with link home", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByRole("link", { name: /На главную/i })).toBeVisible();
  });
});
