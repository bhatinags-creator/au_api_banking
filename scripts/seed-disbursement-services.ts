import { db } from '../server/db.js';
import { apiEndpoints } from '../shared/schema.js';
import { nanoid } from 'nanoid';

// Loans Category ID
const LOANS_CATEGORY_ID = 'faf2c6c8-4b0e-4fa7-94c8-f92527965e3e';

async function seedDisbursementServices() {
  console.log('🏦 Seeding AU Bank Loan Disbursement APIs...');

  try {
    const disbursementApis = [
      // 4. Disburse Loan Calculate EMI Service API
      {
        id: 'disburse-loan-cal-emi-004',
        categoryId: LOANS_CATEGORY_ID,
        category: 'Loans',
        name: 'Disburse Loan Calculate EMI Service',
        path: '/DisburseLoanCalEMIServiceV1/disburseLoan',
        method: 'POST',
        description: 'Calculates the Equated Monthly Installment (EMI) for a loan at the time of disbursement based on loan amount, interest rate, and tenure. This API provides accurate EMI calculations considering various parameters like subsidy, margin codes, and stage configurations.',
        summary: 'Calculate EMI for loan disbursement',
        parameters: [
          {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "REF123456789012345678901234567890"},
          {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (5 characters max)", "example": "2011"},
          {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "REQ123456789012345678901234567890"},
          {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel/APP Name (5 characters max)", "example": "SFDC"},
          {"name": "PremiumAmount", "type": "string", "required": false, "description": "Premium Amount (10 characters max)", "example": "5000"},
          {"name": "TermMonths", "type": "string", "required": true, "description": "Term in Months (10 characters max)", "example": "60"},
          {"name": "RateChartCode", "type": "string", "required": true, "description": "Rate Chart Code (16 characters max)", "example": "RATE001"},
          {"name": "SubsidyMarginCode", "type": "string", "required": false, "description": "Subsidy Margin Code (10 characters max)", "example": "SUB001"},
          {"name": "ScheduleTypeCode", "type": "string", "required": true, "description": "Schedule Type Code (16 characters max)", "example": "SCH001"},
          {"name": "AccountVarianceRate", "type": "string", "required": true, "description": "Account Variance Rate (10 characters max)", "example": "12.5"},
          {"name": "VariableMarginCode", "type": "string", "required": false, "description": "Variable Margin Code (10 characters max)", "example": "VAR001"},
          {"name": "SubsidyType", "type": "string", "required": false, "description": "Subsidy Type (10 characters max)", "example": "GOVT"},
          {"name": "SubsidyFixedRate", "type": "string", "required": false, "description": "Subsidy Fixed Rate (10 characters max)", "example": "2.5"},
          {"name": "SubsidyExpiryDate", "type": "string", "required": false, "description": "Subsidy Expiry Date (10 characters max)", "example": "2025-12-31"},
          {"name": "SanctionedAmount", "type": "string", "required": true, "description": "Sanctioned Loan Amount (10 characters max)", "example": "1000000"},
          {"name": "SubsidyStartDate", "type": "string", "required": false, "description": "Subsidy Start Date (10 characters max)", "example": "2024-01-01"},
          {"name": "ProductCode", "type": "string", "required": true, "description": "Product Code (10 characters max)", "example": "HLOAN"},
          {"name": "GenerationDate", "type": "string", "required": true, "description": "EMI Generation Date (10 characters max)", "example": "2024-12-20"},
          {"name": "InterestVarianceType", "type": "string", "required": true, "description": "Interest Variance Type (2 characters max)", "example": "01"},
          {"name": "StageNumber", "type": "string", "required": true, "description": "Stage Number (2 characters max)", "example": "01"},
          {"name": "NumberOfPrincipalRepayments", "type": "string", "required": true, "description": "Number Of Principal Repayments (10 characters max)", "example": "60"},
          {"name": "InterestRepaymentFrequency", "type": "string", "required": true, "description": "Interest Repayment Frequency (10 characters max)", "example": "MONTHLY"},
          {"name": "FirstInterestRepaymentDate", "type": "string", "required": true, "description": "First Interest Repayment Date (10 characters max)", "example": "2025-01-10"},
          {"name": "FirstPrincipalRepaymentDate", "type": "string", "required": true, "description": "First Principal Repayment Date (10 characters max)", "example": "2025-01-10"},
          {"name": "FixedMarginCode", "type": "string", "required": true, "description": "Fixed Margin Code (2 characters max)", "example": "01"},
          {"name": "SubsidyPercentShared", "type": "string", "required": true, "description": "Subsidy Percent Shared (2 characters max)", "example": "50"}
        ],
        headers: [
          {"name": "Content-Type", "value": "application/json", "required": true},
          {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
        ],
        responses: [
          {"status": 200, "description": "Success - EMI calculated successfully"},
          {"status": 400, "description": "Bad Request - Invalid calculation parameters"},
          {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
          {"status": 500, "description": "Internal Server Error - EMI calculation failed"}
        ],
        requestExample: JSON.stringify({
          "ReferenceNumber": "REF123456789012345678901234567890",
          "TransactionBranch": "2011",
          "RequestId": "REQ123456789012345678901234567890",
          "OriginatingChannel": "SFDC",
          "TermMonths": "60",
          "RateChartCode": "RATE001",
          "ScheduleTypeCode": "SCH001",
          "AccountVarianceRate": "12.5",
          "SanctionedAmount": "1000000",
          "ProductCode": "HLOAN",
          "GenerationDate": "2024-12-20",
          "InterestVarianceType": "01",
          "StageNumber": "01",
          "NumberOfPrincipalRepayments": "60",
          "InterestRepaymentFrequency": "MONTHLY",
          "FirstInterestRepaymentDate": "2025-01-10",
          "FirstPrincipalRepaymentDate": "2025-01-10",
          "FixedMarginCode": "01",
          "SubsidyPercentShared": "50"
        }),
        responseExample: JSON.stringify({
          "TransactionStatus": {
            "ResponseCode": "0",
            "ResponseMessage": "Success",
            "ExtendedErrorDetails": {
              "messages": [{"code": 0}]
            }
          },
          "EMIDetails": {
            "EMIAmount": "18534.37",
            "TotalInterest": "112062.20",
            "TotalAmount": "1112062.20",
            "CalculationDate": "2024-12-20"
          }
        }),
        documentation: 'Disburse Loan Calculate EMI Service API - Comprehensive EMI calculation engine supporting multiple loan products, subsidy structures, variable rates, stage-based calculations, and flexible repayment schedules with accurate interest computations.',
        tags: ["Disbursement", "EMI", "Calculation", "Interest", "Loan"],
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
            "EMIDetails": {
              "type": "object",
              "properties": {
                "EMIAmount": {"type": "string"},
                "TotalInterest": {"type": "string"},
                "TotalAmount": {"type": "string"},
                "CalculationDate": {"type": "string"}
              }
            }
          }
        },
        rateLimits: {"sandbox": 100, "uat": 200, "production": 500},
        timeout: 30000,
        requiresAuth: true,
        authType: 'bearer',
        requiredPermissions: ["loans:disbursement", "loans:read"],
        isActive: true,
        isInternal: true,
        status: 'active',
        version: 'v1'
      },

      // 5. Disburse Loan Service API
      {
        id: 'disburse-loan-005',
        categoryId: LOANS_CATEGORY_ID,
        category: 'Loans',
        name: 'Disburse Loan Service',
        path: '/DisburseLoanService/disburseLoan',
        method: 'POST',
        description: 'Initiates and processes the loan disbursement to the borrower\'s account as per approved terms. This API handles comprehensive disbursement operations including mode selection, deduction processing, and transaction execution.',
        summary: 'Initiate and process loan disbursement',
        parameters: [
          {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "REF123456789012345678901234567890"},
          {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (5 characters max)", "example": "2011"},
          {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "REQ123456789012345678901234567890"},
          {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel/APP Name (5 characters max)", "example": "SFDC"},
          {"name": "UserId", "type": "string", "required": true, "description": "User ID initiating disbursement (10 characters max)", "example": "USER001"},
          {"name": "AccountId", "type": "string", "required": true, "description": "Loan Account ID (16 characters max)", "example": "9001020451074496"},
          {"name": "DisbursementMode", "type": "string", "required": true, "description": "Disbursement Mode (10 characters max)", "example": "NEFT"},
          {"name": "FromAccountNo", "type": "string", "required": true, "description": "Source Account Number (16 characters max)", "example": "1234567890123456"},
          {"name": "BeneficiaryName", "type": "string", "required": false, "description": "Beneficiary Name (10 characters max)", "example": "John Doe"},
          {"name": "BankCode", "type": "string", "required": false, "description": "Beneficiary Bank Code (10 characters max)", "example": "AUBL0000001"},
          {"name": "UserReferenceNumber", "type": "string", "required": true, "description": "User Reference Number (10 characters max)", "example": "URN001"},
          {"name": "SessionId", "type": "string", "required": true, "description": "Session ID", "example": "SESSION123"},
          {"name": "DisbursementDate", "type": "string", "required": true, "description": "Disbursement Date (10 characters max)", "example": "2024-12-20"},
          {"name": "DisbursementTransactionAmount", "type": "string", "required": true, "description": "Disbursement Transaction Amount (10 characters max)", "example": "1000000"},
          {"name": "ScheduleCode", "type": "string", "required": true, "description": "Schedule Code (10 characters max)", "example": "SCH001"},
          {"name": "ArrearsToBeCapitalized", "type": "string", "required": true, "description": "Arrears To Be Capitalized (10 characters max)", "example": "0"},
          {"name": "DeductTypeDeductionAmount", "type": "string", "required": true, "description": "Deduct Type Deduction Amount (10 characters max)", "example": "50000"}
        ],
        headers: [
          {"name": "Content-Type", "value": "application/json", "required": true},
          {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
        ],
        responses: [
          {"status": 200, "description": "Success - Loan disbursed successfully"},
          {"status": 400, "description": "Bad Request - Invalid disbursement parameters"},
          {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
          {"status": 500, "description": "Internal Server Error - Disbursement processing failed"}
        ],
        requestExample: JSON.stringify({
          "ReferenceNumber": "REF123456789012345678901234567890",
          "TransactionBranch": "2011",
          "RequestId": "REQ123456789012345678901234567890",
          "OriginatingChannel": "SFDC",
          "BranchDisbursementDetail": {
            "UserId": "USER001",
            "AccountId": "9001020451074496",
            "DisbursementMode": "NEFT",
            "FromAccountNo": "1234567890123456",
            "BeneficiaryName": "John Doe",
            "BankCode": "AUBL0000001",
            "UserReferenceNumber": "URN001"
          },
          "HostDisbursementDetail": {
            "AccountId": "9001020451074496",
            "SessionId": "SESSION123",
            "DisbursementDate": "2024-12-20",
            "DisbursementTransactionAmount": "1000000",
            "ScheduleCode": "SCH001",
            "ArrearsToBeCapitalized": "0",
            "DeductTypeDeductionAmount": "50000"
          }
        }),
        responseExample: JSON.stringify({
          "TransactionStatus": {
            "ResponseCode": "0",
            "ResponseMessage": "Success",
            "ExtendedErrorDetails": {
              "messages": [{"code": 0}]
            }
          },
          "DisbursementDetails": {
            "TransactionReference": "TXN123456789",
            "DisbursementAmount": "950000",
            "DeductionAmount": "50000",
            "NetAmount": "950000",
            "DisbursementDate": "2024-12-20"
          }
        }),
        documentation: 'Disburse Loan Service API - Complete loan disbursement processing with multiple disbursement modes (NEFT, RTGS, Cheque), comprehensive deduction handling, beneficiary management, and real-time transaction processing with detailed audit trails.',
        tags: ["Disbursement", "Loan", "Transaction", "NEFT", "Processing"],
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
            "DisbursementDetails": {
              "type": "object",
              "properties": {
                "TransactionReference": {"type": "string"},
                "DisbursementAmount": {"type": "string"},
                "DeductionAmount": {"type": "string"},
                "NetAmount": {"type": "string"},
                "DisbursementDate": {"type": "string"}
              }
            }
          }
        },
        rateLimits: {"sandbox": 50, "uat": 100, "production": 300},
        timeout: 60000,
        requiresAuth: true,
        authType: 'bearer',
        requiredPermissions: ["loans:disbursement", "loans:write"],
        isActive: true,
        isInternal: true,
        status: 'active',
        version: 'v1'
      },

      // 6. Generate Disbursement Schedule Service API
      {
        id: 'generate-disbursement-schedule-006',
        categoryId: LOANS_CATEGORY_ID,
        category: 'Loans',
        name: 'Generate Disbursement Schedule Service',
        path: '/DisburseLoanService/generateDisbursementSchedule',
        method: 'POST',
        description: 'Generates the loan disbursement schedule with details of installment amounts, dates, and payment stages. This API creates comprehensive repayment schedules considering various loan parameters and stage configurations.',
        summary: 'Generate loan disbursement schedule',
        parameters: [
          {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "765456789"},
          {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (5 characters max)", "example": "2011"},
          {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "9876546789"},
          {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel/APP Name (5 characters max)", "example": "SFDC"},
          {"name": "SessionId", "type": "string", "required": true, "description": "Session ID (10 characters max)", "example": "124993"},
          {"name": "AccountId", "type": "string", "required": true, "description": "Loan Account ID (16 characters max)", "example": "9001020451074496"},
          {"name": "DisbursementDate", "type": "string", "required": true, "description": "Disbursement Date (10 characters max)", "example": "2025-09-02"},
          {"name": "StageNumber", "type": "string", "required": true, "description": "Stage Number (2 characters max)", "example": "1"},
          {"name": "NumberOfPrincipalRepayments", "type": "string", "required": true, "description": "Number Of Principal Repayments (10 characters max)", "example": "60"},
          {"name": "NumberOfInterestRepayments", "type": "string", "required": false, "description": "Number Of Interest Repayments (10 characters max)", "example": "60"},
          {"name": "PrincipalAmountToRepay", "type": "string", "required": false, "description": "Principal Amount To Repay (10 characters max)", "example": "1000000"},
          {"name": "InstallmentAmount", "type": "string", "required": false, "description": "Installment Amount (10 characters max)", "example": "18534"},
          {"name": "PrincipalRepaymentFrequency", "type": "string", "required": false, "description": "Principal Repayment Frequency (10 characters max)", "example": "MONTHLY"},
          {"name": "InterestRepaymentFrequency", "type": "string", "required": false, "description": "Interest Repayment Frequency (10 characters max)", "example": "MONTHLY"},
          {"name": "InterestCompoundingFrequency", "type": "string", "required": false, "description": "Interest Compounding Frequency (10 characters max)", "example": "MONTHLY"},
          {"name": "FirstPrincipalRepaymentDate", "type": "string", "required": true, "description": "First Principal Repayment Date (10 characters max)", "example": "2025-10-10"},
          {"name": "FirstInterestRepaymentDate", "type": "string", "required": true, "description": "First Interest Repayment Date (10 characters max)", "example": "2025-10-10"}
        ],
        headers: [
          {"name": "Content-Type", "value": "application/json", "required": true},
          {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
        ],
        responses: [
          {"status": 200, "description": "Success - Disbursement schedule generated successfully"},
          {"status": 400, "description": "Bad Request - Invalid schedule parameters"},
          {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
          {"status": 500, "description": "Internal Server Error - Schedule generation failed"}
        ],
        requestExample: JSON.stringify({
          "ReferenceNumber": "765456789",
          "TransactionBranch": 2011,
          "RequestId": "9876546789",
          "OriginatingChannel": "SFDC",
          "AccountId": "9001020451074496",
          "SessionId": "124993",
          "DisbursementDate": "2025-09-02",
          "UserModifiedStageParameter": [{
            "StageNumber": 1,
            "NumberOfPrincipalRepayments": 60,
            "FirstPrincipalRepaymentDate": "2025-10-10",
            "FirstInterestRepaymentDate": "2025-10-10"
          }]
        }),
        responseExample: JSON.stringify({
          "TransactionStatus": {
            "ResponseCode": "0",
            "ResponseMessage": "Success",
            "ExtendedErrorDetails": {
              "messages": [{"code": 0}]
            }
          },
          "ScheduleDetails": {
            "SessionId": "72493",
            "StageNumber": "1",
            "InstallmentCounter": "1",
            "InstallmentStartDate": "2025-09-03",
            "InstallmentDate": "2025-10-10",
            "InterestRate": "21",
            "PrincipalAmount": "1756.0000000000",
            "InterestAmount": "1759.0000000000",
            "SubsidyAmount": "0",
            "PremiumAmount": "0",
            "ServiceChargeAmount": "0",
            "CapitalizedAmount": "0",
            "InstallmentAmount": "3515.0000000000",
            "PrincipalBalanceAmount": "79744.0000000000",
            "NumberOfDays": "37"
          }
        }),
        documentation: 'Generate Disbursement Schedule Service API - Creates detailed loan repayment schedules with installment breakdowns, interest calculations, principal components, subsidy allocations, and comprehensive payment timelines for various loan products.',
        tags: ["Disbursement", "Schedule", "Installment", "Repayment", "Planning"],
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
            "ScheduleDetails": {
              "type": "object",
              "properties": {
                "SessionId": {"type": "string"},
                "StageNumber": {"type": "string"},
                "InstallmentCounter": {"type": "string"},
                "InstallmentDate": {"type": "string"},
                "InterestRate": {"type": "string"},
                "PrincipalAmount": {"type": "string"},
                "InterestAmount": {"type": "string"},
                "InstallmentAmount": {"type": "string"},
                "PrincipalBalanceAmount": {"type": "string"}
              }
            }
          }
        },
        rateLimits: {"sandbox": 100, "uat": 200, "production": 500},
        timeout: 45000,
        requiresAuth: true,
        authType: 'bearer',
        requiredPermissions: ["loans:disbursement", "loans:read"],
        isActive: true,
        isInternal: true,
        status: 'active',
        version: 'v1'
      }
    ];

    // Insert all disbursement APIs
    for (const api of disbursementApis) {
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

    console.log('✅ Disbursement APIs seeded successfully!');
    console.log(`📊 Total APIs added: ${disbursementApis.length}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error seeding disbursement APIs:', error);
    throw error;
  }
}

// Execute the seeding function
seedDisbursementServices()
  .then(() => {
    console.log('🎉 Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });