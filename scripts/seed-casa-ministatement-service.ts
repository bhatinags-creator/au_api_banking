// Script to insert CBSCustCASATDLoanTDCBRMntService (CASA Mini Statement) API into database
import { storage } from "../server/storage";

const liabilitiesCategoryId = "7f74500f-d4f2-45c4-ab6b-bc4e1df129ad";

const casaMiniStatementService = {
  categoryId: liabilitiesCategoryId,
  category: "Liabilities",
  name: "CASA Mini Statement Service",
  path: "/CBSCustCASATDLoanTDCBRMntService/cbr",
  method: "POST",
  description: "CBR (Customer Banking Record) maintenance service for CASA, Term Deposits, Loans and other banking products. Manages customer information, KYC details, risk categories, and portfolio data.",
  summary: "Comprehensive CBR maintenance for customer banking records",
  parameters: [
    {
      name: "ReferenceNumber",
      type: "string",
      maxLength: 20,
      required: true,
      description: "Unique reference number for the transaction"
    },
    {
      name: "TransactionBranch",
      type: "integer",
      maxLength: 10,
      required: true,
      description: "Branch code where transaction is processed"
    },
    {
      name: "RequestId",
      type: "string",
      maxLength: 32,
      required: true,
      description: "Unique request identifier"
    },
    {
      name: "OriginatingChannel",
      type: "string",
      maxLength: 10,
      required: true,
      description: "Channel from which request originated"
    },
    {
      name: "CustCASATDLoanCBRRequest",
      type: "object",
      required: true,
      description: "Main CBR request object with customer details",
      properties: {
        customerID: { type: "string", required: false, description: "Customer ID" },
        module: { type: "string", required: false, description: "Module identifier (CUST, CASA, LOAN, TD)" },
        accountNumber: { type: "string", required: false, description: "Account number if applicable" },
        COD_1: { type: "string", required: false, description: "Last KYC Done" },
        COD_2: { type: "string", required: false, description: "Third Party Client CIF" },
        COD_3: { type: "string", required: false, description: "C-KYC ID" },
        COD_4: { type: "string", required: false, description: "Type of Entity" },
        COD_5: { type: "string", required: false, description: "BSR Code" },
        COD_6: { type: "string", required: false, description: "Risk Category" },
        COD_7: { type: "string", required: false, description: "Passport Number" },
        COD_8: { type: "string", required: false, description: "Voter ID Number" },
        COD_10: { type: "string", required: false, description: "Risk review done date" },
        COD_11: { type: "string", required: false, description: "Subsidy Applicable" },
        COD_26: { type: "string", required: false, description: "Profitability Band" },
        COD_27: { type: "string", required: false, description: "Two-Wheeler Loan" },
        COD_28: { type: "string", required: false, description: "Auto Loan" },
        COD_29: { type: "string", required: false, description: "Personal Loan" },
        COD_30: { type: "string", required: false, description: "Credit Card" },
        COD_31: { type: "string", required: false, description: "Consumer Loan" },
        COD_32: { type: "string", required: false, description: "Type of OVD" },
        COD_33: { type: "string", required: false, description: "Portfolio Code" },
        COD_34: { type: "string", required: false, description: "Politically Exposed Person" },
        COD_35: { type: "string", required: false, description: "CA" },
        COD_36: { type: "string", required: false, description: "Loan Restructuring" },
        COD_37: { type: "string", required: false, description: "Udyam Registration" },
        COD_39: { type: "string", required: false, description: "CIN/Registration no./Document no." },
        COD_40: { type: "string", required: false, description: "Credit Card Flag" },
        NUM_1: { type: "string", required: false, description: "UCIC (Unique Customer Identification Code)" }
      }
    }
  ],
  headers: [
    { name: "Content-Type", value: "application/json" },
    { name: "Authorization", value: "Bearer {access_token}" }
  ],
  responses: [
    {
      status: "200",
      description: "CBR maintenance completed successfully",
      example: {
        TransactionStatus: {
          ResponseCode: "0",
          ResponseMessage: "Success",
          ExtendedErrorDetails: {
            messages: [
              {
                code: 0,
                message: null
              }
            ]
          },
          ValidationErrors: [null]
        },
        ErrorDescription: null
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
      status: "500",
      description: "Internal Server Error - Something went wrong"
    }
  ],
  requestExample: JSON.stringify({
    ReferenceNumber: "1878172831723",
    TransactionBranch: 2011,
    RequestId: "1872381623716",
    OriginatingChannel: "CCO",
    CustCASATDLoanCBRRequest: {
      accountNumber: "",
      customerID: "24079128",
      mode: "",
      module: "CUST",
      COD_1: "",
      COD_2: "",
      COD_3: "",
      COD_4: "",
      COD_5: "Stable Money",
      COD_6: "",
      COD_7: "",
      COD_8: "",
      COD_10: "",
      COD_11: "",
      COD_26: "",
      COD_27: "",
      COD_28: "",
      COD_29: "",
      COD_30: "",
      COD_31: "",
      COD_32: "",
      COD_33: "",
      COD_34: "",
      COD_35: "",
      COD_36: "",
      COD_37: "",
      COD_39: "",
      COD_40: "",
      COD_47: "Face to Face",
      NUM_1: ""
    }
  }, null, 2),
  responseExample: JSON.stringify({
    TransactionStatus: {
      ResponseCode: "0",
      ResponseMessage: "Success",
      ExtendedErrorDetails: {
        messages: [
          {
            code: 0,
            message: null
          }
        ]
      },
      ValidationErrors: [null]
    },
    ErrorDescription: null
  }, null, 2),
  documentation: "CBR (Customer Banking Record) maintenance service that manages comprehensive customer information across CASA accounts, Term Deposits, Loans, and other banking products. Handles KYC details, risk assessment, portfolio management, and regulatory compliance data. Essential for maintaining up-to-date customer records and ensuring regulatory compliance.",
  tags: ["liabilities", "casa", "cbr", "customer-maintenance", "kyc", "risk-management"],
  timeout: 45000,
  requiresAuth: true,
  authType: "bearer",
  status: "active",
  isActive: true,
  version: "v1",
  isInternal: true,
  requiredPermissions: ["sandbox", "uat"],
  rateLimits: {
    sandbox: 30,
    uat: 150,
    production: 300
  }
};

async function seedCasaMiniStatementService() {
  console.log("🌱 Starting CASA Mini Statement Service seeding...");
  
  try {
    // Create the API endpoint
    const endpoint = await storage.createApiEndpoint(casaMiniStatementService);
    console.log(`✅ Created CASA Mini Statement Service API: ${endpoint.id}`);
    
    console.log("🎉 CASA Mini Statement Service seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding CASA Mini Statement Service:", error);
    throw error;
  }
}

// Run the seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCasaMiniStatementService()
    .then(() => {
      console.log("Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
}

export { seedCasaMiniStatementService };