import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import { z } from "zod";
import { db } from "@workspace/db";
import { paymentsTable, notificationsTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";
import { asyncHandler } from "../lib/asyncHandler";

const router: IRouter = Router();

// Prevent payment-flood / user-enumeration via the payment endpoint.
// 5 create-payment calls per minute per IP is a comfortable cap — legit
// users will never hit it, abusers get locked out.
const paymentCreateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Слишком много попыток оплаты. Подождите минуту." },
});

const YooMoneyWebhookBody = z.object({
  notification_type: z.string(),
  operation_id: z.string(),
  amount: z.string(),
  currency: z.string(),
  datetime: z.string(),
  sender: z.string().default(""),
  codepro: z.string(),
  sha1_hash: z.string(),
  label: z.string().default(""),
});

// ---------------------------------------------------------------------------
// Create a payment (returns a YooMoney Quickpay redirect URL)
// ---------------------------------------------------------------------------
router.post("/payments", paymentCreateLimiter, requireAuth, asyncHandler(async (req, res) => {
  const body = z
    .object({
      amount: z.number().int().positive().max(100_000),
      description: z.string().max(200).default("Абонемент Нейро 32"),
    })
    .safeParse(req.body);

  if (!body.success) {
    res.status(400).json({ error: body.error.errors[0]?.message ?? "Неверный формат" });
    return;
  }

  const receiver = process.env.YOOMONEY_RECEIVER;
  if (!receiver) {
    res.status(503).json({ error: "Платёжная система не настроена" });
    return;
  }

  // Idempotency: if client provides an Idempotency-Key header and we already
  // have a payment with that key for this user, return the existing row.
  // Prevents double-charging on network retries / double submit.
  const idempotencyKey = (req.get("idempotency-key") ?? "").trim();
  if (idempotencyKey) {
    // Require a UUID v4 — narrow charset eliminates collision risk and rules
    // out clients accidentally sending session tokens / emails as the key.
    // Old permissive regex `[A-Za-z0-9_\-.:]+` accepted things like
    // "session:abc.def" which is sketchy.
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!UUID_RE.test(idempotencyKey)) {
      res.status(400).json({ error: "Idempotency-Key должен быть UUID v4" });
      return;
    }
    const [existing] = await db
      .select()
      .from(paymentsTable)
      .where(
        and(
          eq(paymentsTable.userId, req.session!.userId!),
          eq(paymentsTable.idempotencyKey, idempotencyKey),
        ),
      );
    if (existing) {
      const params = new URLSearchParams({
        receiver,
        "quickpay-form": "button",
        targets: existing.description,
        paymentType: "SB",
        sum: String(existing.amount),
        label: existing.label,
        successURL: `${process.env.FRONTEND_URL ?? ""}/lk?tab=payment&paid=1`,
      });
      res.json({
        paymentId: existing.id,
        redirectUrl: `https://yoomoney.ru/quickpay/confirm.xml?${params.toString()}`,
        idempotent: true,
      });
      return;
    }
  }

  // Unique label for this payment — used to match the incoming webhook
  const label = `u${req.session!.userId!}-${Date.now()}`;

  const [payment] = await db
    .insert(paymentsTable)
    .values({
      userId: req.session!.userId!,
      amount: body.data.amount,
      description: body.data.description,
      label,
      status: "pending",
      idempotencyKey: idempotencyKey || null,
    })
    .returning();

  // Build YooMoney Quickpay URL (form-based, no SDK required)
  const params = new URLSearchParams({
    receiver,
    "quickpay-form": "button",
    targets: body.data.description,
    paymentType: "SB", // SBP
    sum: String(body.data.amount),
    label,
    successURL: `${process.env.FRONTEND_URL ?? ""}/lk?tab=payment&paid=1`,
  });

  res.json({
    paymentId: payment.id,
    redirectUrl: `https://yoomoney.ru/quickpay/confirm.xml?${params.toString()}`,
  });
}));

// ---------------------------------------------------------------------------
// List payments for current user
// ---------------------------------------------------------------------------
router.get("/payments", requireAuth, asyncHandler(async (req, res) => {
  const rows = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.userId, req.session!.userId!))
    .orderBy(paymentsTable.createdAt);

  res.json(rows.reverse());
}));

// ---------------------------------------------------------------------------
// YooMoney webhook (incoming notification after successful payment)
// Docs: https://yoomoney.ru/docs/payment-buttons/using-api/notifications
// ---------------------------------------------------------------------------
router.post("/payments/webhook", asyncHandler(async (req, res) => {
  const secret = process.env.YOOMONEY_SECRET;
  if (!secret) {
    res.status(503).json({ error: "Webhook не настроен" });
    return;
  }

  const parsed = YooMoneyWebhookBody.safeParse(req.body);
  if (!parsed.success) {
    logger.warn({ errors: parsed.error.errors }, "YooMoney webhook: invalid payload");
    res.status(400).json({ error: "Invalid payload" });
    return;
  }

  const body = parsed.data;

  // Verify SHA-1 signature
  const fields = [
    body.notification_type,
    body.operation_id,
    body.amount,
    body.currency,
    body.datetime,
    body.sender,
    body.codepro,
    secret,
    body.label,
  ];
  const expectedSha1 = crypto
    .createHash("sha1")
    .update(fields.join("&"))
    .digest("hex");

  if (expectedSha1 !== body.sha1_hash) {
    logger.warn({ label: body.label }, "YooMoney webhook: invalid signature");
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  const label = body.label;
  if (!label) {
    res.sendStatus(200);
    return;
  }

  const [payment] = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.label, label));

  if (!payment) {
    logger.warn({ label }, "YooMoney webhook: unknown label");
    res.sendStatus(200);
    return;
  }

  await db
    .update(paymentsTable)
    .set({
      status: "succeeded",
      ymoneyOperationId: body.operation_id,
      paidAt: new Date(),
    })
    .where(eq(paymentsTable.label, label));

  // Notify the user
  await db.insert(notificationsTable).values({
    userId: payment.userId,
    type: "success",
    title: "Оплата подтверждена",
    body: `${payment.description} — ${payment.amount} ₽. Спасибо!`,
  });

  logger.info({ label, amount: payment.amount }, "Payment confirmed");
  res.sendStatus(200);
}));

export default router;
