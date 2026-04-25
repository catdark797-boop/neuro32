/**
 * VK Admin Notifications
 * Sends messages to the admin's VK inbox via a community (group) access token.
 *
 * Required env vars:
 *   VK_BOT_TOKEN   — community access token from VK ("Управление сообществом → Работа с API → Ключи доступа")
 *   VK_ADMIN_PEER_ID — admin's VK user id (e.g. 123456789)
 *
 * Prereq: the admin must have sent at least one message to the community first
 *         (VK policy: communities can only reply to users who initiated contact).
 */

import * as Sentry from "@sentry/node";

const VK_API = "https://api.vk.com/method";
const VK_VERSION = "5.199";

// VK errors that are "terminal" — no point retrying, they'll fail the same
// way forever until someone fixes config or VK community settings:
//   901 — Permission to send messages required (user must write first)
//   15  — Access denied (bad scope on token)
//   5   — Authorization failed (expired/revoked token)
//   7   — Permission to perform this action is denied
const VK_TERMINAL_ERROR_CODES = new Set([901, 15, 7, 5]);

async function vkSendOnce(token: string, peerId: string, message: string) {
  const plainText = message.replace(/<\/?[^>]+>/g, "");
  const randomId = Math.floor(Math.random() * 1_000_000_000);
  const url = new URL(`${VK_API}/messages.send`);
  url.searchParams.set("access_token", token);
  url.searchParams.set("v", VK_VERSION);
  url.searchParams.set("peer_id", peerId);
  url.searchParams.set("random_id", String(randomId));
  url.searchParams.set("message", plainText);
  try {
    const res = await fetch(url.toString(), { method: "POST", signal: AbortSignal.timeout(10_000) });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false as const, status: res.status, body };
    }
    const json = (await res.json()) as { error?: { error_code: number; error_msg?: string } };
    if (json.error) {
      return { ok: false as const, error_code: json.error.error_code, error_msg: json.error.error_msg };
    }
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

export async function notifyAdminVK(message: string): Promise<void> {
  const token = process.env.VK_BOT_TOKEN;
  const peerId = process.env.VK_ADMIN_PEER_ID;

  if (!token || !peerId) return;

  const delays = [0, 2_000, 8_000];
  let lastFailure: unknown = null;
  let terminal = false;
  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (delays[attempt] > 0) await new Promise((r) => setTimeout(r, delays[attempt]));
    const result = await vkSendOnce(token, peerId, message);
    if (result.ok) {
      if (attempt > 0) {
        Sentry.captureMessage("VK notify recovered on retry", {
          level: "info",
          tags: { feature: "notify-admin-vk" },
          extra: { attempt, lastFailure },
        });
      }
      return;
    }
    lastFailure = result;
    if ("error_code" in result && result.error_code && VK_TERMINAL_ERROR_CODES.has(result.error_code)) {
      // e.g. 901 — user hasn't written to community yet. VK policy, expected.
      console.warn("[vk] terminal error, not retrying:", result.error_code, result.error_msg);
      terminal = true;
      break;
    }
    console.warn("[vk] attempt failed:", attempt, "error_msg" in result ? result.error_msg : ("status" in result ? result.status : result));
  }

  // Only alert Sentry for genuine failures — terminal VK policy errors
  // (user hasn't initiated contact) would otherwise drown real incidents.
  if (!terminal) {
    Sentry.captureMessage("VK admin notification failed after retries", {
      level: "error",
      tags: { feature: "notify-admin-vk" },
      extra: { lastFailure, messagePreview: message.slice(0, 120) },
    });
  }
}

/**
 * ─── Wall posting primitives ─────────────────────────────────────────────
 * Required scope on the community token: wall + photos.
 */

type VKError = { error?: { error_code: number; error_msg: string } };

async function vkCall<T>(method: string, params: Record<string, string>): Promise<T> {
  const token = process.env.VK_BOT_TOKEN;
  if (!token) throw new Error("VK_BOT_TOKEN not configured");

  const url = new URL(`${VK_API}/${method}`);
  url.searchParams.set("access_token", token);
  url.searchParams.set("v", VK_VERSION);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), { method: "POST" });
  const json = (await res.json()) as VKError & { response?: T };
  if (json.error) {
    throw new Error(`VK ${method} error ${json.error.error_code}: ${json.error.error_msg}`);
  }
  return json.response as T;
}

/** Uploads a PNG buffer to the community's wall photo pool. Returns VK attachment id. */
export async function uploadWallPhoto(groupId: number, pngBuffer: Buffer): Promise<string> {
  // 1. Get upload URL
  const { upload_url } = await vkCall<{ upload_url: string }>("photos.getWallUploadServer", {
    group_id: String(groupId),
  });

  // 2. Upload file via multipart/form-data
  const form = new FormData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
const blob = new Blob([pngBuffer as any], { type: "image/png" });
  form.append("photo", blob, "post.png");
  const uploadRes = await fetch(upload_url, { method: "POST", body: form });
  const uploadJson = (await uploadRes.json()) as { server: number; photo: string; hash: string };

  // 3. Save the photo to the group
  const saved = await vkCall<Array<{ id: number; owner_id: number }>>("photos.saveWallPhoto", {
    group_id: String(groupId),
    server: String(uploadJson.server),
    photo: uploadJson.photo,
    hash: uploadJson.hash,
  });
  const item = saved[0];
  return `photo${item.owner_id}_${item.id}`;
}

/** Post to a community wall. Returns the post id. */
export async function postToWall(
  groupId: number,
  message: string,
  attachments: string[] = [],
): Promise<number> {
  const params: Record<string, string> = {
    owner_id: `-${groupId}`,
    from_group: "1",
    message,
  };
  if (attachments.length) params.attachments = attachments.join(",");
  const resp = await vkCall<{ post_id: number }>("wall.post", params);
  return resp.post_id;
}

/** Upload and set a community cover (1590×400 PNG buffer). */
export async function setGroupCover(groupId: number, pngBuffer: Buffer): Promise<void> {
  const { upload_url } = await vkCall<{ upload_url: string }>(
    "photos.getOwnerCoverPhotoUploadServer",
    {
      group_id: String(groupId),
      crop_x: "0",
      crop_y: "0",
      crop_x2: "1590",
      crop_y2: "400",
    },
  );
  const form = new FormData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
const blob = new Blob([pngBuffer as any], { type: "image/png" });
  form.append("photo", blob, "cover.png");
  const uploadRes = await fetch(upload_url, { method: "POST", body: form });
  const uploadJson = (await uploadRes.json()) as { hash: string; photo: string };
  await vkCall("photos.saveOwnerCoverPhoto", {
    hash: uploadJson.hash,
    photo: uploadJson.photo,
  });
}

/** Update the community description and optionally name/website. */
export async function editGroupMeta(
  groupId: number,
  edits: { title?: string; description?: string; website?: string; email?: string },
): Promise<void> {
  const params: Record<string, string> = { group_id: String(groupId) };
  if (edits.title) params.title = edits.title;
  if (edits.description) params.description = edits.description;
  if (edits.website) params.website = edits.website;
  if (edits.email) params.email = edits.email;
  await vkCall("groups.edit", params);
}
