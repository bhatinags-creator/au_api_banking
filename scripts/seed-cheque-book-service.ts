// Script to insert Cheque Book Request API into database
import { storage } from "../server/storage";

const liabilitiesCategoryId = "7f74500f-d4f2-45c4-ab6b-bc4e1df129ad";

const chequeBookService = {
  categoryId: liabilitiesCategoryId,
  category: "Liabilities",
  name: "Cheque Book Request Service",
  path: "/ChequeService/requestStopCheque",
  method: "POST",
  description: "Service to raise requests for cheque book issuance for CASA accounts. Supports multiple cheque books, customizable dispatch options, and branch-specific processing.",
  summary: "Request new cheque books for account holders",
  parameters: [
    {
      name: "RequestId",
      type: "string",
      maxLength: 32,
      required: true,
      description: "Unique reference number for the cheque book request",
      example: "CBR202501150001"
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
      name: "AccountNumber",
      type: "string",
      maxLength: 16,
      required: true,
      description: "CASA account number for which cheque book is requested",
      example: "1821201119736140"
    },
    {
      name: "DespatchBranch",
      type: "number",
      maxLength: 5,
      required: true,
      description: "Dispatch branch code for cheque book delivery",
      example: 2011
    },
    {
      name: "NoOfLeaves",
      type: "number",
      maxLength: 3,
      required: true,
      description: "Number of leaves per cheque book (typically 25, 50, or 100)",
      example: 25
    },
    {
      name: "NoOfChqBooks",
      type: "number",
      maxLength: 3,
      required: true,
      description: "Number of cheque books to be issued",
      example: 1
    },
    {
      name: "FlgDespatch",
      type: "string",
      maxLength: 1,
      required: true,
      description: "Dispatch flag - B: Send to branch, C: Send to customer",
      example: "C",
      enum: ["B", "C"]
    },
    {
      name: "OriginatingBranchCode",
      type: "number",
      maxLength: 5,
      required: true,
      description: "Originating branch code",
      example: 2011
    }
  ],
  headers: [
    { name: "Content-Type", value: "application/json" },
    { name: "Authorization", value: "Bearer {access_token}" }
  ],
  responses: [
    {
      status: "200",
      description: "Cheque book request processed successfully",
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
      description: "Not Found - Account not found"
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
    TransactionBranch: 2011,
    RequestId: "CBR202501150001",
    OriginatingChannel: "NTRNT",
    AccountNumber: "1821201119736140",
    DespatchBranch: 2011,
    FlgDespatch: "C",
    NoOfChqBooks: 1,
    NoOfLeaves: 25,
    OriginatingBranchCode: 2011
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
  documentation: "Comprehensive cheque book request service for CASA account holders. Enables customers to request new cheque books with customizable options including number of leaves, dispatch preferences (branch or customer address), and multiple book requests. Includes proper tracking and reference number generation for audit purposes.",
  tags: ["liabilities", "casa", "cheque-book", "account-services", "dispatch"],
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

async function seedChequeBookService() {
  console.log("🌱 Starting Cheque Book Service seeding...");
  
  try {
    // Create the API endpoint
    const endpoint = await storage.createApiEndpoint(chequeBookService);
    console.log(`✅ Created Cheque Book Service API: ${endpoint.id}`);
    
    console.log("🎉 Cheque Book Service seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding Cheque Book Service:", error);
    throw error;
  }
}

// Run the seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedChequeBookService()
    .then(() => {
      console.log("Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
}

export { seedChequeBookService };