// Script to insert ASBA Hold Release API into database
import { storage } from "../server/storage";

const liabilitiesCategoryId = "7f74500f-d4f2-45c4-ab6b-bc4e1df129ad";

const holdReleaseService = {
  categoryId: liabilitiesCategoryId,
  category: "Liabilities",
  name: "Hold Release Service", 
  path: "/ASBAmaintanService/HoldRelease",
  method: "POST",
  description: "ASBA hold release service used for releasing IPO hold amounts from customer accounts. Enables the release of previously blocked amounts after IPO allocation or application cancellation.",
  summary: "Release IPO hold amounts from customer accounts",
  parameters: [
    {
      name: "RequestId",
      type: "string",
      maxLength: 32,
      required: true,
      description: "Unique reference number for the hold release request",
      example: "458968575465"
    },
    {
      name: "OriginatingChannel",
      type: "string",
      maxLength: 5,
      required: true,
      description: "Application name or channel identifier",
      example: "ASBA"
    },
    {
      name: "ReferenceNumber",
      type: "string",
      maxLength: 30,
      required: true,
      description: "Reference number for tracking the release transaction",
      example: "REL20250904140545848593"
    },
    {
      name: "TransactionBranch",
      type: "string",
      maxLength: 10,
      required: true,
      description: "Branch code where transaction is processed",
      example: "2445"
    },
    {
      name: "AccountNumber",
      type: "string",
      maxLength: 16,
      required: true,
      description: "Account number from which hold amount will be released",
      example: "2211223144629231"
    },
    {
      name: "IPOreferenceNo",
      type: "string",
      maxLength: 20,
      required: true,
      description: "IPO reference number for tracking the original hold",
      example: "51701155830409c8a5b9"
    },
    {
      name: "UserReferenceNumber",
      type: "string",
      maxLength: 30,
      required: true,
      description: "User-defined reference number for tracking",
      example: "USER_REL_001"
    }
  ],
  headers: [
    { name: "Content-Type", value: "application/json" },
    { name: "Authorization", value: "Bearer {access_token}" }
  ],
  responses: [
    {
      status: "200",
      description: "Hold release processed successfully",
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
      description: "Not Found - Account or hold reference not found"
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
    ReferenceNumber: "REL20250904140545848593",
    TransactionBranch: "2445",
    RequestId: "458968575465",
    OriginatingChannel: "ASBA",
    AccountNumber: "2211223144629231",
    IPOreferenceNo: "51701155830409c8a5b9",
    UserReferenceNumber: "USER_REL_001"
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
  documentation: "ASBA hold release service that enables the release of previously blocked amounts from customer accounts. This API is typically used after IPO allocation processing, application cancellation, or when hold amounts need to be freed up. Ensures proper audit trail and account balance restoration.",
  tags: ["liabilities", "asba", "ipo", "hold-release", "unblock-amount"],
  timeout: 45000,
  requiresAuth: true,
  authType: "bearer",
  status: "active",
  isActive: true,
  version: "v1",
  isInternal: true,
  requiredPermissions: ["sandbox", "uat"],
  rateLimits: {
    sandbox: 15,
    uat: 75,
    production: 150
  }
};

async function seedHoldReleaseService() {
  console.log("🌱 Starting Hold Release Service seeding...");
  
  try {
    // Create the API endpoint
    const endpoint = await storage.createApiEndpoint(holdReleaseService);
    console.log(`✅ Created Hold Release Service API: ${endpoint.id}`);
    
    console.log("🎉 Hold Release Service seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding Hold Release Service:", error);
    throw error;
  }
}

// Run the seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedHoldReleaseService()
    .then(() => {
      console.log("Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
}

export { seedHoldReleaseService };