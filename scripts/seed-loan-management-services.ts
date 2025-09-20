import { db } from '../server/db.js';
import { apiEndpoints } from '../shared/schema.js';
import { nanoid } from 'nanoid';

// Loans Category ID
const LOANS_CATEGORY_ID = 'faf2c6c8-4b0e-4fa7-94c8-f92527965e3e';

async function seedLoanManagementServices() {
  console.log('🏦 Seeding AU Bank Loan Management APIs...');

  try {
    const loanManagementApis = [
      // 7. Get Disbursement Deduction Details Service API
      {
        id: 'get-disbursement-deduction-details-007',
        categoryId: LOANS_CATEGORY_ID,
        category: 'Loans',
        name: 'Get Disbursement Deduction Details Service',
        path: '/DisburseLoanService/getDisbursementDeductionDetails',
        method: 'POST',
        description: 'Fetches details of deductions made at the time of loan disbursement, including deduction type, amount, and applicable charges. This API provides comprehensive breakdown of all deductions applied during disbursement process.',
        summary: 'Get loan disbursement deduction details',
        parameters: [
          {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "987656789"},
          {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel (5 characters max)", "example": "SFDC"},
          {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "09876545678"},
          {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (10 characters max)", "example": "2011"},
          {"name": "AccountId", "type": "string", "required": true, "description": "Account Id (20 characters max)", "example": "9001020150815100"},
          {"name": "DisbursementDate", "type": "string", "required": true, "description": "Disbursement Date (10 characters max)", "example": "2025-08-23"},
          {"name": "DisbursementMode", "type": "string", "required": true, "description": "Disbursement Mode (2 characters max)", "example": "5"},
          {"name": "DisbursementAmount", "type": "string", "required": true, "description": "Disbursement Amount (10 characters max)", "example": "500000"},
          {"name": "LineNumber", "type": "string", "required": false, "description": "Line Number (10 characters max)", "example": "1"}
        ],
        headers: [
          {"name": "Content-Type", "value": "application/json", "required": true},
          {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
        ],
        responses: [
          {"status": 200, "description": "Success - Deduction details retrieved successfully"},
          {"status": 400, "description": "Bad Request - Invalid parameters"},
          {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
          {"status": 404, "description": "Not Found - Deduction details not found"},
          {"status": 500, "description": "Internal Server Error - Something went wrong"}
        ],
        requestExample: JSON.stringify({
          "AccountId": "9001020150815100",
          "RequestId": "987656789",
          "OriginatingChannel": "SFDC",
          "DisbursementDate": "2025-08-23",
          "ReferenceNumber": "09876545678",
          "TransactionBranch": 2011,
          "DisbursementMode": "5",
          "DisbursementAmount": 500000,
          "LineNumber": ""
        }),
        responseExample: JSON.stringify({
          "TransactionStatus": {
            "ResponseCode": "0",
            "ResponseMessage": "Success",
            "ExtendedErrorDetails": {
              "messages": [{"code": 0}]
            }
          },
          "TotalAmountDeducted": "10111.6",
          "TotalAmountDebited": "0",
          "TotalAmountBilled": "0",
          "DeductionDetails": {
            "SrlNumber": "1",
            "DeductionAmountInLocalCurrency": "6100.6",
            "IsWaived": "false",
            "CtrSrlDednNo": "1",
            "FlgDueOn": "1",
            "IsSCDeductionAmortised": "false",
            "ServiceChargeName": "Processing Fees Auto Loan (New)",
            "DeductionMode": "1",
            "ConversionRateTransactionCurrency": "1",
            "ConversionRateAccountCurrency": "1",
            "DeductionCode": "1042",
            "AccountCurrencyCode": "1",
            "TransactionCurrencyCode": "1",
            "LocalCurrencyCode": "1",
            "DeductionCurrencyCode": "1",
            "DeductionType": "0",
            "DeductionAmountInTransactionCurrency": "6100.6",
            "DeductionAmountInAccountCurrency": "6100.6"
          }
        }),
        documentation: 'Get Disbursement Deduction Details Service API - Provides comprehensive breakdown of all deductions applied during loan disbursement including processing fees, service charges, insurance premiums, and other applicable charges with detailed currency conversion information.',
        tags: ["Disbursement", "Deduction", "Details", "Charges", "Fees"],
        responseSchema: {
          "type": "object",
          "properties": {
            "TransactionStatus": {
              "type": "object",
              "properties": {
                "ResponseCode": {"type": "string"},
                "ResponseMessage": {"type": "string"}
              }
            },
            "TotalAmountDeducted": {"type": "string"},
            "TotalAmountDebited": {"type": "string"},
            "TotalAmountBilled": {"type": "string"},
            "DeductionDetails": {
              "type": "object",
              "properties": {
                "SrlNumber": {"type": "string"},
                "DeductionAmountInLocalCurrency": {"type": "string"},
                "IsWaived": {"type": "string"},
                "ServiceChargeName": {"type": "string"},
                "DeductionCode": {"type": "string"}
              }
            }
          }
        },
        rateLimits: {"sandbox": 200, "uat": 500, "production": 1000},
        timeout: 30000,
        requiresAuth: true,
        authType: 'bearer',
        requiredPermissions: ["loans:disbursement", "loans:read"],
        isActive: true,
        isInternal: true,
        status: 'active',
        version: 'v1'
      },

      // 8. Get Disbursement Stage API
      {
        id: 'get-disbursement-stage-008',
        categoryId: LOANS_CATEGORY_ID,
        category: 'Loans',
        name: 'Get Disbursement Stage API',
        path: '/DisburseLoanService/getDisbursementStage',
        method: 'POST',
        description: 'Provides the current stage/status of the loan disbursement process, helping track whether the disbursement is pending, in progress, or completed. This API offers detailed stage information with repayment terms and schedules.',
        summary: 'Get current disbursement stage and status',
        parameters: [
          {"name": "RequestId", "type": "string", "required": true, "description": "Unique Reference number (32 characters max)", "example": "1772837221623123"},
          {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Application Name (5 characters max)", "example": "LOS"},
          {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (20 characters max)", "example": "HFT16733170300315403"},
          {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (5 characters max)", "example": "9000"},
          {"name": "AccountId", "type": "string", "required": true, "description": "Loan Account Number (16 characters max)", "example": "9001070630342629"},
          {"name": "DefinitionDate", "type": "string", "required": true, "description": "Disbursement date (10 characters max)", "example": "2023-02-08"},
          {"name": "DisbursementAmount", "type": "string", "required": false, "description": "Loan Disbursement amount (15 characters max)", "example": "1000000"},
          {"name": "DebitTypeDeductionAmount", "type": "string", "required": false, "description": "Deduction amount to be deducted (15 characters max)", "example": "0"}
        ],
        headers: [
          {"name": "Content-Type", "value": "application/json", "required": true},
          {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
        ],
        responses: [
          {"status": 200, "description": "Success - Disbursement stage retrieved successfully"},
          {"status": 400, "description": "Bad Request - Invalid parameters"},
          {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
          {"status": 404, "description": "Not Found - Disbursement stage not found"},
          {"status": 500, "description": "Internal Server Error - Something went wrong"}
        ],
        requestExample: JSON.stringify({
          "AccountId": 9001070630342629,
          "RequestId": "1772837221623123",
          "OriginatingChannel": "LOS",
          "ReferenceNumber": "HFT16733170300315403",
          "ScheduleTypeCode": 1109,
          "TransactionBranch": 9000,
          "DefinitionDate": "2023-02-08",
          "DisbursementAmount": 1000000,
          "DebitTypeDeductionAmount": 0
        }),
        responseExample: JSON.stringify({
          "LoanRepaymentStageDetails": [
            {
              "StageNumber": "1",
              "PrincipalRepaymentFrequency": "0",
              "PrincipalAmountToRepay": 0,
              "CalendarPlan": "0",
              "StageName": "INTEREST ONLY INSTALLMENTS",
              "NumberOfPrincipalRepayments": "0",
              "FirstInterestCompoundingDate": "2099-01-01",
              "StageStartDate": "2023-02-08",
              "InterestInstallmentAmount": 0,
              "InstallmentRuleCode": "103",
              "InterestRuleCode": "101",
              "RestPeriodFrequency": "99",
              "InstallmentAmount": 0,
              "StageTermMonths": "0",
              "FirstPrincipalRepaymentDate": "1950-01-01",
              "InstallmentRuleName": "INTEREST ONLY INSTALLMENTS",
              "InterestCompoundingFrequency": "0",
              "FirstRestPeriodDate": "1950-01-01",
              "NumberOfInterestRepayments": "36",
              "InterestRepaymentFrequency": "1",
              "StageTermYears": "3",
              "FirstInterestRepaymentDate": "2023-03-08",
              "StageEndDate": "2026-02-08"
            }
          ],
          "TransactionStatus": {
            "ResponseCode": "0",
            "ResponseMessage": "Success",
            "ExtendedErrorDetails": {
              "messages": [{"code": 0}]
            }
          },
          "SessionId": 4079
        }),
        documentation: 'Get Disbursement Stage API - Tracks loan disbursement stages from initiation to completion with detailed repayment stage information, installment rules, interest calculations, and comprehensive stage lifecycle management.',
        tags: ["Disbursement", "Stage", "Status", "Tracking", "Repayment"],
        responseSchema: {
          "type": "object",
          "properties": {
            "LoanRepaymentStageDetails": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "StageNumber": {"type": "string"},
                  "StageName": {"type": "string"},
                  "StageStartDate": {"type": "string"},
                  "StageEndDate": {"type": "string"},
                  "InstallmentAmount": {"type": "number"},
                  "NumberOfPrincipalRepayments": {"type": "string"},
                  "NumberOfInterestRepayments": {"type": "string"},
                  "FirstPrincipalRepaymentDate": {"type": "string"},
                  "FirstInterestRepaymentDate": {"type": "string"}
                }
              }
            },
            "TransactionStatus": {
              "type": "object",
              "properties": {
                "ResponseCode": {"type": "string"},
                "ResponseMessage": {"type": "string"}
              }
            },
            "SessionId": {"type": "number"}
          }
        },
        rateLimits: {"sandbox": 200, "uat": 500, "production": 1000},
        timeout: 30000,
        requiresAuth: true,
        authType: 'bearer',
        requiredPermissions: ["loans:disbursement", "loans:read"],
        isActive: true,
        isInternal: true,
        status: 'active',
        version: 'v1'
      },

      // 9. Get Loan Account Statement Service API
      {
        id: 'get-loan-account-statement-009',
        categoryId: LOANS_CATEGORY_ID,
        category: 'Loans',
        name: 'Get Loan Account Statement Service',
        path: '/AssetAccountService/getLoanAccountStatement',
        method: 'POST',
        description: 'Fetches the statement of loan account on date range with comprehensive transaction details, payment history, interest calculations, and running balance information. This API provides detailed loan account activity for specified periods.',
        summary: 'Get loan account statement for date range',
        parameters: [
          {"name": "RequestId", "type": "string", "required": true, "description": "Unique Reference number (32 characters max)", "example": "1456787654345"},
          {"name": "Channel", "type": "string", "required": true, "description": "Application Name (3 characters max)", "example": "TGT"},
          {"name": "AccountID", "type": "string", "required": true, "description": "Loan Account Number (16 characters max)", "example": "9001030143360101"},
          {"name": "valueFromDate", "type": "string", "required": true, "description": "From value Date in 'yyyy-MM-dd' format (8 characters max)", "example": "20250401"},
          {"name": "valueToDate", "type": "string", "required": true, "description": "To Value date in 'yyyy-MM-dd' format (8 characters max)", "example": "20250613"},
          {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (10 characters max)", "example": "2011"},
          {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "987656789"}
        ],
        headers: [
          {"name": "Content-Type", "value": "application/json", "required": true},
          {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
        ],
        responses: [
          {"status": 200, "description": "Success - Loan account statement retrieved successfully"},
          {"status": 400, "description": "Bad Request - Invalid date range or parameters"},
          {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
          {"status": 404, "description": "Not Found - Account statement not found"},
          {"status": 500, "description": "Internal Server Error - Something went wrong"}
        ],
        requestExample: JSON.stringify({
          "AccountId": "9001030143360101",
          "ValueToDate": "20250613",
          "RequestId": "1456787654345",
          "OriginatingChannel": "TGT",
          "ReferenceNumber": "987656789",
          "TransactionBranch": 2011,
          "ValueFromDate": "20250401"
        }),
        responseExample: JSON.stringify({
          "AccountID": "9001030143360101",
          "TransactionStatus": {
            "ResponseCode": "0",
            "ResponseMessage": "Success",
            "ExtendedErrorDetails": {
              "messages": [{"code": 0}]
            }
          },
          "LoanAccountStatement": [
            {
              "Description": "REGULAR INTEREST",
              "FlgDrCr": "D",
              "Amount": 1333.00,
              "TxnDate": "2025-04-10",
              "ValueDate": "2025-04-10",
              "RunningBalance": 71236.35
            },
            {
              "Description": "Payment for Loan EMI Payment 2301720250047509-2301720250047509-Shrawan Ram Meghwal",
              "FlgDrCr": "C",
              "Amount": 17.00,
              "TxnDate": "2025-06-06",
              "ValueDate": "2025-06-06",
              "RunningBalance": 74097.35
            }
          ]
        }),
        documentation: 'Get Loan Account Statement Service API - Comprehensive loan account statement with transaction history, interest postings, EMI payments, collection charges, principal and interest breakdowns, and running balance calculations for specified date ranges.',
        tags: ["Loan", "Account", "Statement", "Transaction", "History"],
        responseSchema: {
          "type": "object",
          "properties": {
            "AccountID": {"type": "string"},
            "TransactionStatus": {
              "type": "object",
              "properties": {
                "ResponseCode": {"type": "string"},
                "ResponseMessage": {"type": "string"}
              }
            },
            "LoanAccountStatement": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "Description": {"type": "string"},
                  "FlgDrCr": {"type": "string"},
                  "Amount": {"type": "number"},
                  "TxnDate": {"type": "string"},
                  "ValueDate": {"type": "string"},
                  "RunningBalance": {"type": "number"}
                }
              }
            }
          }
        },
        rateLimits: {"sandbox": 200, "uat": 500, "production": 1000},
        timeout: 30000,
        requiresAuth: true,
        authType: 'bearer',
        requiredPermissions: ["loans:account", "loans:read"],
        isActive: true,
        isInternal: true,
        status: 'active',
        version: 'v1'
      },

      // 10. Get Loan Closure Details API
      {
        id: 'get-loan-closure-details-010',
        categoryId: LOANS_CATEGORY_ID,
        category: 'Loans',
        name: 'Get Loan Closure Details API',
        path: '/AssetAccountService/getLoanClosureDetails',
        method: 'POST',
        description: 'Provides complete information about the closure status of a loan account. It helps customers and systems verify whether a loan is fully paid, partially settled, or pending closure with detailed closure calculations.',
        summary: 'Get comprehensive loan closure details',
        parameters: [
          {"name": "AccountID", "type": "string", "required": true, "description": "Account ID (16 characters max)", "example": "231121212"},
          {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "231212"},
          {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel (5 characters max)", "example": "CRM"},
          {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "23222"},
          {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (10 characters max)", "example": "2011"},
          {"name": "PenaltyMethod", "type": "string", "required": false, "description": "Penalty Method (10 characters max)", "example": "AUTO"},
          {"name": "PenaltyAmount", "type": "string", "required": true, "description": "Penalty Amount (10 characters max)", "example": "1000.00"}
        ],
        headers: [
          {"name": "Content-Type", "value": "application/json", "required": true},
          {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
        ],
        responses: [
          {"status": 200, "description": "Success - Loan closure details retrieved successfully"},
          {"status": 400, "description": "Bad Request - Invalid penalty method or parameters"},
          {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
          {"status": 404, "description": "Not Found - Loan account not found"},
          {"status": 500, "description": "Internal Server Error - Something went wrong"}
        ],
        requestExample: JSON.stringify({
          "ReferenceNumber": "23222",
          "TransactionBranch": 2011,
          "RequestId": "231212",
          "OriginatingChannel": "CRM",
          "AccountId": "231121212",
          "PenaltyMethod": "",
          "PenaltyAmount": 1000.00
        }),
        responseExample: JSON.stringify({
          "TransactionStatus": {
            "ResponseCode": "99",
            "ResponseMessage": "Failure",
            "ExtendedErrorDetails": {
              "messages": [
                {
                  "code": 99,
                  "message": " Invalid Penalty method"
                }
              ]
            }
          },
          "ErrorCode": "91783"
        }),
        documentation: 'Get Loan Closure Details API - Comprehensive loan closure information including outstanding balance, penalty calculations, closure charges, settlement amounts, and complete closure requirements for loan account closure processing.',
        tags: ["Loan", "Closure", "Settlement", "Outstanding", "Penalty"],
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
                          "code": {"type": "number"},
                          "message": {"type": "string"}
                        }
                      }
                    }
                  }
                }
              }
            },
            "ErrorCode": {"type": "string"}
          }
        },
        rateLimits: {"sandbox": 100, "uat": 200, "production": 500},
        timeout: 30000,
        requiresAuth: true,
        authType: 'bearer',
        requiredPermissions: ["loans:closure", "loans:read"],
        isActive: true,
        isInternal: true,
        status: 'active',
        version: 'v1'
      },

      // 11. Get Loan Disbursement Details Service API
      {
        id: 'get-loan-disbursement-details-011',
        categoryId: LOANS_CATEGORY_ID,
        category: 'Loans',
        name: 'Get Loan Disbursement Details Service',
        path: '/DisburseLoanService/getLoanDisbursementDetails',
        method: 'POST',
        description: 'Provides complete information about the loan disbursement, including disbursed amount, disbursement date, payment mode, bank details, and transaction references. This API offers comprehensive disbursement tracking and verification.',
        summary: 'Get complete loan disbursement information',
        parameters: [
          {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "987651167890"},
          {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel (5 characters max)", "example": "HFT"},
          {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "8761567819"},
          {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (10 characters max)", "example": "2011"},
          {"name": "AccountId", "type": "string", "required": true, "description": "Account Id (20 characters max)", "example": "9001070849522150"}
        ],
        headers: [
          {"name": "Content-Type", "value": "application/json", "required": true},
          {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
        ],
        responses: [
          {"status": 200, "description": "Success - Loan disbursement details retrieved successfully"},
          {"status": 400, "description": "Bad Request - Invalid parameters"},
          {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
          {"status": 404, "description": "Not Found - Disbursement details not found"},
          {"status": 500, "description": "Internal Server Error - Something went wrong"}
        ],
        requestExample: JSON.stringify({
          "AccountId": "9001070849522150",
          "RequestId": "987651167890",
          "OriginatingChannel": "HFT",
          "ReferenceNumber": "8761567819",
          "TransactionBranch": 2011
        }),
        responseExample: JSON.stringify({
          "AccountTerm": 0,
          "AccountBranchCode": 0,
          "AccountCurrency": 0,
          "ScheduleDrawnOn": 0,
          "AccountScheduleCode": 0,
          "TransactionStatus": {
            "ResponseCode": "99",
            "ResponseMessage": "Failure",
            "ExtendedErrorDetails": {
              "messages": [
                {
                  "code": 99,
                  "message": "Multiple Disbursements cannot be done on the same day."
                }
              ]
            }
          },
          "AccountProduct": 0
        }),
        documentation: 'Get Loan Disbursement Details Service API - Complete disbursement information including account details, schedule codes, currency information, disbursement tracking, and comprehensive transaction verification with detailed error handling.',
        tags: ["Loan", "Disbursement", "Details", "Transaction", "Tracking"],
        responseSchema: {
          "type": "object",
          "properties": {
            "AccountTerm": {"type": "number"},
            "AccountBranchCode": {"type": "number"},
            "AccountCurrency": {"type": "number"},
            "ScheduleDrawnOn": {"type": "number"},
            "AccountScheduleCode": {"type": "number"},
            "AccountProduct": {"type": "number"},
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
        requiredPermissions: ["loans:disbursement", "loans:read"],
        isActive: true,
        isInternal: true,
        status: 'active',
        version: 'v1'
      },

      // 12. Collateral Modification Service API  
      {
        id: 'collateral-modification-012',
        categoryId: LOANS_CATEGORY_ID,
        category: 'Loans',
        name: 'Collateral Modification Service',
        path: '/CollateralModificationRestServiceV1/CollMod',
        method: 'POST',
        description: 'Provides functionality to update or modify existing collateral details linked to a loan or customer account. This API supports comprehensive collateral management including automobile, property, and financial instrument modifications.',
        summary: 'Update and modify existing collateral details',
        parameters: [
          {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "REF123456789012345678901234567890"},
          {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (5 characters max)", "example": "2011"},
          {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "REQ123456789012345678901234567890"},
          {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel/APP Name (5 characters max)", "example": "SFDC"},
          {"name": "ExternalLocalDateText", "type": "string", "required": false, "description": "External Local Date Text", "example": "2024-12-20"},
          {"name": "ExternalTaskCode", "type": "string", "required": false, "description": "External Task Code", "example": "TASK001"},
          {"name": "ValidationFlag", "type": "string", "required": false, "description": "Validation Flag", "example": "Y"},
          {"name": "CollateralCurrency", "type": "string", "required": false, "description": "Collateral Currency", "example": "INR"},
          {"name": "CollateralId", "type": "string", "required": false, "description": "Collateral Id", "example": "COLL123456"},
          {"name": "CollateralCode", "type": "string", "required": false, "description": "Collateral Code", "example": "CC001"},
          {"name": "DocumentCode", "type": "string", "required": false, "description": "Document Code", "example": "DOC001"},
          {"name": "HomeBranch", "type": "string", "required": false, "description": "Home Branch", "example": "2011"},
          {"name": "SubsidyFixedRate", "type": "string", "required": false, "description": "Subsidy Fixed Rate", "example": "2.5"},
          {"name": "ChassisNumber", "type": "string", "required": false, "description": "Vehicle Chassis Number", "example": "ABC123456789DEF"},
          {"name": "EngineNumber", "type": "string", "required": false, "description": "Vehicle Engine Number", "example": "ENG123456789"},
          {"name": "RegistrationNumber", "type": "string", "required": false, "description": "Vehicle Registration Number", "example": "MH01AB1234"},
          {"name": "ModelName", "type": "string", "required": false, "description": "Vehicle Model Name", "example": "Swift VDI"},
          {"name": "ManufactureYearMonth", "type": "string", "required": false, "description": "Manufacture Year Month", "example": "2023-01"},
          {"name": "AutomobileDescription1", "type": "string", "required": false, "description": "Automobile Description 1", "example": "Maruti Suzuki Swift"},
          {"name": "AutomobileDescription2", "type": "string", "required": false, "description": "Automobile Description 2", "example": "VDI Variant"},
          {"name": "InvoiceNumber", "type": "string", "required": false, "description": "Vehicle Invoice Number", "example": "INV123456789"},
          {"name": "VehicleVariant", "type": "string", "required": false, "description": "Vehicle Variant", "example": "VDI"},
          {"name": "OwnershipOnRc", "type": "string", "required": false, "description": "Ownership On RC", "example": "HYPOTHECATION"},
          {"name": "HypothecationOnRc", "type": "string", "required": false, "description": "Hypothecation On RC", "example": "AU SMALL FINANCE BANK"},
          {"name": "FinalRcStatus", "type": "string", "required": false, "description": "Final RC Status", "example": "RECEIVED"}
        ],
        headers: [
          {"name": "Content-Type", "value": "application/json", "required": true},
          {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
        ],
        responses: [
          {"status": 200, "description": "Success - Collateral modified successfully"},
          {"status": 400, "description": "Bad Request - Invalid modification parameters"},
          {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
          {"status": 404, "description": "Not Found - Collateral not found"},
          {"status": 500, "description": "Internal Server Error - Something went wrong"}
        ],
        requestExample: JSON.stringify({
          "ReferenceNumber": "REF123456789012345678901234567890",
          "TransactionBranch": "2011",
          "RequestId": "REQ123456789012345678901234567890",
          "OriginatingChannel": "SFDC",
          "CollateralId": "COLL123456",
          "CollateralCode": "CC001",
          "CollateralCurrency": "INR",
          "AutomobileCollModDetails": {
            "ChassisNumber": "ABC123456789DEF",
            "EngineNumber": "ENG123456789",
            "RegistrationNumber": "MH01AB1234",
            "ModelName": "Swift VDI",
            "ManufactureYearMonth": "2023-01",
            "AutomobileDescription1": "Maruti Suzuki Swift",
            "AutomobileDescription2": "VDI Variant",
            "InvoiceNumber": "INV123456789",
            "VehicleVariant": "VDI",
            "OwnershipOnRc": "HYPOTHECATION",
            "HypothecationOnRc": "AU SMALL FINANCE BANK",
            "FinalRcStatus": "RECEIVED"
          }
        }),
        responseExample: JSON.stringify({
          "TransactionStatus": {
            "ResponseCode": "0",
            "ResponseMessage": "Success",
            "ExtendedErrorDetails": {
              "messages": [{"code": 0}]
            }
          }
        }),
        documentation: 'Collateral Modification Service API - Comprehensive collateral modification supporting automobile details, property information, financial instruments, document management, and complete collateral lifecycle management with detailed validation.',
        tags: ["Collateral", "Modification", "Automobile", "Property", "Update"],
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

    // Insert all loan management APIs
    for (const api of loanManagementApis) {
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

    console.log('✅ Loan Management APIs seeded successfully!');
    console.log(`📊 Total APIs added: ${loanManagementApis.length}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error seeding loan management APIs:', error);
    throw error;
  }
}

// Execute the seeding function
seedLoanManagementServices()
  .then(() => {
    console.log('🎉 Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });