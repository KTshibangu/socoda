import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  integer, 
  decimal, 
  timestamp, 
  boolean, 
  pgEnum 
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", [
  "artist",
  "business", 
  "admin"
]);

export const contributorRoleEnum = pgEnum("contributor_role", [
  "composer",
  "author", 
  "vocalist"
]);

export const workStatusEnum = pgEnum("work_status", [
  "pending", 
  "approved", 
  "rejected"
]);

export const businessTypeEnum = pgEnum("business_type", [
  "bar", 
  "restaurant", 
  "venue", 
  "radio", 
  "tv", 
  "gym", 
  "mall"
]);

export const licenseStatusEnum = pgEnum("license_status", [
  "pending", 
  "active", 
  "expired", 
  "revoked"
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending", 
  "processing", 
  "paid", 
  "failed"
]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  role: userRoleEnum("role").notNull().default("artist"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sessions table for authentication
export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Works table
export const works = pgTable("works", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  iswc: varchar("iswc").unique(),
  isrc: varchar("isrc").unique(),
  duration: varchar("duration"),
  status: workStatusEnum("status").notNull().default("pending"),
  registeredBy: varchar("registered_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contributors table (linking users to works with percentage splits)
export const contributors = pgTable("contributors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workId: varchar("work_id").notNull().references(() => works.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: contributorRoleEnum("role").notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Business licenses table
export const businessLicenses = pgTable("business_licenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessName: varchar("business_name").notNull(),
  businessType: businessTypeEnum("business_type").notNull(),
  contactEmail: varchar("contact_email").notNull(),
  contactPhone: varchar("contact_phone"),
  address: text("address").notNull(),
  annualFee: decimal("annual_fee", { precision: 10, scale: 2 }).notNull(),
  status: licenseStatusEnum("status").notNull().default("pending"),
  appliedBy: varchar("applied_by").notNull().references(() => users.id),
  approvedBy: varchar("approved_by").references(() => users.id),
  validFrom: timestamp("valid_from"),
  validTo: timestamp("valid_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Usage reports table
export const usageReports = pgTable("usage_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  licenseId: varchar("license_id").notNull().references(() => businessLicenses.id),
  workId: varchar("work_id").notNull().references(() => works.id),
  playCount: integer("play_count").notNull(),
  reportPeriodStart: timestamp("report_period_start").notNull(),
  reportPeriodEnd: timestamp("report_period_end").notNull(),
  submittedBy: varchar("submitted_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Royalty distributions table
export const royaltyDistributions = pgTable("royalty_distributions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  usageReportId: varchar("usage_report_id").notNull().references(() => usageReports.id),
  contributorId: varchar("contributor_id").notNull().references(() => contributors.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  registeredWorks: many(works),
  contributions: many(contributors),
  licenseApplications: many(businessLicenses),
  usageReports: many(usageReports),
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const worksRelations = relations(works, ({ one, many }) => ({
  registeredBy: one(users, {
    fields: [works.registeredBy],
    references: [users.id],
  }),
  contributors: many(contributors),
  usageReports: many(usageReports),
}));

export const contributorsRelations = relations(contributors, ({ one, many }) => ({
  work: one(works, {
    fields: [contributors.workId],
    references: [works.id],
  }),
  user: one(users, {
    fields: [contributors.userId],
    references: [users.id],
  }),
  royaltyDistributions: many(royaltyDistributions),
}));

export const businessLicensesRelations = relations(businessLicenses, ({ one, many }) => ({
  appliedBy: one(users, {
    fields: [businessLicenses.appliedBy],
    references: [users.id],
  }),
  approvedBy: one(users, {
    fields: [businessLicenses.approvedBy],
    references: [users.id],
  }),
  usageReports: many(usageReports),
}));

export const usageReportsRelations = relations(usageReports, ({ one, many }) => ({
  license: one(businessLicenses, {
    fields: [usageReports.licenseId],
    references: [businessLicenses.id],
  }),
  work: one(works, {
    fields: [usageReports.workId],
    references: [works.id],
  }),
  submittedBy: one(users, {
    fields: [usageReports.submittedBy],
    references: [users.id],
  }),
  royaltyDistributions: many(royaltyDistributions),
}));

export const royaltyDistributionsRelations = relations(royaltyDistributions, ({ one }) => ({
  usageReport: one(usageReports, {
    fields: [royaltyDistributions.usageReportId],
    references: [usageReports.id],
  }),
  contributor: one(contributors, {
    fields: [royaltyDistributions.contributorId],
    references: [contributors.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["artist", "business"]),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
});

export const insertWorkSchema = createInsertSchema(works).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContributorSchema = createInsertSchema(contributors).omit({
  id: true,
  createdAt: true,
});

export const insertBusinessLicenseSchema = createInsertSchema(businessLicenses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedBy: true,
  validFrom: true,
  validTo: true,
});

export const insertUsageReportSchema = createInsertSchema(usageReports).omit({
  id: true,
  createdAt: true,
});

export const insertRoyaltyDistributionSchema = createInsertSchema(royaltyDistributions).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;

export type Work = typeof works.$inferSelect;
export type InsertWork = z.infer<typeof insertWorkSchema>;

export type Contributor = typeof contributors.$inferSelect;
export type InsertContributor = z.infer<typeof insertContributorSchema>;

export type BusinessLicense = typeof businessLicenses.$inferSelect;
export type InsertBusinessLicense = z.infer<typeof insertBusinessLicenseSchema>;

export type UsageReport = typeof usageReports.$inferSelect;
export type InsertUsageReport = z.infer<typeof insertUsageReportSchema>;

export type RoyaltyDistribution = typeof royaltyDistributions.$inferSelect;
export type InsertRoyaltyDistribution = z.infer<typeof insertRoyaltyDistributionSchema>;
