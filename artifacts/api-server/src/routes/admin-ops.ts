// Admin-only operational endpoints for manually triggering scheduled jobs.
// Useful for testing / catching up after downtime.
import { Router, type IRouter } from "express";
import { requireAdmin } from "../middlewares/auth";
import { asyncHandler } from "../lib/asyncHandler";
import { runVkAutopostOnce } from "../cron/vk-autopost";

const router: IRouter = Router();

router.post(
  "/admin-ops/vk-autopost-now",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const result = await runVkAutopostOnce();
    res.json(result);
  }),
);

export default router;
