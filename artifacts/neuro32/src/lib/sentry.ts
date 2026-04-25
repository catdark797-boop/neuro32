// Sentry initialization for the SPA. No-op unless VITE_SENTRY_DSN is set,
// so local dev / PR preview builds don't spam the project.
import * as Sentry from "@sentry/react";

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: (import.meta.env.MODE as string) || "production",
    release: import.meta.env.VITE_SENTRY_RELEASE as string | undefined,
    // Conservative sample rate — raise once we've tuned the quota.
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES ?? "0.1"),
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    integrations: [Sentry.browserTracingIntegration()],
    sendDefaultPii: false,
    beforeSend(event) {
      // Strip anything that looks credential-ish. Cookies are httpOnly in
      // prod, but defense-in-depth.
      if (event.request?.cookies) event.request.cookies = undefined;
      if (event.request?.headers) {
        for (const k of Object.keys(event.request.headers)) {
          if (/cookie|authorization|token/i.test(k)) {
            event.request.headers[k] = "[REDACTED]";
          }
        }
      }
      return event;
    },
  });
}

export { Sentry };
