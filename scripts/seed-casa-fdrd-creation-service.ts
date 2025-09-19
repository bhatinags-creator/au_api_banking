// Script to insert CASA FD&RD Creation Service API into database
import { storage } from "../server/storage";

const liabilitiesCategoryId = "7f74500f-d4f2-45c4-ab6b-bc4e1df129ad";

const casaFdRdCreationService = {
  categoryId: liabilitiesCategoryId,
  category: "Liabilities",
  name: "CASA FD&RD Creation Service",
  path: "/CASAFDRDCreaeationServiceNewV1/Create",
  method: "POST",
  description: "Service to create CASA (Current Account Savings Account), Fixed Deposits (FD) and Recurring Deposits (RD) with nominee details and payment configurations",
  summary: "Create new FD/RD accounts with comprehensive setup options",
  parameters: [
    {
      name: "FDCreation",
      type: "object",
      required: true,
      description: "Main FD creation request object",
      properties: {
        referenceNumber: { type: "string", maxLength: 5, required: true, description: "Application reference number" },
        channel: { type: "string", maxLength: 16, required: true, description: "Channel identifier" },
        accountNo: { type: "string", maxLength: 30, required: true, description: "Account number" },
        acctCurrency: { type: "string", required: true, description: "Account currency code" },
        branchCode: { type: "string", required: true, description: "Branch code" },
        customerID: { type: "string", required: true, description: "Customer ID" },
        flgJointHolder: { type: "string", required: false, description: "Joint holder flag (Y/N)" },
        flgRestrictAcct: { type: "string", required: false, description: "Account restriction flag (Y/N)" },
        flgSCWaive: { type: "string", required: false, description: "Service charge waiver flag (Y/N)" },
        flgTransactionType: { type: "string", required: true, description: "Transaction type flag" },
        minorAcctStatus: { type: "string", required: false, description: "Minor account status" },
        productCode: { type: "string", required: true, description: "Product code for FD/RD" },
        customerAndRelation: {
          type: "array",
          required: true,
          description: "Customer and relation details",
          items: {
            customerId: { type: "string", required: true, description: "Customer ID" },
            customerName: { type: "string", required: true, description: "Customer name" },
            relation: { type: "string", required: true, description: "Relationship type" }
          }
        },
        accountNomineeDTO: {
          type: "object",
          required: false,
          description: "Nominee details",
          properties: {
            accountId: { type: "string", required: true, description: "Account ID" },
            nomineeName: { type: "string", required: false, description: "Nominee name" },
            dateOfBirth: { type: "string", required: true, description: "Nominee date of birth" },
            depositId: { type: "string", required: true, description: "Deposit ID" },
            sharePercentage: { type: "string", required: false, description: "Share percentage" },
            relationGuardian: { type: "string", required: false, description: "Guardian relationship" }
          }
        },
        xfaceTDAccountPayinRequestDTO: {
          type: "object",
          required: false,
          description: "TD Account payin details",
          properties: {
            depositAmount: { type: "string", required: false, description: "Deposit amount" },
            payoutType: { type: "string", required: false, description: "Payout type" },
            termMonths: { type: "string", required: false, description: "Term in months" },
            termDays: { type: "string", required: false, description: "Term in days" },
            fromAccountNo: { type: "string", required: false, description: "Source account number" },
            payoutAccountNo: { type: "string", required: true, description: "Payout account number" },
            intCompoundingFrequency: { type: "string", required: false, description: "Interest compounding frequency" },
            intPayoutFrequency: { type: "string", required: false, description: "Interest payout frequency" }
          }
        }
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
      description: "FD/RD created successfully",
      example: {
        FDCreationResponse: {
          TransactionStatus: {
            ResponseCode: "0",
            ResponseMessage: "Success",
            ExtendedErrorDetails: {
              messages: [{ code: "0", message: null }]
            }
          },
          CASAAccountReturn: {
            AccountNumber: "2503201141360993",
            TDAccounPayin: {
              DepositNo: "1",
              AccountTitle: "Account Holder Name",
              NetInterestRate: "7.25",
              PayinAmount: "1000.00",
              MaturityAmount: "1000.00",
              MaturityDate: "20260907"
            }
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
      status: "500",
      description: "Internal Server Error - Something went wrong"
    }
  ],
  requestExample: JSON.stringify({
    FDCreation: {
      flgTransactionType: "P",
      channel: "VDEC",
      valueDate: "20250907",
      flgRestrictAcct: "N",
      branchCode: "2011",
      flgSCWaive: "Y",
      productCode: "20302",
      acctCurrency: "1",
      referenceNumber: "442746636629",
      customerAndRelation: [
        {
          customerId: "39893699",
          customerName: "Account Holder",
          relation: "SOW"
        }
      ],
      flgJointHolder: "N",
      xfaceTDAccountPayinRequestDTO: {
        depositAmount: "1000.00",
        payoutType: "1",
        branchCodeGL: "2011",
        termDays: "0",
        intCompoundingFrequency: "0",
        intPayoutFrequency: "6",
        fromAccountNo: "160611048",
        branchCodeTD: "2011",
        termMonths: "12",
        referenceNoGL: "160611048",
        depositIntVariance: "0",
        payinNarration: "FD Funding-442746636629",
        payoutAccountNo: "1821201119736140"
      },
      customerID: "39893699"
    }
  }, null, 2),
  responseExample: JSON.stringify({
    FDCreationResponse: {
      TransactionStatus: {
        ResponseCode: "0",
        ResponseMessage: "Success",
        ExtendedErrorDetails: {
          messages: [{ code: "0", message: null }]
        }
      },
      CASAAccountReturn: {
        AccountNumber: "2503201141360993",
        TDAccounPayin: {
          DepositNo: "1",
          AccountTitle: "Account Holder Name",
          NetInterestRate: "7.25",
          PayinAmount: "1000.00",
          MaturityAmount: "1000.00",
          MaturityDate: "20260907"
        }
      }
    }
  }, null, 2),
  documentation: "Comprehensive API for creating Fixed Deposits (FD) and Recurring Deposits (RD) accounts under CASA services. Supports nominee configuration, payment setup, and term customization. Requires proper authentication and branch authorization.",
  tags: ["liabilities", "deposits", "casa", "fd", "rd", "account-creation"],
  timeout: 60000,
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

async function seedCasaFdRdCreationService() {
  console.log("🌱 Starting CASA FD&RD Creation Service seeding...");
  
  try {
    // Create the API endpoint
    const endpoint = await storage.createApiEndpoint(casaFdRdCreationService);
    console.log(`✅ Created CASA FD&RD Creation Service API: ${endpoint.id}`);
    
    console.log("🎉 CASA FD&RD Creation Service seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding CASA FD&RD Creation Service:", error);
    throw error;
  }
}

// Run the seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCasaFdRdCreationService()
    .then(() => {
      console.log("Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
}

export { seedCasaFdRdCreationService };