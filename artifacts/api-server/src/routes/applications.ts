import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { db } from "@workspace/db";
import { applicationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateApplicationBody,
  UpdateApplicationParams,
  UpdateApplicationBody,
  ListApplicationsResponse,
  UpdateApplicationResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";
import { logAudit } from "./auditLogs";
import { asyncHandler } from "../lib/asyncHandler";
import { notifyAdmin } from "../lib/telegram";
import { notifyAdminVK } from "../lib/vk";

const submitLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Слишком много заявок. Попробуйте через минуту." },
});

const router: IRouter = Router();

router.get("/applications", requireAdmin, asyncHandler(async (_req, res) => {
  const rows = await db.select().from(applicationsTable).orderBy(applicationsTable.createdAt);
  res.json(ListApplicationsResponse.parse(rows.map(r => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }))));
}));

router.post("/applications", submitLimiter, asyncHandler(async (req, res) => {
  const parsed = CreateApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(applicationsTable).values({
    name: parsed.data.name,
    phone: parsed.data.phone,
    direction: parsed.data.direction,
    format: parsed.data.format,
    message: parsed.data.message ?? "",
    isBusinessInquiry: parsed.data.isBusinessInquiry ?? false,
    organizationName: parsed.data.organizationName,
    status: "new",
  }).returning();

  // Telegram notification — fire and forget
  const dirLabel = parsed.data.direction || "не указано";
  const fmtLabel = parsed.data.format || "";
  const msgText = parsed.data.message ? `\n💬 ${parsed.data.message}` : "";
  const bizLabel = parsed.data.isBusinessInquiry ? "\n🏢 Бизнес-заявка" : "";
  const adminMsg =
    `📥 <b>Новая заявка!</b>${bizLabel}\n` +
    `👤 ${parsed.data.name}\n` +
    `📱 ${parsed.data.phone}\n` +
    `📚 ${dirLabel}${fmtLabel ? ` · ${fmtLabel}` : ""}${msgText}\n` +
    `🕐 ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`;
  notifyAdmin(adminMsg);
  notifyAdminVK(adminMsg);

  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
}));

router.patch("/applications/:id", requireAdmin, asyncHandler(async (req, res) => {
  const params = UpdateApplicationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Неверный ID" });
    return;
  }
  const body = UpdateApplicationBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (body.data.status !== undefined) updateData.status = body.data.status;
  if (body.data.businessStatus !== undefined) updateData.businessStatus = body.data.businessStatus;

  const [row] = await db.update(applicationsTable)
    .set(updateData)
    .where(eq(applicationsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Заявка не найдена" });
    return;
  }

  await logAudit(req.session!.userId!, "UPDATE_APPLICATION_STATUS", {
    targetTable: "applications",
    targetId: row.id,
    after: { status: row.status, businessStatus: row.businessStatus },
  });

  res.json(UpdateApplicationResponse.parse({ ...row, createdAt: row.createdAt.toISOString() }));
}));

export default router;
