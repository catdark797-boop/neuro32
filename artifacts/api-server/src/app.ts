import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from "express-session";
import pg from "pg";
import connectPgSimple from "connect-pg-simple";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { Sentry } from "./lib/sentry";

const sentryEnabled = !!process.env.SENTRY_DSN;

const app: Express = express();

// Trust reverse proxy (Railway edge + Fastly CDN). Railway sits behind ~2
// hops (Fastly + internal router). With `true`, express-rate-limit refuses
// to start because it considers it permissive; with `1`, the forwarded IP
// resolves to the same CDN edge IP for every request → rate-limit buckets
// collapse. A numeric value = specific proxy-count is the safe middle ground.
app.set("trust proxy", 2);

// HTTP security headers.
//
// Timezone convention: ALL timestamps in DB are UTC (drizzle `timestamp`
// columns default to UTC). Conversion to Europe/Moscow happens only inside
// notifyAdmin / notifyAdminVK message bodies + JSON responses where humans
// will read them. This keeps internal comparisons / sorts straightforward
// and avoids DST surprises.
//
// CSP intentionally disabled: this is an API consumed by the SPA at
// нейро32.рф. Browsers don't execute API responses as documents, so a CSP
// header here would be a no-op while the SPA's own <meta http-equiv> +
// .htaccess on reg.ru carry the real defense.
app.use(
  helmet({
    contentSecurityPolicy: false, // see comment above; CSP is the SPA's job
    crossOriginResourcePolicy: { policy: "cross-origin" },
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "no-referrer" },
    // HSTS: 1 year, include subdomains (Railway is behind HTTPS anyway)
    hsts: process.env.NODE_ENV === "production"
      ? { maxAge: 31_536_000, includeSubDomains: true, preload: false }
      : false,
    // Prevent browsers from MIME-sniffing
    noSniff: true,
  }),
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// In production ALLOWED_ORIGINS must be set (validated in index.ts).
// In development, restrict to localhost origins.
const DEV_ORIGINS = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];
const allowedOrigins: string[] | boolean =
  process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : process.env.NODE_ENV === "production"
      ? []
      : DEV_ORIGINS;

app.use(cors({ origin: allowedOrigins, credentials: true }));

// Global rate limit — 300 requests per 15 min per IP (coarse DDoS/abuse protection)
// Specific endpoints (auth, enroll) have their own tighter limits in route handlers
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    ...(process.env.NODE_ENV === "production"
      ? {
          // In production, persist sessions in Postgres (MemoryStore is unsafe).
          // Uses DATABASE_URL already required by env validation.
          store: new (connectPgSimple(session))({
            pool: new pg.Pool({ connectionString: process.env.DATABASE_URL }),
            // Table is provisioned by create-session-table.cjs (run once).
            // createTableIfMissing looks for /app/dist/table.sql which isn't bundled in our image.
            createTableIfMissing: false,
          }),
        }
      : {}),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite="none" is required for the cross-origin SPA (нейро32.рф →
      // api-server-*.up.railway.app). In dev we stay on localhost so "lax" is
      // enough + stricter. "none" always pairs with secure:true (enforced above).
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      // 7 days, not 30 — shorter window if a device is compromised. Active
      // users roll their session forward with every request (rolling: true is
      // the default for express-session when resave is false + cookie has a
      // maxAge).
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use("/api", router);

// Sentry Express error handler MUST come before our own error middleware.
// It intercepts errors, reports to Sentry, then forwards to next().
if (sentryEnabled) {
  Sentry.setupExpressErrorHandler(app);
}

// Global error handler — catches anything thrown in async route handlers
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ error: "Internal server error" });
});

export default app;
