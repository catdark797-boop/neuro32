import { pgTable, serial, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const businessInquiryFormatEnum = pgEnum("business_inquiry_format", [
  "only_neuro32",
  "educational_case",
  "any",
]);

export const businessInquiriesTable = pgTable("business_inquiries", {
  id: serial("id").primaryKey(),
  nameOrCompany: text("name_or_company").notNull(),
  contact: text("contact").notNull(),
  taskDescription: text("task_description").notNull(),
  format: businessInquiryFormatEnum("format").notNull().default("any"),
  consentPersonalData: boolean("consent_personal_data").notNull().default(false),
  consentEducationalCase: boolean("consent_educational_case").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
