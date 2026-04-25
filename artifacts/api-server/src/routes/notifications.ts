import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { db } from "@workspace/db";
import { notificationsTable, usersTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/auth";
import { asyncHandler } from "../lib/asyncHandler";

const router: IRouter = Router();

// Generous limit for reading notifications — clicking around shouldn't trip
// it, but a scraped loop would. 120/min per IP (≈ 2 rps) is plenty.
const readLimiter = rateLimit({
  windowMs: 60_000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Слишком много запросов. Подождите минуту." },
});

// List notifications for the current user, paginated.
// Defaults to 20 newest; ?limit=50&offset=20 for next page. Hard-cap at 100.
router.get("/notifications", requireAuth, asyncHandler(async (req, res) => {
  const params = z
    .object({
      limit: z.coerce.number().int().min(1).max(100).default(20),
      offset: z.coerce.number().int().min(0).max(10_000).default(0),
    })
    .safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "Неверные параметры пагинации" });
    return;
  }
  const { limit, offset } = params.data;
  const rows = await db
    .select()
    .from(notificationsTable)
    .where(eq(notificationsTable.userId, req.session!.userId!))
    .orderBy(desc(notificationsTable.createdAt))
    .limit(limit)
    .offset(offset);
  res.json(rows);
}));

// Mark all notifications as read — must be BEFORE /:id/read to avoid route collision
router.patch("/notifications/read-all", readLimiter, requireAuth, asyncHandler(async (req, res) => {
  await db
    .update(notificationsTable)
    .set({ read: true })
    .where(eq(notificationsTable.userId, req.session!.userId!));

  res.json({ ok: true });
}));

// Mark a single notification as read
router.patch("/notifications/:id/read", readLimiter, requireAuth, asyncHandler(async (req, res) => {
  const idParsed = z.object({ id: z.coerce.number().int().positive() }).safeParse(req.params);
  if (!idParsed.success) {
    res.status(400).json({ error: "Неверный ID" });
    return;
  }

  const [row] = await db
    .update(notificationsTable)
    .set({ read: true })
    .where(
      and(
        eq(notificationsTable.id, idParsed.data.id),
        eq(notificationsTable.userId, req.session!.userId!),
      ),
    )
    .returning();

  if (!row) {
    res.status(404).json({ error: "Уведомление не найдено" });
    return;
  }

  res.json(row);
}));

// Admin: create a notification for any user.
// Guard against IDOR — verify the target user exists AND isn't soft-deleted
// before inserting (previously we'd happily create a notification for user
// id=42 even if that user never existed or was GDPR-deleted, which both
// leaked enumeration data and silently buried admin messages in orphan rows).
router.post("/notifications", requireAdmin, asyncHandler(async (req, res) => {
  const body = z
    .object({
      userId: z.number().int().positive(),
      type: z.enum(["info", "success", "warning", "tip"]).default("info"),
      title: z.string().min(1).max(200),
      body: z.string().max(1000).default(""),
    })
    .safeParse(req.body);

  if (!body.success) {
    res.status(400).json({ error: body.error.errors[0]?.message ?? "Неверный формат" });
    return;
  }

  const [target] = await db
    .select({ id: usersTable.id, deletedAt: usersTable.deletedAt })
    .from(usersTable)
    .where(eq(usersTable.id, body.data.userId));
  if (!target || target.deletedAt) {
    res.status(404).json({ error: "Получатель не найден" });
    return;
  }

  const [row] = await db.insert(notificationsTable).values(body.data).returning();
  res.status(201).json(row);
}));

export default router;
