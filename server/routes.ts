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

  // Simulate API endpoints for demo
  app.post("/api/sandbox/accounts", async (req, res) => {
    res.json({
      id: "acc_" + Math.random().toString(36).substr(2, 9),
      balance: 1000.00,
      currency: "USD",
      status: "active"
    });
  });

  app.get("/api/sandbox/accounts/:id/balance", async (req, res) => {
    res.json({
      accountId: req.params.id,
      balance: 2500.75,
      currency: "USD",
      lastUpdated: new Date().toISOString()
    });
  });

  app.post("/api/sandbox/payments", async (req, res) => {
    res.json({
      id: "pay_" + Math.random().toString(36).substr(2, 9),
      amount: req.body.amount || 100.00,
      currency: "USD",
      status: "pending",
      createdAt: new Date().toISOString()
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
