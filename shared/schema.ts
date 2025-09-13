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

// Daily analytics summary for performance optimization
export const dailyAnalytics = pgTable("daily_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(), // YYYY-MM-DD format
  totalRequests: integer("total_requests").notNull().default(0),
  totalSuccessfulRequests: integer("total_successful_requests").notNull().default(0),
  totalErrorRequests: integer("total_error_requests").notNull().default(0),
  averageResponseTime: integer("average_response_time").notNull().default(0),
  uniqueDevelopers: integer("unique_developers").notNull().default(0),
  topCategoryRequests: jsonb("top_category_requests").default(sql`'{}'::jsonb`), // category breakdown
  environment: text("environment").notNull().default("sandbox"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_daily_analytics_date_env").on(table.date, table.environment),
]);

// Real-time API activity tracking for recent activity feed
export const apiActivity = pgTable("api_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  developerId: varchar("developer_id").references(() => developers.id).notNull(),
  endpointId: varchar("endpoint_id").references(() => apiEndpoints.id).notNull(),
  method: text("method").notNull(),
  path: text("path").notNull(),
  statusCode: integer("status_code").notNull(),
  responseTime: integer("response_time").notNull(), // in milliseconds
  environment: text("environment").notNull().default("sandbox"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
}, (table) => [
  index("idx_api_activity_timestamp").on(table.timestamp),
  index("idx_api_activity_developer").on(table.developerId),
]);

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

// Configuration management tables for dynamic admin UI settings
export const configCategories = pgTable("config_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(), // ui, forms, validation, system, api
  description: text("description").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Main configuration settings table
export const configurations = pgTable("configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").references(() => configCategories.id).notNull(),
  key: text("key").notNull(), // unique identifier like 'primary_color', 'max_upload_size'
  name: text("name").notNull(), // human readable name
  description: text("description").notNull(),
  value: jsonb("value").notNull(), // actual configuration value
  defaultValue: jsonb("default_value").notNull(), // fallback default
  dataType: text("data_type").notNull().default("string"), // string, number, boolean, object, array
  environment: text("environment").notNull().default("all"), // all, sandbox, uat, production
  isEditable: boolean("is_editable").notNull().default(true),
  isRequired: boolean("is_required").notNull().default(false),
  validationRules: jsonb("validation_rules").default(sql`'{}'::jsonb`), // min, max, pattern, enum
  displayOrder: integer("display_order").notNull().default(0),
  lastModifiedBy: varchar("last_modified_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// UI Theme and Appearance configurations
export const uiConfigurations = pgTable("ui_configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  theme: text("theme").notNull().default("default"), // default, dark, light, au-bank
  primaryColor: text("primary_color").notNull().default("#603078"),
  secondaryColor: text("secondary_color").notNull().default("#4d2661"),
  accentColor: text("accent_color").notNull().default("#f59e0b"),
  backgroundColor: text("background_color").notNull().default("#fefefe"),
  textColor: text("text_color").notNull().default("#111827"),
  borderRadius: text("border_radius").notNull().default("14px"),
  fontFamily: text("font_family").notNull().default("Inter"),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  customCss: text("custom_css"),
  sidebarWidth: text("sidebar_width").notNull().default("16rem"),
  headerHeight: text("header_height").notNull().default("4rem"),
  environment: text("environment").notNull().default("all"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Form default values and configurations
export const formConfigurations = pgTable("form_configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  formType: text("form_type").notNull(), // registration, login, api-request, developer-profile
  formName: text("form_name").notNull(),
  fieldDefaults: jsonb("field_defaults").default(sql`'{}'::jsonb`), // default values for form fields
  fieldVisibility: jsonb("field_visibility").default(sql`'{}'::jsonb`), // which fields to show/hide
  fieldValidation: jsonb("field_validation").default(sql`'{}'::jsonb`), // field-specific validation rules
  submitBehavior: jsonb("submit_behavior").default(sql`'{}'::jsonb`), // redirect, message, etc.
  autoSave: boolean("auto_save").notNull().default(false),
  environment: text("environment").notNull().default("all"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Validation rules and business constraints
export const validationConfigurations = pgTable("validation_configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(), // user, developer, application, api
  fieldName: text("field_name").notNull(),
  validationType: text("validation_type").notNull(), // required, length, pattern, range, custom
  rules: jsonb("rules").notNull(), // specific validation parameters
  errorMessage: text("error_message").notNull(),
  environment: text("environment").notNull().default("all"),
  isActive: boolean("is_active").notNull().default(true),
  priority: integer("priority").notNull().default(0), // for ordering validation rules
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// System-wide settings and constants
export const systemConfigurations = pgTable("system_configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  module: text("module").notNull(), // auth, api, storage, email, etc.
  setting: text("setting").notNull(), // rate_limit, timeout, max_file_size, etc.
  value: jsonb("value").notNull(),
  description: text("description").notNull(),
  dataType: text("data_type").notNull().default("string"),
  environment: text("environment").notNull().default("all"),
  isEditable: boolean("is_editable").notNull().default(true),
  requiresRestart: boolean("requires_restart").notNull().default(false),
  lastModifiedBy: varchar("last_modified_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Environment-specific configurations
export const environmentConfigurations = pgTable("environment_configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  environment: text("environment").notNull(), // sandbox, uat, production
  configKey: text("config_key").notNull(),
  configValue: jsonb("config_value").notNull(),
  description: text("description"),
  isOverride: boolean("is_override").notNull().default(false), // overrides default config
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// API Explorer configurations for test keys and settings
export const apiExplorerConfigurations = pgTable("api_explorer_configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  environment: text("environment").notNull().default("all"), // all, sandbox, uat, production
  testApiKeys: jsonb("test_api_keys").default(sql`'{}'::jsonb`), // environment-specific test keys
  defaultApiKey: text("default_api_key"), // default test API key
  sampleRequestTemplates: jsonb("sample_request_templates").default(sql`'{}'::jsonb`), // category-specific sample requests
  endpointSettings: jsonb("endpoint_settings").default(sql`'{}'::jsonb`), // test endpoint configurations
  uiSettings: jsonb("ui_settings").default(sql`'{"showTestData": true, "autoLoadApiKey": true}'::jsonb`),
  isActive: boolean("is_active").notNull().default(true),
  lastModifiedBy: varchar("last_modified_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Category styling configurations for icons and colors
export const categoryStyleConfigurations = pgTable("category_style_configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryName: text("category_name").notNull().unique(), // auth, accounts, payments, kyc, etc.
  iconName: text("icon_name").notNull().default("Code"), // Lucide icon name
  iconColor: text("icon_color").notNull().default("#603078"), // icon color hex
  backgroundColor: text("background_color").notNull().default("bg-gray-100"), // tailwind background class
  textColor: text("text_color").notNull().default("text-gray-700"), // tailwind text class
  hoverBackgroundColor: text("hover_background_color").notNull().default("bg-gray-50"), // tailwind hover class
  selectedBackgroundColor: text("selected_background_color").notNull().default("bg-blue-100"), // tailwind selected class
  selectedTextColor: text("selected_text_color").notNull().default("text-blue-700"), // tailwind selected text class
  selectedBorderColor: text("selected_border_color").notNull().default("border-blue-200"), // tailwind selected border class
  displayOrder: integer("display_order").notNull().default(0),
  environment: text("environment").notNull().default("all"),
  isActive: boolean("is_active").notNull().default(true),
  lastModifiedBy: varchar("last_modified_by").references(() => users.id),
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

export const insertDailyAnalyticsSchema = createInsertSchema(dailyAnalytics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApiActivitySchema = createInsertSchema(apiActivity).omit({
  id: true,
  timestamp: true,
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

// Configuration schemas
export const insertConfigCategorySchema = createInsertSchema(configCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateConfigCategorySchema = createInsertSchema(configCategories).omit({
  id: true,
  createdAt: true,
}).partial();

export const insertConfigurationSchema = createInsertSchema(configurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateConfigurationSchema = createInsertSchema(configurations).omit({
  id: true,
  createdAt: true,
}).partial();

export const insertUiConfigurationSchema = createInsertSchema(uiConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUiConfigurationSchema = createInsertSchema(uiConfigurations).omit({
  id: true,
  createdAt: true,
}).partial();

export const insertFormConfigurationSchema = createInsertSchema(formConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateFormConfigurationSchema = createInsertSchema(formConfigurations).omit({
  id: true,
  createdAt: true,
}).partial();

export const insertValidationConfigurationSchema = createInsertSchema(validationConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateValidationConfigurationSchema = createInsertSchema(validationConfigurations).omit({
  id: true,
  createdAt: true,
}).partial();

export const insertSystemConfigurationSchema = createInsertSchema(systemConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateSystemConfigurationSchema = createInsertSchema(systemConfigurations).omit({
  id: true,
  createdAt: true,
}).partial();

export const insertEnvironmentConfigurationSchema = createInsertSchema(environmentConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateEnvironmentConfigurationSchema = createInsertSchema(environmentConfigurations).omit({
  id: true,
  createdAt: true,
}).partial();

// API Explorer configuration schemas
export const insertApiExplorerConfigurationSchema = createInsertSchema(apiExplorerConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateApiExplorerConfigurationSchema = createInsertSchema(apiExplorerConfigurations).omit({
  id: true,
  createdAt: true,
}).partial();

export const insertCategoryStyleConfigurationSchema = createInsertSchema(categoryStyleConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCategoryStyleConfigurationSchema = createInsertSchema(categoryStyleConfigurations).omit({
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
export type DailyAnalytics = typeof dailyAnalytics.$inferSelect;
export type InsertDailyAnalytics = z.infer<typeof insertDailyAnalyticsSchema>;
export type ApiActivity = typeof apiActivity.$inferSelect;
export type InsertApiActivity = z.infer<typeof insertApiActivitySchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type ApiToken = typeof apiTokens.$inferSelect;
export type InsertApiToken = z.infer<typeof insertApiTokenSchema>;

// Documentation System Tables
export const documentationCategories: any = pgTable("documentation_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Used as identifier (e.g., "security", "customer") 
  title: text("title").notNull(), // Display name (e.g., "Security", "Customer")
  description: text("description").notNull(),
  icon: text("icon").notNull().default("BookOpen"), // Lucide icon name
  color: text("color").notNull().default("#603078"),
  parentId: varchar("parent_id").references((): any => documentationCategories.id), // For subcategories
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const documentationEndpoints = pgTable("documentation_endpoints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").references(() => documentationCategories.id).notNull(),
  subcategoryId: varchar("subcategory_id").references(() => documentationCategories.id), // Optional subcategory
  name: text("name").notNull(), // Used as identifier (e.g., "encryption", "otp-generation")
  title: text("title").notNull(), // Display name (e.g., "Encryption", "OTP Generation")
  method: text("method").notNull(), // GET, POST, PUT, DELETE, etc.
  path: text("path").notNull(), // API path (e.g., "/security/encrypt")
  description: text("description").notNull(),
  summary: text("summary"), // Short summary
  requestBody: jsonb("request_body"), // Request body schema
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const documentationParameters = pgTable("documentation_parameters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  endpointId: varchar("endpoint_id").references(() => documentationEndpoints.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // string, number, boolean, file, etc.
  required: boolean("required").notNull().default(false),
  description: text("description").notNull(),
  example: text("example"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documentationResponses = pgTable("documentation_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  endpointId: varchar("endpoint_id").references(() => documentationEndpoints.id).notNull(),
  status: integer("status").notNull(), // HTTP status code
  description: text("description").notNull(),
  example: jsonb("example"), // Response example as JSON
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documentationExamples = pgTable("documentation_examples", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  endpointId: varchar("endpoint_id").references(() => documentationEndpoints.id).notNull(),
  title: text("title").notNull(),
  request: jsonb("request"), // Request example as JSON
  response: jsonb("response"), // Response example as JSON  
  curlCommand: text("curl_command"), // cURL command example
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documentationSecurity = pgTable("documentation_security", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  endpointId: varchar("endpoint_id").references(() => documentationEndpoints.id).notNull(),
  type: text("type").notNull(), // API Key, Bearer Token, Basic Auth, etc.
  description: text("description").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Documentation Zod Schemas
export const insertDocumentationCategorySchema = createInsertSchema(documentationCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateDocumentationCategorySchema = insertDocumentationCategorySchema.partial();

export const insertDocumentationEndpointSchema = createInsertSchema(documentationEndpoints).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateDocumentationEndpointSchema = insertDocumentationEndpointSchema.partial();

export const insertDocumentationParameterSchema = createInsertSchema(documentationParameters).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentationResponseSchema = createInsertSchema(documentationResponses).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentationExampleSchema = createInsertSchema(documentationExamples).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentationSecuritySchema = createInsertSchema(documentationSecurity).omit({
  id: true,
  createdAt: true,
});

// Configuration type exports
export type ConfigCategory = typeof configCategories.$inferSelect;
export type InsertConfigCategory = z.infer<typeof insertConfigCategorySchema>;
export type UpdateConfigCategory = z.infer<typeof updateConfigCategorySchema>;
export type Configuration = typeof configurations.$inferSelect;
export type InsertConfiguration = z.infer<typeof insertConfigurationSchema>;
export type UpdateConfiguration = z.infer<typeof updateConfigurationSchema>;
export type UiConfiguration = typeof uiConfigurations.$inferSelect;
export type InsertUiConfiguration = z.infer<typeof insertUiConfigurationSchema>;
export type UpdateUiConfiguration = z.infer<typeof updateUiConfigurationSchema>;
export type FormConfiguration = typeof formConfigurations.$inferSelect;
export type InsertFormConfiguration = z.infer<typeof insertFormConfigurationSchema>;
export type UpdateFormConfiguration = z.infer<typeof updateFormConfigurationSchema>;
export type ValidationConfiguration = typeof validationConfigurations.$inferSelect;
export type InsertValidationConfiguration = z.infer<typeof insertValidationConfigurationSchema>;
export type UpdateValidationConfiguration = z.infer<typeof updateValidationConfigurationSchema>;
export type SystemConfiguration = typeof systemConfigurations.$inferSelect;
export type InsertSystemConfiguration = z.infer<typeof insertSystemConfigurationSchema>;
export type UpdateSystemConfiguration = z.infer<typeof updateSystemConfigurationSchema>;
export type EnvironmentConfiguration = typeof environmentConfigurations.$inferSelect;
export type InsertEnvironmentConfiguration = z.infer<typeof insertEnvironmentConfigurationSchema>;
export type UpdateEnvironmentConfiguration = z.infer<typeof updateEnvironmentConfigurationSchema>;

// API Explorer configuration type exports
export type ApiExplorerConfiguration = typeof apiExplorerConfigurations.$inferSelect;
export type InsertApiExplorerConfiguration = z.infer<typeof insertApiExplorerConfigurationSchema>;
export type UpdateApiExplorerConfiguration = z.infer<typeof updateApiExplorerConfigurationSchema>;
export type CategoryStyleConfiguration = typeof categoryStyleConfigurations.$inferSelect;
export type InsertCategoryStyleConfiguration = z.infer<typeof insertCategoryStyleConfigurationSchema>;
export type UpdateCategoryStyleConfiguration = z.infer<typeof updateCategoryStyleConfigurationSchema>;

// Documentation type exports
export type DocumentationCategory = typeof documentationCategories.$inferSelect;
export type InsertDocumentationCategory = z.infer<typeof insertDocumentationCategorySchema>;
export type UpdateDocumentationCategory = z.infer<typeof updateDocumentationCategorySchema>;
export type DocumentationEndpoint = typeof documentationEndpoints.$inferSelect;
export type InsertDocumentationEndpoint = z.infer<typeof insertDocumentationEndpointSchema>;
export type UpdateDocumentationEndpoint = z.infer<typeof updateDocumentationEndpointSchema>;
export type DocumentationParameter = typeof documentationParameters.$inferSelect;
export type InsertDocumentationParameter = z.infer<typeof insertDocumentationParameterSchema>;
export type DocumentationResponse = typeof documentationResponses.$inferSelect;
export type InsertDocumentationResponse = z.infer<typeof insertDocumentationResponseSchema>;
export type DocumentationExample = typeof documentationExamples.$inferSelect;
export type InsertDocumentationExample = z.infer<typeof insertDocumentationExampleSchema>;
export type DocumentationSecurity = typeof documentationSecurity.$inferSelect;
export type InsertDocumentationSecurity = z.infer<typeof insertDocumentationSecuritySchema>;
