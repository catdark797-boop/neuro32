import { expect, test } from "@playwright/test";
import { stubApi, markE2E } from "./helpers";

test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    await markE2E(page);
    await stubApi(page);
  });

  test("hero loads with main CTA visible", async ({ page }) => {
    await page.goto("/");
    // Title sanity check — usePageMeta should have applied.
    await expect(page).toHaveTitle(/Нейро 32/);
    // Primary nav-bar CTA «ЗАПИСАТЬСЯ» is the conversion north-star.
    await expect(page.getByRole("button", { name: /ЗАПИСАТЬСЯ/i }).first()).toBeVisible();
  });

  test("clicking «Записаться» opens EnrollModal", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /ЗАПИСАТЬСЯ/i }).first().click();
    // EnrollModal heading is the dialog's labelled-by target.
    await expect(page.getByRole("dialog", { name: /Записаться на занятие/i })).toBeVisible();
  });

  test("Escape closes the EnrollModal", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /ЗАПИСАТЬСЯ/i }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("no fake testimonials section visible", async ({ page }) => {
    // We removed Алина К. / Дмитрий С. / Юлия В. in P0-4 — guard against regression.
    await page.goto("/");
    await expect(page.locator("body")).not.toContainText("Алина К.");
    await expect(page.locator("body")).not.toContainText("Дмитрий С.");
    await expect(page.locator("body")).not.toContainText("Юлия В.");
  });

  test("no stale «4 мая 2026» date anywhere", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).not.toContainText("4 мая 2026");
  });
});
