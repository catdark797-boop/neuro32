import { Router, type IRouter } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import { auditLogsTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import { asyncHandler } from "../lib/asyncHandler";

const router: IRouter = Router();

// List audit logs — admin only, newest first, paginated
router.get("/admin/audit-logs", requireAdmin, asyncHandler(async (req, res) => {
  const query = z
    .object({
      limit: z.coerce.number().int().min(1).max(200).default(50),
      offset: z.coerce.number().int().min(0).default(0),
    })
    .safeParse(req.query);

  const { limit, offset } = query.success ? query.data : { limit: 50, offset: 0 };

  const rows = await db
    .select({
      id: auditLogsTable.id,
      adminId: auditLogsTable.adminId,
      adminName: usersTable.name,
      action: auditLogsTable.action,
      targetTable: auditLogsTable.targetTable,
      targetId: auditLogsTable.targetId,
      before: auditLogsTable.before,
      after: auditLogsTable.after,
      createdAt: auditLogsTable.createdAt,
    })
    .from(auditLogsTable)
    .leftJoin(usersTable, eq(auditLogsTable.adminId, usersTable.id))
    .orderBy(desc(auditLogsTable.createdAt))
    .limit(limit)
    .offset(offset);

  res.json(rows);
}));

export default router;

// ---------------------------------------------------------------------------
// Typed action labels for audit log entries
// ---------------------------------------------------------------------------
export type AuditAction =
  | "DELETE_USER"
  | "DELETE_SELF"
  | "UPDATE_APPLICATION_STATUS"
  | "BULK_UPDATE_APPLICATION_STATUS"
  | "APPROVE_REVIEW"
  | "REJECT_REVIEW"
  | "DELETE_REVIEW";

// ---------------------------------------------------------------------------
// Helper — call this from other route files to record admin actions
// ---------------------------------------------------------------------------
export async function logAudit(
  adminId: number,
  action: AuditAction,
  opts?: {
    targetTable?: string;
    targetId?: number;
    before?: unknown;
    after?: unknown;
  },
) {
  await db.insert(auditLogsTable).values({
    adminId,
    action,
    targetTable: opts?.targetTable ?? null,
    targetId: opts?.targetId ?? null,
    before: (opts?.before as object) ?? null,
    after: (opts?.after as object) ?? null,
  });
}
