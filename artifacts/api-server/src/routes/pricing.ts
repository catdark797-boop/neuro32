// Public pricing endpoint — single source of truth for tier prices.
// Reads from settings table with hard-coded fallbacks so the site
// stays functional even if the rows are missing. Admin can override
// via PATCH (auth required).
import { Router, type IRouter } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import { asyncHandler } from "../lib/asyncHandler";

const router: IRouter = Router();

// Keys stored in settings table. Values are serialized numbers.
const PRICE_KEYS = {
  kids: "price_kids",
  teens: "price_teens",
  adults: "price_adults",
  cyber: "price_cyber",
  trial: "price_trial",
} as const;

// Defaults — keep in sync with Offer.tsx / PRD. Price in RUB.
const PRICE_DEFAULTS: Record<keyof typeof PRICE_KEYS, number> = {
  kids: 5500,
  teens: 7000,
  adults: 8500,
  cyber: 11000,
  trial: 500,
};

async function readAll(): Promise<Record<keyof typeof PRICE_KEYS, number>> {
  const keys = Object.values(PRICE_KEYS);
  const rows = await db.select().from(settingsTable);
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const out = { ...PRICE_DEFAULTS };
  for (const [tier, key] of Object.entries(PRICE_KEYS) as [keyof typeof PRICE_KEYS, string][]) {
    const raw = map.get(key);
    const n = raw != null ? Number(raw) : NaN;
    if (Number.isFinite(n) && n > 0) out[tier] = n;
  }
  void keys;
  return out;
}

router.get("/pricing", asyncHandler(async (_req, res) => {
  const prices = await readAll();
  // Public endpoint, cacheable by CDN briefly.
  res.set("cache-control", "public, max-age=60, stale-while-revalidate=300");
  res.json({ prices });
}));

const UpdateBody = z.object({
  kids: z.number().int().positive().max(1_000_000).optional(),
  teens: z.number().int().positive().max(1_000_000).optional(),
  adults: z.number().int().positive().max(1_000_000).optional(),
  cyber: z.number().int().positive().max(1_000_000).optional(),
  trial: z.number().int().positive().max(1_000_000).optional(),
});

router.patch("/pricing", requireAdmin, asyncHandler(async (req, res) => {
  const parsed = UpdateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? "Неверный формат" });
    return;
  }

  // Upsert changed keys only. Keys we don't receive stay untouched.
  for (const [tier, value] of Object.entries(parsed.data) as [keyof typeof PRICE_KEYS, number | undefined][]) {
    if (value == null) continue;
    const key = PRICE_KEYS[tier];
    const [existing] = await db.select().from(settingsTable).where(eq(settingsTable.key, key));
    if (existing) {
      await db.update(settingsTable).set({ value: String(value) }).where(eq(settingsTable.key, key));
    } else {
      await db.insert(settingsTable).values({ key, value: String(value) });
    }
  }

  res.json({ prices: await readAll() });
}));

export default router;
