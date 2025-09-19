// Script to insert CBS RD Details Rest Service API into database
import { storage } from "../server/storage";

const liabilitiesCategoryId = "7f74500f-d4f2-45c4-ab6b-bc4e1df129ad";

const rdDetailsService = {
  categoryId: liabilitiesCategoryId,
  category: "Liabilities",
  name: "RD Details Service",
  path: "/CBSRDDetailsRestService/RDDetails",
  method: "GET",
  description: "Fetch comprehensive Recurring Deposit (RD) account details including balance, maturity information, installment details, and account status based on account number and deposit number.",
  summary: "Retrieve detailed RD account information and status",
  parameters: [
    {
      name: "RequestId",
      type: "string",
      maxLength: 32,
      required: true,
      description: "Unique reference number for the request",
      example: "5432578880545"
    },
    {
      name: "OriginatingChannel",
      type: "string",
      maxLength: 5,
      required: true,
      description: "Application name or channel identifier",
      example: "TGT"
    },
    {
      name: "AccountNo",
      type: "string",
      maxLength: 16,
      required: true,
      description: "RD account number to fetch details",
      example: "10895340459"
    }
  ],
  headers: [
    { name: "Content-Type", value: "application/json" },
    { name: "Authorization", value: "Bearer {access_token}" }
  ],
  responses: [
    {
      status: "200",
      description: "RD details retrieved successfully",
      example: {
        ErrorCode: "0",
        ErrorDescription: "Success",
        RDAccountNo: "10895340459",
        MaturityAccountNo: "1821201119736140",
        AccountTitle: "Account Holder Name",
        InstallmentAmount: "5000.00",
        AvailableBalance: "125000.00",
        AmtMaturityValue: "127500.00",
        Years: "2",
        Months: "1",
        Days: "15",
        TotalTermDay: "440",
        DatAcctOpen: "2023-01-15",
        MaturityDate: "2025-02-28",
        ProdCod: "30301",
        AccountStatusCode: "2",
        AccountStatus: "Active",
        ROI: "7.5"
      }
    },
    {
      status: "400",
      description: "Bad request - Invalid input parameters"
    },
    {
      status: "401",
      description: "Unauthorized - Invalid authentication credentials"
    },
    {
      status: "404",
      description: "Not Found - RD account not found"
    },
    {
      status: "500",
      description: "Internal Server Error - Something went wrong"
    },
    {
      status: "503",
      description: "Service Unavailable"
    },
    {
      status: "504",
      description: "Gateway timeout"
    }
  ],
  requestExample: JSON.stringify({
    RequestId: "5432578880545",
    OriginatingChannel: "TGT",
    AccountNo: "10895340459"
  }, null, 2),
  responseExample: JSON.stringify({
    ErrorCode: "0",
    ErrorDescription: "Success",
    RDAccountNo: "10895340459",
    MaturityAccountNo: "1821201119736140",
    AccountTitle: "Account Holder Name",
    InstallmentAmount: "5000.00",
    AvailableBalance: "125000.00",
    AmtMaturityValue: "127500.00",
    Years: "2",
    Months: "1",
    Days: "15",
    TotalTermDay: "440",
    DatAcctOpen: "2023-01-15",
    MaturityDate: "2025-02-28",
    ProdCod: "30301",
    AccountStatusCode: "2",
    AccountStatus: "Active",
    ROI: "7.5"
  }, null, 2),
  documentation: "Comprehensive API for retrieving Recurring Deposit (RD) account details. Provides complete information including account balance, maturity value, installment amounts, tenure details, interest rates, and account status. Essential for account management and customer service operations.",
  tags: ["liabilities", "rd", "recurring-deposit", "account-details", "balance-inquiry"],
  timeout: 30000,
  requiresAuth: true,
  authType: "bearer",
  status: "active",
  isActive: true,
  version: "v1",
  isInternal: true,
  requiredPermissions: ["sandbox", "uat"],
  rateLimits: {
    sandbox: 50,
    uat: 200,
    production: 500
  }
};

async function seedRdDetailsService() {
  console.log("🌱 Starting RD Details Service seeding...");
  
  try {
    // Create the API endpoint
    const endpoint = await storage.createApiEndpoint(rdDetailsService);
    console.log(`✅ Created RD Details Service API: ${endpoint.id}`);
    
    console.log("🎉 RD Details Service seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding RD Details Service:", error);
    throw error;
  }
}

// Run the seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedRdDetailsService()
    .then(() => {
      console.log("Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
}

export { seedRdDetailsService };