#!/usr/bin/env tsx

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { dailyAnalytics, apiActivity, developers, apiEndpoints } from "../shared/schema";

const sql = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seedAnalyticsData() {
  console.log("🌱 Starting analytics seed data...");

  try {
    // Get existing developers and APIs from database
    const existingDevelopers = await db.select().from(developers);
    const existingApiEndpoints = await db.select().from(apiEndpoints);

    console.log(`Found ${existingDevelopers.length} developers and ${existingApiEndpoints.length} API endpoints`);

    // Generate daily analytics for the last 30 days
    console.log("📊 Creating daily analytics data...");
    const dailyAnalyticsData = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic daily numbers with some variation
      const baseRequests = 150 + Math.floor(Math.random() * 100);
      const accounts = Math.floor(baseRequests * (0.3 + Math.random() * 0.2)); // 30-50% of requests
      const payments = Math.floor(baseRequests * (0.25 + Math.random() * 0.15)); // 25-40% of requests
      const kyc = Math.floor(baseRequests * (0.15 + Math.random() * 0.15)); // 15-30% of requests
      
      dailyAnalyticsData.push({
        date: date.toISOString().split('T')[0],
        environment: 'sandbox',
        totalRequests: baseRequests,
        successfulRequests: Math.floor(baseRequests * (0.92 + Math.random() * 0.06)), // 92-98% success rate
        failedRequests: Math.floor(baseRequests * (0.02 + Math.random() * 0.06)), // 2-8% failure rate
        averageResponseTime: 150 + Math.floor(Math.random() * 100), // 150-250ms
        uniqueDevelopers: Math.min(existingDevelopers.length, 5 + Math.floor(Math.random() * 10)),
        accountsApiRequests: accounts,
        paymentsApiRequests: payments,
        kycApiRequests: kyc,
        topApiCategory: Math.random() > 0.5 ? 'Accounts' : 'Payments'
      });
    }

    await db.insert(dailyAnalytics).values(dailyAnalyticsData);
    console.log(`✅ Inserted ${dailyAnalyticsData.length} daily analytics records`);

    // Generate realistic API activity for the last few hours
    console.log("🔄 Creating API activity data...");
    const apiActivityData = [];
    const now = new Date();
    
    // Generate 50 recent API calls
    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(now);
      timestamp.setMinutes(timestamp.getMinutes() - Math.floor(Math.random() * 300)); // Within last 5 hours
      
      const apiMethods = ['GET', 'POST', 'PUT', 'PATCH'];
      const apiPaths = [
        '/accounts/balance',
        '/accounts/transactions',
        '/accounts/create',
        '/payments/transfer',
        '/payments/status', 
        '/payments/history',
        '/kyc/verify',
        '/kyc/documents',
        '/kyc/status'
      ];
      
      const method = apiMethods[Math.floor(Math.random() * apiMethods.length)];
      const path = apiPaths[Math.floor(Math.random() * apiPaths.length)];
      const statusCode = Math.random() > 0.05 ? 200 : (Math.random() > 0.5 ? 400 : 500); // 95% success
      // Skip API activity data if no developers exist since developerId is required
      if (existingDevelopers.length === 0) {
        continue;
      }

      const developerId = existingDevelopers[Math.floor(Math.random() * existingDevelopers.length)].id;
      
      apiActivityData.push({
        timestamp: timestamp,
        environment: 'sandbox',
        method,
        path,
        statusCode,
        responseTime: 100 + Math.floor(Math.random() * 300), // 100-400ms
        developerId,
        apiId: existingApiEndpoints.length > 0 ? 
          existingApiEndpoints[Math.floor(Math.random() * existingApiEndpoints.length)].id : 
          null,
        userAgent: 'AU-Bank-SDK/1.0.0',
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      });
    }

    if (apiActivityData.length > 0) {
      await db.insert(apiActivity).values(apiActivityData);
      console.log(`✅ Inserted ${apiActivityData.length} API activity records`);
    } else {
      console.log(`⚠️  No API activity records created (no developers found)`);
    }

    console.log("🎉 Analytics seed data completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding analytics data:", error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Run the seed function
seedAnalyticsData()
  .then(() => {
    console.log("✅ Analytics seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Analytics seeding failed:", error);
    process.exit(1);
  });