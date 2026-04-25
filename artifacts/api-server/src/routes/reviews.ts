import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { db } from "@workspace/db";
import { reviewsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateReviewBody,
  UpdateReviewParams,
  UpdateReviewBody,
  DeleteReviewParams,
  ListReviewsResponse,
  UpdateReviewResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";
import { logAudit } from "./auditLogs";
import { asyncHandler } from "../lib/asyncHandler";

const submitLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Слишком много запросов. Попробуйте через минуту." },
});

const router: IRouter = Router();

function rowToReview(r: typeof reviewsTable.$inferSelect) {
  return { ...r, createdAt: r.createdAt.toISOString() };
}

router.get("/reviews", asyncHandler(async (req, res) => {
  const isAdmin = req.session?.role === "admin";
  const rows = await db.select().from(reviewsTable).orderBy(reviewsTable.createdAt);
  const filtered = isAdmin ? rows : rows.filter(r => r.approved);
  res.json(ListReviewsResponse.parse(filtered.map(rowToReview)));
}));

router.post("/reviews", submitLimiter, asyncHandler(async (req, res) => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(reviewsTable).values({
    name: parsed.data.name,
    role: parsed.data.role,
    direction: parsed.data.direction,
    rating: parsed.data.rating,
    text: parsed.data.text,
    approved: false,
  }).returning();

  res.status(201).json(rowToReview(row));
}));

router.patch("/reviews/:id", requireAdmin, asyncHandler(async (req, res) => {
  const params = UpdateReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Неверный ID" });
    return;
  }
  const body = UpdateReviewBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [row] = await db.update(reviewsTable)
    .set({ approved: body.data.approved })
    .where(eq(reviewsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Отзыв не найден" });
    return;
  }

  await logAudit(req.session!.userId!, body.data.approved ? "APPROVE_REVIEW" : "REJECT_REVIEW", {
    targetTable: "reviews",
    targetId: row.id,
  });

  res.json(UpdateReviewResponse.parse(rowToReview(row)));
}));

router.delete("/reviews/:id", requireAdmin, asyncHandler(async (req, res) => {
  const params = DeleteReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Неверный ID" });
    return;
  }

  const [row] = await db.delete(reviewsTable).where(eq(reviewsTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Отзыв не найден" });
    return;
  }

  await logAudit(req.session!.userId!, "DELETE_REVIEW", {
    targetTable: "reviews",
    targetId: params.data.id,
    before: rowToReview(row),
  });

  res.sendStatus(204);
}));

export default router;
