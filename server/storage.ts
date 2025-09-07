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
  users, developers, applications, apiEndpoints, apiCategories, apiUsage, corporateRegistrations, auditLogs, apiTokens
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
    
    // Seed with sample data
    this.seedApiCategories();
    this.seedApiEndpoints();
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

  async updateApiEndpoint(id: string, updateData: UpdateApiEndpoint): Promise<ApiEndpoint | undefined> {
    try {
      const [updated] = await db
        .update(apiEndpoints)
        .set({ ...updateData, updatedAt: new Date() })
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
}

// Use database storage for production
export const storage = new DatabaseStorage();
