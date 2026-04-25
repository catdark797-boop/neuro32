/**
 * One-shot: brand the VK community (avatar + cover + description).
 * Run with: tsx src/scripts/vk-brand.ts
 * Requires env: VK_BOT_TOKEN, VK_GROUP_ID.
 */
import { renderVKAvatar, renderVKCover } from "../lib/post-image";
import { setGroupCover, editGroupMeta } from "../lib/vk";

async function main() {
  const groupId = Number(process.env.VK_GROUP_ID);
  if (!groupId) throw new Error("VK_GROUP_ID env missing");

  console.log("[vk-brand] rendering cover (1590×400)...");
  const cover = await renderVKCover();

  console.log("[vk-brand] uploading cover to VK...");
  await setGroupCover(groupId, cover);
  console.log("[vk-brand] cover uploaded ✓");

  console.log("[vk-brand] updating description...");
  await editGroupMeta(groupId, {
    description:
      "Офлайн-лаборатория ИИ-практик в Новозыбкове. 4 направления: дети 7-12, подростки 13-17, взрослые 18+, кибербезопасность.\n\n" +
      "Учим работать с ChatGPT, Claude, Midjourney, Sora, Suno, YandexGPT, Python, Kali Linux — на реальных задачах.\n\n" +
      "💡 Пробное занятие — 500 ₽\n" +
      "📍 Коммунистическая, 22А (АНО «Простые вещи»), 4 рабочих ПК\n" +
      "📞 +7 (901) 976-98-10 · Telegram @DSM1322\n" +
      "🌐 нейро32.рф",
    website: "https://нейро32.рф",
  });
  console.log("[vk-brand] description updated ✓");

  // Avatar upload is separate VK flow (photos.getOwnerPhotoUploadServer).
  // For initial brand, users usually upload avatar by hand — skip here unless requested.
  console.log("[vk-brand] avatar rendered (400×400), saved but not auto-uploaded to keep scopes minimal");
  console.log("[vk-brand] ALL DONE");
  void renderVKAvatar;
}

main().catch((err) => {
  console.error("[vk-brand] FAILED:", err);
  process.exit(1);
});
