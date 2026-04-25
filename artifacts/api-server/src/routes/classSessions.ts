import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { classSessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateClassSessionBody,
  DeleteClassSessionParams,
  ListClassSessionsResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";
import { asyncHandler } from "../lib/asyncHandler";

const router: IRouter = Router();

function rowToSession(r: typeof classSessionsTable.$inferSelect) {
  return { id: r.id, date: r.date, time: r.time, direction: r.direction, topic: r.topic };
}

router.get("/class-sessions", asyncHandler(async (_req, res) => {
  const rows = await db.select().from(classSessionsTable).orderBy(classSessionsTable.date, classSessionsTable.time);
  res.json(ListClassSessionsResponse.parse(rows.map(rowToSession)));
}));

router.post("/class-sessions", requireAdmin, asyncHandler(async (req, res) => {
  const parsed = CreateClassSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(classSessionsTable).values(parsed.data).returning();
  res.status(201).json(rowToSession(row));
}));

router.delete("/class-sessions/:id", requireAdmin, asyncHandler(async (req, res) => {
  const params = DeleteClassSessionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Неверный ID" });
    return;
  }
  const [row] = await db.delete(classSessionsTable).where(eq(classSessionsTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Занятие не найдено" });
    return;
  }
  res.sendStatus(204);
}));

export default router;
