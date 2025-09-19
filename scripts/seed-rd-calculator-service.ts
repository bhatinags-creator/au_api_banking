// Script to insert RD Calculator API into database
import { storage } from "../server/storage";

const liabilitiesCategoryId = "7f74500f-d4f2-45c4-ab6b-bc4e1df129ad";

const rdCalculatorService = {
  categoryId: liabilitiesCategoryId,
  category: "Liabilities",
  name: "RD Calculator Service",
  path: "/CBSRDCalculatorRESTService",
  method: "POST",
  description: "Recurring Deposit (RD) calculator service that computes maturity amounts, interest calculations, and term details based on installment amounts, tenure, and product specifications.",
  summary: "Calculate RD maturity and interest details",
  parameters: [
    {
      name: "RequestId",
      type: "string",
      maxLength: 32,
      required: true,
      description: "Unique reference number for the calculation request",
      example: "767565454534"
    },
    {
      name: "OriginatingChannel",
      type: "string",
      maxLength: 5,
      required: true,
      description: "Originating channel identifier",
      example: "AUAPI"
    },
    {
      name: "Term_Months",
      type: "string",
      maxLength: 30,
      required: true,
      description: "Term duration in months",
      example: "24"
    },
    {
      name: "TransactionBranch",
      type: "string",
      maxLength: 10,
      required: true,
      description: "Branch code where calculation is processed",
      example: "2011"
    },
    {
      name: "InstallmentAmount",
      type: "string",
      maxLength: 16,
      required: true,
      description: "Monthly installment amount for RD",
      example: "1000"
    },
    {
      name: "Term_Years",
      type: "string",
      maxLength: 20,
      required: true,
      description: "Term duration in years",
      example: "0"
    },
    {
      name: "RDProductCode",
      type: "string",
      maxLength: 30,
      required: true,
      description: "RD product code for interest rate determination",
      example: "20401"
    },
    {
      name: "DebitAccount",
      type: "string",
      required: false,
      description: "Debit account for installment payments",
      example: "2201210944285554"
    }
  ],
  headers: [
    { name: "Content-Type", value: "application/json" },
    { name: "Authorization", value: "Bearer {access_token}" }
  ],
  responses: [
    {
      status: "200",
      description: "RD calculation completed successfully",
      example: {
        TransactionStatus: {
          ResponseCode: "0",
          ResponseMessage: "Success",
          ExtendedErrorDetails: {
            messages: {
              code: "0",
              message: "Success"
            }
          }
        },
        RD_Cal_MaturityDetials: "Result",
        RatInt: "7",
        Amt_MaturityValue: "789065",
        Date_Maturity: "129785435"
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
      description: "Not Found - Product code or branch not found"
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
    RequestId: "767565454534",
    OriginatingChannel: "AUAPI",
    Term_Months: "24",
    TransactionBranch: "2011",
    InstallmentAmount: "1000",
    Term_Years: "0",
    RDProductCode: "20401",
    DebitAccount: "2201210944285554"
  }, null, 2),
  responseExample: JSON.stringify({
    TransactionStatus: {
      ResponseCode: "0",
      ResponseMessage: "Success",
      ExtendedErrorDetails: {
        messages: {
          code: "0",
          message: "Success"
        }
      }
    },
    RD_Cal_MaturityDetials: "Result",
    RatInt: "7",
    Amt_MaturityValue: "789065",
    Date_Maturity: "129785435"
  }, null, 2),
  documentation: "Comprehensive RD calculator service that helps customers and bank staff calculate recurring deposit maturity amounts, interest earnings, and tenure details. Supports various RD products with different interest rates and compounding frequencies. Essential for financial planning and customer advisory services.",
  tags: ["liabilities", "rd", "calculator", "maturity-calculation", "interest-calculation"],
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

async function seedRdCalculatorService() {
  console.log("🌱 Starting RD Calculator Service seeding...");
  
  try {
    // Create the API endpoint
    const endpoint = await storage.createApiEndpoint(rdCalculatorService);
    console.log(`✅ Created RD Calculator Service API: ${endpoint.id}`);
    
    console.log("🎉 RD Calculator Service seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding RD Calculator Service:", error);
    throw error;
  }
}

// Run the seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedRdCalculatorService()
    .then(() => {
      console.log("Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
}

export { seedRdCalculatorService };