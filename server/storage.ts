import { 
  type User, type InsertUser, type UpdateUser,
  type Developer, type InsertDeveloper, type UpdateDeveloper,
  type Application, type InsertApplication, 
  type ApiEndpoint, type InsertApiEndpoint, type UpdateApiEndpoint,
  type ApiCategory, type InsertApiCategory, type UpdateApiCategory,
  type ApiUsage, type InsertApiUsage, 
  type CorporateRegistration, type InsertCorporateRegistration,
  type AuditLog, type InsertAuditLog,
  type ApiToken, type InsertApiToken,
  type ConfigCategory, type InsertConfigCategory, type UpdateConfigCategory,
  type Configuration, type InsertConfiguration, type UpdateConfiguration,
  type UiConfiguration, type InsertUiConfiguration, type UpdateUiConfiguration,
  type FormConfiguration, type InsertFormConfiguration, type UpdateFormConfiguration,
  type ValidationConfiguration, type InsertValidationConfiguration, type UpdateValidationConfiguration,
  type SystemConfiguration, type InsertSystemConfiguration, type UpdateSystemConfiguration,
  type EnvironmentConfiguration, type InsertEnvironmentConfiguration, type UpdateEnvironmentConfiguration,
  users, developers, applications, apiEndpoints, apiCategories, apiUsage, corporateRegistrations, auditLogs, apiTokens,
  configCategories, configurations, uiConfigurations, formConfigurations, validationConfigurations, systemConfigurations, environmentConfigurations
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

// Production-ready storage interface
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: UpdateUser): Promise<User | undefined>;
  verifyUserPassword(email: string, password: string): Promise<User | undefined>;
  updateUserPassword(id: string, newPasswordHash: string): Promise<boolean>;
  updateLastLogin(id: string): Promise<void>;
  
  // Developer operations
  getDeveloper(id: string): Promise<Developer | undefined>;
  getDeveloperByUserId(userId: string): Promise<Developer | undefined>;
  getDeveloperByEmail(email: string): Promise<Developer | undefined>;
  getDeveloperByApiKey(apiKey: string): Promise<Developer | undefined>;
  createDeveloper(developer: InsertDeveloper): Promise<Developer>;
  updateDeveloper(id: string, updates: UpdateDeveloper): Promise<Developer | undefined>;
  getAllDevelopers(): Promise<Developer[]>;
  updateDeveloperActivity(id: string): Promise<void>;
  
  // Corporate Registration operations
  createCorporateRegistration(registration: InsertCorporateRegistration): Promise<CorporateRegistration>;
  getCorporateRegistration(id: string): Promise<CorporateRegistration | undefined>;
  updateCorporateRegistration(id: string, updates: Partial<CorporateRegistration>): Promise<CorporateRegistration | undefined>;
  getCorporateRegistrationByEmail(email: string): Promise<CorporateRegistration | undefined>;
  
  // Application operations
  getApplication(id: string): Promise<Application | undefined>;
  getApplicationsByDeveloper(developerId: string): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: string, application: Partial<InsertApplication>): Promise<Application | undefined>;
  deleteApplication(id: string): Promise<boolean>;
  
  // API Endpoint operations
  getAllApiEndpoints(): Promise<ApiEndpoint[]>;
  getApiEndpointsByCategory(category: string): Promise<ApiEndpoint[]>;
  createApiEndpoint(endpoint: InsertApiEndpoint): Promise<ApiEndpoint>;
  updateApiEndpoint(id: string, endpoint: UpdateApiEndpoint): Promise<ApiEndpoint | undefined>;
  deleteApiEndpoint(id: string): Promise<boolean>;
  
  // API Category operations
  getAllApiCategories(): Promise<ApiCategory[]>;
  createApiCategory(category: InsertApiCategory): Promise<ApiCategory>;
  updateApiCategory(id: string, category: UpdateApiCategory): Promise<ApiCategory | undefined>;
  deleteApiCategory(id: string): Promise<boolean>;
  
  // API Usage operations
  getApiUsageByDeveloper(developerId: string): Promise<ApiUsage[]>;
  getApiUsageByApplication(applicationId: string): Promise<ApiUsage[]>;
  createApiUsage(usage: InsertApiUsage): Promise<ApiUsage>;
  updateApiUsage(id: string, usage: Partial<InsertApiUsage>): Promise<ApiUsage | undefined>;
  getApiUsageStats(developerId: string, environment?: string): Promise<any>;
  
  // Audit log operations
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(userId?: string, limit?: number): Promise<AuditLog[]>;
  
  // API Token operations
  createApiToken(token: InsertApiToken): Promise<ApiToken>;
  getApiToken(token: string): Promise<ApiToken | undefined>;
  getApiTokensByDeveloper(developerId: string): Promise<ApiToken[]>;
  revokeApiToken(id: string): Promise<boolean>;
  updateTokenLastUsed(token: string): Promise<void>;
  
  // Configuration operations
  // Config Categories
  getAllConfigCategories(): Promise<ConfigCategory[]>;
  getConfigCategory(id: string): Promise<ConfigCategory | undefined>;
  getConfigCategoryByName(name: string): Promise<ConfigCategory | undefined>;
  createConfigCategory(category: InsertConfigCategory): Promise<ConfigCategory>;
  updateConfigCategory(id: string, updates: UpdateConfigCategory): Promise<ConfigCategory | undefined>;
  deleteConfigCategory(id: string): Promise<boolean>;
  
  // General Configurations
  getAllConfigurations(environment?: string): Promise<Configuration[]>;
  getConfigurationsByCategory(categoryId: string, environment?: string): Promise<Configuration[]>;
  getConfiguration(id: string): Promise<Configuration | undefined>;
  getConfigurationByKey(key: string, environment?: string): Promise<Configuration | undefined>;
  createConfiguration(config: InsertConfiguration): Promise<Configuration>;
  updateConfiguration(id: string, updates: UpdateConfiguration): Promise<Configuration | undefined>;
  deleteConfiguration(id: string): Promise<boolean>;
  
  // UI Configurations
  getAllUiConfigurations(environment?: string): Promise<UiConfiguration[]>;
  getUiConfiguration(id: string): Promise<UiConfiguration | undefined>;
  getUiConfigurationByEnvironment(environment: string): Promise<UiConfiguration | undefined>;
  createUiConfiguration(config: InsertUiConfiguration): Promise<UiConfiguration>;
  updateUiConfiguration(id: string, updates: UpdateUiConfiguration): Promise<UiConfiguration | undefined>;
  deleteUiConfiguration(id: string): Promise<boolean>;
  
  // Form Configurations
  getAllFormConfigurations(environment?: string): Promise<FormConfiguration[]>;
  getFormConfiguration(id: string): Promise<FormConfiguration | undefined>;
  getFormConfigurationByType(formType: string, environment?: string): Promise<FormConfiguration | undefined>;
  createFormConfiguration(config: InsertFormConfiguration): Promise<FormConfiguration>;
  updateFormConfiguration(id: string, updates: UpdateFormConfiguration): Promise<FormConfiguration | undefined>;
  deleteFormConfiguration(id: string): Promise<boolean>;
  
  // Validation Configurations
  getAllValidationConfigurations(environment?: string): Promise<ValidationConfiguration[]>;
  getValidationConfiguration(id: string): Promise<ValidationConfiguration | undefined>;
  getValidationConfigurationsByEntity(entityType: string, environment?: string): Promise<ValidationConfiguration[]>;
  createValidationConfiguration(config: InsertValidationConfiguration): Promise<ValidationConfiguration>;
  updateValidationConfiguration(id: string, updates: UpdateValidationConfiguration): Promise<ValidationConfiguration | undefined>;
  deleteValidationConfiguration(id: string): Promise<boolean>;
  
  // System Configurations
  getAllSystemConfigurations(environment?: string): Promise<SystemConfiguration[]>;
  getSystemConfiguration(id: string): Promise<SystemConfiguration | undefined>;
  getSystemConfigurationsByModule(module: string, environment?: string): Promise<SystemConfiguration[]>;
  getSystemConfigurationBySetting(module: string, setting: string, environment?: string): Promise<SystemConfiguration | undefined>;
  createSystemConfiguration(config: InsertSystemConfiguration): Promise<SystemConfiguration>;
  updateSystemConfiguration(id: string, updates: UpdateSystemConfiguration): Promise<SystemConfiguration | undefined>;
  deleteSystemConfiguration(id: string): Promise<boolean>;
  
  // Environment Configurations
  getAllEnvironmentConfigurations(environment?: string): Promise<EnvironmentConfiguration[]>;
  getEnvironmentConfiguration(id: string): Promise<EnvironmentConfiguration | undefined>;
  getEnvironmentConfigurationByKey(configKey: string, environment: string): Promise<EnvironmentConfiguration | undefined>;
  createEnvironmentConfiguration(config: InsertEnvironmentConfiguration): Promise<EnvironmentConfiguration>;
  updateEnvironmentConfiguration(id: string, updates: UpdateEnvironmentConfiguration): Promise<EnvironmentConfiguration | undefined>;
  deleteEnvironmentConfiguration(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private developers: Map<string, Developer>;
  private applications: Map<string, Application>;
  private apiEndpoints: Map<string, ApiEndpoint>;
  private apiCategories: Map<string, ApiCategory>;
  private apiUsage: Map<string, ApiUsage>;
  private corporateRegistrations: Map<string, CorporateRegistration>;
  private auditLogs: Map<string, AuditLog>;
  private apiTokens: Map<string, ApiToken>;
  
  // Configuration storage
  private configCategories: Map<string, ConfigCategory>;
  private configurations: Map<string, Configuration>;
  private uiConfigurations: Map<string, UiConfiguration>;
  private formConfigurations: Map<string, FormConfiguration>;
  private validationConfigurations: Map<string, ValidationConfiguration>;
  private systemConfigurations: Map<string, SystemConfiguration>;
  private environmentConfigurations: Map<string, EnvironmentConfiguration>;

  constructor() {
    this.users = new Map();
    this.developers = new Map();
    this.applications = new Map();
    this.apiEndpoints = new Map();
    this.apiCategories = new Map();
    this.apiUsage = new Map();
    this.corporateRegistrations = new Map();
    this.auditLogs = new Map();
    this.apiTokens = new Map();
    
    // Initialize configuration storage
    this.configCategories = new Map();
    this.configurations = new Map();
    this.uiConfigurations = new Map();
    this.formConfigurations = new Map();
    this.validationConfigurations = new Map();
    this.systemConfigurations = new Map();
    this.environmentConfigurations = new Map();
    
    // Seed with sample data
    this.seedApiCategories();
    this.seedApiEndpoints();
    this.seedConfigurationData();
  }

  private seedApiCategories() {
    const categories: ApiCategory[] = [
      {
        id: "cat-1", name: "Customer", description: "Customer identity and profile management APIs including KYC verification, profile updates, and customer data retrieval", 
        icon: "Users", color: "#603078", displayOrder: 1, isActive: true, createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "cat-2", name: "Loans", description: "Personal loans, home loans, and business financing APIs for eligibility checks and loan management", 
        icon: "CreditCard", color: "#603078", displayOrder: 2, isActive: true, createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "cat-3", name: "Liabilities", description: "Savings accounts, fixed deposits, and recurring deposits management APIs", 
        icon: "DollarSign", color: "#603078", displayOrder: 3, isActive: true, createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "cat-4", name: "Cards", description: "Credit and debit card management, issuance, and transaction APIs", 
        icon: "CreditCard", color: "#603078", displayOrder: 4, isActive: true, createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "cat-5", name: "Payments", description: "Payment processing APIs including NEFT, RTGS, IMPS, and internal fund transfers", 
        icon: "Send", color: "#603078", displayOrder: 5, isActive: true, createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "cat-6", name: "Authentication", description: "OAuth 2.0 token generation and security APIs for secure access to banking services", 
        icon: "Lock", color: "#603078", displayOrder: 6, isActive: true, createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "cat-7", name: "Trade Services", description: "Trade finance APIs including letters of credit, bank guarantees, and documentary collections", 
        icon: "Globe", color: "#603078", displayOrder: 7, isActive: true, createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "cat-8", name: "Corporate API Suite", description: "Enterprise banking solutions for corporate clients including cash management and treasury services", 
        icon: "Building", color: "#603078", displayOrder: 8, isActive: true, createdAt: new Date(), updatedAt: new Date()
      }
    ];
    
    categories.forEach(category => {
      this.apiCategories.set(category.id, category);
    });
  }

  private seedApiEndpoints() {
    const endpoints: ApiEndpoint[] = [
      // AU Bank OAuth and Authentication
      {
        id: "1", categoryId: "cat-6", category: "Authentication", name: "Generate Access Token", path: "/oauth/accesstoken",
        method: "GET", description: "Generate OAuth access token for API authentication (Valid for 24hrs in UAT, 6 months in production)",
        summary: "OAuth token generation for API access",
        headers: [{name: "Content-Type", value: "application/json"}],
        responses: [{status: "200", description: "Token generated successfully"}],
        requestExample: null,
        responseExample: '{"access_token": "abc123", "expires_in": 86400}',
        documentation: "Standard OAuth 2.0 token generation endpoint",
        tags: ["oauth", "authentication"],
        timeout: 30000, requiresAuth: false, authType: "basic", status: "active",
        isActive: true, version: "v1", parameters: [], responseSchema: {}, 
        rateLimits: { sandbox: 100, uat: 500, production: 1000 },
        requiredPermissions: ["sandbox"], isInternal: true, createdAt: new Date(), updatedAt: new Date()
      },
      
      // AU Bank Payout APIs
      {
        id: "2", categoryId: "cat-5", category: "Payments", name: "CNB Payment Creation", path: "/CNBPaymentService/paymentCreation",
        method: "POST", description: "Initiate Internal Fund Transfer/NEFT/RTGS/IMPS transactions (Single + Bulk payment up to 50 transactions)",
        summary: "Create payment transactions for various transfer types",
        headers: [{name: "Authorization", value: "Bearer {token}"}, {name: "Content-Type", value: "application/json"}],
        responses: [{status: "200", description: "Payment created successfully"}, {status: "400", description: "Invalid request"}],
        requestExample: '{"amount": 1000, "beneficiary_account": "123456789", "transfer_type": "NEFT"}',
        responseExample: '{"transaction_id": "TXN123", "status": "initiated"}',
        documentation: "Comprehensive payment creation API supporting multiple transfer modes",
        tags: ["payments", "neft", "rtgs", "imps"],
        timeout: 45000, requiresAuth: true, authType: "bearer", status: "active",
        isActive: true, version: "v1", parameters: [], responseSchema: {},
        rateLimits: { sandbox: 50, uat: 200, production: 500 },
        requiredPermissions: ["sandbox", "uat"], isInternal: true, createdAt: new Date(), updatedAt: new Date()
      },
      
      // Customer 360 Service
      {
        id: "3", categoryId: "cat-1", category: "Customer", name: "Customer 360 Service", path: "/customer360/profile",
        method: "GET", description: "Comprehensive customer profile API providing complete customer information, account details, and relationship data",
        summary: "Get complete customer profile and relationship data",
        headers: [{name: "Authorization", value: "Bearer {token}"}, {name: "X-Customer-ID", value: "{customer_id}"}],
        responses: [{status: "200", description: "Customer data retrieved"}, {status: "404", description: "Customer not found"}],
        requestExample: null,
        responseExample: '{"customer_id": "CUST001", "profile": {...}, "accounts": [...], "relationships": [...]}',
        documentation: "Complete customer 360-degree view API",
        tags: ["customer", "profile", "360"],
        timeout: 30000, requiresAuth: true, authType: "bearer", status: "active",
        isActive: true, version: "v1", parameters: [], responseSchema: {},
        rateLimits: { sandbox: 100, uat: 300, production: 800 },
        requiredPermissions: ["sandbox", "uat"], isInternal: true, createdAt: new Date(), updatedAt: new Date()
      }
    ];
    
    endpoints.forEach(endpoint => {
      this.apiEndpoints.set(endpoint.id, endpoint);
    });
  }

  private seedConfigurationData() {
    // Seed config categories
    const configCats: ConfigCategory[] = [
      { id: "ui", name: "UI", description: "User interface settings", displayOrder: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: "forms", name: "Forms", description: "Form configurations", displayOrder: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: "validation", name: "Validation", description: "Validation rules", displayOrder: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: "system", name: "System", description: "System settings", displayOrder: 4, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: "api", name: "API", description: "API configurations", displayOrder: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    configCats.forEach(cat => this.configCategories.set(cat.id, cat));

    // Seed UI configurations
    const uiConfig: UiConfiguration = {
      id: "ui-default", theme: "default", primaryColor: "#603078", secondaryColor: "#4d2661",
      accentColor: "#f59e0b", backgroundColor: "#fefefe", textColor: "#111827",
      borderRadius: "14px", fontFamily: "Inter", logoUrl: "", faviconUrl: "",
      customCss: "", sidebarWidth: "16rem", headerHeight: "4rem",
      environment: "all", isActive: true, createdAt: new Date(), updatedAt: new Date()
    };
    this.uiConfigurations.set(uiConfig.id, uiConfig);

    // Seed system configurations
    const systemConfigs: SystemConfiguration[] = [
      { id: "sys-1", module: "api", setting: "rate_limit", value: 100, description: "API rate limit per minute", dataType: "number", environment: "sandbox", isEditable: true, requiresRestart: false, lastModifiedBy: null, createdAt: new Date(), updatedAt: new Date() },
      { id: "sys-2", module: "auth", setting: "session_timeout", value: 3600, description: "Session timeout in seconds", dataType: "number", environment: "all", isEditable: true, requiresRestart: false, lastModifiedBy: null, createdAt: new Date(), updatedAt: new Date() }
    ];
    systemConfigs.forEach(config => this.systemConfigurations.set(config.id, config));

    // Seed comprehensive validation configurations
    this.seedValidationConfigurations();
  }

  private seedValidationConfigurations() {
    const validationConfigs: ValidationConfiguration[] = [
      // Authentication validation rules
      {
        id: "val-1", entityType: "user", fieldName: "email", validationType: "pattern",
        rules: { pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" },
        errorMessage: "Please enter a valid email address",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-2", entityType: "user", fieldName: "password", validationType: "length",
        rules: { minLength: 6, maxLength: 128 },
        errorMessage: "Password must be at least 6 characters long",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },

      // Corporate registration validation rules
      {
        id: "val-3", entityType: "corporate_registration", fieldName: "otpCode", validationType: "length",
        rules: { exactLength: 6 },
        errorMessage: "OTP code must be exactly 6 digits",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-4", entityType: "corporate_registration", fieldName: "companyName", validationType: "length",
        rules: { minLength: 2, maxLength: 200 },
        errorMessage: "Company name must be between 2 and 200 characters",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-5", entityType: "corporate_registration", fieldName: "contactPerson", validationType: "length",
        rules: { minLength: 2, maxLength: 100 },
        errorMessage: "Contact person name must be between 2 and 100 characters",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },

      // API sandbox validation rules - Currency validation
      {
        id: "val-6", entityType: "api_request", fieldName: "amount", validationType: "pattern",
        rules: { pattern: "^\\d+\\.\\d{2}$", minValue: 0.01, maxValue: 999999999.99 },
        errorMessage: "Amount must be in format 1000.00 and greater than 0",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },

      // Phone number validation
      {
        id: "val-7", entityType: "api_request", fieldName: "mobile_number", validationType: "pattern",
        rules: { pattern: "^[6-9]\\d{9}$" },
        errorMessage: "Mobile number must be a valid 10-digit Indian mobile number",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-8", entityType: "api_request", fieldName: "customer_mobile", validationType: "pattern",
        rules: { pattern: "^[6-9]\\d{9}$" },
        errorMessage: "Customer mobile must be a valid 10-digit Indian mobile number",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-9", entityType: "api_request", fieldName: "phoneNo", validationType: "pattern",
        rules: { pattern: "^[6-9]\\d{9}$" },
        errorMessage: "Phone number must be a valid 10-digit Indian mobile number",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },

      // IFSC code validation
      {
        id: "val-10", entityType: "api_request", fieldName: "ifscCode", validationType: "pattern",
        rules: { pattern: "^[A-Z]{4}0[A-Z0-9]{6}$" },
        errorMessage: "IFSC code must be in valid format (e.g., AUBL0002086)",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },

      // Account number validation
      {
        id: "val-11", entityType: "api_request", fieldName: "remitterAccountNo", validationType: "pattern",
        rules: { pattern: "^\\d{9,18}$" },
        errorMessage: "Remitter account number must be 9-18 digits",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-12", entityType: "api_request", fieldName: "beneAccNo", validationType: "pattern",
        rules: { pattern: "^\\d{9,18}$" },
        errorMessage: "Beneficiary account number must be 9-18 digits",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },

      // Date validation patterns
      {
        id: "val-13", entityType: "api_request", fieldName: "date_of_birth", validationType: "pattern",
        rules: { pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
        errorMessage: "Date of birth must be in YYYY-MM-DD format",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-14", entityType: "api_request", fieldName: "valueDate", validationType: "pattern",
        rules: { pattern: "^\\d{8}$" },
        errorMessage: "Value date must be in YYYYMMDD format",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },

      // Length constraints for API fields
      {
        id: "val-15", entityType: "api_request", fieldName: "uniqueRequestId", validationType: "length",
        rules: { maxLength: 20 },
        errorMessage: "Unique Request ID must not exceed 20 characters",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-16", entityType: "api_request", fieldName: "corporateCode", validationType: "length",
        rules: { maxLength: 20 },
        errorMessage: "Corporate code must not exceed 20 characters",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-17", entityType: "api_request", fieldName: "corporateProductCode", validationType: "length",
        rules: { maxLength: 50 },
        errorMessage: "Corporate product code must not exceed 50 characters",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-18", entityType: "api_request", fieldName: "paymentMethodName", validationType: "length",
        rules: { maxLength: 50 },
        errorMessage: "Payment method name must not exceed 50 characters",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-19", entityType: "api_request", fieldName: "beneName", validationType: "length",
        rules: { maxLength: 200 },
        errorMessage: "Beneficiary name must not exceed 200 characters",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-20", entityType: "api_request", fieldName: "transactionRefNo", validationType: "length",
        rules: { maxLength: 25 },
        errorMessage: "Transaction reference number must not exceed 25 characters",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-21", entityType: "api_request", fieldName: "paymentInstruction", validationType: "length",
        rules: { maxLength: 314 },
        errorMessage: "Payment instruction must not exceed 314 characters",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-22", entityType: "api_request", fieldName: "remarks", validationType: "length",
        rules: { maxLength: 40 },
        errorMessage: "Remarks must not exceed 40 characters",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-23", entityType: "api_request", fieldName: "customer_name", validationType: "length",
        rules: { maxLength: 100 },
        errorMessage: "Customer name must not exceed 100 characters",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-24", entityType: "api_request", fieldName: "document_number", validationType: "length",
        rules: { maxLength: 20 },
        errorMessage: "Document number must not exceed 20 characters",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-25", entityType: "api_request", fieldName: "biller_id", validationType: "length",
        rules: { maxLength: 20 },
        errorMessage: "Biller ID must not exceed 20 characters",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-26", entityType: "api_request", fieldName: "reference_id", validationType: "length",
        rules: { maxLength: 25 },
        errorMessage: "Reference ID must not exceed 25 characters",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },

      // Required field validations
      {
        id: "val-27", entityType: "api_request", fieldName: "amount", validationType: "required",
        rules: { required: true },
        errorMessage: "Amount is mandatory and cannot be empty",
        environment: "all", isActive: true, priority: 0,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-28", entityType: "api_request", fieldName: "transaction_ref", validationType: "required",
        rules: { required: true },
        errorMessage: "Transaction reference is mandatory and cannot be empty",
        environment: "all", isActive: true, priority: 0,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-29", entityType: "api_request", fieldName: "mobile_number", validationType: "required",
        rules: { required: true },
        errorMessage: "Mobile number is mandatory and cannot be empty",
        environment: "all", isActive: true, priority: 0,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-30", entityType: "user", fieldName: "email", validationType: "required",
        rules: { required: true },
        errorMessage: "Email is required",
        environment: "all", isActive: true, priority: 0,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-31", entityType: "user", fieldName: "password", validationType: "required",
        rules: { required: true },
        errorMessage: "Password is required",
        environment: "all", isActive: true, priority: 0,
        createdAt: new Date(), updatedAt: new Date()
      },

      // Admin panel validation rules
      {
        id: "val-32", entityType: "api_endpoint", fieldName: "name", validationType: "length",
        rules: { minLength: 1, maxLength: 100 },
        errorMessage: "API name must be between 1 and 100 characters",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-33", entityType: "api_endpoint", fieldName: "path", validationType: "length",
        rules: { minLength: 1, maxLength: 500 },
        errorMessage: "API path must be between 1 and 500 characters",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-34", entityType: "api_endpoint", fieldName: "description", validationType: "length",
        rules: { minLength: 10, maxLength: 1000 },
        errorMessage: "API description must be between 10 and 1000 characters",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: "val-35", entityType: "api_endpoint", fieldName: "timeout", validationType: "range",
        rules: { minValue: 5000, maxValue: 300000 },
        errorMessage: "API timeout must be between 5 seconds and 5 minutes",
        environment: "all", isActive: true, priority: 1,
        createdAt: new Date(), updatedAt: new Date()
      }
    ];

    validationConfigs.forEach(config => {
      this.validationConfigurations.set(config.id, config);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      department: insertUser.department || null,
      employeeId: insertUser.employeeId || null,
      role: insertUser.role || 'developer',
      isActive: insertUser.isActive ?? true,
      id, 
      lastLoginAt: null, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: UpdateUser): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  async verifyUserPassword(email: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    return user && user.isActive ? user : undefined;
  }

  async updateUserPassword(id: string, newPasswordHash: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;
    user.passwordHash = newPasswordHash;
    user.updatedAt = new Date();
    this.users.set(id, user);
    return true;
  }

  async updateLastLogin(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.lastLoginAt = new Date();
      this.users.set(id, user);
    }
  }

  // Developer operations
  async getDeveloper(id: string): Promise<Developer | undefined> {
    return this.developers.get(id);
  }

  async getDeveloperByEmail(email: string): Promise<Developer | undefined> {
    return Array.from(this.developers.values()).find(dev => dev.email === email);
  }

  async getDeveloperByApiKey(apiKey: string): Promise<Developer | undefined> {
    return Array.from(this.developers.values()).find(dev => dev.apiKey === apiKey);
  }

  async getDeveloperByUserId(userId: string): Promise<Developer | undefined> {
    return Array.from(this.developers.values()).find(dev => dev.userId === userId);
  }

  async createDeveloper(insertDeveloper: InsertDeveloper): Promise<Developer> {
    const id = randomUUID();
    const apiKey = `au_dev_${randomUUID().replace(/-/g, '')}`;
    const developer: Developer = { 
      ...insertDeveloper,
      department: insertDeveloper.department || null,
      team: insertDeveloper.team || null,
      projectsAssigned: insertDeveloper.projectsAssigned || null,
      permissions: insertDeveloper.permissions || null,
      id, 
      apiKey,
      isVerified: false,
      lastActiveAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.developers.set(id, developer);
    return developer;
  }

  async updateDeveloper(id: string, updates: UpdateDeveloper): Promise<Developer | undefined> {
    const developer = this.developers.get(id);
    if (!developer) return undefined;
    const updated = { ...developer, ...updates, updatedAt: new Date() };
    this.developers.set(id, updated);
    return updated;
  }

  async updateDeveloperActivity(id: string): Promise<void> {
    const developer = this.developers.get(id);
    if (developer) {
      developer.lastActiveAt = new Date();
      this.developers.set(id, developer);
    }
  }

  async getAllDevelopers(): Promise<Developer[]> {
    return Array.from(this.developers.values());
  }

  // Corporate Registration operations
  async createCorporateRegistration(insertRegistration: InsertCorporateRegistration): Promise<CorporateRegistration> {
    const id = randomUUID();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    
    const registration: CorporateRegistration = {
      ...insertRegistration,
      id,
      status: "pending",
      otpCode,
      otpExpiry,
      createdAt: new Date()
    };
    
    this.corporateRegistrations.set(id, registration);
    return registration;
  }

  async getCorporateRegistration(id: string): Promise<CorporateRegistration | undefined> {
    return this.corporateRegistrations.get(id);
  }

  async updateCorporateRegistration(id: string, updates: Partial<CorporateRegistration>): Promise<CorporateRegistration | undefined> {
    const registration = this.corporateRegistrations.get(id);
    if (!registration) return undefined;
    
    const updatedRegistration = { ...registration, ...updates };
    this.corporateRegistrations.set(id, updatedRegistration);
    return updatedRegistration;
  }

  async getCorporateRegistrationByEmail(email: string): Promise<CorporateRegistration | undefined> {
    return Array.from(this.corporateRegistrations.values()).find(reg => reg.email === email);
  }

  // Application operations
  async getApplication(id: string): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async getApplicationsByDeveloper(developerId: string): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(app => app.developerId === developerId);
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = randomUUID();
    const application: Application = {
      ...insertApplication,
      description: insertApplication.description || null,
      projectType: insertApplication.projectType || "internal",
      environment: insertApplication.environment || "sandbox",
      status: insertApplication.status || "active",
      configuration: insertApplication.configuration || {},
      approvedBy: insertApplication.approvedBy || null,
      approvedAt: insertApplication.approvedAt || null,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.applications.set(id, application);
    return application;
  }

  async updateApplication(id: string, updateData: Partial<InsertApplication>): Promise<Application | undefined> {
    const existing = this.applications.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updateData };
    this.applications.set(id, updated);
    return updated;
  }

  async deleteApplication(id: string): Promise<boolean> {
    return this.applications.delete(id);
  }

  // API Endpoint operations
  async getAllApiEndpoints(): Promise<ApiEndpoint[]> {
    return Array.from(this.apiEndpoints.values());
  }

  async getApiEndpointsByCategory(category: string): Promise<ApiEndpoint[]> {
    return Array.from(this.apiEndpoints.values()).filter(endpoint => endpoint.category === category);
  }

  async createApiEndpoint(insertEndpoint: InsertApiEndpoint): Promise<ApiEndpoint> {
    const id = randomUUID();
    const endpoint: ApiEndpoint = { 
      ...insertEndpoint,
      categoryId: insertEndpoint.categoryId || null,
      summary: insertEndpoint.summary || null,
      headers: insertEndpoint.headers || [],
      responses: insertEndpoint.responses || [],
      requestExample: insertEndpoint.requestExample || null,
      responseExample: insertEndpoint.responseExample || null,
      documentation: insertEndpoint.documentation || null,
      tags: insertEndpoint.tags || [],
      timeout: insertEndpoint.timeout || 30000,
      requiresAuth: insertEndpoint.requiresAuth ?? true,
      authType: insertEndpoint.authType || "bearer",
      status: insertEndpoint.status || "active",
      version: insertEndpoint.version || 'v1',
      parameters: insertEndpoint.parameters || [],
      responseSchema: insertEndpoint.responseSchema || {},
      rateLimits: insertEndpoint.rateLimits || {},
      requiredPermissions: insertEndpoint.requiredPermissions || [],
      isInternal: insertEndpoint.isInternal ?? true,
      isActive: insertEndpoint.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
      id 
    };
    this.apiEndpoints.set(id, endpoint);
    return endpoint;
  }

  async updateApiEndpoint(id: string, updateData: UpdateApiEndpoint): Promise<ApiEndpoint | undefined> {
    const existing = this.apiEndpoints.get(id);
    if (!existing) return undefined;
    
    const updated: ApiEndpoint = { ...existing, ...updateData, updatedAt: new Date() };
    this.apiEndpoints.set(id, updated);
    return updated;
  }

  async deleteApiEndpoint(id: string): Promise<boolean> {
    return this.apiEndpoints.delete(id);
  }

  // API Category operations
  async getAllApiCategories(): Promise<ApiCategory[]> {
    return Array.from(this.apiCategories.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async createApiCategory(insertCategory: InsertApiCategory): Promise<ApiCategory> {
    const id = randomUUID();
    const category: ApiCategory = {
      ...insertCategory,
      icon: insertCategory.icon || "Code",
      color: insertCategory.color || "#603078",
      displayOrder: insertCategory.displayOrder || 0,
      isActive: insertCategory.isActive ?? true,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.apiCategories.set(id, category);
    return category;
  }

  async updateApiCategory(id: string, updateData: UpdateApiCategory): Promise<ApiCategory | undefined> {
    const existing = this.apiCategories.get(id);
    if (!existing) return undefined;
    
    const updated: ApiCategory = { ...existing, ...updateData, updatedAt: new Date() };
    this.apiCategories.set(id, updated);
    return updated;
  }

  async deleteApiCategory(id: string): Promise<boolean> {
    return this.apiCategories.delete(id);
  }

  async getApiCategory(id: string): Promise<ApiCategory | undefined> {
    return this.apiCategories.get(id);
  }

  // API Usage operations
  async getApiUsageByDeveloper(developerId: string): Promise<ApiUsage[]> {
    return Array.from(this.apiUsage.values()).filter(usage => usage.developerId === developerId);
  }

  async getApiUsageByApplication(applicationId: string): Promise<ApiUsage[]> {
    return Array.from(this.apiUsage.values()).filter(usage => usage.applicationId === applicationId);
  }

  async createApiUsage(insertUsage: InsertApiUsage): Promise<ApiUsage> {
    const id = randomUUID();
    const month = new Date().toISOString().slice(0, 7);
    const usage: ApiUsage = {
      ...insertUsage,
      requestCount: insertUsage.requestCount || 0,
      successCount: insertUsage.successCount || 0,
      errorCount: insertUsage.errorCount || 0,
      totalResponseTime: insertUsage.totalResponseTime || 0,
      environment: insertUsage.environment || "sandbox",
      month,
      id,
      date: new Date()
    };
    this.apiUsage.set(id, usage);
    return usage;
  }

  async updateApiUsage(id: string, updateData: Partial<InsertApiUsage>): Promise<ApiUsage | undefined> {
    const existing = this.apiUsage.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updateData };
    this.apiUsage.set(id, updated);
    return updated;
  }

  async getApiUsageStats(developerId: string, environment?: string): Promise<any> {
    const usage = Array.from(this.apiUsage.values())
      .filter(u => u.developerId === developerId && (!environment || u.environment === environment));
    
    return {
      totalRequests: usage.reduce((sum, u) => sum + u.requestCount, 0),
      totalErrors: usage.reduce((sum, u) => sum + u.errorCount, 0),
      avgResponseTime: usage.length > 0 ? usage.reduce((sum, u) => sum + u.totalResponseTime, 0) / usage.length : 0
    };
  }

  // Audit Log operations
  async createAuditLog(logData: InsertAuditLog): Promise<AuditLog> {
    const id = randomUUID();
    const auditLog: AuditLog = {
      ...logData,
      userId: logData.userId || null,
      resource: logData.resource || null,
      resourceId: logData.resourceId || null,
      ipAddress: logData.ipAddress || null,
      userAgent: logData.userAgent || null,
      details: logData.details || {},
      id,
      timestamp: new Date()
    };
    this.auditLogs.set(id, auditLog);
    return auditLog;
  }

  async getAuditLogs(userId?: string, limit?: number): Promise<AuditLog[]> {
    let logs = Array.from(this.auditLogs.values());
    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }
    logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return limit ? logs.slice(0, limit) : logs;
  }

  // API Token operations
  async createApiToken(tokenData: InsertApiToken): Promise<ApiToken> {
    const id = randomUUID();
    const token = `au_token_${randomUUID().replace(/-/g, '')}`;
    const apiToken: ApiToken = {
      ...tokenData,
      id,
      token,
      permissions: tokenData.permissions || {},
      expiresAt: tokenData.expiresAt || null,
      isActive: tokenData.isActive ?? true,
      environment: tokenData.environment || 'sandbox',
      lastUsedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.apiTokens.set(id, apiToken);
    return apiToken;
  }

  async getApiToken(token: string): Promise<ApiToken | undefined> {
    return Array.from(this.apiTokens.values()).find(t => t.token === token);
  }

  async getApiTokensByDeveloper(developerId: string): Promise<ApiToken[]> {
    return Array.from(this.apiTokens.values()).filter(t => t.developerId === developerId);
  }

  async revokeApiToken(id: string): Promise<boolean> {
    const token = this.apiTokens.get(id);
    if (!token) return false;
    token.isActive = false;
    this.apiTokens.set(id, token);
    return true;
  }

  async updateTokenLastUsed(token: string): Promise<void> {
    const apiToken = Array.from(this.apiTokens.values()).find(t => t.token === token);
    if (apiToken) {
      apiToken.lastUsedAt = new Date();
      this.apiTokens.set(apiToken.id, apiToken);
    }
  }

  // Configuration Category operations
  async getAllConfigCategories(): Promise<ConfigCategory[]> {
    return Array.from(this.configCategories.values())
      .filter(cat => cat.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getConfigCategory(id: string): Promise<ConfigCategory | undefined> {
    return this.configCategories.get(id);
  }

  async getConfigCategoryByName(name: string): Promise<ConfigCategory | undefined> {
    return Array.from(this.configCategories.values()).find(cat => cat.name === name);
  }

  async createConfigCategory(category: InsertConfigCategory): Promise<ConfigCategory> {
    const id = randomUUID();
    const newCategory: ConfigCategory = {
      ...category,
      displayOrder: category.displayOrder || 0,
      isActive: category.isActive ?? true,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.configCategories.set(id, newCategory);
    return newCategory;
  }

  async updateConfigCategory(id: string, updates: UpdateConfigCategory): Promise<ConfigCategory | undefined> {
    const category = this.configCategories.get(id);
    if (!category) return undefined;
    const updated = { ...category, ...updates, updatedAt: new Date() };
    this.configCategories.set(id, updated);
    return updated;
  }

  async deleteConfigCategory(id: string): Promise<boolean> {
    return this.configCategories.delete(id);
  }

  // General Configuration operations
  async getAllConfigurations(environment?: string): Promise<Configuration[]> {
    return Array.from(this.configurations.values()).filter(config => 
      !environment || config.environment === 'all' || config.environment === environment
    );
  }

  async getConfigurationsByCategory(categoryId: string, environment?: string): Promise<Configuration[]> {
    return Array.from(this.configurations.values()).filter(config => 
      config.categoryId === categoryId && 
      (!environment || config.environment === 'all' || config.environment === environment)
    );
  }

  async getConfiguration(id: string): Promise<Configuration | undefined> {
    return this.configurations.get(id);
  }

  async getConfigurationByKey(key: string, environment?: string): Promise<Configuration | undefined> {
    return Array.from(this.configurations.values()).find(config => 
      config.key === key && 
      (!environment || config.environment === 'all' || config.environment === environment)
    );
  }

  async createConfiguration(config: InsertConfiguration): Promise<Configuration> {
    const id = randomUUID();
    const newConfig: Configuration = {
      ...config,
      environment: config.environment || "all",
      dataType: config.dataType || "string",
      displayOrder: config.displayOrder || 0,
      isEditable: config.isEditable ?? true,
      isRequired: config.isRequired ?? false,
      validationRules: config.validationRules || {},
      lastModifiedBy: config.lastModifiedBy || null,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.configurations.set(id, newConfig);
    return newConfig;
  }

  async updateConfiguration(id: string, updates: UpdateConfiguration): Promise<Configuration | undefined> {
    const config = this.configurations.get(id);
    if (!config) return undefined;
    const updated = { ...config, ...updates, updatedAt: new Date() };
    this.configurations.set(id, updated);
    return updated;
  }

  async deleteConfiguration(id: string): Promise<boolean> {
    return this.configurations.delete(id);
  }

  // UI Configuration operations
  async getAllUiConfigurations(environment?: string): Promise<UiConfiguration[]> {
    return Array.from(this.uiConfigurations.values()).filter(config => 
      config.isActive && (!environment || config.environment === 'all' || config.environment === environment)
    );
  }

  async getUiConfiguration(id: string): Promise<UiConfiguration | undefined> {
    return this.uiConfigurations.get(id);
  }

  async getUiConfigurationByEnvironment(environment: string): Promise<UiConfiguration | undefined> {
    return Array.from(this.uiConfigurations.values()).find(config => 
      config.isActive && (config.environment === 'all' || config.environment === environment)
    );
  }

  async createUiConfiguration(config: InsertUiConfiguration): Promise<UiConfiguration> {
    const id = randomUUID();
    const newConfig: UiConfiguration = {
      ...config,
      fontFamily: config.fontFamily || "Inter",
      environment: config.environment || "all",
      isActive: config.isActive ?? true,
      theme: config.theme || "default",
      primaryColor: config.primaryColor || "#603078",
      secondaryColor: config.secondaryColor || "#4d2661",
      accentColor: config.accentColor || "#f59e0b",
      backgroundColor: config.backgroundColor || "#fefefe",
      textColor: config.textColor || "#111827",
      borderRadius: config.borderRadius || "14px",
      logoUrl: config.logoUrl ?? null,
      faviconUrl: config.faviconUrl ?? null,
      customCss: config.customCss ?? null,
      sidebarWidth: config.sidebarWidth || "16rem",
      headerHeight: config.headerHeight || "4rem",
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.uiConfigurations.set(id, newConfig);
    return newConfig;
  }

  async updateUiConfiguration(id: string, updates: UpdateUiConfiguration): Promise<UiConfiguration | undefined> {
    const config = this.uiConfigurations.get(id);
    if (!config) return undefined;
    const updated = { ...config, ...updates, updatedAt: new Date() };
    this.uiConfigurations.set(id, updated);
    return updated;
  }

  async deleteUiConfiguration(id: string): Promise<boolean> {
    return this.uiConfigurations.delete(id);
  }

  // Form Configuration operations
  async getAllFormConfigurations(environment?: string): Promise<FormConfiguration[]> {
    return Array.from(this.formConfigurations.values()).filter(config => 
      config.isActive && (!environment || config.environment === 'all' || config.environment === environment)
    );
  }

  async getFormConfiguration(id: string): Promise<FormConfiguration | undefined> {
    return this.formConfigurations.get(id);
  }

  async getFormConfigurationByType(formType: string, environment?: string): Promise<FormConfiguration | undefined> {
    return Array.from(this.formConfigurations.values()).find(config => 
      config.isActive && config.formType === formType && 
      (!environment || config.environment === 'all' || config.environment === environment)
    );
  }

  async createFormConfiguration(config: InsertFormConfiguration): Promise<FormConfiguration> {
    const id = randomUUID();
    const newConfig: FormConfiguration = {
      ...config,
      environment: config.environment || "all",
      autoSave: config.autoSave ?? false,
      isActive: config.isActive ?? true,
      fieldDefaults: config.fieldDefaults || {},
      fieldVisibility: config.fieldVisibility || {},
      fieldValidation: config.fieldValidation || {},
      submitBehavior: config.submitBehavior || {},
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.formConfigurations.set(id, newConfig);
    return newConfig;
  }

  async updateFormConfiguration(id: string, updates: UpdateFormConfiguration): Promise<FormConfiguration | undefined> {
    const config = this.formConfigurations.get(id);
    if (!config) return undefined;
    const updated = { ...config, ...updates, updatedAt: new Date() };
    this.formConfigurations.set(id, updated);
    return updated;
  }

  async deleteFormConfiguration(id: string): Promise<boolean> {
    return this.formConfigurations.delete(id);
  }

  // Validation Configuration operations
  async getAllValidationConfigurations(environment?: string): Promise<ValidationConfiguration[]> {
    return Array.from(this.validationConfigurations.values()).filter(config => 
      config.isActive && (!environment || config.environment === 'all' || config.environment === environment)
    ).sort((a, b) => a.priority - b.priority);
  }

  async getValidationConfiguration(id: string): Promise<ValidationConfiguration | undefined> {
    return this.validationConfigurations.get(id);
  }

  async getValidationConfigurationsByEntity(entityType: string, environment?: string): Promise<ValidationConfiguration[]> {
    return Array.from(this.validationConfigurations.values()).filter(config => 
      config.isActive && config.entityType === entityType && 
      (!environment || config.environment === 'all' || config.environment === environment)
    ).sort((a, b) => a.priority - b.priority);
  }

  async createValidationConfiguration(config: InsertValidationConfiguration): Promise<ValidationConfiguration> {
    const id = randomUUID();
    const newConfig: ValidationConfiguration = {
      ...config,
      environment: config.environment || "all",
      isActive: config.isActive ?? true,
      priority: config.priority || 0,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.validationConfigurations.set(id, newConfig);
    return newConfig;
  }

  async updateValidationConfiguration(id: string, updates: UpdateValidationConfiguration): Promise<ValidationConfiguration | undefined> {
    const config = this.validationConfigurations.get(id);
    if (!config) return undefined;
    const updated = { ...config, ...updates, updatedAt: new Date() };
    this.validationConfigurations.set(id, updated);
    return updated;
  }

  async deleteValidationConfiguration(id: string): Promise<boolean> {
    return this.validationConfigurations.delete(id);
  }

  // System Configuration operations
  async getAllSystemConfigurations(environment?: string): Promise<SystemConfiguration[]> {
    return Array.from(this.systemConfigurations.values()).filter(config => 
      (!environment || config.environment === 'all' || config.environment === environment)
    );
  }

  async getSystemConfiguration(id: string): Promise<SystemConfiguration | undefined> {
    return this.systemConfigurations.get(id);
  }

  async getSystemConfigurationsByModule(module: string, environment?: string): Promise<SystemConfiguration[]> {
    return Array.from(this.systemConfigurations.values()).filter(config => 
      config.module === module && 
      (!environment || config.environment === 'all' || config.environment === environment)
    );
  }

  async getSystemConfigurationBySetting(module: string, setting: string, environment?: string): Promise<SystemConfiguration | undefined> {
    return Array.from(this.systemConfigurations.values()).find(config => 
      config.module === module && config.setting === setting && 
      (!environment || config.environment === 'all' || config.environment === environment)
    );
  }

  async createSystemConfiguration(config: InsertSystemConfiguration): Promise<SystemConfiguration> {
    const id = randomUUID();
    const newConfig: SystemConfiguration = {
      ...config,
      environment: config.environment || "all",
      dataType: config.dataType || "string",
      isEditable: config.isEditable ?? true,
      requiresRestart: config.requiresRestart ?? false,
      lastModifiedBy: config.lastModifiedBy || null,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.systemConfigurations.set(id, newConfig);
    return newConfig;
  }

  async updateSystemConfiguration(id: string, updates: UpdateSystemConfiguration): Promise<SystemConfiguration | undefined> {
    const config = this.systemConfigurations.get(id);
    if (!config) return undefined;
    const updated = { ...config, ...updates, updatedAt: new Date() };
    this.systemConfigurations.set(id, updated);
    return updated;
  }

  async deleteSystemConfiguration(id: string): Promise<boolean> {
    return this.systemConfigurations.delete(id);
  }

  // Environment Configuration operations
  async getAllEnvironmentConfigurations(environment?: string): Promise<EnvironmentConfiguration[]> {
    return Array.from(this.environmentConfigurations.values()).filter(config => 
      !environment || config.environment === environment
    );
  }

  async getEnvironmentConfiguration(id: string): Promise<EnvironmentConfiguration | undefined> {
    return this.environmentConfigurations.get(id);
  }

  async getEnvironmentConfigurationByKey(configKey: string, environment: string): Promise<EnvironmentConfiguration | undefined> {
    return Array.from(this.environmentConfigurations.values()).find(config => 
      config.configKey === configKey && config.environment === environment
    );
  }

  async createEnvironmentConfiguration(config: InsertEnvironmentConfiguration): Promise<EnvironmentConfiguration> {
    const id = randomUUID();
    const newConfig: EnvironmentConfiguration = {
      ...config,
      description: config.description ?? null,
      isOverride: config.isOverride ?? false,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.environmentConfigurations.set(id, newConfig);
    return newConfig;
  }

  async updateEnvironmentConfiguration(id: string, updates: UpdateEnvironmentConfiguration): Promise<EnvironmentConfiguration | undefined> {
    const config = this.environmentConfigurations.get(id);
    if (!config) return undefined;
    const updated = { ...config, ...updates, updatedAt: new Date() };
    this.environmentConfigurations.set(id, updated);
    return updated;
  }

  async deleteEnvironmentConfiguration(id: string): Promise<boolean> {
    return this.environmentConfigurations.delete(id);
  }
}

// Production database storage implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const passwordHash = await bcrypt.hash(userData.passwordHash, 12);
    const [user] = await db
      .insert(users)
      .values({ ...userData, passwordHash })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: UpdateUser): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async verifyUserPassword(email: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.isActive) return undefined;
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return undefined;
    
    await this.updateLastLogin(user.id);
    return user;
  }

  async updateUserPassword(id: string, newPasswordHash: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(newPasswordHash, 12);
    const result = await db
      .update(users)
      .set({ passwordHash: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async updateLastLogin(id: string): Promise<void> {
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, id));
  }

  // Developer operations
  async getDeveloper(id: string): Promise<Developer | undefined> {
    const [developer] = await db.select().from(developers).where(eq(developers.id, id));
    return developer;
  }

  async getDeveloperByUserId(userId: string): Promise<Developer | undefined> {
    const [developer] = await db.select().from(developers).where(eq(developers.userId, userId));
    return developer;
  }

  async getDeveloperByEmail(email: string): Promise<Developer | undefined> {
    const [developer] = await db.select().from(developers).where(eq(developers.email, email));
    return developer;
  }

  async getDeveloperByApiKey(apiKey: string): Promise<Developer | undefined> {
    const [developer] = await db.select().from(developers).where(eq(developers.apiKey, apiKey));
    return developer;
  }

  async createDeveloper(developerData: InsertDeveloper): Promise<Developer> {
    const apiKey = `au_dev_${randomUUID().replace(/-/g, '')}`;
    const [developer] = await db
      .insert(developers)
      .values({ ...developerData, apiKey })
      .returning();
    return developer;
  }

  async updateDeveloper(id: string, updates: UpdateDeveloper): Promise<Developer | undefined> {
    const [updated] = await db
      .update(developers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(developers.id, id))
      .returning();
    return updated;
  }

  async getAllDevelopers(): Promise<Developer[]> {
    return await db.select().from(developers).orderBy(desc(developers.createdAt));
  }

  async updateDeveloperActivity(id: string): Promise<void> {
    await db
      .update(developers)
      .set({ lastActiveAt: new Date() })
      .where(eq(developers.id, id));
  }

  // Corporate Registration operations
  async createCorporateRegistration(registrationData: InsertCorporateRegistration): Promise<CorporateRegistration> {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    const [registration] = await db
      .insert(corporateRegistrations)
      .values({ ...registrationData, otpCode, otpExpiry })
      .returning();
    return registration;
  }

  async getCorporateRegistration(id: string): Promise<CorporateRegistration | undefined> {
    const [registration] = await db.select().from(corporateRegistrations).where(eq(corporateRegistrations.id, id));
    return registration;
  }

  async updateCorporateRegistration(id: string, updates: Partial<CorporateRegistration>): Promise<CorporateRegistration | undefined> {
    const [updated] = await db
      .update(corporateRegistrations)
      .set(updates)
      .where(eq(corporateRegistrations.id, id))
      .returning();
    return updated;
  }

  async getCorporateRegistrationByEmail(email: string): Promise<CorporateRegistration | undefined> {
    const [registration] = await db.select().from(corporateRegistrations).where(eq(corporateRegistrations.email, email));
    return registration;
  }

  // Application operations
  async getApplication(id: string): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }

  async getApplicationsByDeveloper(developerId: string): Promise<Application[]> {
    return await db.select().from(applications)
      .where(eq(applications.developerId, developerId))
      .orderBy(desc(applications.createdAt));
  }

  async createApplication(applicationData: InsertApplication): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values(applicationData)
      .returning();
    return application;
  }

  async updateApplication(id: string, updates: Partial<InsertApplication>): Promise<Application | undefined> {
    const [updated] = await db
      .update(applications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return updated;
  }

  async deleteApplication(id: string): Promise<boolean> {
    const result = await db.delete(applications).where(eq(applications.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // API Endpoint operations
  async getAllApiEndpoints(): Promise<ApiEndpoint[]> {
    return await db.select().from(apiEndpoints)
      .where(eq(apiEndpoints.isActive, true))
      .orderBy(apiEndpoints.category, apiEndpoints.name);
  }

  async getApiEndpointsByCategory(category: string): Promise<ApiEndpoint[]> {
    return await db.select().from(apiEndpoints)
      .where(and(
        eq(apiEndpoints.category, category),
        eq(apiEndpoints.isActive, true)
      ));
  }

  async createApiEndpoint(endpointData: InsertApiEndpoint): Promise<ApiEndpoint> {
    const [endpoint] = await db
      .insert(apiEndpoints)
      .values(endpointData)
      .returning();
    return endpoint;
  }

  // API Usage operations
  async getApiUsageByDeveloper(developerId: string): Promise<ApiUsage[]> {
    return await db.select().from(apiUsage)
      .where(eq(apiUsage.developerId, developerId))
      .orderBy(desc(apiUsage.date));
  }

  async getApiUsageByApplication(applicationId: string): Promise<ApiUsage[]> {
    return await db.select().from(apiUsage)
      .where(eq(apiUsage.applicationId, applicationId))
      .orderBy(desc(apiUsage.date));
  }

  async createApiUsage(usageData: InsertApiUsage): Promise<ApiUsage> {
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const [usage] = await db
      .insert(apiUsage)
      .values({ ...usageData, month })
      .returning();
    return usage;
  }

  async updateApiUsage(id: string, updates: Partial<InsertApiUsage>): Promise<ApiUsage | undefined> {
    const [updated] = await db
      .update(apiUsage)
      .set(updates)
      .where(eq(apiUsage.id, id))
      .returning();
    return updated;
  }

  async getApiUsageStats(developerId: string, environment = 'sandbox'): Promise<any> {
    const result = await db
      .select({
        totalRequests: sql<number>`sum(${apiUsage.requestCount})`,
        totalSuccess: sql<number>`sum(${apiUsage.successCount})`,
        totalErrors: sql<number>`sum(${apiUsage.errorCount})`,
        avgResponseTime: sql<number>`avg(${apiUsage.totalResponseTime} / ${apiUsage.requestCount})`,
      })
      .from(apiUsage)
      .where(and(
        eq(apiUsage.developerId, developerId),
        eq(apiUsage.environment, environment)
      ));
    
    return result[0] || { totalRequests: 0, totalSuccess: 0, totalErrors: 0, avgResponseTime: 0 };
  }


  // Audit log operations
  async createAuditLog(logData: InsertAuditLog): Promise<AuditLog> {
    const [log] = await db
      .insert(auditLogs)
      .values(logData)
      .returning();
    return log;
  }

  async getAuditLogs(userId?: string, limit = 100): Promise<AuditLog[]> {
    if (userId) {
      return await db.select().from(auditLogs)
        .where(eq(auditLogs.userId, userId))
        .orderBy(desc(auditLogs.timestamp))
        .limit(limit);
    }
    
    return await db.select().from(auditLogs)
      .orderBy(desc(auditLogs.timestamp))
      .limit(limit);
  }

  // API Token operations
  async createApiToken(tokenData: InsertApiToken): Promise<ApiToken> {
    const token = `au_token_${randomUUID().replace(/-/g, '')}`;
    const [apiToken] = await db
      .insert(apiTokens)
      .values({ ...tokenData, token })
      .returning();
    return apiToken;
  }

  async getApiToken(token: string): Promise<ApiToken | undefined> {
    const [apiToken] = await db.select().from(apiTokens)
      .where(and(
        eq(apiTokens.token, token),
        eq(apiTokens.isActive, true)
      ));
    return apiToken;
  }

  async getApiTokensByDeveloper(developerId: string): Promise<ApiToken[]> {
    return await db.select().from(apiTokens)
      .where(eq(apiTokens.developerId, developerId))
      .orderBy(desc(apiTokens.createdAt));
  }

  async revokeApiToken(id: string): Promise<boolean> {
    const result = await db
      .update(apiTokens)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(apiTokens.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async updateTokenLastUsed(token: string): Promise<void> {
    await db
      .update(apiTokens)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiTokens.token, token));
  }

  // API Category operations (Database Implementation)
  async getAllApiCategories(): Promise<ApiCategory[]> {
    try {
      return await db
        .select()
        .from(apiCategories)
        .where(eq(apiCategories.isActive, true))
        .orderBy(asc(apiCategories.displayOrder));
    } catch (error) {
      console.error('Database error in getAllApiCategories:', error);
      throw new Error('Failed to fetch API categories');
    }
  }

  async createApiCategory(categoryData: InsertApiCategory): Promise<ApiCategory> {
    try {
      const [category] = await db
        .insert(apiCategories)
        .values({
          ...categoryData,
          icon: categoryData.icon || 'Database',
          color: categoryData.color || '#603078',
          displayOrder: categoryData.displayOrder || 0,
          isActive: categoryData.isActive ?? true
        })
        .returning();
      return category;
    } catch (error) {
      console.error('Database error in createApiCategory:', error);
      throw new Error('Failed to create API category');
    }
  }

  async updateApiCategory(id: string, categoryData: UpdateApiCategory): Promise<ApiCategory | undefined> {
    try {
      const [updated] = await db
        .update(apiCategories)
        .set({ ...categoryData, updatedAt: new Date() })
        .where(eq(apiCategories.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Database error in updateApiCategory:', error);
      throw new Error('Failed to update API category');
    }
  }

  async deleteApiCategory(id: string): Promise<boolean> {
    try {
      const result = await db
        .update(apiCategories)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(apiCategories.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Database error in deleteApiCategory:', error);
      throw new Error('Failed to delete API category');
    }
  }

  async getApiCategory(id: string): Promise<ApiCategory | undefined> {
    try {
      const [category] = await db
        .select()
        .from(apiCategories)
        .where(and(eq(apiCategories.id, id), eq(apiCategories.isActive, true)));
      return category;
    } catch (error) {
      console.error('Database error in getApiCategory:', error);
      throw new Error('Failed to get API category');
    }
  }


  // Hierarchical data method - Categories with their APIs and documentation
  async getCategoriesWithApisHierarchical(): Promise<Array<ApiCategory & { apis: ApiEndpoint[] }>> {
    try {
      // Get all active categories
      const categories = await this.getAllApiCategories();
      
      // For each category, get its APIs with full documentation and sandbox details
      const categoriesWithApis = await Promise.all(
        categories.map(async (category) => {
          const apis = await this.getApiEndpointsByCategory(category.name);
          return {
            ...category,
            apis: apis.map(api => ({
              ...api,
              // Include sandbox and documentation details
              documentation: api.description || '',
              sandbox: {
                enabled: true,
                testData: api.parameters || [],
                mockResponse: api.responseSchema || {},
                rateLimits: api.rateLimits || { sandbox: 100, production: 1000 }
              }
            }))
          };
        })
      );
      
      return categoriesWithApis;
    } catch (error) {
      console.error('Database error in getCategoriesWithApisHierarchical:', error);
      throw new Error('Failed to fetch hierarchical categories data');
    }
  }

  // Missing API Endpoint operations
  async updateApiEndpoint(id: string, updates: UpdateApiEndpoint): Promise<ApiEndpoint | undefined> {
    try {
      const [updated] = await db
        .update(apiEndpoints)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(apiEndpoints.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Database error in updateApiEndpoint:', error);
      throw new Error('Failed to update API endpoint');
    }
  }

  async deleteApiEndpoint(id: string): Promise<boolean> {
    try {
      const result = await db
        .update(apiEndpoints)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(apiEndpoints.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Database error in deleteApiEndpoint:', error);
      throw new Error('Failed to delete API endpoint');
    }
  }

  // Configuration operations - Config Categories
  async getAllConfigCategories(): Promise<ConfigCategory[]> {
    try {
      return await db
        .select()
        .from(configCategories)
        .where(eq(configCategories.isActive, true))
        .orderBy(asc(configCategories.displayOrder));
    } catch (error) {
      console.error('Database error in getAllConfigCategories:', error);
      throw new Error('Failed to fetch config categories');
    }
  }

  async getConfigCategory(id: string): Promise<ConfigCategory | undefined> {
    try {
      const [category] = await db
        .select()
        .from(configCategories)
        .where(and(eq(configCategories.id, id), eq(configCategories.isActive, true)));
      return category;
    } catch (error) {
      console.error('Database error in getConfigCategory:', error);
      throw new Error('Failed to get config category');
    }
  }

  async getConfigCategoryByName(name: string): Promise<ConfigCategory | undefined> {
    try {
      const [category] = await db
        .select()
        .from(configCategories)
        .where(and(eq(configCategories.name, name), eq(configCategories.isActive, true)));
      return category;
    } catch (error) {
      console.error('Database error in getConfigCategoryByName:', error);
      throw new Error('Failed to get config category by name');
    }
  }

  async createConfigCategory(categoryData: InsertConfigCategory): Promise<ConfigCategory> {
    try {
      const [category] = await db
        .insert(configCategories)
        .values({
          ...categoryData,
          displayOrder: categoryData.displayOrder || 0,
          isActive: categoryData.isActive ?? true
        })
        .returning();
      return category;
    } catch (error) {
      console.error('Database error in createConfigCategory:', error);
      throw new Error('Failed to create config category');
    }
  }

  async updateConfigCategory(id: string, updates: UpdateConfigCategory): Promise<ConfigCategory | undefined> {
    try {
      const [updated] = await db
        .update(configCategories)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(configCategories.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Database error in updateConfigCategory:', error);
      throw new Error('Failed to update config category');
    }
  }

  async deleteConfigCategory(id: string): Promise<boolean> {
    try {
      const result = await db
        .update(configCategories)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(configCategories.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Database error in deleteConfigCategory:', error);
      throw new Error('Failed to delete config category');
    }
  }

  // General Configurations
  async getAllConfigurations(environment?: string): Promise<Configuration[]> {
    try {
      const baseQuery = db.select().from(configurations);
      const query = environment && environment !== 'all'
        ? baseQuery.where(eq(configurations.environment, environment))
        : baseQuery;
      return await query.orderBy(configurations.categoryId, configurations.key);
    } catch (error) {
      console.error('Database error in getAllConfigurations:', error);
      throw new Error('Failed to fetch configurations');
    }
  }

  async getConfigurationsByCategory(categoryId: string, environment?: string): Promise<Configuration[]> {
    try {
      const whereClause = environment && environment !== 'all'
        ? and(eq(configurations.categoryId, categoryId), eq(configurations.environment, environment))
        : eq(configurations.categoryId, categoryId);
      return await db.select().from(configurations)
        .where(whereClause)
        .orderBy(configurations.key);
    } catch (error) {
      console.error('Database error in getConfigurationsByCategory:', error);
      throw new Error('Failed to fetch configurations by category');
    }
  }

  async getConfiguration(id: string): Promise<Configuration | undefined> {
    try {
      const [config] = await db
        .select()
        .from(configurations)
        .where(eq(configurations.id, id));
      return config;
    } catch (error) {
      console.error('Database error in getConfiguration:', error);
      throw new Error('Failed to get configuration');
    }
  }

  async getConfigurationByKey(key: string, environment?: string): Promise<Configuration | undefined> {
    try {
      const whereClause = environment && environment !== 'all'
        ? and(eq(configurations.key, key), eq(configurations.environment, environment))
        : eq(configurations.key, key);
      const [config] = await db.select().from(configurations).where(whereClause);
      return config;
    } catch (error) {
      console.error('Database error in getConfigurationByKey:', error);
      throw new Error('Failed to get configuration by key');
    }
  }

  async createConfiguration(configData: InsertConfiguration): Promise<Configuration> {
    try {
      const [config] = await db
        .insert(configurations)
        .values(configData)
        .returning();
      return config;
    } catch (error) {
      console.error('Database error in createConfiguration:', error);
      throw new Error('Failed to create configuration');
    }
  }

  async updateConfiguration(id: string, updates: UpdateConfiguration): Promise<Configuration | undefined> {
    try {
      const [updated] = await db
        .update(configurations)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(configurations.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Database error in updateConfiguration:', error);
      throw new Error('Failed to update configuration');
    }
  }

  async deleteConfiguration(id: string): Promise<boolean> {
    try {
      const result = await db.delete(configurations).where(eq(configurations.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Database error in deleteConfiguration:', error);
      throw new Error('Failed to delete configuration');
    }
  }

  // UI Configurations
  async getAllUiConfigurations(environment?: string): Promise<UiConfiguration[]> {
    try {
      const whereClause = environment && environment !== 'all'
        ? and(
            eq(uiConfigurations.isActive, true),
            eq(uiConfigurations.environment, environment)
          )
        : eq(uiConfigurations.isActive, true);
      
      return await db.select().from(uiConfigurations)
        .where(whereClause)
        .orderBy(uiConfigurations.environment);
    } catch (error) {
      console.error('Database error in getAllUiConfigurations:', error);
      throw new Error('Failed to fetch UI configurations');
    }
  }

  async getUiConfiguration(id: string): Promise<UiConfiguration | undefined> {
    try {
      const [config] = await db
        .select()
        .from(uiConfigurations)
        .where(and(eq(uiConfigurations.id, id), eq(uiConfigurations.isActive, true)));
      return config;
    } catch (error) {
      console.error('Database error in getUiConfiguration:', error);
      throw new Error('Failed to get UI configuration');
    }
  }

  async getUiConfigurationByEnvironment(environment: string): Promise<UiConfiguration | undefined> {
    try {
      // First try to find environment-specific config
      let [config] = await db
        .select()
        .from(uiConfigurations)
        .where(and(
          eq(uiConfigurations.environment, environment),
          eq(uiConfigurations.isActive, true)
        ));

      // If not found, try 'all' environment as fallback
      if (!config && environment !== 'all') {
        [config] = await db
          .select()
          .from(uiConfigurations)
          .where(and(
            eq(uiConfigurations.environment, 'all'),
            eq(uiConfigurations.isActive, true)
          ));
      }

      return config;
    } catch (error) {
      console.error('Database error in getUiConfigurationByEnvironment:', error);
      throw new Error('Failed to get UI configuration by environment');
    }
  }

  async createUiConfiguration(configData: InsertUiConfiguration): Promise<UiConfiguration> {
    try {
      const [config] = await db
        .insert(uiConfigurations)
        .values({
          ...configData,
          isActive: configData.isActive ?? true
        })
        .returning();
      return config;
    } catch (error) {
      console.error('Database error in createUiConfiguration:', error);
      throw new Error('Failed to create UI configuration');
    }
  }

  async updateUiConfiguration(id: string, updates: UpdateUiConfiguration): Promise<UiConfiguration | undefined> {
    try {
      const [updated] = await db
        .update(uiConfigurations)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(uiConfigurations.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Database error in updateUiConfiguration:', error);
      throw new Error('Failed to update UI configuration');
    }
  }

  async deleteUiConfiguration(id: string): Promise<boolean> {
    try {
      const result = await db
        .update(uiConfigurations)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(uiConfigurations.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Database error in deleteUiConfiguration:', error);
      throw new Error('Failed to delete UI configuration');
    }
  }

  // Form Configurations
  async getAllFormConfigurations(environment?: string): Promise<FormConfiguration[]> {
    try {
      const whereClause = environment && environment !== 'all'
        ? eq(formConfigurations.environment, environment)
        : undefined;
      
      const query = db.select().from(formConfigurations);
      const finalQuery = whereClause ? query.where(whereClause) : query;
      return await finalQuery.orderBy(formConfigurations.formType);
    } catch (error) {
      console.error('Database error in getAllFormConfigurations:', error);
      throw new Error('Failed to fetch form configurations');
    }
  }

  async getFormConfiguration(id: string): Promise<FormConfiguration | undefined> {
    try {
      const [config] = await db
        .select()
        .from(formConfigurations)
        .where(eq(formConfigurations.id, id));
      return config;
    } catch (error) {
      console.error('Database error in getFormConfiguration:', error);
      throw new Error('Failed to get form configuration');
    }
  }

  async getFormConfigurationByType(formType: string, environment?: string): Promise<FormConfiguration | undefined> {
    try {
      const whereClause = environment && environment !== 'all'
        ? and(
            eq(formConfigurations.formType, formType),
            eq(formConfigurations.environment, environment)
          )
        : eq(formConfigurations.formType, formType);
      
      const [config] = await db.select().from(formConfigurations).where(whereClause);
      return config;
    } catch (error) {
      console.error('Database error in getFormConfigurationByType:', error);
      throw new Error('Failed to get form configuration by type');
    }
  }

  async createFormConfiguration(configData: InsertFormConfiguration): Promise<FormConfiguration> {
    try {
      const [config] = await db
        .insert(formConfigurations)
        .values(configData)
        .returning();
      return config;
    } catch (error) {
      console.error('Database error in createFormConfiguration:', error);
      throw new Error('Failed to create form configuration');
    }
  }

  async updateFormConfiguration(id: string, updates: UpdateFormConfiguration): Promise<FormConfiguration | undefined> {
    try {
      const [updated] = await db
        .update(formConfigurations)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(formConfigurations.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Database error in updateFormConfiguration:', error);
      throw new Error('Failed to update form configuration');
    }
  }

  async deleteFormConfiguration(id: string): Promise<boolean> {
    try {
      const result = await db.delete(formConfigurations).where(eq(formConfigurations.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Database error in deleteFormConfiguration:', error);
      throw new Error('Failed to delete form configuration');
    }
  }

  // Validation Configurations
  async getAllValidationConfigurations(environment?: string): Promise<ValidationConfiguration[]> {
    try {
      const whereClause = environment && environment !== 'all'
        ? eq(validationConfigurations.environment, environment)
        : undefined;
      
      const query = db.select().from(validationConfigurations);
      const finalQuery = whereClause ? query.where(whereClause) : query;
      return await finalQuery.orderBy(validationConfigurations.entityType, validationConfigurations.fieldName);
    } catch (error) {
      console.error('Database error in getAllValidationConfigurations:', error);
      throw new Error('Failed to fetch validation configurations');
    }
  }

  async getValidationConfiguration(id: string): Promise<ValidationConfiguration | undefined> {
    try {
      const [config] = await db
        .select()
        .from(validationConfigurations)
        .where(eq(validationConfigurations.id, id));
      return config;
    } catch (error) {
      console.error('Database error in getValidationConfiguration:', error);
      throw new Error('Failed to get validation configuration');
    }
  }

  async getValidationConfigurationsByEntity(entityType: string, environment?: string): Promise<ValidationConfiguration[]> {
    try {
      const whereClause = environment && environment !== 'all'
        ? and(
            eq(validationConfigurations.entityType, entityType),
            eq(validationConfigurations.environment, environment)
          )
        : eq(validationConfigurations.entityType, entityType);
      
      return await db.select().from(validationConfigurations)
        .where(whereClause)
        .orderBy(validationConfigurations.fieldName);
    } catch (error) {
      console.error('Database error in getValidationConfigurationsByEntity:', error);
      throw new Error('Failed to get validation configurations by entity');
    }
  }

  async createValidationConfiguration(configData: InsertValidationConfiguration): Promise<ValidationConfiguration> {
    try {
      const [config] = await db
        .insert(validationConfigurations)
        .values(configData)
        .returning();
      return config;
    } catch (error) {
      console.error('Database error in createValidationConfiguration:', error);
      throw new Error('Failed to create validation configuration');
    }
  }

  async updateValidationConfiguration(id: string, updates: UpdateValidationConfiguration): Promise<ValidationConfiguration | undefined> {
    try {
      const [updated] = await db
        .update(validationConfigurations)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(validationConfigurations.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Database error in updateValidationConfiguration:', error);
      throw new Error('Failed to update validation configuration');
    }
  }

  async deleteValidationConfiguration(id: string): Promise<boolean> {
    try {
      const result = await db.delete(validationConfigurations).where(eq(validationConfigurations.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Database error in deleteValidationConfiguration:', error);
      throw new Error('Failed to delete validation configuration');
    }
  }

  // System Configurations
  async getAllSystemConfigurations(environment?: string): Promise<SystemConfiguration[]> {
    try {
      const whereClause = environment && environment !== 'all'
        ? eq(systemConfigurations.environment, environment)
        : undefined;
      
      const query = db.select().from(systemConfigurations);
      const finalQuery = whereClause ? query.where(whereClause) : query;
      return await finalQuery.orderBy(systemConfigurations.module, systemConfigurations.setting);
    } catch (error) {
      console.error('Database error in getAllSystemConfigurations:', error);
      throw new Error('Failed to fetch system configurations');
    }
  }

  async getSystemConfiguration(id: string): Promise<SystemConfiguration | undefined> {
    try {
      const [config] = await db
        .select()
        .from(systemConfigurations)
        .where(eq(systemConfigurations.id, id));
      return config;
    } catch (error) {
      console.error('Database error in getSystemConfiguration:', error);
      throw new Error('Failed to get system configuration');
    }
  }

  async getSystemConfigurationsByModule(module: string, environment?: string): Promise<SystemConfiguration[]> {
    try {
      const whereClause = environment && environment !== 'all'
        ? and(
            eq(systemConfigurations.module, module),
            eq(systemConfigurations.environment, environment)
          )
        : eq(systemConfigurations.module, module);
      
      return await db.select().from(systemConfigurations)
        .where(whereClause)
        .orderBy(systemConfigurations.setting);
    } catch (error) {
      console.error('Database error in getSystemConfigurationsByModule:', error);
      throw new Error('Failed to get system configurations by module');
    }
  }

  async getSystemConfigurationBySetting(module: string, setting: string, environment?: string): Promise<SystemConfiguration | undefined> {
    try {
      const whereClause = environment && environment !== 'all'
        ? and(
            eq(systemConfigurations.module, module),
            eq(systemConfigurations.setting, setting),
            eq(systemConfigurations.environment, environment)
          )
        : and(
            eq(systemConfigurations.module, module),
            eq(systemConfigurations.setting, setting)
          );
      
      const [config] = await db.select().from(systemConfigurations).where(whereClause);
      return config;
    } catch (error) {
      console.error('Database error in getSystemConfigurationBySetting:', error);
      throw new Error('Failed to get system configuration by setting');
    }
  }

  async createSystemConfiguration(configData: InsertSystemConfiguration): Promise<SystemConfiguration> {
    try {
      const [config] = await db
        .insert(systemConfigurations)
        .values({
          ...configData,
          isEditable: configData.isEditable ?? true,
          requiresRestart: configData.requiresRestart ?? false
        })
        .returning();
      return config;
    } catch (error) {
      console.error('Database error in createSystemConfiguration:', error);
      throw new Error('Failed to create system configuration');
    }
  }

  async updateSystemConfiguration(id: string, updates: UpdateSystemConfiguration): Promise<SystemConfiguration | undefined> {
    try {
      const [updated] = await db
        .update(systemConfigurations)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(systemConfigurations.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Database error in updateSystemConfiguration:', error);
      throw new Error('Failed to update system configuration');
    }
  }

  async deleteSystemConfiguration(id: string): Promise<boolean> {
    try {
      const result = await db.delete(systemConfigurations).where(eq(systemConfigurations.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Database error in deleteSystemConfiguration:', error);
      throw new Error('Failed to delete system configuration');
    }
  }

  // Environment Configurations
  async getAllEnvironmentConfigurations(environment?: string): Promise<EnvironmentConfiguration[]> {
    try {
      const whereClause = environment && environment !== 'all'
        ? eq(environmentConfigurations.environment, environment)
        : undefined;
      
      const query = db.select().from(environmentConfigurations);
      const finalQuery = whereClause ? query.where(whereClause) : query;
      return await finalQuery.orderBy(environmentConfigurations.configKey);
    } catch (error) {
      console.error('Database error in getAllEnvironmentConfigurations:', error);
      throw new Error('Failed to fetch environment configurations');
    }
  }

  async getEnvironmentConfiguration(id: string): Promise<EnvironmentConfiguration | undefined> {
    try {
      const [config] = await db
        .select()
        .from(environmentConfigurations)
        .where(eq(environmentConfigurations.id, id));
      return config;
    } catch (error) {
      console.error('Database error in getEnvironmentConfiguration:', error);
      throw new Error('Failed to get environment configuration');
    }
  }

  async getEnvironmentConfigurationByKey(configKey: string, environment: string): Promise<EnvironmentConfiguration | undefined> {
    try {
      const [config] = await db
        .select()
        .from(environmentConfigurations)
        .where(and(
          eq(environmentConfigurations.configKey, configKey),
          eq(environmentConfigurations.environment, environment)
        ));
      return config;
    } catch (error) {
      console.error('Database error in getEnvironmentConfigurationByKey:', error);
      throw new Error('Failed to get environment configuration by key');
    }
  }

  async createEnvironmentConfiguration(configData: InsertEnvironmentConfiguration): Promise<EnvironmentConfiguration> {
    try {
      const [config] = await db
        .insert(environmentConfigurations)
        .values(configData)
        .returning();
      return config;
    } catch (error) {
      console.error('Database error in createEnvironmentConfiguration:', error);
      throw new Error('Failed to create environment configuration');
    }
  }

  async updateEnvironmentConfiguration(id: string, updates: UpdateEnvironmentConfiguration): Promise<EnvironmentConfiguration | undefined> {
    try {
      const [updated] = await db
        .update(environmentConfigurations)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(environmentConfigurations.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Database error in updateEnvironmentConfiguration:', error);
      throw new Error('Failed to update environment configuration');
    }
  }

  async deleteEnvironmentConfiguration(id: string): Promise<boolean> {
    try {
      const result = await db.delete(environmentConfigurations).where(eq(environmentConfigurations.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Database error in deleteEnvironmentConfiguration:', error);
      throw new Error('Failed to delete environment configuration');
    }
  }
}

// Use database storage for production
export const storage = new DatabaseStorage();
