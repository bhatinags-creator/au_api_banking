import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for production
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enhanced user table for internal developers
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  department: text("department"),
  role: text("role").notNull().default("developer"), // developer, admin, manager
  employeeId: text("employee_id").unique(),
  passwordHash: text("password_hash").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Internal developer profiles linked to users
export const developers = pgTable("developers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  department: text("department"),
  team: text("team"),
  projectsAssigned: jsonb("projects_assigned").default(sql`'[]'::jsonb`),
  permissions: jsonb("permissions").default(sql`'{"sandbox": true, "uat": false, "production": false}'::jsonb`),
  apiKey: text("api_key").notNull().unique(),
  isVerified: boolean("is_verified").notNull().default(false),
  lastActiveAt: timestamp("last_active_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const corporateRegistrations = pgTable("corporate_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  accountNumber: text("account_number").notNull(),
  email: text("email").notNull(),
  contactPerson: text("contact_person").notNull(),
  status: text("status").notNull().default("pending"), // pending, verified, rejected
  otpCode: text("otp_code"),
  otpExpiry: timestamp("otp_expiry"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Internal applications and projects
export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  developerId: varchar("developer_id").references(() => developers.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  projectType: text("project_type").notNull().default("internal"), // internal, integration, testing
  environment: text("environment").notNull().default("sandbox"), // sandbox, uat, production
  status: text("status").notNull().default("active"), // active, inactive, archived
  configuration: jsonb("configuration").default(sql`'{}'::jsonb`),
  approvedBy: varchar("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// API Categories for organization
export const apiCategories = pgTable("api_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull().default("Code"),
  color: text("color").notNull().default("#603078"),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Enhanced API endpoints with production features
export const apiEndpoints = pgTable("api_endpoints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").references(() => apiCategories.id),
  category: text("category").notNull(), // Keep for backwards compatibility
  name: text("name").notNull(),
  path: text("path").notNull(),
  method: text("method").notNull(),
  description: text("description").notNull(),
  summary: text("summary"),
  parameters: jsonb("parameters").default(sql`'[]'::jsonb`),
  headers: jsonb("headers").default(sql`'[]'::jsonb`),
  responses: jsonb("responses").default(sql`'[]'::jsonb`),
  requestExample: text("request_example"),
  responseExample: text("response_example"),
  documentation: text("documentation"),
  tags: jsonb("tags").default(sql`'[]'::jsonb`),
  responseSchema: jsonb("response_schema").default(sql`'{}'::jsonb`),
  rateLimits: jsonb("rate_limits").default(sql`'{"sandbox": 100, "uat": 500, "production": 1000}'::jsonb`),
  timeout: integer("timeout").default(30000),
  requiresAuth: boolean("requires_auth").notNull().default(true),
  authType: text("auth_type").default("bearer"),
  requiredPermissions: jsonb("required_permissions").default(sql`'["sandbox"]'::jsonb`),
  isActive: boolean("is_active").notNull().default(true),
  isInternal: boolean("is_internal").notNull().default(true),
  status: text("status").notNull().default("active"), // active, deprecated, draft
  version: text("version").notNull().default("v1"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// API usage tracking with enhanced metrics
export const apiUsage = pgTable("api_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  developerId: varchar("developer_id").references(() => developers.id).notNull(),
  applicationId: varchar("application_id").references(() => applications.id).notNull(),
  endpointId: varchar("endpoint_id").references(() => apiEndpoints.id).notNull(),
  requestCount: integer("request_count").notNull().default(0),
  successCount: integer("success_count").notNull().default(0),
  errorCount: integer("error_count").notNull().default(0),
  totalResponseTime: integer("total_response_time").notNull().default(0), // in milliseconds
  environment: text("environment").notNull().default("sandbox"),
  date: timestamp("date").defaultNow().notNull(),
  month: text("month").notNull(), // YYYY-MM format for easy querying
});

// New table for audit logs
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(), // login, logout, api_call, config_change, etc.
  resource: text("resource"), // what was affected
  resourceId: text("resource_id"), // ID of the affected resource
  details: jsonb("details").default(sql`'{}'::jsonb`),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// API keys and tokens management
export const apiTokens = pgTable("api_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  developerId: varchar("developer_id").references(() => developers.id).notNull(),
  name: text("name").notNull(),
  token: text("token").notNull().unique(),
  permissions: jsonb("permissions").default(sql`'[]'::jsonb`),
  environment: text("environment").notNull().default("sandbox"),
  expiresAt: timestamp("expires_at"),
  lastUsedAt: timestamp("last_used_at"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User schema for internal developers
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = createInsertSchema(users).omit({
  id: true,
  email: true,
  passwordHash: true,
  createdAt: true,
}).partial();

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const insertDeveloperSchema = createInsertSchema(developers).omit({
  id: true,
  apiKey: true,
  isVerified: true,
  lastActiveAt: true,
  createdAt: true,
  updatedAt: true,
});

export const updateDeveloperSchema = createInsertSchema(developers).omit({
  id: true,
  userId: true,
  email: true,
  apiKey: true,
  createdAt: true,
}).partial();

export const insertCorporateRegistrationSchema = createInsertSchema(corporateRegistrations).omit({
  id: true,
  status: true,
  otpCode: true,
  otpExpiry: true,
  createdAt: true,
});

export const verifyOtpSchema = z.object({
  registrationId: z.string(),
  otpCode: z.string().length(6),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
});

export const insertApiEndpointSchema = createInsertSchema(apiEndpoints).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});

export const insertApiTokenSchema = createInsertSchema(apiTokens).omit({
  id: true,
  token: true,
  lastUsedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApiUsageSchema = createInsertSchema(apiUsage).omit({
  id: true,
  date: true,
  month: true,
});

export const insertApiCategorySchema = createInsertSchema(apiCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateApiCategorySchema = createInsertSchema(apiCategories).omit({
  id: true,
  createdAt: true,
}).partial();

export const updateApiEndpointSchema = createInsertSchema(apiEndpoints).omit({
  id: true,
  createdAt: true,
}).partial();

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type User = typeof users.$inferSelect;
export type Developer = typeof developers.$inferSelect;
export type InsertDeveloper = z.infer<typeof insertDeveloperSchema>;
export type UpdateDeveloper = z.infer<typeof updateDeveloperSchema>;
export type CorporateRegistration = typeof corporateRegistrations.$inferSelect;
export type InsertCorporateRegistration = z.infer<typeof insertCorporateRegistrationSchema>;
export type VerifyOtp = z.infer<typeof verifyOtpSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type ApiEndpoint = typeof apiEndpoints.$inferSelect;
export type InsertApiEndpoint = z.infer<typeof insertApiEndpointSchema>;
export type ApiCategory = typeof apiCategories.$inferSelect;
export type InsertApiCategory = z.infer<typeof insertApiCategorySchema>;
export type UpdateApiCategory = z.infer<typeof updateApiCategorySchema>;
export type UpdateApiEndpoint = z.infer<typeof updateApiEndpointSchema>;
export type ApiUsage = typeof apiUsage.$inferSelect;
export type InsertApiUsage = z.infer<typeof insertApiUsageSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type ApiToken = typeof apiTokens.$inferSelect;
export type InsertApiToken = z.infer<typeof insertApiTokenSchema>;
