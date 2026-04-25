import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  UpdateSettingsBody,
  GetSettingsResponse,
  UpdateSettingsResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";
import { asyncHandler } from "../lib/asyncHandler";

const router: IRouter = Router();

async function getSetting(key: string, defaultValue: string): Promise<string> {
  const [row] = await db.select().from(settingsTable).where(eq(settingsTable.key, key));
  return row?.value ?? defaultValue;
}

async function setSetting(key: string, value: string): Promise<void> {
  const [existing] = await db.select().from(settingsTable).where(eq(settingsTable.key, key));
  if (existing) {
    await db.update(settingsTable).set({ value }).where(eq(settingsTable.key, key));
  } else {
    await db.insert(settingsTable).values({ key, value });
  }
}

router.get("/settings", asyncHandler(async (_req, res) => {
  const groupMaxStr = await getSetting("group_max", "8");
  res.json(GetSettingsResponse.parse({ groupMax: parseInt(groupMaxStr, 10) }));
}));

router.patch("/settings", requireAdmin, asyncHandler(async (req, res) => {
  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.groupMax !== undefined) {
    await setSetting("group_max", String(parsed.data.groupMax));
  }

  const groupMaxStr = await getSetting("group_max", "8");
  res.json(UpdateSettingsResponse.parse({ groupMax: parseInt(groupMaxStr, 10) }));
}));

export default router;
