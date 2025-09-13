import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sessionConfig } from "./session";
import { authenticate, requireRole, authenticateApiKey, requireEnvironmentAccess, createRateLimiter } from "./auth";
import {
  insertUserSchema, updateUserSchema, loginSchema,
  insertDeveloperSchema, updateDeveloperSchema, insertApplicationSchema,
  insertCorporateRegistrationSchema, verifyOtpSchema,
  insertApiEndpointSchema, insertApiTokenSchema,
  insertConfigCategorySchema, updateConfigCategorySchema,
  insertConfigurationSchema, updateConfigurationSchema,
  insertUiConfigurationSchema, updateUiConfigurationSchema,
  insertFormConfigurationSchema, updateFormConfigurationSchema,
  insertValidationConfigurationSchema, updateValidationConfigurationSchema,
  insertSystemConfigurationSchema, updateSystemConfigurationSchema,
  insertEnvironmentConfigurationSchema, updateEnvironmentConfigurationSchema,
  insertDocumentationCategorySchema, updateDocumentationCategorySchema,
  insertDocumentationEndpointSchema, updateDocumentationEndpointSchema,
  insertDocumentationParameterSchema, insertDocumentationResponseSchema,
  insertDocumentationExampleSchema, insertDocumentationSecuritySchema
} from "@shared/schema";
import bcrypt from "bcrypt";
import { ZodError } from "zod";
// API_CATEGORIES import removed - all data now served from database
// Migration endpoint disabled as data is already migrated

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(sessionConfig);

  // Rate limiting for API routes
  const apiRateLimit = createRateLimiter(60 * 1000, 100); // 100 requests per minute
  const authRateLimit = createRateLimiter(15 * 60 * 1000, 5); // 5 login attempts per 15 minutes

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0"
    });
  });

  // Authentication routes
  app.post("/api/auth/login", authRateLimit, async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.verifyUserPassword(email, password);
      if (!user) {
        // Log failed login attempt
        await storage.createAuditLog({
          action: 'login_failed',
          resource: 'auth',
          details: { email, reason: 'invalid_credentials' },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        });
        
        return res.status(401).json({ 
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Set session
      req.session!.userId = user.id;
      
      // Get developer profile
      const developer = await storage.getDeveloperByUserId(user.id);
      if (developer) {
        req.session!.developerId = developer.id;
      }

      // Log successful login
      await storage.createAuditLog({
        userId: user.id,
        action: 'login_success',
        resource: 'auth',
        details: { email },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          department: user.department
        },
        developer: developer ? {
          id: developer.id,
          name: developer.name,
          apiKey: developer.apiKey,
          permissions: developer.permissions
        } : null
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.errors
        });
      }
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Login failed',
        message: 'Internal server error'
      });
    }
  });

  app.post("/api/auth/logout", authenticate, async (req, res) => {
    try {
      // Log logout
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'logout',
        resource: 'auth',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      if (req.session) {
        req.session.userId = undefined;
        req.session.developerId = undefined;
      }
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  app.get("/api/auth/me", authenticate, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const developer = req.user!.developerId ? 
        await storage.getDeveloper(req.user!.developerId) : null;

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          department: user.department,
          lastLoginAt: user.lastLoginAt
        },
        developer: developer ? {
          id: developer.id,
          name: developer.name,
          team: developer.team,
          permissions: developer.permissions,
          lastActiveAt: developer.lastActiveAt
        } : null
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user information' });
    }
  });

  // User management routes (admin only)
  app.post("/api/users", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Log user creation
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'user_created',
        resource: 'user',
        resourceId: user.id,
        details: { email: user.email, role: user.role },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json({ 
        id: user.id, 
        email: user.email, 
        role: user.role,
        isActive: user.isActive
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.errors
        });
      }
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  // Developer routes (authenticated)
  app.get("/api/developers", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const developers = await storage.getAllDevelopers();
      res.json(developers);
    } catch (error) {
      console.error('Get developers error:', error);
      res.status(500).json({ error: "Failed to fetch developers" });
    }
  });

  app.post("/api/developers", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const validatedData = insertDeveloperSchema.parse(req.body);
      const developer = await storage.createDeveloper(validatedData);
      
      // Log developer creation
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'developer_created',
        resource: 'developer',
        resourceId: developer.id,
        details: { email: developer.email, name: developer.name },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json(developer);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.errors
        });
      }
      console.error('Create developer error:', error);
      res.status(400).json({ error: "Failed to create developer" });
    }
  });

  app.get("/api/developers/:id", authenticate, async (req, res) => {
    try {
      // Users can only view their own developer profile unless they're admin/manager
      const canViewAll = ['admin', 'manager'].includes(req.user!.role);
      const requestedId = req.params.id;
      
      if (!canViewAll && req.user!.developerId !== requestedId) {
        return res.status(403).json({ 
          error: "Access denied",
          message: "You can only view your own developer profile"
        });
      }

      const developer = await storage.getDeveloper(requestedId);
      if (!developer) {
        return res.status(404).json({ error: "Developer not found" });
      }
      res.json(developer);
    } catch (error) {
      console.error('Get developer error:', error);
      res.status(500).json({ error: "Failed to fetch developer" });
    }
  });

  // Application routes (authenticated)
  app.get("/api/applications", authenticate, async (req, res) => {
    try {
      const { developerId } = req.query;
      const targetDeveloperId = developerId as string || req.user!.developerId;
      
      if (!targetDeveloperId) {
        return res.status(400).json({ error: "Developer ID required" });
      }

      // Check permissions - users can only view their own applications unless admin/manager
      const canViewAll = ['admin', 'manager'].includes(req.user!.role);
      if (!canViewAll && req.user!.developerId !== targetDeveloperId) {
        return res.status(403).json({ 
          error: "Access denied",
          message: "You can only view your own applications"
        });
      }

      const applications = await storage.getApplicationsByDeveloper(targetDeveloperId);
      res.json(applications);
    } catch (error) {
      console.error('Get applications error:', error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.post("/api/applications", authenticate, async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      
      // Ensure developer can only create applications for themselves
      if (!req.user!.developerId) {
        return res.status(403).json({ 
          error: "Developer profile required",
          message: "You need a developer profile to create applications"
        });
      }
      
      const applicationData = {
        ...validatedData,
        developerId: req.user!.developerId
      };
      
      const application = await storage.createApplication(applicationData);
      
      // Log application creation
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'application_created',
        resource: 'application',
        resourceId: application.id,
        details: { name: application.name, environment: application.environment },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json(application);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.errors
        });
      }
      console.error('Create application error:', error);
      res.status(400).json({ error: "Failed to create application" });
    }
  });

  app.get("/api/applications/:id", authenticate, async (req, res) => {
    try {
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Check permissions
      const canViewAll = ['admin', 'manager'].includes(req.user!.role);
      if (!canViewAll && application.developerId !== req.user!.developerId) {
        return res.status(403).json({ 
          error: "Access denied",
          message: "You can only view your own applications"
        });
      }

      res.json(application);
    } catch (error) {
      console.error('Get application error:', error);
      res.status(500).json({ error: "Failed to fetch application" });
    }
  });

  app.delete("/api/applications/:id", authenticate, async (req, res) => {
    try {
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Check permissions
      const canDeleteAll = ['admin', 'manager'].includes(req.user!.role);
      if (!canDeleteAll && application.developerId !== req.user!.developerId) {
        return res.status(403).json({ 
          error: "Access denied",
          message: "You can only delete your own applications"
        });
      }

      const success = await storage.deleteApplication(req.params.id);
      if (!success) {
        return res.status(500).json({ error: "Failed to delete application" });
      }
      
      // Log application deletion
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'application_deleted',
        resource: 'application',
        resourceId: req.params.id,
        details: { name: application.name },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ message: "Application deleted successfully" });
    } catch (error) {
      console.error('Delete application error:', error);
      res.status(500).json({ error: "Failed to delete application" });
    }
  });

  // API Endpoint routes (public for internal users)
  app.get("/api/endpoints", apiRateLimit, async (req, res) => {
    try {
      const { category } = req.query;
      if (category) {
        const endpoints = await storage.getApiEndpointsByCategory(category as string);
        return res.json(endpoints);
      }
      const endpoints = await storage.getAllApiEndpoints();
      res.json(endpoints);
    } catch (error) {
      console.error('Get endpoints error:', error);
      res.status(500).json({ error: "Failed to fetch endpoints" });
    }
  });

  // Admin API and Category Management Routes
  
  // Public Categories endpoint for main portal with hierarchical structure
  app.get("/api/categories", async (req, res) => {
    try {
      // Load categories from database instead of hardcoded data
      const dbCategories = await storage.getAllApiCategories();
      
      // If no data in database, return empty array - use migration endpoint to populate
      if (dbCategories.length === 0) {
        console.log('⚠️ No categories in database. Use /api/migrate-data endpoint to populate.');
        return res.json([]);
      }
      
      // Get all APIs to map category endpoints
      const allApis = await storage.getAllApiEndpoints();
      
      const categoriesWithApis = dbCategories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        icon: category.icon,
        color: category.color,
        displayOrder: category.displayOrder,
        isActive: category.isActive,
        endpoints: allApis.filter(api => api.category === category.name).map(api => api.id)
      }));
      
      console.log(`📊 Backend serving ${categoriesWithApis.length} categories from database`);
      res.json(categoriesWithApis);
    } catch (error) {
      console.error("Error fetching hierarchical categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Public APIs endpoint for main portal (read-only)
  app.get("/api/apis", async (req, res) => {
    try {
      // Load APIs from database instead of hardcoded data
      const allApis = await storage.getAllApiEndpoints();
      
      // If no data in database, return empty array - use migration endpoint to populate  
      if (allApis.length === 0) {
        console.log('⚠️ No APIs in database. Use /api/migrate-data endpoint to populate.');
        return res.json([]);
      }
      
      console.log(`🔧 Backend serving ${allApis.length} APIs from database`);
      res.json(allApis);
    } catch (error) {
      console.error("Error fetching APIs:", error);
      res.status(500).json({ error: "Failed to fetch APIs" });
    }
  });

  // Data migration endpoint - DISABLED (migration completed successfully)
  app.post("/api/migrate-data", async (req, res) => {
    res.json({ 
      message: "Migration endpoint disabled - all data successfully migrated to database",
      status: "completed",
      note: "All API configurations now served dynamically from database"
    });
  });

  // Simple data initialization endpoint (public for demo purposes) 
  app.post("/api/init-data", async (req, res) => {
    try {
      // Check if data already exists
      const existingCategories = await storage.getAllApiCategories();
      if (existingCategories.length > 0) {
        return res.json({ message: "Data already initialized", categories: existingCategories.length });
      }

      // Create initial categories
      const authCategory = await storage.createApiCategory({
        name: "Authentication",
        description: "Essential APIs for secure authentication and authorization including OAuth, JWT tokens, and user management",
        icon: "Shield",
        color: "#603078",
        displayOrder: 1,
        isActive: true
      });

      const paymentCategory = await storage.createApiCategory({
        name: "Digital Payments", 
        description: "Comprehensive payment processing APIs including UPI, NEFT, RTGS, and wallet integrations",
        icon: "CreditCard",
        color: "#2563eb",
        displayOrder: 2,
        isActive: true
      });

      // Create APIs with full documentation and sandbox details
      await storage.createApiEndpoint({
        name: "OAuth 2.0 Token",
        method: "POST",
        path: "/oauth/token",
        category: "Authentication",
        description: "Generate OAuth 2.0 access tokens for secure API authentication with configurable scopes and expiration. This endpoint provides enterprise-grade security with comprehensive token management.",
        summary: "OAuth 2.0 token generation with enterprise security features",
        requiresAuth: false,
        authType: "bearer",
        status: "active",
        version: "v1",
        timeout: 30000,
        parameters: [
          { name: "client_id", type: "string", required: true, description: "Application client identifier" },
          { name: "client_secret", type: "string", required: true, description: "Application client secret" },
          { name: "grant_type", type: "string", required: true, description: "OAuth grant type (client_credentials)" }
        ],
        responseSchema: { access_token: "string", token_type: "Bearer", expires_in: 3600 },
        rateLimits: { sandbox: 100, production: 1000 },
        requiredPermissions: [],
        isInternal: true,
        isActive: true
      });

      await storage.createApiEndpoint({
        name: "UPI Payment Processing",
        method: "POST", 
        path: "/upi/payment",
        category: "Digital Payments",
        description: "Process UPI payments with real-time status updates, VPA validation, and comprehensive fraud detection. Includes sandbox testing environment with mock responses.",
        summary: "Complete UPI payment processing with advanced security",
        requiresAuth: true,
        authType: "bearer",
        status: "active",
        version: "v1",
        timeout: 45000,
        parameters: [
          { name: "amount", type: "number", required: true, description: "Payment amount in INR" },
          { name: "payerVPA", type: "string", required: true, description: "Payer's Virtual Payment Address" },
          { name: "payeeVPA", type: "string", required: true, description: "Payee's Virtual Payment Address" }
        ],
        responseSchema: { transactionId: "string", status: "SUCCESS|PENDING|FAILED", amount: "number" },
        rateLimits: { sandbox: 50, production: 500 },
        requiredPermissions: ["payment:write"],
        isInternal: true,
        isActive: true
      });

      res.json({ 
        message: "Hierarchical data initialized successfully",
        categories: 2,
        apis: 2,
        structure: "Categories → APIs → Documentation & Sandbox"
      });
      
    } catch (error) {
      console.error("Initialization error:", error);
      res.status(500).json({ error: "Failed to initialize data" });
    }
  });

  // Categories management
  app.get("/api/admin/categories", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const categories = await storage.getAllApiCategories();
      res.json(categories);
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/admin/categories", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const categoryData = req.body;
      const category = await storage.createApiCategory(categoryData);
      
      // Log category creation
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'category_created',
        resource: 'api_category',
        resourceId: category.id,
        details: { name: category.name, description: category.description },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json(category);
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.put("/api/admin/categories/:id", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const categoryId = req.params.id;
      const categoryData = req.body;
      const category = await storage.updateApiCategory(categoryId, categoryData);
      
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      // Log category update
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'category_updated',
        resource: 'api_category',
        resourceId: categoryId,
        details: { name: category.name, changes: categoryData },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json(category);
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const categoryId = req.params.id;
      const deleted = await storage.deleteApiCategory(categoryId);
      
      if (!deleted) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      // Log category deletion
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'category_deleted',
        resource: 'api_category',
        resourceId: categoryId,
        details: { categoryId },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // APIs management  
  app.get("/api/admin/apis", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const apis = await storage.getAllApiEndpoints();
      res.json(apis);
    } catch (error) {
      console.error('Get APIs error:', error);
      res.status(500).json({ error: "Failed to fetch APIs" });
    }
  });

  app.post("/api/admin/apis", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const apiData = req.body;
      const api = await storage.createApiEndpoint(apiData);
      
      // Log API creation
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'api_created',
        resource: 'api_endpoint',
        resourceId: api.id,
        details: { name: api.name, path: api.path, method: api.method },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json(api);
    } catch (error) {
      console.error('Create API error:', error);
      res.status(500).json({ error: "Failed to create API" });
    }
  });

  app.put("/api/admin/apis/:id", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const apiId = req.params.id;
      const apiData = req.body;
      const api = await storage.updateApiEndpoint(apiId, apiData);
      
      if (!api) {
        return res.status(404).json({ error: "API not found" });
      }
      
      // Log API update
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'api_updated',
        resource: 'api_endpoint',
        resourceId: apiId,
        details: { name: api.name, changes: apiData },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json(api);
    } catch (error) {
      console.error('Update API error:', error);
      res.status(500).json({ error: "Failed to update API" });
    }
  });

  app.delete("/api/admin/apis/:id", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const apiId = req.params.id;
      const deleted = await storage.deleteApiEndpoint(apiId);
      
      if (!deleted) {
        return res.status(404).json({ error: "API not found" });
      }
      
      // Log API deletion
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'api_deleted',
        resource: 'api_endpoint',
        resourceId: apiId,
        details: { apiId },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ message: "API deleted successfully" });
    } catch (error) {
      console.error('Delete API error:', error);
      res.status(500).json({ error: "Failed to delete API" });
    }
  });

  // API Endpoint management (admin only) - Legacy endpoint
  app.post("/api/endpoints", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const validatedData = insertApiEndpointSchema.parse(req.body);
      const endpoint = await storage.createApiEndpoint(validatedData);
      
      // Log endpoint creation
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'endpoint_created',
        resource: 'api_endpoint',
        resourceId: endpoint.id,
        details: { name: endpoint.name, path: endpoint.path, method: endpoint.method },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json(endpoint);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.errors
        });
      }
      console.error('Create endpoint error:', error);
      res.status(500).json({ error: "Failed to create endpoint" });
    }
  });

  // API Usage routes (authenticated)
  app.get("/api/usage/:developerId", authenticate, async (req, res) => {
    try {
      const requestedDeveloperId = req.params.developerId;
      
      // Check permissions
      const canViewAll = ['admin', 'manager'].includes(req.user!.role);
      if (!canViewAll && req.user!.developerId !== requestedDeveloperId) {
        return res.status(403).json({ 
          error: "Access denied",
          message: "You can only view your own usage data"
        });
      }

      const usage = await storage.getApiUsageByDeveloper(requestedDeveloperId);
      const stats = await storage.getApiUsageStats(requestedDeveloperId);
      
      res.json({ usage, stats });
    } catch (error) {
      console.error('Get usage error:', error);
      res.status(500).json({ error: "Failed to fetch usage data" });
    }
  });

  // API Token management (authenticated)
  app.get("/api/tokens", authenticate, async (req, res) => {
    try {
      if (!req.user!.developerId) {
        return res.status(403).json({ 
          error: "Developer profile required",
          message: "You need a developer profile to manage API tokens"
        });
      }

      const tokens = await storage.getApiTokensByDeveloper(req.user!.developerId);
      res.json(tokens);
    } catch (error) {
      console.error('Get tokens error:', error);
      res.status(500).json({ error: "Failed to fetch API tokens" });
    }
  });

  app.post("/api/tokens", authenticate, async (req, res) => {
    try {
      if (!req.user!.developerId) {
        return res.status(403).json({ 
          error: "Developer profile required",
          message: "You need a developer profile to create API tokens"
        });
      }

      const tokenData = insertApiTokenSchema.parse(req.body);
      const apiToken = await storage.createApiToken({
        ...tokenData,
        developerId: req.user!.developerId
      });

      // Log token creation
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'token_created',
        resource: 'api_token',
        resourceId: apiToken.id,
        details: { name: apiToken.name, environment: apiToken.environment },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json(apiToken);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.errors
        });
      }
      console.error('Create token error:', error);
      res.status(500).json({ error: "Failed to create API token" });
    }
  });

  app.delete("/api/tokens/:id", authenticate, async (req, res) => {
    try {
      if (!req.user!.developerId) {
        return res.status(403).json({ 
          error: "Developer profile required"
        });
      }

      const success = await storage.revokeApiToken(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Token not found" });
      }

      // Log token revocation
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'token_revoked',
        resource: 'api_token',
        resourceId: req.params.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ message: "Token revoked successfully" });
    } catch (error) {
      console.error('Revoke token error:', error);
      res.status(500).json({ error: "Failed to revoke token" });
    }
  });

  // Audit logs (admin only)
  app.get("/api/audit-logs", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const { userId, limit } = req.query;
      const logs = await storage.getAuditLogs(
        userId as string, 
        limit ? parseInt(limit as string) : 100
      );
      res.json(logs);
    } catch (error) {
      console.error('Get audit logs error:', error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  // Corporate registration routes (kept for compatibility)
  app.post("/api/corporate/register", apiRateLimit, async (req, res) => {
    try {
      const validatedData = insertCorporateRegistrationSchema.parse(req.body);
      const registration = await storage.createCorporateRegistration(validatedData);
      
      res.status(201).json({
        registrationId: registration.id,
        status: registration.status,
        message: "Registration initiated. OTP sent to your email."
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.errors
        });
      }
      console.error('Corporate registration error:', error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/corporate/verify-otp", apiRateLimit, async (req, res) => {
    try {
      const { registrationId, otpCode } = verifyOtpSchema.parse(req.body);
      
      const registration = await storage.getCorporateRegistration(registrationId);
      if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
      }

      if (registration.otpCode !== otpCode) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      if (registration.otpExpiry && registration.otpExpiry < new Date()) {
        return res.status(400).json({ error: "OTP has expired" });
      }

      const updatedRegistration = await storage.updateCorporateRegistration(registrationId, {
        status: "verified"
      });

      res.json({
        status: "verified",
        message: "Corporate registration verified successfully"
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.errors
        });
      }
      console.error('OTP verification error:', error);
      res.status(500).json({ error: "Verification failed" });
    }
  });

  // AU Bank OAuth Token Generation (sandbox)
  app.get("/api/sandbox/oauth/accesstoken", authenticateApiKey, requireEnvironmentAccess('sandbox'), async (req, res) => {
    res.json({
      "refresh_token_expires_in": "0",
      "api_product_list": "[Internal APIs, Authentication, Payments, Accounts, KYC]",
      "api_product_list_json": [
        "Internal APIs",
        "Authentication", 
        "Payments",
        "Accounts",
        "KYC"
      ],
      "organization_name": "au-bank-internal",
      "developer.email": req.user!.email,
      "token_type": "BearerToken", 
      "issued_at": Date.now().toString(),
      "access_token": `internal_access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      "expires_in": "86400", // 24 hours
      "status": "approved",
      "scope": "internal sandbox"
    });
  });

  // Payment creation endpoint (sandbox)
  app.post("/api/sandbox/CNBPaymentService/paymentCreation", authenticateApiKey, requireEnvironmentAccess('sandbox'), async (req, res) => {
    // Log API usage
    if (req.user!.developerId) {
      await storage.createApiUsage({
        developerId: req.user!.developerId,
        applicationId: req.body.applicationId || 'default',
        endpointId: 'payment-creation',
        requestCount: 1,
        successCount: 1,
        errorCount: 0,
        totalResponseTime: 150,
        environment: 'sandbox'
      });
    }

    res.json({
      "transactionId": `TXN${Date.now()}`,
      "status": "SUCCESS",
      "message": "Payment initiated successfully",
      "referenceNumber": `REF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      "timestamp": new Date().toISOString(),
      "amount": req.body.amount || "1000.00",
      "currency": "INR"
    });
  });

  // Payment enquiry endpoint (sandbox)
  app.post("/api/sandbox/paymentEnquiry", authenticateApiKey, requireEnvironmentAccess('sandbox'), async (req, res) => {
    res.json({
      "transactionId": req.body.transactionId,
      "status": "COMPLETED",
      "amount": "1000.00",
      "currency": "INR",
      "beneficiaryName": "Test Beneficiary",
      "processedAt": new Date().toISOString(),
      "mode": "NEFT"
    });
  });

  // Customer Dedupe Service (sandbox)
  app.post("/api/sandbox/Customer/customerDedupe", authenticateApiKey, requireEnvironmentAccess('sandbox'), async (req, res) => {
    const { mobile, pan, aadhaar } = req.body;
    
    // Simulate customer search logic
    const existingCustomer = Math.random() > 0.7; // 30% chance of existing customer
    
    res.json({
      "status": "SUCCESS",
      "customer_exists": existingCustomer,
      "customer_id": existingCustomer ? `CUST${Date.now()}` : null,
      "message": existingCustomer ? "Existing customer found" : "No existing customer found",
      "search_criteria": {
        mobile: mobile ? mobile.replace(/\d(?=\d{4})/g, 'X') : null,
        pan: pan ? pan.replace(/.(?=.{4})/g, 'X') : null,
        aadhaar: aadhaar ? aadhaar.replace(/\d(?=\d{4})/g, 'X') : null
      },
      "timestamp": new Date().toISOString()
    });
  });

  // Account Balance (sandbox)
  app.get("/api/sandbox/accounts/balance", authenticateApiKey, requireEnvironmentAccess('sandbox'), async (req, res) => {
    const { account_id } = req.query;
    
    res.json({
      "account_id": account_id || "acc_123456789",
      "account_number": "****1234",
      "balance": {
        "available": 25750.50,
        "ledger": 26000.00,
        "currency": "INR"
      },
      "last_updated": new Date().toISOString(),
      "status": "ACTIVE"
    });
  });

  // Account Transactions (sandbox)
  app.get("/api/sandbox/accounts/transactions", authenticateApiKey, requireEnvironmentAccess('sandbox'), async (req, res) => {
    const { account_id, limit = 10, page = 1 } = req.query;
    
    const transactions = Array.from({ length: parseInt(limit as string) }, (_, i) => ({
      transaction_id: `txn_${Date.now()}_${i}`,
      type: Math.random() > 0.5 ? "CREDIT" : "DEBIT",
      amount: parseFloat((Math.random() * 10000).toFixed(2)),
      description: ["Salary Credit", "Online Purchase", "ATM Withdrawal", "UPI Payment"][Math.floor(Math.random() * 4)],
      date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      balance_after: 25750.50 + (Math.random() * 1000)
    }));
    
    res.json({
      "account_id": account_id || "acc_123456789",
      "transactions": transactions,
      "pagination": {
        "page": parseInt(page as string),
        "total_pages": 5,
        "total_transactions": 47
      }
    });
  });

  // Corporate Registration (sandbox)
  app.post("/api/sandbox/business/corporate/register", authenticateApiKey, requireEnvironmentAccess('sandbox'), async (req, res) => {
    const { company_name, business_type, registration_number, contact_email, contact_phone } = req.body;
    
    res.json({
      "application_id": `app_corp_${Date.now()}`,
      "status": "under_review",
      "company_name": company_name,
      "business_type": business_type,
      "registration_number": registration_number,
      "contact_email": contact_email,
      "contact_phone": contact_phone,
      "estimated_approval_time": "3-5 business days",
      "submitted_at": new Date().toISOString(),
      "reference_id": `REF${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    });
  });

  // Fund Transfer (sandbox)
  app.post("/api/sandbox/payments/fund-transfer", authenticateApiKey, requireEnvironmentAccess('sandbox'), async (req, res) => {
    const { from_account, to_account, amount, purpose } = req.body;
    
    res.json({
      "transfer_id": `FT${Date.now()}`,
      "status": "INITIATED",
      "from_account": from_account,
      "to_account": to_account,
      "amount": amount,
      "currency": "INR",
      "purpose": purpose,
      "reference_number": `REF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      "estimated_completion": new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      "timestamp": new Date().toISOString()
    });
  });

  // Bulk Payment (sandbox)
  app.post("/api/sandbox/payments/bulk", authenticateApiKey, requireEnvironmentAccess('sandbox'), async (req, res) => {
    const { payments, batch_name } = req.body;
    
    const batchId = `BATCH${Date.now()}`;
    const processedPayments = payments?.map((payment: any, index: number) => ({
      payment_id: `PAY${Date.now()}_${index}`,
      beneficiary_account: payment.beneficiary_account,
      amount: payment.amount,
      status: Math.random() > 0.9 ? "FAILED" : "SUCCESS",
      reference: `REF${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    })) || [];
    
    res.json({
      "batch_id": batchId,
      "batch_name": batch_name,
      "total_payments": processedPayments.length,
      "successful_payments": processedPayments.filter((p: any) => p.status === "SUCCESS").length,
      "failed_payments": processedPayments.filter((p: any) => p.status === "FAILED").length,
      "payments": processedPayments,
      "status": "PROCESSING",
      "created_at": new Date().toISOString()
    });
  });

  // Payment Status (sandbox)
  app.get("/api/sandbox/payments/status", authenticateApiKey, requireEnvironmentAccess('sandbox'), async (req, res) => {
    const { payment_id, transaction_id } = req.query;
    
    res.json({
      "payment_id": payment_id || transaction_id,
      "status": ["INITIATED", "PROCESSING", "COMPLETED", "FAILED"][Math.floor(Math.random() * 4)],
      "amount": "1000.00",
      "currency": "INR",
      "created_at": new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      "completed_at": new Date().toISOString(),
      "failure_reason": null
    });
  });

  // VAM Create (sandbox)
  app.post("/api/sandbox/vam/create", authenticateApiKey, requireEnvironmentAccess('sandbox'), async (req, res) => {
    const { customer_id, purpose, validity_days } = req.body;
    
    res.json({
      "vam_id": `VAM${Date.now()}`,
      "virtual_account_number": `VA${Date.now().toString().slice(-12)}`,
      "customer_id": customer_id,
      "purpose": purpose,
      "status": "ACTIVE",
      "valid_until": new Date(Date.now() + (validity_days || 30) * 24 * 60 * 60 * 1000).toISOString(),
      "created_at": new Date().toISOString()
    });
  });

  // VAM Transactions (sandbox)
  app.get("/api/sandbox/vam/transactions", authenticateApiKey, requireEnvironmentAccess('sandbox'), async (req, res) => {
    const { vam_id, from_date, to_date } = req.query;
    
    res.json({
      "vam_id": vam_id,
      "transactions": [{
        "transaction_id": "TXN789012345",
        "amount": 5000.00,
        "currency": "INR",
        "transaction_date": new Date().toISOString(),
        "remitter_name": "John Doe",
        "remitter_account": "9876543210987",
        "utr_number": "UTR123456789"
      }],
      "total_amount": 5000.00,
      "transaction_count": 1,
      "from_date": from_date,
      "to_date": to_date
    });
  });

  // Loan Application (sandbox)
  app.post("/api/sandbox/loans/application", authenticateApiKey, requireEnvironmentAccess('sandbox'), async (req, res) => {
    const { loan_type, amount, tenure, customer_id } = req.body;
    
    res.json({
      "application_id": `LOAN${Date.now()}`,
      "loan_type": loan_type,
      "amount": amount,
      "tenure": tenure,
      "customer_id": customer_id,
      "status": "SUBMITTED",
      "interest_rate": "9.5%",
      "processing_fee": amount * 0.01,
      "estimated_approval_time": "7-10 business days",
      "submitted_at": new Date().toISOString()
    });
  });

  // Loan Status (sandbox)
  app.get("/api/sandbox/loans/status", authenticateApiKey, requireEnvironmentAccess('sandbox'), async (req, res) => {
    const { application_id } = req.query;
    
    res.json({
      "application_id": application_id,
      "status": ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED"][Math.floor(Math.random() * 4)],
      "loan_amount": "500000.00",
      "approved_amount": "450000.00",
      "interest_rate": "9.5%",
      "tenure": "60 months",
      "last_updated": new Date().toISOString()
    });
  });

  // Card Application (sandbox)
  app.post("/api/sandbox/cards/application", authenticateApiKey, requireEnvironmentAccess('sandbox'), async (req, res) => {
    const { card_type, customer_id, annual_income } = req.body;
    
    res.json({
      "application_id": `CARD${Date.now()}`,
      "card_type": card_type,
      "customer_id": customer_id,
      "annual_income": annual_income,
      "status": "SUBMITTED",
      "estimated_approval_time": "5-7 business days",
      "submitted_at": new Date().toISOString(),
      "reference_number": `CREF${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    });
  });

  // Card Status (sandbox)
  app.get("/api/sandbox/cards/status", authenticateApiKey, requireEnvironmentAccess('sandbox'), async (req, res) => {
    const { application_id } = req.query;
    
    res.json({
      "application_id": application_id,
      "status": ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "CARD_DISPATCHED"][Math.floor(Math.random() * 5)],
      "card_type": "PREMIUM_CREDIT",
      "credit_limit": "200000.00",
      "card_number": "****-****-****-1234",
      "dispatch_date": new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      "last_updated": new Date().toISOString()
    });
  });

  // Seed initial data for hierarchical structure
  app.get("/api/seed", async (req, res) => {
    try {
      // Create initial categories with proper hierarchy
      const authCategory = await storage.createApiCategory({
        name: "Authentication",
        description: "Essential APIs for secure authentication and authorization including OAuth, JWT tokens, and user management",
        icon: "Shield",
        color: "#603078",
        displayOrder: 1,
        isActive: true
      });

      const paymentCategory = await storage.createApiCategory({
        name: "Digital Payments",
        description: "Comprehensive payment processing APIs including UPI, NEFT, RTGS, and wallet integrations",
        icon: "CreditCard", 
        color: "#2563eb",
        displayOrder: 2,
        isActive: true
      });

      const customerCategory = await storage.createApiCategory({
        name: "Customer Management",
        description: "Complete customer lifecycle APIs for KYC, onboarding, profile management and 360-degree customer view",
        icon: "Users",
        color: "#059669",
        displayOrder: 3,
        isActive: true
      });

      // Create APIs with full documentation and sandbox details
      await storage.createApiEndpoint({
        name: "OAuth 2.0 Token",
        method: "POST", 
        path: "/oauth/token",
        category: "Authentication",
        description: "Generate OAuth 2.0 access tokens for secure API authentication with configurable scopes and expiration",
        summary: "OAuth 2.0 token generation with enterprise security features",
        requiresAuth: false,
        authType: "bearer",
        status: "active",
        version: "v1",
        timeout: 30000,
        parameters: [
          { name: "client_id", type: "string", required: true, description: "Application client identifier" },
          { name: "client_secret", type: "string", required: true, description: "Application client secret" },
          { name: "grant_type", type: "string", required: true, description: "OAuth grant type (client_credentials)" },
          { name: "scope", type: "string", required: false, description: "Requested scopes separated by spaces" }
        ],
        responseSchema: {
          access_token: "string",
          token_type: "Bearer", 
          expires_in: 3600,
          scope: "string"
        },
        rateLimits: { sandbox: 100, production: 1000 },
        requiredPermissions: [],
        isInternal: true,
        isActive: true
      });

      await storage.createApiEndpoint({
        name: "UPI Payment Processing",
        method: "POST",
        path: "/upi/payment",
        category: "Digital Payments", 
        description: "Process UPI payments with real-time status updates, VPA validation, and comprehensive fraud detection",
        summary: "Complete UPI payment processing with advanced security",
        requiresAuth: true,
        authType: "bearer",
        status: "active",
        version: "v1", 
        timeout: 45000,
        parameters: [
          { name: "amount", type: "number", required: true, description: "Payment amount in INR" },
          { name: "payerVPA", type: "string", required: true, description: "Payer's Virtual Payment Address" },
          { name: "payeeVPA", type: "string", required: true, description: "Payee's Virtual Payment Address" },
          { name: "reference", type: "string", required: true, description: "Unique transaction reference" },
          { name: "remarks", type: "string", required: false, description: "Payment remarks" }
        ],
        responseSchema: {
          transactionId: "string",
          status: "SUCCESS|PENDING|FAILED",
          amount: "number",
          timestamp: "ISO8601",
          reference: "string"
        },
        rateLimits: { sandbox: 50, production: 500 },
        requiredPermissions: ["payment:write"],
        isInternal: true,
        isActive: true
      });

      await storage.createApiEndpoint({
        name: "Customer 360 Service",
        method: "GET",
        path: "/customer/360/{customerId}",
        category: "Customer Management",
        description: "Comprehensive customer data aggregation providing complete 360-degree view including accounts, transactions, preferences, and relationship history",
        summary: "Complete customer profile with relationship insights",
        requiresAuth: true,
        authType: "bearer", 
        status: "active",
        version: "v1",
        timeout: 30000,
        parameters: [
          { name: "customerId", type: "string", required: true, description: "Unique customer identifier" },
          { name: "includeTransactions", type: "boolean", required: false, description: "Include transaction history" },
          { name: "includeFamilyData", type: "boolean", required: false, description: "Include family relationship data" }
        ],
        responseSchema: {
          customerId: "string",
          personalInfo: "object",
          accounts: "array",
          transactions: "array",
          relationshipData: "object",
          preferences: "object"
        },
        rateLimits: { sandbox: 100, production: 800 },
        requiredPermissions: ["customer:read"],
        isInternal: true,
        isActive: true
      });

      res.json({ 
        message: "Initial hierarchical data seeded successfully",
        categories: 3,
        apis: 3
      });

    } catch (error) {
      console.error("Seeding error:", error);
      res.status(500).json({ error: "Failed to seed data" });
    }
  });

  // ==============================================
  // CONFIGURATION MANAGEMENT ROUTES
  // ==============================================

  // Config Categories Management
  app.get("/api/config/categories", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const categories = await storage.getAllConfigCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      console.error('Get config categories error:', error);
      res.status(500).json({ error: 'Failed to fetch configuration categories' });
    }
  });

  app.post("/api/config/categories", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const categoryData = insertConfigCategorySchema.parse(req.body);
      const category = await storage.createConfigCategory(categoryData);
      
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'config_category_created',
        resource: 'config_category',
        resourceId: category.id,
        details: { name: category.name },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json({ success: true, data: category });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Create config category error:', error);
      res.status(500).json({ error: 'Failed to create configuration category' });
    }
  });

  app.put("/api/config/categories/:id", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateConfigCategorySchema.parse(req.body);
      const category = await storage.updateConfigCategory(id, updates);
      
      if (!category) {
        return res.status(404).json({ error: 'Configuration category not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'config_category_updated',
        resource: 'config_category',
        resourceId: id,
        details: updates,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, data: category });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Update config category error:', error);
      res.status(500).json({ error: 'Failed to update configuration category' });
    }
  });

  // General Configuration Settings (Admin/Manager only - contains sensitive data)
  app.get("/api/config/settings", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const { environment, category } = req.query;
      let configurations;
      
      if (category) {
        configurations = await storage.getConfigurationsByCategory(category as string, environment as string);
      } else {
        configurations = await storage.getAllConfigurations(environment as string);
      }
      
      res.json({ success: true, data: configurations });
    } catch (error) {
      console.error('Get configurations error:', error);
      res.status(500).json({ error: 'Failed to fetch configurations' });
    }
  });

  app.post("/api/config/settings", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const configData = insertConfigurationSchema.parse(req.body);
      configData.lastModifiedBy = req.user!.id;
      const config = await storage.createConfiguration(configData);
      
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'configuration_created',
        resource: 'configuration',
        resourceId: config.id,
        details: { key: config.key, environment: config.environment },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json({ success: true, data: config });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Create configuration error:', error);
      res.status(500).json({ error: 'Failed to create configuration' });
    }
  });

  app.put("/api/config/settings/:id", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateConfigurationSchema.parse(req.body);
      updates.lastModifiedBy = req.user!.id;
      const config = await storage.updateConfiguration(id, updates);
      
      if (!config) {
        return res.status(404).json({ error: 'Configuration not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'configuration_updated',
        resource: 'configuration',
        resourceId: id,
        details: updates,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, data: config });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Update configuration error:', error);
      res.status(500).json({ error: 'Failed to update configuration' });
    }
  });

  // DELETE endpoint for Config Categories
  app.delete("/api/config/categories/:id", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteConfigCategory(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Configuration category not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'config_category_deleted',
        resource: 'config_category',
        resourceId: id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, message: 'Configuration category deleted successfully' });
    } catch (error) {
      console.error('Delete config category error:', error);
      res.status(500).json({ error: 'Failed to delete configuration category' });
    }
  });

  // DELETE endpoint for General Settings
  app.delete("/api/config/settings/:id", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteConfiguration(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Configuration not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'configuration_deleted',
        resource: 'configuration',
        resourceId: id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, message: 'Configuration deleted successfully' });
    } catch (error) {
      console.error('Delete configuration error:', error);
      res.status(500).json({ error: 'Failed to delete configuration' });
    }
  });

  // UI Configuration Routes
  app.get("/api/config/ui", async (req, res) => {
    try {
      const { environment = 'all' } = req.query;
      const uiConfig = await storage.getUiConfigurationByEnvironment(environment as string);
      
      if (!uiConfig) {
        // Return default UI configuration if none exists
        const defaultConfig = {
          theme: "default",
          primaryColor: "#603078",
          secondaryColor: "#4d2661",
          accentColor: "#f59e0b",
          backgroundColor: "#fefefe",
          textColor: "#111827",
          borderRadius: "14px",
          fontFamily: "Inter",
          sidebarWidth: "16rem",
          headerHeight: "4rem"
        };
        return res.json({ success: true, data: defaultConfig });
      }
      
      res.json({ success: true, data: uiConfig });
    } catch (error) {
      console.error('Get UI configuration error:', error);
      res.status(500).json({ error: 'Failed to fetch UI configuration' });
    }
  });

  app.post("/api/config/ui", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const uiConfigData = insertUiConfigurationSchema.parse(req.body);
      const uiConfig = await storage.createUiConfiguration(uiConfigData);
      
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'ui_config_created',
        resource: 'ui_configuration',
        resourceId: uiConfig.id,
        details: { environment: uiConfig.environment, theme: uiConfig.theme },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json({ success: true, data: uiConfig });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Create UI configuration error:', error);
      res.status(500).json({ error: 'Failed to create UI configuration' });
    }
  });

  app.put("/api/config/ui/:id", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateUiConfigurationSchema.parse(req.body);
      const uiConfig = await storage.updateUiConfiguration(id, updates);
      
      if (!uiConfig) {
        return res.status(404).json({ error: 'UI configuration not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'ui_config_updated',
        resource: 'ui_configuration',
        resourceId: id,
        details: updates,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, data: uiConfig });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Update UI configuration error:', error);
      res.status(500).json({ error: 'Failed to update UI configuration' });
    }
  });

  // DELETE endpoint for UI Configuration
  app.delete("/api/config/ui/:id", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteUiConfiguration(id);
      
      if (!success) {
        return res.status(404).json({ error: 'UI configuration not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'ui_config_deleted',
        resource: 'ui_configuration',
        resourceId: id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, message: 'UI configuration deleted successfully' });
    } catch (error) {
      console.error('Delete UI configuration error:', error);
      res.status(500).json({ error: 'Failed to delete UI configuration' });
    }
  });

  // Form Configuration Routes (Admin/Manager only)
  app.get("/api/config/forms", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const { environment, formType } = req.query;
      let formConfigs;
      
      if (formType) {
        formConfigs = [await storage.getFormConfigurationByType(formType as string, environment as string)].filter(Boolean);
      } else {
        formConfigs = await storage.getAllFormConfigurations(environment as string);
      }
      
      res.json({ success: true, data: formConfigs });
    } catch (error) {
      console.error('Get form configurations error:', error);
      res.status(500).json({ error: 'Failed to fetch form configurations' });
    }
  });

  app.post("/api/config/forms", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const formConfigData = insertFormConfigurationSchema.parse(req.body);
      const formConfig = await storage.createFormConfiguration(formConfigData);
      
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'form_config_created',
        resource: 'form_configuration',
        resourceId: formConfig.id,
        details: { formType: formConfig.formType, formName: formConfig.formName },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json({ success: true, data: formConfig });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Create form configuration error:', error);
      res.status(500).json({ error: 'Failed to create form configuration' });
    }
  });

  // PUT endpoint for Form Configuration
  app.put("/api/config/forms/:id", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateFormConfigurationSchema.parse(req.body);
      const formConfig = await storage.updateFormConfiguration(id, updates);
      
      if (!formConfig) {
        return res.status(404).json({ error: 'Form configuration not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'form_config_updated',
        resource: 'form_configuration',
        resourceId: id,
        details: updates,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, data: formConfig });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Update form configuration error:', error);
      res.status(500).json({ error: 'Failed to update form configuration' });
    }
  });

  // DELETE endpoint for Form Configuration
  app.delete("/api/config/forms/:id", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteFormConfiguration(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Form configuration not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'form_config_deleted',
        resource: 'form_configuration',
        resourceId: id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, message: 'Form configuration deleted successfully' });
    } catch (error) {
      console.error('Delete form configuration error:', error);
      res.status(500).json({ error: 'Failed to delete form configuration' });
    }
  });

  // Public Validation Configuration endpoint for frontend forms
  app.get("/api/validation-rules", async (req, res) => {
    try {
      const { environment = 'all', entityType } = req.query;
      let validationConfigs;
      
      if (entityType) {
        validationConfigs = await storage.getValidationConfigurationsByEntity(entityType as string, environment as string);
      } else {
        validationConfigs = await storage.getAllValidationConfigurations(environment as string);
      }
      
      // Transform validation configurations into a more usable format for frontend
      const formattedRules: Record<string, Record<string, any>> = {};
      
      validationConfigs.forEach(config => {
        if (!formattedRules[config.entityType]) {
          formattedRules[config.entityType] = {};
        }
        if (!formattedRules[config.entityType][config.fieldName]) {
          formattedRules[config.entityType][config.fieldName] = {
            validations: [],
            errorMessages: {}
          };
        }
        
        formattedRules[config.entityType][config.fieldName].validations.push({
          type: config.validationType,
          rules: config.rules,
          priority: config.priority,
          isActive: config.isActive
        });
        
        formattedRules[config.entityType][config.fieldName].errorMessages[config.validationType] = config.errorMessage;
      });
      
      res.json({ 
        success: true, 
        data: formattedRules,
        environment: environment,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get public validation rules error:', error);
      res.status(500).json({ error: 'Failed to fetch validation rules' });
    }
  });

  // Validation Configuration Routes (Admin/Manager only)
  app.get("/api/config/validation", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const { environment, entityType } = req.query;
      let validationConfigs;
      
      if (entityType) {
        validationConfigs = await storage.getValidationConfigurationsByEntity(entityType as string, environment as string);
      } else {
        validationConfigs = await storage.getAllValidationConfigurations(environment as string);
      }
      
      res.json({ success: true, data: validationConfigs });
    } catch (error) {
      console.error('Get validation configurations error:', error);
      res.status(500).json({ error: 'Failed to fetch validation configurations' });
    }
  });

  app.post("/api/config/validation", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const validationConfigData = insertValidationConfigurationSchema.parse(req.body);
      const validationConfig = await storage.createValidationConfiguration(validationConfigData);
      
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'validation_config_created',
        resource: 'validation_configuration',
        resourceId: validationConfig.id,
        details: { entityType: validationConfig.entityType, fieldName: validationConfig.fieldName },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json({ success: true, data: validationConfig });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Create validation configuration error:', error);
      res.status(500).json({ error: 'Failed to create validation configuration' });
    }
  });

  // PUT endpoint for Validation Configuration
  app.put("/api/config/validation/:id", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateValidationConfigurationSchema.parse(req.body);
      const validationConfig = await storage.updateValidationConfiguration(id, updates);
      
      if (!validationConfig) {
        return res.status(404).json({ error: 'Validation configuration not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'validation_config_updated',
        resource: 'validation_configuration',
        resourceId: id,
        details: updates,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, data: validationConfig });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Update validation configuration error:', error);
      res.status(500).json({ error: 'Failed to update validation configuration' });
    }
  });

  // DELETE endpoint for Validation Configuration
  app.delete("/api/config/validation/:id", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteValidationConfiguration(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Validation configuration not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'validation_config_deleted',
        resource: 'validation_configuration',
        resourceId: id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, message: 'Validation configuration deleted successfully' });
    } catch (error) {
      console.error('Delete validation configuration error:', error);
      res.status(500).json({ error: 'Failed to delete validation configuration' });
    }
  });

  // System Configuration Routes
  app.get("/api/config/system", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const { environment, module } = req.query;
      let systemConfigs;
      
      if (module) {
        systemConfigs = await storage.getSystemConfigurationsByModule(module as string, environment as string);
      } else {
        systemConfigs = await storage.getAllSystemConfigurations(environment as string);
      }
      
      res.json({ success: true, data: systemConfigs });
    } catch (error) {
      console.error('Get system configurations error:', error);
      res.status(500).json({ error: 'Failed to fetch system configurations' });
    }
  });

  app.post("/api/config/system", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const systemConfigData = insertSystemConfigurationSchema.parse(req.body);
      systemConfigData.lastModifiedBy = req.user!.id;
      const systemConfig = await storage.createSystemConfiguration(systemConfigData);
      
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'system_config_created',
        resource: 'system_configuration',
        resourceId: systemConfig.id,
        details: { module: systemConfig.module, setting: systemConfig.setting },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json({ success: true, data: systemConfig });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Create system configuration error:', error);
      res.status(500).json({ error: 'Failed to create system configuration' });
    }
  });

  app.put("/api/config/system/:id", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateSystemConfigurationSchema.parse(req.body);
      updates.lastModifiedBy = req.user!.id;
      const systemConfig = await storage.updateSystemConfiguration(id, updates);
      
      if (!systemConfig) {
        return res.status(404).json({ error: 'System configuration not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'system_config_updated',
        resource: 'system_configuration',
        resourceId: id,
        details: updates,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, data: systemConfig });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Update system configuration error:', error);
      res.status(500).json({ error: 'Failed to update system configuration' });
    }
  });

  // DELETE endpoint for System Configuration
  app.delete("/api/config/system/:id", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteSystemConfiguration(id);
      
      if (!success) {
        return res.status(404).json({ error: 'System configuration not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'system_config_deleted',
        resource: 'system_configuration',
        resourceId: id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, message: 'System configuration deleted successfully' });
    } catch (error) {
      console.error('Delete system configuration error:', error);
      res.status(500).json({ error: 'Failed to delete system configuration' });
    }
  });

  // Environment Configuration Routes
  app.get("/api/config/environment", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const { environment } = req.query;
      const envConfigs = await storage.getAllEnvironmentConfigurations(environment as string);
      res.json({ success: true, data: envConfigs });
    } catch (error) {
      console.error('Get environment configurations error:', error);
      res.status(500).json({ error: 'Failed to fetch environment configurations' });
    }
  });

  app.post("/api/config/environment", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const envConfigData = insertEnvironmentConfigurationSchema.parse(req.body);
      const envConfig = await storage.createEnvironmentConfiguration(envConfigData);
      
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'env_config_created',
        resource: 'environment_configuration',
        resourceId: envConfig.id,
        details: { environment: envConfig.environment, configKey: envConfig.configKey },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json({ success: true, data: envConfig });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Create environment configuration error:', error);
      res.status(500).json({ error: 'Failed to create environment configuration' });
    }
  });

  // PUT endpoint for Environment Configuration
  app.put("/api/config/environment/:id", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateEnvironmentConfigurationSchema.parse(req.body);
      const envConfig = await storage.updateEnvironmentConfiguration(id, updates);
      
      if (!envConfig) {
        return res.status(404).json({ error: 'Environment configuration not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'env_config_updated',
        resource: 'environment_configuration',
        resourceId: id,
        details: updates,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, data: envConfig });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Update environment configuration error:', error);
      res.status(500).json({ error: 'Failed to update environment configuration' });
    }
  });

  // DELETE endpoint for Environment Configuration
  app.delete("/api/config/environment/:id", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteEnvironmentConfiguration(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Environment configuration not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'env_config_deleted',
        resource: 'environment_configuration',
        resourceId: id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, message: 'Environment configuration deleted successfully' });
    } catch (error) {
      console.error('Delete environment configuration error:', error);
      res.status(500).json({ error: 'Failed to delete environment configuration' });
    }
  });

  // Bulk Configuration Export/Import (Admin only)
  app.get("/api/config/export", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const { environment = 'all' } = req.query;
      
      const [
        categories,
        configurations,
        uiConfigs,
        formConfigs,
        validationConfigs,
        systemConfigs,
        envConfigs
      ] = await Promise.all([
        storage.getAllConfigCategories(),
        storage.getAllConfigurations(environment as string),
        storage.getAllUiConfigurations(environment as string),
        storage.getAllFormConfigurations(environment as string),
        storage.getAllValidationConfigurations(environment as string),
        storage.getAllSystemConfigurations(environment as string),
        storage.getAllEnvironmentConfigurations(environment as string)
      ]);

      const exportData = {
        exportedAt: new Date().toISOString(),
        environment: environment as string,
        categories,
        configurations,
        uiConfigurations: uiConfigs,
        formConfigurations: formConfigs,
        validationConfigurations: validationConfigs,
        systemConfigurations: systemConfigs,
        environmentConfigurations: envConfigs
      };

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'config_exported',
        resource: 'configurations',
        details: { environment, totalItems: Object.values(exportData).flat().length },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, data: exportData });
    } catch (error) {
      console.error('Export configurations error:', error);
      res.status(500).json({ error: 'Failed to export configurations' });
    }
  });

  // Analytics endpoints (authenticated with role-based access)
  app.get("/api/analytics/summary", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const { environment = 'sandbox' } = req.query;
      const summary = await storage.getAnalyticsSummary(environment as string);
      
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'analytics_summary_viewed',
        resource: 'analytics',
        details: { environment },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, data: summary });
    } catch (error) {
      console.error('Get analytics summary error:', error);
      res.status(500).json({ error: 'Failed to get analytics summary' });
    }
  });

  app.get("/api/analytics/usage", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const { days = '7', environment = 'sandbox' } = req.query;
      const usageData = await storage.getUsageOverTime(parseInt(days as string), environment as string);
      
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'analytics_usage_viewed',
        resource: 'analytics',
        details: { days, environment },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, data: usageData });
    } catch (error) {
      console.error('Get analytics usage error:', error);
      res.status(500).json({ error: 'Failed to get usage analytics' });
    }
  });

  app.get("/api/analytics/distribution", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const { environment = 'sandbox' } = req.query;
      const distribution = await storage.getApiDistribution(environment as string);
      
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'analytics_distribution_viewed',
        resource: 'analytics',
        details: { environment },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, data: distribution });
    } catch (error) {
      console.error('Get analytics distribution error:', error);
      res.status(500).json({ error: 'Failed to get API distribution analytics' });
    }
  });

  app.get("/api/analytics/developers", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const { limit = '5', environment = 'sandbox' } = req.query;
      const topDevelopers = await storage.getTopDevelopers(parseInt(limit as string), environment as string);
      
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'analytics_developers_viewed',
        resource: 'analytics',
        details: { limit, environment },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, data: topDevelopers });
    } catch (error) {
      console.error('Get top developers analytics error:', error);
      res.status(500).json({ error: 'Failed to get top developers analytics' });
    }
  });

  app.get("/api/analytics/activity", authenticate, requireRole(['admin', 'manager']), async (req, res) => {
    try {
      const { limit = '50', environment = 'sandbox' } = req.query;
      const recentActivity = await storage.getRecentApiActivity(parseInt(limit as string), environment as string);
      
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'analytics_activity_viewed',
        resource: 'analytics',
        details: { limit, environment },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, data: recentActivity });
    } catch (error) {
      console.error('Get recent activity analytics error:', error);
      res.status(500).json({ error: 'Failed to get recent activity analytics' });
    }
  });

  // Documentation management endpoints
  // Documentation Categories endpoints
  app.get("/api/documentation/categories", async (req, res) => {
    try {
      const categories = await storage.getAllDocumentationCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      console.error('Get documentation categories error:', error);
      res.status(500).json({ error: 'Failed to get documentation categories' });
    }
  });

  app.get("/api/documentation/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const category = await storage.getDocumentationCategory(id);
      
      if (!category) {
        return res.status(404).json({ error: 'Documentation category not found' });
      }

      res.json({ success: true, data: category });
    } catch (error) {
      console.error('Get documentation category error:', error);
      res.status(500).json({ error: 'Failed to get documentation category' });
    }
  });

  app.post("/api/documentation/categories", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const categoryData = insertDocumentationCategorySchema.parse(req.body);
      const category = await storage.createDocumentationCategory(categoryData);
      
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'documentation_category_created',
        resource: 'documentation_category',
        resourceId: category.id,
        details: { name: category.name },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json({ success: true, data: category });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Create documentation category error:', error);
      res.status(500).json({ error: 'Failed to create documentation category' });
    }
  });

  app.put("/api/documentation/categories/:id", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateDocumentationCategorySchema.parse(req.body);
      const category = await storage.updateDocumentationCategory(id, updates);
      
      if (!category) {
        return res.status(404).json({ error: 'Documentation category not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'documentation_category_updated',
        resource: 'documentation_category',
        resourceId: category.id,
        details: { name: category.name },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, data: category });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Update documentation category error:', error);
      res.status(500).json({ error: 'Failed to update documentation category' });
    }
  });

  app.delete("/api/documentation/categories/:id", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteDocumentationCategory(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Documentation category not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'documentation_category_deleted',
        resource: 'documentation_category',
        resourceId: id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, message: 'Documentation category deleted successfully' });
    } catch (error) {
      console.error('Delete documentation category error:', error);
      res.status(500).json({ error: 'Failed to delete documentation category' });
    }
  });

  // Documentation Endpoints endpoints
  app.get("/api/documentation/endpoints", async (req, res) => {
    try {
      const { categoryId, subcategoryId } = req.query;
      let endpoints;
      
      if (categoryId) {
        endpoints = await storage.getDocumentationEndpointsByCategory(categoryId as string);
      } else if (subcategoryId) {
        endpoints = await storage.getDocumentationEndpointsBySubcategory(subcategoryId as string);
      } else {
        endpoints = await storage.getAllDocumentationEndpoints();
      }

      res.json({ success: true, data: endpoints });
    } catch (error) {
      console.error('Get documentation endpoints error:', error);
      res.status(500).json({ error: 'Failed to get documentation endpoints' });
    }
  });

  app.get("/api/documentation/endpoints/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const endpoint = await storage.getDocumentationEndpoint(id);
      
      if (!endpoint) {
        return res.status(404).json({ error: 'Documentation endpoint not found' });
      }

      // Get related data for complete endpoint documentation
      const [parameters, responses, examples, security] = await Promise.all([
        storage.getDocumentationParametersByEndpoint(id),
        storage.getDocumentationResponsesByEndpoint(id),
        storage.getDocumentationExamplesByEndpoint(id),
        storage.getDocumentationSecurityByEndpoint(id)
      ]);

      res.json({ 
        success: true, 
        data: {
          ...endpoint,
          parameters,
          responses,
          examples,
          security
        }
      });
    } catch (error) {
      console.error('Get documentation endpoint error:', error);
      res.status(500).json({ error: 'Failed to get documentation endpoint' });
    }
  });

  app.post("/api/documentation/endpoints", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const endpointData = insertDocumentationEndpointSchema.parse(req.body);
      const endpoint = await storage.createDocumentationEndpoint(endpointData);
      
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'documentation_endpoint_created',
        resource: 'documentation_endpoint',
        resourceId: endpoint.id,
        details: { name: endpoint.name, path: endpoint.path },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json({ success: true, data: endpoint });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Create documentation endpoint error:', error);
      res.status(500).json({ error: 'Failed to create documentation endpoint' });
    }
  });

  app.put("/api/documentation/endpoints/:id", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateDocumentationEndpointSchema.parse(req.body);
      const endpoint = await storage.updateDocumentationEndpoint(id, updates);
      
      if (!endpoint) {
        return res.status(404).json({ error: 'Documentation endpoint not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'documentation_endpoint_updated',
        resource: 'documentation_endpoint',
        resourceId: endpoint.id,
        details: { name: endpoint.name, path: endpoint.path },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, data: endpoint });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Update documentation endpoint error:', error);
      res.status(500).json({ error: 'Failed to update documentation endpoint' });
    }
  });

  app.delete("/api/documentation/endpoints/:id", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteDocumentationEndpoint(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Documentation endpoint not found' });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'documentation_endpoint_deleted',
        resource: 'documentation_endpoint',
        resourceId: id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true, message: 'Documentation endpoint deleted successfully' });
    } catch (error) {
      console.error('Delete documentation endpoint error:', error);
      res.status(500).json({ error: 'Failed to delete documentation endpoint' });
    }
  });

  // Documentation Parameters endpoints
  app.get("/api/documentation/parameters", async (req, res) => {
    try {
      const { endpointId } = req.query;
      if (!endpointId) {
        return res.status(400).json({ error: 'endpointId query parameter is required' });
      }

      const parameters = await storage.getDocumentationParametersByEndpoint(endpointId as string);
      res.json({ success: true, data: parameters });
    } catch (error) {
      console.error('Get documentation parameters error:', error);
      res.status(500).json({ error: 'Failed to get documentation parameters' });
    }
  });

  app.post("/api/documentation/parameters", authenticate, requireRole(['admin']), async (req, res) => {
    try {
      const parameterData = insertDocumentationParameterSchema.parse(req.body);
      const parameter = await storage.createDocumentationParameter(parameterData);
      
      await storage.createAuditLog({
        userId: req.user!.id,
        action: 'documentation_parameter_created',
        resource: 'documentation_parameter',
        resourceId: parameter.id,
        details: { name: parameter.name, endpointId: parameter.endpointId },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json({ success: true, data: parameter });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Create documentation parameter error:', error);
      res.status(500).json({ error: 'Failed to create documentation parameter' });
    }
  });

  // Complete documentation structure endpoint
  app.get("/api/documentation/structure", async (req, res) => {
    try {
      const structure = await storage.getCompleteDocumentationStructure();
      res.json({ success: true, data: structure });
    } catch (error) {
      console.error('Get complete documentation structure error:', error);
      res.status(500).json({ error: 'Failed to get complete documentation structure' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}