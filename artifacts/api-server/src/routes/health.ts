import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { db, usersTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { asyncHandler } from "../lib/asyncHandler";

const router: IRouter = Router();

// Basic liveness — Railway uses this
router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

// Deep readiness: verify DB connectivity with a 2s timeout
router.get("/readyz", asyncHandler(async (_req, res) => {
  try {
    await Promise.race([
      db.execute(sql`SELECT 1`),
      new Promise((_, rej) => setTimeout(() => rej(new Error("db timeout")), 2000)),
    ]);
    res.json({ status: "ok", db: "connected" });
  } catch {
    res.status(503).json({ status: "error", db: "disconnected" });
    // Touch usersTable import so it stays tree-shaken correctly if needed
    void usersTable;
  }
}));

export default router;
