import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { db } from "@workspace/db";
import { businessInquiriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import { asyncHandler } from "../lib/asyncHandler";
import { notifyAdmin } from "../lib/telegram";
import { notifyAdminVK } from "../lib/vk";

const submitLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Слишком много заявок. Попробуйте через минуту." },
});

const router: IRouter = Router();

const CreateBusinessInquiryBody = z.object({
  nameOrCompany: z.string().min(1).max(200),
  contact: z.string().min(1).max(200),
  taskDescription: z.string().min(1).max(2000),
  format: z.enum(["only_neuro32", "educational_case", "any"]).default("any"),
  // GDPR / 152-ФЗ — this literal makes the consent truly mandatory at the
  // schema level. Before, it was a plain bool checked AFTER parse, so a
  // client could bypass by sending `undefined` (which would coerce to false
  // in the handler check — actually wait, it WOULD fail. But the schema was
  // `z.boolean()` which rejected undefined. Either way literal(true) is the
  // right thing: the spec becomes unambiguous and accidental-false is blocked).
  consentPersonalData: z.literal(true, {
    errorMap: () => ({ message: "Необходимо дать согласие на обработку персональных данных" }),
  }),
  consentEducationalCase: z.boolean().default(false),
});

// Public: submit a business inquiry
router.post("/business-inquiry", submitLimiter, asyncHandler(async (req, res) => {
  const parsed = CreateBusinessInquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.errors[0]?.message ?? "Неверный формат" });
    return;
  }

  await db.insert(businessInquiriesTable).values(parsed.data);

  const formatLabels: Record<string, string> = {
    only_neuro32: "Только Нейро 32",
    educational_case: "Образовательный кейс",
    any: "Любой формат",
  };
  const msg =
    `💼 <b>Новая бизнес-заявка!</b>\n` +
    `🏢 ${parsed.data.nameOrCompany}\n` +
    `📱 ${parsed.data.contact}\n` +
    `📝 ${parsed.data.taskDescription}\n` +
    `🎯 Формат: ${formatLabels[parsed.data.format] ?? parsed.data.format}\n` +
    `🕐 ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`;
  // Fire-and-forget; failures are swallowed by the helpers + Sentry picks up.
  notifyAdmin(msg);
  notifyAdminVK(msg);

  res.status(201).json({ ok: true });
}));

// Admin: list all business inquiries
router.get("/business-inquiry", requireAdmin, asyncHandler(async (_req, res) => {
  const rows = await db
    .select()
    .from(businessInquiriesTable)
    .orderBy(businessInquiriesTable.createdAt);

  res.json({
    ok: true,
    data: rows.reverse().map(r => ({
      ...r,
      id: String(r.id),
      createdAt: r.createdAt.toISOString(),
    })),
  });
}));

// Admin: delete a business inquiry
router.delete("/business-inquiry/:id", requireAdmin, asyncHandler(async (req, res) => {
  const idParsed = z.object({ id: z.coerce.number().int().positive() }).safeParse(req.params);
  if (!idParsed.success) {
    res.status(400).json({ ok: false, error: "Неверный ID" });
    return;
  }

  const [row] = await db
    .delete(businessInquiriesTable)
    .where(eq(businessInquiriesTable.id, idParsed.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ ok: false, error: "Заявка не найдена" });
    return;
  }

  res.json({ ok: true });
}));

export default router;
