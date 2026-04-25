import "dotenv/config";
// Sentry must init BEFORE any other module that could throw, so its
// instrumentation can hook into require/import graphs.
import { initSentry } from "./lib/sentry";
initSentry();
import app from "./app";
import { scheduleVkAutopost } from "./cron/vk-autopost";
import { logger } from "./lib/logger";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// ---------------------------------------------------------------------------
// Env validation — fail fast before binding to a port
// ---------------------------------------------------------------------------
function validateEnv() {
  const always = ["PORT", "DATABASE_URL", "SESSION_SECRET"];
  const productionOnly = ["ALLOWED_ORIGINS", "ADMIN_EMAIL", "ADMIN_PASSWORD"];

  for (const key of always) {
    if (!process.env[key]) {
      throw new Error(
        `Required environment variable "${key}" is not set. ` +
        `Copy .env.example to .env and fill in all required values.`,
      );
    }
  }

  if (process.env.NODE_ENV === "production") {
    for (const key of productionOnly) {
      if (!process.env[key]) {
        throw new Error(
          `Required environment variable "${key}" is not set in production mode. ` +
          `Never deploy without explicit values for all production env vars.`,
        );
      }
    }
    if (process.env.SESSION_SECRET === "dev-secret-change-in-production") {
      throw new Error(
        "SESSION_SECRET must not use the default development value in production.",
      );
    }
  }
}

validateEnv();

const rawPort = process.env["PORT"]!;
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    logger.warn("ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin seed");
    return;
  }

  const [existing] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, adminEmail));
  if (existing) {
    // Admin already exists — do NOT rewrite password on every boot.
    // If you need to rotate, do it through the admin UI or manual SQL.
    // Use debug not info: Admin email is sensitive (PII + identifies the
    // owner) and the line otherwise repeats every cold-start, polluting
    // any operator with prod log access.
    logger.debug({ adminId: existing.id }, "Admin already exists");
    return;
  }
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const [created] = await db
    .insert(usersTable)
    .values({
      name: "Степан Денис",
      email: adminEmail,
      phone: "+79019769810",
      telegram: "@DSM1322",
      passwordHash,
      role: "admin",
      direction: "Все",
      goals: "Обучение ИИ",
    })
    .returning({ id: usersTable.id });
  logger.info({ adminId: created?.id }, "Admin user seeded");
}

const server = app.listen(port, async (err?: Error) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  try {
    await seedAdmin();
  } catch (e) {
    logger.error({ err: e }, "Failed to seed admin");
  }

  // Kick off scheduled jobs after the server is ready.
  try {
    scheduleVkAutopost();
  } catch (e) {
    logger.error({ err: e }, "Failed to schedule vk autopost");
  }
});

// Graceful shutdown: give in-flight requests ~10s to drain
function shutdown(signal: string) {
  logger.info({ signal }, "Shutdown signal received, closing server…");
  const timer = setTimeout(() => {
    logger.warn("Shutdown timeout reached, forcing exit");
    process.exit(1);
  }, 10_000);
  server.close((err) => {
    clearTimeout(timer);
    if (err) {
      logger.error({ err }, "Error during server close");
      process.exit(1);
    }
    logger.info("Server closed cleanly");
    process.exit(0);
  });
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
