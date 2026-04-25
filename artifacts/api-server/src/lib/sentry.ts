// Sentry initialization for the api-server.
//
// Enabled only when SENTRY_DSN is set. Silent no-op in dev/test so local work
// doesn't spam Sentry, and so unit tests don't need the SDK configured.
//
// Scrubs common credential fields from events before send.
import * as Sentry from "@sentry/node";

const SCRUB_KEYS = new Set([
  "password",
  "passwordhash",
  "newpassword",
  "currentpassword",
  "token",
  "authorization",
  "cookie",
  "set-cookie",
  "session",
  "x-session-id",
]);

export function scrub<T>(value: T, depth = 0): T {
  if (depth > 5 || value == null) return value;
  if (Array.isArray(value)) return value.map((v) => scrub(v, depth + 1)) as T;
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SCRUB_KEYS.has(k.toLowerCase()) ? "[REDACTED]" : scrub(v, depth + 1);
    }
    return out as T;
  }
  return value;
}

export function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    // Visible in Railway logs so we notice silent no-ops.
    console.log("[sentry] SENTRY_DSN not set — Sentry disabled");
    return false;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV ?? "development",
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0.1"),
    // Strip PII — we never want raw emails/IPs in Sentry.
    sendDefaultPii: false,
    beforeSend(event) {
      if (event.request) {
        event.request.data = scrub(event.request.data);
        event.request.headers = scrub(event.request.headers);
        event.request.cookies = undefined;
      }
      if (event.extra) event.extra = scrub(event.extra);
      return event;
    },
  });
  console.log("[sentry] initialized", {
    env: process.env.NODE_ENV,
    release: process.env.SENTRY_RELEASE ?? "(none)",
  });
  return true;
}

export { Sentry };
