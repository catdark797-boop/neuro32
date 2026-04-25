/**
 * Autopost: take next pending post from seed + DB state, render image, publish to VK wall.
 * Run with: tsx src/scripts/vk-autopost.ts [--dry-run]
 * Env: VK_BOT_TOKEN, VK_GROUP_ID.
 *
 * State is stored in the `settings` table as key `vk_next_post_idx` (uses existing table).
 * No new migration needed — we just bump a number.
 */
import { renderPostImage } from "../lib/post-image";
import { uploadWallPhoto, postToWall } from "../lib/vk";
import { POSTS_SEED } from "../lib/vk-posts-seed";
import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const STATE_KEY = "vk_next_post_idx";

async function getNextIdx(): Promise<number> {
  const [row] = await db
    .select({ value: settingsTable.value })
    .from(settingsTable)
    .where(eq(settingsTable.key, STATE_KEY));
  return row ? Number(row.value) || 0 : 0;
}
async function saveIdx(idx: number): Promise<void> {
  const [existing] = await db
    .select({ key: settingsTable.key })
    .from(settingsTable)
    .where(eq(settingsTable.key, STATE_KEY));
  if (existing) {
    await db.update(settingsTable).set({ value: String(idx) }).where(eq(settingsTable.key, STATE_KEY));
  } else {
    await db.insert(settingsTable).values({ key: STATE_KEY, value: String(idx) });
  }
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const groupId = Number(process.env.VK_GROUP_ID);
  if (!groupId) throw new Error("VK_GROUP_ID env missing");
  if (!process.env.VK_BOT_TOKEN && !dryRun) throw new Error("VK_BOT_TOKEN env missing");

  const idx = await getNextIdx();
  const post = POSTS_SEED[idx % POSTS_SEED.length];
  console.log(`[vk-autopost] post #${idx} (template=${post.template.kind}) — dry-run=${dryRun}`);

  // Community tokens can't use photos.getWallUploadServer (VK restriction).
  // We attempt upload; if it fails, fall back to text-only.
  let attachments: string[] = [];
  try {
    const png = await renderPostImage(post.template);
    console.log(`[vk-autopost] image rendered: ${png.length} bytes`);
    if (dryRun) {
      const fs = await import("node:fs");
      const path = `/tmp/vk-post-${idx}.png`;
      fs.writeFileSync(path, png);
      console.log(`[vk-autopost] DRY RUN — image saved to ${path}`);
      console.log(`[vk-autopost] text: ${post.text.slice(0, 200)}...`);
      return;
    }
    const attach = await uploadWallPhoto(groupId, png);
    attachments = [attach];
    console.log(`[vk-autopost] image attached: ${attach}`);
  } catch (e) {
    console.warn(`[vk-autopost] image upload skipped (${(e as Error).message}) — posting text-only`);
    if (dryRun) {
      console.log(`[vk-autopost] DRY RUN — text: ${post.text.slice(0, 200)}...`);
      return;
    }
  }

  const postId = await postToWall(groupId, post.text, attachments);
  console.log(`[vk-autopost] posted as #${postId} → https://vk.com/club${groupId}?w=wall-${groupId}_${postId}`);

  await saveIdx(idx + 1);
  console.log(`[vk-autopost] advanced cursor to ${idx + 1}`);
}

main().catch((err) => {
  console.error("[vk-autopost] FAILED:", err);
  process.exit(1);
});
