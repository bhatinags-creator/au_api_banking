// Script to insert Stop Cheque API into database
import { storage } from "../server/storage";

const liabilitiesCategoryId = "7f74500f-d4f2-45c4-ab6b-bc4e1df129ad";

const stopChequeService = {
  categoryId: liabilitiesCategoryId,
  category: "Liabilities",
  name: "Stop Cheque Service",
  path: "/ChequeService/requestStopCheque",
  method: "POST",
  description: "Service to stop cheques on CBS system based on cheque number and account number. Allows customers to request stop payment on issued cheques for security and fraud prevention.",
  summary: "Stop payment on issued cheques",
  parameters: [
    {
      name: "RequestId",
      type: "string",
      maxLength: 32,
      required: true,
      description: "Unique reference number for the stop cheque request",
      example: "STC202501150001"
    },
    {
      name: "OriginatingChannel",
      type: "string",
      maxLength: 5,
      required: true,
      description: "Application name or channel identifier",
      example: "NTRNT"
    },
    {
      name: "ReferenceNumber",
      type: "string",
      maxLength: 16,
      required: true,
      description: "Reference number for tracking",
      example: "REF123456789"
    },
    {
      name: "TransactionBranch",
      type: "string",
      maxLength: 30,
      required: true,
      description: "Branch code where transaction is processed",
      example: "2011"
    },
    {
      name: "AccountId",
      type: "string",
      maxLength: 16,
      required: true,
      description: "Account ID for which cheque stop is requested",
      example: "1821201119736140"
    },
    {
      name: "ChequeEndNumber",
      type: "string",
      maxLength: 36,
      required: true,
      description: "Ending cheque number in the range to be stopped",
      example: "123456"
    },
    {
      name: "ChequeStartNumber",
      type: "string",
      maxLength: 36,
      required: true,
      description: "Starting cheque number in the range to be stopped",
      example: "123456"
    },
    {
      name: "ChequeStatus",
      type: "string",
      maxLength: 1,
      required: true,
      description: "Cheque status code (S for Stop)",
      example: "S",
      enum: ["S", "A", "C"]
    },
    {
      name: "StopChequeAmount",
      type: "string",
      maxLength: 14,
      required: false,
      description: "Amount for which cheque is to be stopped",
      example: "1000.00"
    },
    {
      name: "StopChequeDate",
      type: "string",
      maxLength: 8,
      required: false,
      description: "Date of cheque stop request (YYYYMMDD)",
      example: "20250115"
    },
    {
      name: "StopChequeInstructionDate",
      type: "string",
      maxLength: 8,
      required: false,
      description: "Stop cheque instruction date (system date)",
      example: "20250115"
    },
    {
      name: "StopChequeReason",
      type: "string",
      maxLength: 45,
      required: true,
      description: "Reason description for stopping the cheque",
      example: "Lost cheque book"
    }
  ],
  headers: [
    { name: "Content-Type", value: "application/json" },
    { name: "Authorization", value: "Bearer {access_token}" }
  ],
  responses: [
    {
      status: "200",
      description: "Stop cheque request processed successfully",
      example: {
        TransactionStatus: {
          ResponseCode: "0",
          ResponseMessage: "Success",
          ExtendedErrorDetails: {
            messages: [
              {
                code: 0,
                message: "Success"
              }
            ]
          }
        }
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
      description: "Not Found - Account or cheque not found"
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
    ReferenceNumber: "REF123456789",
    TransactionBranch: "2011",
    RequestId: "STC202501150001",
    OriginatingChannel: "NTRNT",
    AccountId: "1821201119736140",
    ChequeEndNumber: "123456",
    ChequeStartNumber: "123456",
    ChequeStatus: "S",
    StopChequeAmount: "1000.00",
    StopChequeDate: "20250115",
    StopChequeInstructionDate: "20250115",
    StopChequeReason: "Lost cheque book"
  }, null, 2),
  responseExample: JSON.stringify({
    TransactionStatus: {
      ResponseCode: "0",
      ResponseMessage: "Success",
      ExtendedErrorDetails: {
        messages: [
          {
            code: 0,
            message: "Success"
          }
        ]
      }
    }
  }, null, 2),
  documentation: "Comprehensive stop cheque service that allows customers to request stop payment on issued cheques. Supports single cheque or range-based stop requests with proper reason codes and audit trail. Essential for fraud prevention and customer security. Includes validation for cheque numbers, amounts, and account ownership.",
  tags: ["liabilities", "casa", "stop-cheque", "fraud-prevention", "payment-control"],
  timeout: 45000,
  requiresAuth: true,
  authType: "bearer",
  status: "active",
  isActive: true,
  version: "v1",
  isInternal: true,
  requiredPermissions: ["sandbox", "uat"],
  rateLimits: {
    sandbox: 20,
    uat: 100,
    production: 200
  }
};

async function seedStopChequeService() {
  console.log("🌱 Starting Stop Cheque Service seeding...");
  
  try {
    // Create the API endpoint
    const endpoint = await storage.createApiEndpoint(stopChequeService);
    console.log(`✅ Created Stop Cheque Service API: ${endpoint.id}`);
    
    console.log("🎉 Stop Cheque Service seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding Stop Cheque Service:", error);
    throw error;
  }
}

// Run the seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedStopChequeService()
    .then(() => {
      console.log("Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
}

export { seedStopChequeService };