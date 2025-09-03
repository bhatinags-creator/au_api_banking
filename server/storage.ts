import { type User, type InsertUser, type Developer, type InsertDeveloper, type Application, type InsertApplication, type ApiEndpoint, type InsertApiEndpoint, type ApiUsage, type InsertApiUsage } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Developer operations
  getDeveloper(id: string): Promise<Developer | undefined>;
  getDeveloperByEmail(email: string): Promise<Developer | undefined>;
  getDeveloperByApiKey(apiKey: string): Promise<Developer | undefined>;
  createDeveloper(developer: InsertDeveloper): Promise<Developer>;
  getAllDevelopers(): Promise<Developer[]>;
  
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private developers: Map<string, Developer>;
  private applications: Map<string, Application>;
  private apiEndpoints: Map<string, ApiEndpoint>;
  private apiUsage: Map<string, ApiUsage>;

  constructor() {
    this.users = new Map();
    this.developers = new Map();
    this.applications = new Map();
    this.apiEndpoints = new Map();
    this.apiUsage = new Map();
    
    // Seed with sample API endpoints
    this.seedApiEndpoints();
  }

  private seedApiEndpoints() {
    const endpoints = [
      { id: "1", category: "accounts", name: "Get Account Balance", path: "/accounts/{id}/balance", method: "GET", description: "Retrieve the current balance of a specific account", isActive: true },
      { id: "2", category: "accounts", name: "Get Account Transactions", path: "/accounts/{id}/transactions", method: "GET", description: "Get transaction history for an account", isActive: true },
      { id: "3", category: "accounts", name: "Create Account", path: "/accounts", method: "POST", description: "Create a new bank account", isActive: true },
      { id: "4", category: "payments", name: "Send Payment", path: "/payments", method: "POST", description: "Initiate a payment transfer", isActive: true },
      { id: "5", category: "payments", name: "Get Payment Status", path: "/payments/{id}", method: "GET", description: "Check the status of a payment", isActive: true },
      { id: "6", category: "payments", name: "Cancel Payment", path: "/payments/{id}/cancel", method: "POST", description: "Cancel a pending payment", isActive: true },
      { id: "7", category: "kyc", name: "Verify Identity", path: "/kyc/verify", method: "POST", description: "Submit documents for identity verification", isActive: true },
      { id: "8", category: "kyc", name: "Get Verification Status", path: "/kyc/{id}/status", method: "GET", description: "Check the status of KYC verification", isActive: true },
      { id: "9", category: "kyc", name: "Update KYC Information", path: "/kyc/{id}", method: "PATCH", description: "Update existing KYC information", isActive: true },
    ];
    
    endpoints.forEach(endpoint => {
      this.apiEndpoints.set(endpoint.id, endpoint);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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

  async createDeveloper(insertDeveloper: InsertDeveloper): Promise<Developer> {
    const id = randomUUID();
    const apiKey = `dev_${randomUUID().replace(/-/g, '')}`;
    const developer: Developer = { 
      ...insertDeveloper,
      company: insertDeveloper.company || null,
      id, 
      apiKey,
      createdAt: new Date()
    };
    this.developers.set(id, developer);
    return developer;
  }

  async getAllDevelopers(): Promise<Developer[]> {
    return Array.from(this.developers.values());
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
      environment: insertApplication.environment || "sandbox",
      status: insertApplication.status || "active",
      id,
      createdAt: new Date()
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
    const usage: ApiUsage = {
      ...insertUsage,
      requestCount: insertUsage.requestCount || 0,
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

export const storage = new MemStorage();
