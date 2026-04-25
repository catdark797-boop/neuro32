import { pgTable, serial, integer, text, timestamp, index } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

/**
 * Tracks ЮMoney payment intents and confirmed payments.
 *
 * Flow:
 *  1. Frontend calls POST /payments — server creates a row with status "pending"
 *     and returns a YooMoney Quickpay redirect URL.
 *  2. User pays on YooMoney side.
 *  3. YooMoney sends a webhook to POST /payments/webhook — server verifies the
 *     SHA-1 signature and marks the row as "succeeded".
 */
export const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  /** Amount in rubles */
  amount: integer("amount").notNull(),
  /** "pending" | "succeeded" | "failed" */
  status: text("status").notNull().default("pending"),
  /** label passed to YooMoney so we can match the webhook */
  label: text("label").notNull().unique(),
  /** operation_id returned by YooMoney in the webhook */
  ymoneyOperationId: text("ymoney_operation_id"),
  /** Human-readable description, e.g. "Абонемент Апрель 2026" */
  description: text("description").notNull().default(""),
  /**
   * Client-supplied idempotency key (UUID). If the same key is sent twice
   * from the same user, the server returns the original payment instead of
   * creating a duplicate. Nullable for legacy rows created before this field
   * existed. Scoped per-user to avoid cross-tenant collision.
   */
  idempotencyKey: text("idempotency_key"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
}, (t) => [
  index("payments_user_id_idx").on(t.userId),
  index("payments_status_idx").on(t.status),
  index("payments_user_idem_idx").on(t.userId, t.idempotencyKey),
]);

export type DbPayment = typeof paymentsTable.$inferSelect;
export type InsertPayment = typeof paymentsTable.$inferInsert;
