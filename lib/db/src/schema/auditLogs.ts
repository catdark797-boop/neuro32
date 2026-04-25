import { pgTable, serial, integer, text, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

/** Records key admin actions for compliance / audit trail. */
export const auditLogsTable = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  /** ID of the admin who performed the action */
  adminId: integer("admin_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  /** Human-readable action label, e.g. "DELETE_USER", "APPROVE_REVIEW" */
  action: text("action").notNull(),
  /** The table that was affected */
  targetTable: text("target_table"),
  /** The ID of the affected row */
  targetId: integer("target_id"),
  /** Snapshot of the value before the change */
  before: jsonb("before"),
  /** Snapshot of the value after the change */
  after: jsonb("after"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index("audit_logs_admin_id_idx").on(t.adminId),
  index("audit_logs_action_idx").on(t.action),
]);

export type DbAuditLog = typeof auditLogsTable.$inferSelect;
export type InsertAuditLog = typeof auditLogsTable.$inferInsert;
