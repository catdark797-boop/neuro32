import { expect, test } from "@playwright/test";
import { stubApi, markE2E } from "./helpers";

test.describe("AI widget", () => {
  test.beforeEach(async ({ page }) => {
    await markE2E(page);
    await stubApi(page);
    // ai-chat is gracefully no-op when not configured; we only test the UI shell.
    await page.route("**/api/ai-chat", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ reply: "Тестовый ответ от Нейры" }),
      }),
    );
  });

  test("FAB toggles the chat panel", async ({ page }) => {
    await page.goto("/");
    const fab = page.getByRole("button", { name: /Открыть чат с Нейрой/i });
    await expect(fab).toBeVisible();
    await fab.click();
    // Panel becomes a dialog when open.
    await expect(page.getByRole("dialog", { name: /Нейра/i })).toBeVisible();
  });
});
