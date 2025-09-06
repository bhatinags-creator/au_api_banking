import { 
  type User, type InsertUser, type UpdateUser,
  type Developer, type InsertDeveloper, type UpdateDeveloper,
  type Application, type InsertApplication, 
  type ApiEndpoint, type InsertApiEndpoint, 
  type ApiUsage, type InsertApiUsage, 
  type CorporateRegistration, type InsertCorporateRegistration,
  type AuditLog, type InsertAuditLog,
  type ApiToken, type InsertApiToken,
  users, developers, applications, apiEndpoints, apiUsage, corporateRegistrations, auditLogs, apiTokens
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
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
  private apiUsage: Map<string, ApiUsage>;
  private corporateRegistrations: Map<string, CorporateRegistration>;

  constructor() {
    this.users = new Map();
    this.developers = new Map();
    this.applications = new Map();
    this.apiEndpoints = new Map();
    this.apiUsage = new Map();
    this.corporateRegistrations = new Map();
    
    // Seed with sample API endpoints
    this.seedApiEndpoints();
  }

  private seedApiEndpoints() {
    const endpoints = [
      // AU Bank OAuth and Authentication
      { 
        id: "1", category: "auth", name: "Generate Access Token", path: "/oauth/accesstoken", 
        method: "GET", description: "Generate OAuth access token for API authentication (Valid for 24hrs in UAT, 6 months in production)", 
        isActive: true, version: "v1", parameters: [], responseSchema: {}, rateLimits: { sandbox: 100, uat: 500, production: 1000 }, 
        requiredPermissions: ["sandbox"], isInternal: true, createdAt: new Date(), updatedAt: new Date()
      },
      
      // AU Bank Payout APIs
      { 
        id: "2", category: "payments", name: "CNB Payment Creation", path: "/CNBPaymentService/paymentCreation", 
        method: "POST", description: "Initiate Internal Fund Transfer/NEFT/RTGS/IMPS transactions (Single + Bulk payment up to 50 transactions)", 
        isActive: true, version: "v1", parameters: [], responseSchema: {}, rateLimits: { sandbox: 100, uat: 500, production: 1000 }, 
        requiredPermissions: ["sandbox"], isInternal: true, createdAt: new Date(), updatedAt: new Date()
      },
      { 
        id: "3", category: "payments", name: "Payment Enquiry", path: "/paymentEnquiry", 
        method: "POST", description: "Get payment status and transaction details. Recommended to call every 15 minutes for NEFT transactions", 
        isActive: true, version: "v1", parameters: [], responseSchema: {}, rateLimits: { sandbox: 100, uat: 500, production: 1000 }, 
        requiredPermissions: ["sandbox"], isInternal: true, createdAt: new Date(), updatedAt: new Date()
      },
      
      // Standard Banking APIs for compatibility
      { 
        id: "4", category: "accounts", name: "Get Account Balance", path: "/accounts/{id}/balance", 
        method: "GET", description: "Retrieve the current balance of a specific account", 
        isActive: true, version: "v1", parameters: [], responseSchema: {}, rateLimits: { sandbox: 100, uat: 500, production: 1000 }, 
        requiredPermissions: ["sandbox"], isInternal: true, createdAt: new Date(), updatedAt: new Date()
      },
      { 
        id: "5", category: "accounts", name: "Get Account Transactions", path: "/accounts/{id}/transactions", 
        method: "GET", description: "Get transaction history for an account", 
        isActive: true, version: "v1", parameters: [], responseSchema: {}, rateLimits: { sandbox: 100, uat: 500, production: 1000 }, 
        requiredPermissions: ["sandbox"], isInternal: true, createdAt: new Date(), updatedAt: new Date()
      },
      { 
        id: "6", category: "kyc", name: "Verify Identity", path: "/kyc/verify", 
        method: "POST", description: "Submit documents for identity verification", 
        isActive: true, version: "v1", parameters: [], responseSchema: {}, rateLimits: { sandbox: 100, uat: 500, production: 1000 }, 
        requiredPermissions: ["sandbox"], isInternal: true, createdAt: new Date(), updatedAt: new Date()
      },
      { 
        id: "7", category: "kyc", name: "Get Verification Status", path: "/kyc/{id}/status", 
        method: "GET", description: "Check the status of KYC verification", 
        isActive: true, version: "v1", parameters: [], responseSchema: {}, rateLimits: { sandbox: 100, uat: 500, production: 1000 }, 
        requiredPermissions: ["sandbox"], isInternal: true, createdAt: new Date(), updatedAt: new Date()
      },
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
      id, 
      apiKey,
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
      isActive: insertEndpoint.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
      id 
    };
    this.apiEndpoints.set(id, endpoint);
    return endpoint;
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

  // Stub implementations for audit logs and API tokens in memory storage
  async createAuditLog(logData: InsertAuditLog): Promise<AuditLog> {
    const id = randomUUID();
    return { ...logData, id, timestamp: new Date() };
  }

  async getAuditLogs(userId?: string, limit = 100): Promise<AuditLog[]> {
    return [];
  }

  async createApiToken(tokenData: InsertApiToken): Promise<ApiToken> {
    const id = randomUUID();
    const token = `au_token_${randomUUID().replace(/-/g, '')}`;
    return {
      ...tokenData,
      id,
      token,
      lastUsedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getApiToken(token: string): Promise<ApiToken | undefined> {
    return undefined;
  }

  async getApiTokensByDeveloper(developerId: string): Promise<ApiToken[]> {
    return [];
  }

  async revokeApiToken(id: string): Promise<boolean> {
    return true;
  }

  async updateTokenLastUsed(token: string): Promise<void> {
    // No-op for memory storage
  }

  async getApiUsageStats(developerId: string, environment = 'sandbox'): Promise<any> {
    return { totalRequests: 0, totalSuccess: 0, totalErrors: 0, avgResponseTime: 0 };
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
    const query = db.select().from(auditLogs);
    
    if (userId) {
      query = query.where(eq(auditLogs.userId, userId));
    }
    
    return await query
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
}

// Use database storage for production
export const storage = new DatabaseStorage();
