import { db } from '../server/db.js';
import { apiEndpoints } from '../shared/schema.js';
import { nanoid } from 'nanoid';

// Loans Category ID
const LOANS_CATEGORY_ID = 'faf2c6c8-4b0e-4fa7-94c8-f92527965e3e';

async function seedCollateralServices() {
  console.log('🏦 Seeding AU Bank Collateral Management APIs...');

  try {
    const collateralApis = [
      // 1. Collateral Dedupe Service API
      {
        id: 'collateral-dedupe-001',
        categoryId: LOANS_CATEGORY_ID,
        category: 'Loans',
        name: 'Collateral Dedupe Service',
        path: '/CollateralSearchRestServiceNewV1/CollDedupe',
        method: 'POST',
        description: 'Identifies and eliminates duplicate collateral records to maintain accuracy and integrity in collateral management. This API helps prevent duplicate collateral entries and ensures data consistency across loan accounts.',
        summary: 'Identify and eliminate duplicate collateral records',
        parameters: [
          {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "REF123456789012345678901234567890"},
          {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (5 characters max)", "example": "2011"},
          {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "REQ123456789012345678901234567890"},
          {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel/APP Name (5 characters max)", "example": "SFDC"},
          {"name": "CollateralType", "type": "string", "required": false, "description": "Type of collateral being checked", "example": "Vehicle"},
          {"name": "ChassisNumber", "type": "string", "required": false, "description": "Vehicle chassis number for automobile collateral", "example": "ABC123456789"},
          {"name": "EngineNumber", "type": "string", "required": false, "description": "Vehicle engine number for automobile collateral", "example": "ENG123456789"},
          {"name": "RegistrationNo", "type": "string", "required": false, "description": "Vehicle registration number", "example": "MH01AB1234"},
          {"name": "AccountDepositNumber", "type": "string", "required": false, "description": "Account or deposit number for financial collateral", "example": "12345678901234567890"},
          {"name": "AddressSearch", "type": "string", "required": false, "description": "Address search parameter for property collateral", "example": "123 Main Street Mumbai"},
          {"name": "InsurancePolicyNumber", "type": "string", "required": false, "description": "Insurance policy number", "example": "INS123456789"}
        ],
        headers: [
          {"name": "Content-Type", "value": "application/json", "required": true},
          {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
        ],
        responses: [
          {"status": 200, "description": "Success - Collateral dedupe check completed successfully"},
          {"status": 400, "description": "Bad Request - Invalid collateral parameters"},
          {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
          {"status": 404, "description": "Not Found - Collateral records not found"},
          {"status": 500, "description": "Internal Server Error - Something went wrong"}
        ],
        requestExample: JSON.stringify({
          "ReferenceNumber": "REF123456789012345678901234567890",
          "TransactionBranch": 100,
          "RequestId": "REQ123456789012345678901234567890",
          "OriginatingChannel": "SFDC",
          "CollateralDedupe": {
            "CollateralType": "Vehicle",
            "ChassisNumber": "ABC123456789",
            "EngineNumber": "ENG123456789",
            "RegistrationNo": "MH01AB1234",
            "AccountDepositNumber": "12345678901234567890",
            "AddressSearch": "123 Main Street Mumbai",
            "InsurancePolicyNumber": "INS123456789"
          }
        }),
        responseExample: JSON.stringify({
          "CollateralDetails": [
            {
              "Status": "0",
              "RepoDate": "2022-10-21",
              "Narration": "REPO WITHOUT RO"
            }
          ],
          "TransactionStatus": {
            "ResponseCode": "99",
            "ValidationErrors": [null],
            "ResponseMessage": "Failure",
            "ExtendedErrorDetails": {
              "messages": [
                {
                  "code": 99,
                  "message": "Invalid Input : Collateral type ."
                }
              ]
            }
          }
        }),
        documentation: 'Collateral Dedupe Service API - Identifies and eliminates duplicate collateral records across multiple parameters including chassis number, engine number, registration details, account numbers, address, and insurance policy numbers. Supports comprehensive deduplication logic for vehicles, financial instruments, and property collateral.',
        tags: ["Collateral", "Dedupe", "Validation", "Vehicle", "Property"],
        responseSchema: {
          "type": "object",
          "properties": {
            "CollateralDetails": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "Status": {"type": "string"},
                  "RepoDate": {"type": "string"},
                  "Narration": {"type": "string"}
                }
              }
            },
            "TransactionStatus": {
              "type": "object",
              "properties": {
                "ResponseCode": {"type": "string"},
                "ResponseMessage": {"type": "string"},
                "ValidationErrors": {"type": "array"},
                "ExtendedErrorDetails": {
                  "type": "object",
                  "properties": {
                    "messages": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "code": {"type": "number"},
                          "message": {"type": "string"}
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        rateLimits: {"sandbox": 100, "uat": 200, "production": 500},
        timeout: 30000,
        requiresAuth: true,
        authType: 'bearer',
        requiredPermissions: ["loans:collateral", "loans:read"],
        isActive: true,
        isInternal: true,
        status: 'active',
        version: 'v1'
      },

      // 2. Collateral Enquiry Service API
      {
        id: 'collateral-enquiry-002',
        categoryId: LOANS_CATEGORY_ID,
        category: 'Loans',
        name: 'Collateral Enquiry Service',
        path: '/CollateralSearchRestServiceNewV1/CollEnquiry',
        method: 'POST',
        description: 'Provides details of customer-linked collateral by fetching information such as collateral type, value, status, and associated loan accounts. This API enables comprehensive collateral portfolio viewing for loan management.',
        summary: 'Get detailed customer collateral information',
        parameters: [
          {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "98765678890"},
          {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (5 characters max)", "example": "2011"},
          {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "98767890"},
          {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel/APP Name (5 characters max)", "example": "SFDC"},
          {"name": "CustomerId", "type": "string", "required": true, "description": "Customer ID (8 characters max)", "example": "27570007"}
        ],
        headers: [
          {"name": "Content-Type", "value": "application/json", "required": true},
          {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
        ],
        responses: [
          {"status": 200, "description": "Success - Collateral details retrieved successfully"},
          {"status": 400, "description": "Bad Request - Invalid customer ID or parameters"},
          {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
          {"status": 404, "description": "Not Found - No collateral found for customer"},
          {"status": 500, "description": "Internal Server Error - Something went wrong"}
        ],
        requestExample: JSON.stringify({
          "RequestId": "98767890",
          "OriginatingChannel": "SFDC",
          "ReferenceNumber": "98765678890",
          "TransactionBranch": 2011,
          "CustomerId": "27570007"
        }),
        responseExample: JSON.stringify({
          "CollateralDetails": [
            {
              "Status": "0",
              "RepoDate": "2022-10-21",
              "Narration": "REPO WITHOUT RO"
            }
          ],
          "TransactionStatus": {
            "ResponseCode": "99",
            "ValidationErrors": [null],
            "ResponseMessage": "Failure",
            "ExtendedErrorDetails": {
              "messages": [
                {
                  "code": 99,
                  "message": "No collateral attached to linked accounts for customer."
                }
              ]
            }
          }
        }),
        documentation: 'Collateral Enquiry Service API - Fetches comprehensive collateral details for customers including collateral type, value, status, linked loan accounts, and security details. Provides complete collateral portfolio view for customer relationship management.',
        tags: ["Collateral", "Enquiry", "Customer", "Portfolio", "Security"],
        responseSchema: {
          "type": "object",
          "properties": {
            "CollateralDetails": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "Status": {"type": "string"},
                  "RepoDate": {"type": "string"},
                  "Narration": {"type": "string"}
                }
              }
            },
            "TransactionStatus": {
              "type": "object",
              "properties": {
                "ResponseCode": {"type": "string"},
                "ResponseMessage": {"type": "string"},
                "ValidationErrors": {"type": "array"},
                "ExtendedErrorDetails": {
                  "type": "object",
                  "properties": {
                    "messages": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "code": {"type": "number"},
                          "message": {"type": "string"}
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        rateLimits: {"sandbox": 200, "uat": 500, "production": 1000},
        timeout: 30000,
        requiresAuth: true,
        authType: 'bearer',
        requiredPermissions: ["loans:collateral", "loans:read"],
        isActive: true,
        isInternal: true,
        status: 'active',
        version: 'v1'
      },

      // 3. Collateral Linkage Modification Service API
      {
        id: 'collateral-linkage-modification-003',
        categoryId: LOANS_CATEGORY_ID,
        category: 'Loans',
        name: 'Collateral Linkage Modification Service',
        path: '/CollateralModificationRestServiceV1/LoanCollLinkMod',
        method: 'POST',
        description: 'Allows modification or update of existing collateral linkage details against a loan account, ensuring accurate mapping of security with the respective loan. This API supports dynamic collateral management operations.',
        summary: 'Modify collateral linkage to loan accounts',
        parameters: [
          {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "REF123456789012345678901234567890"},
          {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (5 characters max)", "example": "100"},
          {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "REQ123456789012345678901234567890"},
          {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel/APP Name (5 characters max)", "example": "SFDC"},
          {"name": "FlgMode", "type": "string", "required": false, "description": "Flag Mode for operation type", "example": "ADD"},
          {"name": "AccountID", "type": "string", "required": false, "description": "Loan Account ID to link collateral", "example": "9001020451074496"},
          {"name": "CollateralCode", "type": "string", "required": false, "description": "Collateral identification code", "example": "COLL001"},
          {"name": "CollateralId", "type": "string", "required": false, "description": "Unique collateral identifier", "example": "12345678"},
          {"name": "CollateralPriority", "type": "string", "required": false, "description": "Priority level of collateral (Primary/Secondary)", "example": "Primary"},
          {"name": "CollateralValue", "type": "string", "required": false, "description": "Current market value of collateral", "example": "5000000"},
          {"name": "TDAccountNumber", "type": "string", "required": false, "description": "Term Deposit account number if applicable", "example": "1234567890123456"},
          {"name": "RDAccountNumber", "type": "string", "required": false, "description": "Recurring Deposit account number if applicable", "example": "1234567890123457"},
          {"name": "DepositNumber", "type": "string", "required": false, "description": "General deposit number", "example": "DEP123456789"},
          {"name": "FlagDeduction", "type": "string", "required": false, "description": "Flag for deduction applicability", "example": "Y"},
          {"name": "ImpactofRateChange", "type": "string", "required": false, "description": "Impact assessment for rate changes", "example": "LOW"},
          {"name": "LinkTDForInterest", "type": "string", "required": false, "description": "Link TD for interest calculation", "example": "Y"},
          {"name": "PrimaryOrSecondaryCollateral", "type": "string", "required": false, "description": "Collateral classification", "example": "Primary"}
        ],
        headers: [
          {"name": "Content-Type", "value": "application/json", "required": true},
          {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
        ],
        responses: [
          {"status": 200, "description": "Success - Collateral linkage modified successfully"},
          {"status": 400, "description": "Bad Request - Invalid linkage parameters"},
          {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
          {"status": 404, "description": "Not Found - Collateral or account not found"},
          {"status": 500, "description": "Internal Server Error - Something went wrong"}
        ],
        requestExample: JSON.stringify({
          "ReferenceNumber": "REF123456789012345678901234567890",
          "TransactionBranch": 100,
          "ReportingParam": {
            "MISClass": "LOAN",
            "MISCode": "001"
          },
          "RequestId": "REQ123456789012345678901234567890",
          "OriginatingChannel": "SFDC",
          "FlgMode": "ADD",
          "AccountID": "9001020451074496",
          "CollateralCode": "COLL001",
          "CollateralId": "12345678",
          "CollateralPriority": "Primary",
          "CollateralValue": "5000000",
          "TDAccountNumber": "1234567890123456",
          "RDAccountNumber": "1234567890123457",
          "DepositNumber": "DEP123456789",
          "FlagDeduction": "Y",
          "ImpactofRateChange": "LOW",
          "LinkTDForInterest": "Y",
          "PrimaryOrSecondaryCollateral": "Primary"
        }),
        responseExample: JSON.stringify({
          "TransactionStatus": {
            "ResponseCode": "0",
            "ResponseMessage": "Success",
            "ExtendedErrorDetails": {
              "messages": [
                {"code": 0}
              ]
            }
          }
        }),
        documentation: 'Collateral Linkage Modification Service API - Enables dynamic modification of collateral linkage with loan accounts. Supports priority changes, value updates, deposit linkages, and comprehensive collateral portfolio management with flexible operation modes.',
        tags: ["Collateral", "Linkage", "Modification", "Account", "Priority"],
        responseSchema: {
          "type": "object",
          "properties": {
            "TransactionStatus": {
              "type": "object",
              "properties": {
                "ResponseCode": {"type": "string"},
                "ResponseMessage": {"type": "string"},
                "ExtendedErrorDetails": {
                  "type": "object",
                  "properties": {
                    "messages": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "code": {"type": "number"}
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        rateLimits: {"sandbox": 50, "uat": 100, "production": 300},
        timeout: 45000,
        requiresAuth: true,
        authType: 'bearer',
        requiredPermissions: ["loans:collateral", "loans:write"],
        isActive: true,
        isInternal: true,
        status: 'active',
        version: 'v1'
      }
    ];

    // Insert all collateral APIs
    for (const api of collateralApis) {
      console.log(`📝 Creating: ${api.name}`);
      await db.insert(apiEndpoints).values({
        ...api,
        parameters: JSON.stringify(api.parameters),
        headers: JSON.stringify(api.headers),
        responses: JSON.stringify(api.responses),
        tags: JSON.stringify(api.tags),
        responseSchema: JSON.stringify(api.responseSchema),
        rateLimits: JSON.stringify(api.rateLimits),
        requiredPermissions: JSON.stringify(api.requiredPermissions)
      });
    }

    console.log('✅ Collateral Management APIs seeded successfully!');
    console.log(`📊 Total APIs added: ${collateralApis.length}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error seeding collateral APIs:', error);
    throw error;
  }
}

// Execute the seeding function
seedCollateralServices()
  .then(() => {
    console.log('🎉 Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });