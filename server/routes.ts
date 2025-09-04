import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDeveloperSchema, insertApplicationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Developer routes
  app.get("/api/developers", async (req, res) => {
    try {
      const developers = await storage.getAllDevelopers();
      res.json(developers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch developers" });
    }
  });

  app.post("/api/developers", async (req, res) => {
    try {
      const validatedData = insertDeveloperSchema.parse(req.body);
      const developer = await storage.createDeveloper(validatedData);
      res.status(201).json(developer);
    } catch (error) {
      res.status(400).json({ error: "Invalid developer data" });
    }
  });

  app.get("/api/developers/:id", async (req, res) => {
    try {
      const developer = await storage.getDeveloper(req.params.id);
      if (!developer) {
        return res.status(404).json({ error: "Developer not found" });
      }
      res.json(developer);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch developer" });
    }
  });

  // Application routes
  app.get("/api/applications", async (req, res) => {
    try {
      const { developerId } = req.query;
      if (developerId) {
        const applications = await storage.getApplicationsByDeveloper(developerId as string);
        return res.json(applications);
      }
      res.status(400).json({ error: "Developer ID required" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      res.status(400).json({ error: "Invalid application data" });
    }
  });

  app.get("/api/applications/:id", async (req, res) => {
    try {
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch application" });
    }
  });

  app.delete("/api/applications/:id", async (req, res) => {
    try {
      const success = await storage.deleteApplication(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete application" });
    }
  });

  // API Endpoint routes
  app.get("/api/endpoints", async (req, res) => {
    try {
      const { category } = req.query;
      if (category) {
        const endpoints = await storage.getApiEndpointsByCategory(category as string);
        return res.json(endpoints);
      }
      const endpoints = await storage.getAllApiEndpoints();
      res.json(endpoints);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch endpoints" });
    }
  });

  // API Usage routes
  app.get("/api/usage/:developerId", async (req, res) => {
    try {
      const usage = await storage.getApiUsageByDeveloper(req.params.developerId);
      res.json(usage);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch usage data" });
    }
  });

  // AU Bank OAuth Token Generation
  app.get("/api/sandbox/oauth/accesstoken", async (req, res) => {
    res.json({
      "refresh_token_expires_in": "0",
      "api_product_list": "[LDAP, Oauth, Payment, Customer Onboarding, karza, CBSMiniStatementService, test]",
      "api_product_list_json": [
        "LDAP",
        "Oauth", 
        "Payment",
        "Customer Onboarding",
        "karza",
        "CBSMiniStatementService",
        "test"
      ],
      "organization_name": "au-apigee-nprod",
      "developer.email": "kunal.boriwal@aubank.in",
      "token_type": "BearerToken", 
      "issued_at": Date.now().toString(),
      "client_id": "2I7UVNalTfFBxm3ZYxOtzYXwXX1PMIJCSSFf6AMipK0H0zR9",
      "access_token": "lEbnG39cJwC4lKUe5fliVA9HFcyR",
      "application_name": "f0556c9d-6c97-40aa-8d4e-c6bb190ef2ce",
      "scope": "",
      "expires_in": "86399",
      "refresh_count": "0", 
      "status": "approved"
    });
  });

  // AU Bank Payment Creation
  app.post("/api/sandbox/CNBPaymentService/paymentCreation", async (req, res) => {
    const transactionId = "TXN" + Math.random().toString(36).substr(2, 12).toUpperCase();
    res.json({
      "responseCode": "00",
      "responseMessage": "Payment initiated successfully", 
      "transactionId": transactionId,
      "uniqueRequestId": req.body.uniqueRequestId || "REQ" + Math.random().toString(36).substr(2, 9),
      "batchId": "BATCH" + Math.random().toString(36).substr(2, 9),
      "status": "SUCCESS",
      "timestamp": new Date().toISOString(),
      "paymentDetails": {
        "amount": req.body.amount || "100.00",
        "currency": "INR",
        "paymentMethod": req.body.paymentMethodName || "NEFT",
        "beneficiaryAccount": req.body.beneAccNo || "1234567890",
        "beneficiaryName": req.body.beneName || "Test Beneficiary"
      }
    });
  });

  // AU Bank Payment Enquiry
  app.post("/api/sandbox/paymentEnquiry", async (req, res) => {
    const statuses = ["SUCCESS", "PENDING", "FAILED"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    res.json({
      "responseCode": "00",
      "responseMessage": "Enquiry processed successfully",
      "transactionId": req.body.transactionId || "TXN" + Math.random().toString(36).substr(2, 12),
      "paymentStatus": randomStatus,
      "bankReference": "AU" + Math.random().toString(36).substr(2, 10).toUpperCase(),
      "processedDate": new Date().toISOString(),
      "amount": "100.00",
      "currency": "INR",
      "remarks": randomStatus === "FAILED" ? "Insufficient funds" : "Transaction processed successfully"
    });
  });

  // Standard Banking APIs
  app.get("/api/sandbox/accounts/:id/balance", async (req, res) => {
    res.json({
      accountId: req.params.id,
      balance: 25000.75,
      currency: "INR",
      lastUpdated: new Date().toISOString()
    });
  });

  app.get("/api/sandbox/accounts/:id/transactions", async (req, res) => {
    res.json({
      accountId: req.params.id,
      transactions: [
        {
          id: "TXN001",
          amount: -500.00,
          currency: "INR", 
          type: "DEBIT",
          description: "NEFT Payment",
          date: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "TXN002", 
          amount: 1000.00,
          currency: "INR",
          type: "CREDIT",
          description: "Salary Credit",
          date: new Date(Date.now() - 172800000).toISOString()
        }
      ]
    });
  });

  app.post("/api/sandbox/kyc/verify", async (req, res) => {
    res.json({
      id: "kyc_" + Math.random().toString(36).substr(2, 9),
      status: "pending",
      submittedAt: new Date().toISOString(),
      estimatedCompletion: "2-3 business days"
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
