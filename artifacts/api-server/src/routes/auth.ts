import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  LoginBody,
  RegisterBody,
  GetMeResponse,
  LoginResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";
import { asyncHandler } from "../lib/asyncHandler";
import { notifyAdmin } from "../lib/telegram";
import { notifyAdminVK } from "../lib/vk";
import { verifyHcaptcha, hcaptchaEnabled } from "../lib/captcha";
import { logger } from "../lib/logger";

// 20 attempts per 15-minute window per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Слишком много попыток. Попробуйте через 15 минут." },
});

const router: IRouter = Router();

function userToResponse(u: typeof usersTable.$inferSelect) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    telegram: u.telegram,
    role: u.role,
    direction: u.direction,
    goals: u.goals,
    registeredAt: u.createdAt.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
  };
}

router.get("/auth/me", asyncHandler(async (req, res) => {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Не авторизован" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId));
  if (!user || user.deletedAt) {
    await new Promise<void>((resolve) => req.session.destroy(() => resolve()));
    res.status(401).json({ error: "Пользователь не найден" });
    return;
  }
  res.json(GetMeResponse.parse(userToResponse(user)));
}));

router.post("/auth/login", authLimiter, asyncHandler(async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Неверный формат данных" });
    return;
  }
  const { email, password } = parsed.data;

  // Support @telegram login for admin — flagged so we can audit this path
  // separately (it's a narrower surface + higher-value target).
  const isTelegramLogin = email.startsWith("@");
  const query = isTelegramLogin
    ? eq(usersTable.telegram, email.toLowerCase().trim())
    : eq(usersTable.email, email.toLowerCase().trim());

  const [user] = await db.select().from(usersTable).where(query);

  if (!user || user.deletedAt) {
    if (isTelegramLogin) {
      logger.warn(
        { handle: email.toLowerCase().trim(), ip: req.ip, reason: "not_found" },
        "[tg-login] failed",
      );
    }
    res.status(401).json({ error: "Неверный email или пароль" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    if (isTelegramLogin) {
      logger.warn(
        { handle: email.toLowerCase().trim(), ip: req.ip, userId: user.id, reason: "bad_password" },
        "[tg-login] failed",
      );
    }
    res.status(401).json({ error: "Неверный email или пароль" });
    return;
  }

  if (isTelegramLogin) {
    logger.info(
      { handle: email.toLowerCase().trim(), userId: user.id },
      "[tg-login] success",
    );
  }

  req.session.userId = user.id;
  req.session.role = user.role as "admin" | "user";
  req.session.createdAt = Date.now();

  // Explicit save — in production (cross-origin SPA) waiting for response-end
  // auto-save can race with the next request on slow DBs.
  await new Promise<void>((resolve, reject) => {
    req.session.save((err) => (err ? reject(err) : resolve()));
  });

  res.json(LoginResponse.parse(userToResponse(user)));
}));

router.post("/auth/register", authLimiter, asyncHandler(async (req, res) => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Неверный формат данных" });
    return;
  }
  const { name, email, phone, password } = parsed.data;

  // Bot protection — hCaptcha token. Only enforced when HCAPTCHA_SECRET is
  // set on the server (so dev/preview works without signup).
  if (hcaptchaEnabled()) {
    const captchaToken = (req.body as { captchaToken?: string } | undefined)?.captchaToken;
    if (!captchaToken) {
      res.status(400).json({ error: "Подтвердите, что вы не бот" });
      return;
    }
    const ok = await verifyHcaptcha(captchaToken, req.ip);
    if (!ok) {
      res.status(400).json({ error: "Проверка антибот не пройдена" });
      return;
    }
  }

  // Block @-prefixed registration — Telegram handles are a login-only feature
  // for the pre-seeded admin, not for new signups.
  if (email.trim().startsWith("@") || !email.includes("@") || !email.includes(".")) {
    res.status(400).json({ error: "Укажите корректный email (например, you@example.com)" });
    return;
  }

  // Additional email regex + password policy (generated zod schema has only
  // z.string(), so we enforce here at the edge).
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
    res.status(400).json({ error: "Некорректный email" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Пароль должен быть не короче 8 символов" });
    return;
  }
  if (phone && !/^\+?[\d\s\-()]{10,}$/.test(phone)) {
    res.status(400).json({ error: "Некорректный телефон" });
    return;
  }

  const [existing] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim()));
  if (existing) {
    res.status(409).json({ error: "Пользователь с таким email уже существует" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db.insert(usersTable).values({
    name,
    email: email.toLowerCase().trim(),
    phone,
    passwordHash,
    role: "user",
    telegram: "",
    direction: "",
    goals: "",
  }).returning();

  req.session.userId = user.id;
  req.session.role = user.role as "admin" | "user";
  req.session.createdAt = Date.now();
  await new Promise<void>((resolve, reject) => {
    req.session.save((err) => (err ? reject(err) : resolve()));
  });

  // Admin notifications — fire and forget
  const regMsg =
    `🆕 <b>Новая регистрация!</b>\n` +
    `👤 ${name}\n` +
    `📧 ${email}\n` +
    `📱 ${phone || "не указан"}\n` +
    `🕐 ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`;
  notifyAdmin(regMsg);
  notifyAdminVK(regMsg);

  res.status(201).json(userToResponse(user));
}));

router.post("/auth/logout", asyncHandler(async (req, res) => {
  await new Promise<void>((resolve) => req.session.destroy(() => resolve()));
  res.json({ ok: true });
}));

// Invalidate ALL sessions for the current user (revoke all devices).
// Uses a timestamp stored on the user row; requireAuth checks it on every request.
const revokeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Слишком много запросов. Попробуйте через минуту." },
});
router.delete("/auth/sessions", revokeLimiter, requireAuth, asyncHandler(async (req, res) => {
  await db
    .update(usersTable)
    .set({ sessionInvalidatedBefore: new Date() })
    .where(eq(usersTable.id, req.session!.userId!));

  await new Promise<void>((resolve) => req.session.destroy(() => resolve()));
  res.json({ ok: true });
}));

export default router;
