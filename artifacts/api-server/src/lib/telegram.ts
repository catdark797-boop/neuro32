/**
 * Telegram Admin Notifications
 * Sends messages to the admin's Telegram chat when new applications/registrations arrive.
 *
 * Required env vars:
 *   TELEGRAM_BOT_TOKEN  — from @BotFather
 *   TELEGRAM_ADMIN_CHAT_ID — your personal chat_id (send /start to the bot, then call getUpdates)
 */
import * as Sentry from "@sentry/node";

const TG_API = "https://api.telegram.org";
const RETRY_DELAYS_MS = [0, 2_000, 8_000]; // 3 attempts: immediate, 2s, 8s

async function sendOnce(token: string, chatId: string, message: string): Promise<{ ok: boolean; status?: number; body?: string; error?: Error }> {
  try {
    const payload = Buffer.from(
      JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
      "utf-8",
    );
    const res = await fetch(`${TG_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": String(payload.byteLength),
      },
      body: payload,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, status: res.status, body };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

export async function notifyAdmin(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  // Gracefully skip if not configured — never crash the server
  if (!token || !chatId) return;

  let lastFailure: { status?: number; body?: string; error?: Error } | null = null;
  for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt++) {
    if (RETRY_DELAYS_MS[attempt] > 0) {
      await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
    }
    const result = await sendOnce(token, chatId, message);
    if (result.ok) {
      if (attempt > 0) {
        // Recovered on retry — valuable Sentry signal that TG is flaky.
        Sentry.captureMessage("Telegram notify recovered on retry", {
          level: "info",
          tags: { feature: "notify-admin" },
          extra: { attempt, lastFailure },
        });
      }
      return;
    }
    lastFailure = { status: result.status, body: result.body, error: result.error };
    console.warn("[telegram] sendMessage attempt failed:", attempt, result.status ?? result.error?.message);
  }

  // All retries exhausted — alert Sentry so admins know they missed a lead.
  Sentry.captureMessage("Telegram admin notification failed after retries", {
    level: "error",
    tags: { feature: "notify-admin" },
    extra: { attempts: RETRY_DELAYS_MS.length, lastFailure, messagePreview: message.slice(0, 120) },
  });
}
