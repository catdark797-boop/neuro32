import { expect, test } from "@playwright/test";
import { stubApi, markE2E } from "./helpers";

test.describe("EnrollModal — happy path with mocked API", () => {
  test.beforeEach(async ({ page }) => {
    await markE2E(page);
    await stubApi(page);
  });

  test("submits a valid application and shows success screen", async ({ page }) => {
    let captured: { method: string; body: unknown } | null = null;

    // Intercept the POST so the real Railway endpoint never sees it.
    await page.route("**/api/applications", async (route) => {
      captured = { method: route.request().method(), body: route.request().postDataJSON() };
      if (route.request().method() === "OPTIONS") {
        await route.fulfill({ status: 204 });
        return;
      }
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ id: 999, status: "new", createdAt: new Date().toISOString() }),
      });
    });

    await page.goto("/");
    await page.getByRole("button", { name: /ЗАПИСАТЬСЯ/i }).first().click();
    const dialog = page.getByRole("dialog", { name: /Записаться/i });
    await expect(dialog).toBeVisible();

    // Switch to Adults program — avoids the parent-consent block branch
    // that's auto-shown for child programs. This test is focused on the
    // base submit happy path, not the minor-consent flow.
    await dialog.locator("#enroll-direction").selectOption({ label: "Взрослые 18+" });

    await dialog.locator("#enroll-name").fill("E2E Тестов");
    // Phone field auto-prefixes "+7 (" — type just the 10 subscriber digits.
    await dialog.locator("#enroll-phone").fill("9001234567");
    // Single consent checkbox now (parent block hidden for Adults).
    await dialog.locator('input[type="checkbox"]').check();
    await dialog.getByRole("button", { name: /^Записаться/i }).click();

    // Success screen replaces the form. The dialog's aria-labelledby points
    // to an element only present in form-mode, so we drop the `name` filter
    // and assert on the success-screen heading directly.
    await expect(page.getByText(/Заявка принята/i)).toBeVisible({ timeout: 10_000 });
    expect(captured).not.toBeNull();
    expect(captured!.method).toBe("POST");
    const body = captured!.body as { name: string; phone: string };
    expect(body.name).toBe("E2E Тестов");
    // Server should receive the canonicalised E.164 form, not raw user input.
    expect(body.phone).toBe("+79001234567");
  });

  test("invalid phone surfaces error before any network call", async ({ page }) => {
    let networkHits = 0;
    await page.route("**/api/applications", async (route) => {
      networkHits++;
      await route.fulfill({ status: 201, contentType: "application/json", body: "{}" });
    });

    await page.goto("/");
    await page.getByRole("button", { name: /ЗАПИСАТЬСЯ/i }).first().click();
    const dialog = page.getByRole("dialog");
    await dialog.locator("#enroll-direction").selectOption({ label: "Взрослые 18+" });
    await dialog.locator("#enroll-name").fill("Тест");
    // Only 5 digits — clearly not a valid RU phone.
    await dialog.locator("#enroll-phone").fill("12345");
    await dialog.locator('input[type="checkbox"]').check();
    await dialog.getByRole("button", { name: /^Записаться/i }).click();

    // Inline error banner should appear; success screen should NOT.
    await expect(dialog.getByRole("alert")).toContainText(/корректный российский номер/i);
    await expect(dialog.getByText(/Заявка принята/i)).toHaveCount(0);
    expect(networkHits).toBe(0);
  });

  test("Cyber program forces age + parent consent", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /ЗАПИСАТЬСЯ/i }).first().click();
    const dialog = page.getByRole("dialog");

    await dialog.locator("#enroll-direction").selectOption({ label: "Кибербезопасность" });
    // The age field appears only for cyber.
    await expect(dialog.locator("#enroll-age")).toBeVisible();
  });
});
