// Scheduled VK auto-post. Runs Mon/Wed/Fri at 10:00 Europe/Moscow.
//
// Picks the next seed post in round-robin order (tracked by the
// `vk_cron_state` row in settings), renders its SVG into a PNG, uploads,
// and posts to the wall.
//
// Disabled unless CRON_VK_ENABLED === "1" to avoid spamming the wall on
// every deploy. Run `railway variable set CRON_VK_ENABLED=1` once ready.
import cron from "node-cron";
import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { uploadWallPhoto, postToWall } from "../lib/vk";
import { POSTS_SEED } from "../lib/vk-posts-seed";
import { logger } from "../lib/logger";
// NOTE: post-image imports sharp (native addon). Lazy-load it inside the job
// so module resolution failures (e.g. missing native binary in the runtime
// image) don't crash the whole server on boot.

const CURSOR_KEY = "vk_cron_cursor";

async function readCursor(): Promise<number> {
  const [row] = await db.select().from(settingsTable).where(eq(settingsTable.key, CURSOR_KEY));
  const n = row ? Number(row.value) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

async function writeCursor(n: number): Promise<void> {
  const [row] = await db.select().from(settingsTable).where(eq(settingsTable.key, CURSOR_KEY));
  if (row) {
    await db.update(settingsTable).set({ value: String(n) }).where(eq(settingsTable.key, CURSOR_KEY));
  } else {
    await db.insert(settingsTable).values({ key: CURSOR_KEY, value: String(n) });
  }
}

export async function runVkAutopostOnce(): Promise<{ ok: boolean; skipped?: string; postId?: number }> {
  const groupIdStr = process.env.VK_GROUP_ID;
  if (!groupIdStr) return { ok: false, skipped: "VK_GROUP_ID not set" };
  const groupId = Number(groupIdStr);
  if (!Number.isFinite(groupId) || groupId <= 0) return { ok: false, skipped: "Bad VK_GROUP_ID" };

  const cursor = await readCursor();
  const idx = cursor % POSTS_SEED.length;
  const post = POSTS_SEED[idx];
  if (!post) return { ok: false, skipped: "Empty seed" };

  logger.info({ idx, total: POSTS_SEED.length }, "[vk-cron] publishing post");

  let attachments: string[] = [];
  try {
    const { renderPostImage } = await import("../lib/post-image");
    const png = await renderPostImage(post.template);
    const photo = await uploadWallPhoto(groupId, png);
    attachments = [photo];
  } catch (err) {
    // Community tokens often can't upload photos — fall back to text-only
    // so at least the post still goes out.
    logger.warn({ err }, "[vk-cron] photo upload failed, posting text-only");
  }

  try {
    const postId = await postToWall(groupId, post.text, attachments);
    await writeCursor(cursor + 1);
    logger.info({ postId, idx }, "[vk-cron] post published");
    return { ok: true, postId };
  } catch (err) {
    logger.error({ err, idx }, "[vk-cron] wall.post failed");
    return { ok: false };
  }
}

export function scheduleVkAutopost() {
  if (process.env.CRON_VK_ENABLED !== "1") {
    logger.info("[vk-cron] CRON_VK_ENABLED != 1 — scheduler off");
    return;
  }
  // Mon, Wed, Fri at 10:00 Moscow time. `timezone` ensures we don't drift
  // with server-side UTC.
  cron.schedule(
    "0 10 * * 1,3,5",
    async () => {
      try {
        await runVkAutopostOnce();
      } catch (err) {
        logger.error({ err }, "[vk-cron] unexpected failure");
      }
    },
    { timezone: "Europe/Moscow" },
  );
  logger.info("[vk-cron] scheduled Mon/Wed/Fri 10:00 Europe/Moscow");
}
