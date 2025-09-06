import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sessionConfig } from "./session";
import { authenticate, requireRole, authenticateApiKey, requireEnvironmentAccess, createRateLimiter } from "./auth";
import {
  insertUserSchema, updateUserSchema, loginSchema,
  insertDeveloperSchema, updateDeveloperSchema, insertApplicationSchema,
  insertCorporateRegistrationSchema, verifyOtpSchema,
  insertApiEndpointSchema, insertApiTokenSchema
} from "@shared/schema";
import bcrypt from "bcrypt";
import { ZodError } from "zod";

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

  // API Endpoint management (admin only)
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

  const httpServer = createServer(app);
  return httpServer;
}