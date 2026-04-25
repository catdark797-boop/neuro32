import { expect, test } from "@playwright/test";
import { stubApi, markE2E } from "./helpers";

test.describe("Auth flow — register → /lk", () => {
  test.beforeEach(async ({ page }) => {
    await markE2E(page);
    await stubApi(page);
  });

  test("register creates account and redirects to /lk", async ({ page }) => {
    const fakeUser = {
      id: 42,
      name: "E2E Test",
      email: "e2e@test.ru",
      phone: "+79991234567",
      telegram: "",
      role: "user" as const,
      direction: "",
      goals: "",
      registeredAt: "1 января 2026 г.",
    };

    let firstMeCall = true;
    await page.route("**/api/auth/me", async (route) => {
      // Before submit — anon. After register — authed (cache seeded synchronously
      // so this might not even be called, but cover both).
      if (firstMeCall) {
        firstMeCall = false;
        await route.fulfill({ status: 401, contentType: "application/json", body: '{"error":"Не авторизован"}' });
      } else {
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(fakeUser) });
      }
    });
    await page.route("**/api/auth/register", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(fakeUser),
      });
    });
    // Mocks for LK page deps so it doesn't 401-spam after redirect.
    await page.route("**/api/notifications**", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
    );
    await page.route("**/api/payments", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
    );

    await page.goto("/auth");
    // Switch to register form. The toggle is rendered as <a>Зарегистрироваться</a>
    // inside the «Нет аккаунта?» line below the login form.
    await page.getByRole("main").getByText("Зарегистрироваться", { exact: true }).click();
    // Use placeholders — labels are not htmlFor-linked yet so getByLabel
    // resolves to footer's mailto a[aria-label=Email] first.
    await page.getByPlaceholder("Иван Петров").fill("E2E Test");
    await page.getByPlaceholder("email@example.com", { exact: false }).fill("e2e@test.ru");
    await page.getByPlaceholder("+7 900 000-00-00").fill("+7 (999) 123-45-67");
    await page.getByPlaceholder("Минимум 6 символов").fill("testpass123");
    // The submit button on the register form reads «Зарегистрироваться →».
    await page.getByRole("button", { name: /Зарегистрироваться/i }).click();

    await expect(page).toHaveURL(/\/lk$/, { timeout: 10_000 });
  });

  test("login error renders inline (no redirect)", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "Неверный email или пароль" }),
      });
    });

    await page.goto("/auth");
    // Login form's identifier field accepts «email или @telegram_handle».
    await page.getByPlaceholder(/email@example\.com или @/i).fill("wrong@test.ru");
    await page.getByPlaceholder("Введите пароль").fill("wrongpass");
    // Scope to <main> to avoid Nav's «ВОЙТИ» button collision.
    await page.getByRole("main").getByRole("button", { name: /^Войти/ }).click();

    // Stay on /auth, error banner shown.
    await expect(page).toHaveURL(/\/auth/);
    await expect(page.getByText(/Неверный email или пароль/i)).toBeVisible();
  });
});
