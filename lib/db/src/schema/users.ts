import { pgTable, text, serial, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull().default(""),
  telegram: text("telegram").notNull().default(""),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("user"),
  direction: text("direction").notNull().default(""),
  goals: text("goals").notNull().default(""),
  avatarUrl: text("avatar_url"),
  /** When set, any session created before this timestamp is considered revoked. */
  sessionInvalidatedBefore: timestamp("session_invalidated_before", { withTimezone: true }),
  /**
   * Soft-delete marker for GDPR right-to-be-forgotten. When set, the user's
   * PII (name/email/phone/telegram/avatar/goals) has been anonymized and the
   * account is locked. Payments / applications rows stay for accounting but
   * no longer resolve to identifying information.
   */
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index("users_email_idx").on(t.email),
  index("users_telegram_idx").on(t.telegram),
  index("users_role_idx").on(t.role),
]);

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type DbUser = typeof usersTable.$inferSelect;
