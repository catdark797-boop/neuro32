import { pgTable, text, serial, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  direction: text("direction").notNull(),
  format: text("format").notNull(),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("new"),
  isBusinessInquiry: boolean("is_business_inquiry").notNull().default(false),
  organizationName: text("organization_name"),
  businessStatus: text("business_status"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index("applications_status_idx").on(t.status),
  index("applications_is_business_idx").on(t.isBusinessInquiry),
]);

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({ id: true, createdAt: true });
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
