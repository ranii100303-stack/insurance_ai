import { pgTable, text, numeric, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";

export const claims = pgTable("claims", {
  id: varchar("id").primaryKey(),
  claimantName: varchar("claimant_name").notNull(),
  summary: text("summary").notNull(),
  reportedAmount: numeric("reported_amount").notNull(),
  status: varchar("status").notNull(),
  submittedDate: varchar("submitted_date").notNull(),
  claimantEmail: varchar("claimant_email").notNull(),
  claimantPhone: varchar("claimant_phone").notNull(),
  policyNumber: varchar("policy_number").notNull(),
  vehicleInfo: varchar("vehicle_info").notNull(),
  photos: jsonb("photos"),
  assessmentResults: jsonb("assessment_results"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  username: varchar("username").unique().notNull(),
  password: varchar("password").notNull(),
});
