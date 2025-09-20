-- =====================================================================
-- AU BANK LOAN SERVICES - CONSOLIDATED SQL SCRIPT
-- =====================================================================
-- 
-- GENERATED: December 2024
-- TOTAL APIs: 12 comprehensive Loan APIs
-- CATEGORY: Loans (faf2c6c8-4b0e-4fa7-94c8-f92527965e3e)
--
-- SERVICES INCLUDED:
-- 1. Collateral Management Services (4 APIs)
-- 2. Disbursement Services (3 APIs)  
-- 3. Loan Management Services (5 APIs)
--
-- ⚠️  EXECUTION WARNING:
-- - This script modifies the database
-- - Ensure you have proper backups before execution
-- - Test in UAT environment first if possible
-- - Verify Loans category ID exists in target database
-- 
-- EXECUTION:
-- Run this script as a single transaction on PostgreSQL
-- 
-- =====================================================================

BEGIN;

-- Verify Loans category exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM api_categories WHERE id = 'faf2c6c8-4b0e-4fa7-94c8-f92527965e3e') THEN
        RAISE EXCEPTION 'Loans category not found. Please verify category_id before proceeding.';
    END IF;
END $$;

-- =====================================================================
-- SECTION 1: COLLATERAL MANAGEMENT SERVICES (4 APIs)
-- =====================================================================

INSERT INTO api_endpoints (
    id, category_id, category, name, path, method, description, summary, 
    parameters, headers, responses, request_example, response_example, 
    documentation, tags, response_schema, rate_limits, timeout, 
    requires_auth, auth_type, required_permissions, is_active, is_internal, 
    status, version, created_at, updated_at
) VALUES

-- 1. Collateral Dedupe Service API
(
    'collateral-dedupe-001',
    'faf2c6c8-4b0e-4fa7-94c8-f92527965e3e',
    'Loans',
    'Collateral Dedupe Service',
    '/CollateralSearchRestServiceNewV1/CollDedupe',
    'POST',
    'Identifies and eliminates duplicate collateral records to maintain accuracy and integrity in collateral management. This API helps prevent duplicate collateral entries and ensures data consistency across loan accounts.',
    'Identify and eliminate duplicate collateral records',
    '[
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
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Collateral dedupe check completed successfully"},
        {"status": 400, "description": "Bad Request - Invalid collateral parameters"},
        {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
        {"status": 404, "description": "Not Found - Collateral records not found"},
        {"status": 500, "description": "Internal Server Error - Something went wrong"}
    ]'::jsonb,
    '{"ReferenceNumber":"REF123456789012345678901234567890","TransactionBranch":100,"RequestId":"REQ123456789012345678901234567890","OriginatingChannel":"SFDC","CollateralDedupe":{"CollateralType":"Vehicle","ChassisNumber":"ABC123456789","EngineNumber":"ENG123456789","RegistrationNo":"MH01AB1234","AccountDepositNumber":"12345678901234567890","AddressSearch":"123 Main Street Mumbai","InsurancePolicyNumber":"INS123456789"}}',
    '{"CollateralDetails":[{"Status":"0","RepoDate":"2022-10-21","Narration":"REPO WITHOUT RO"}],"TransactionStatus":{"ResponseCode":"99","ValidationErrors":[null],"ResponseMessage":"Failure","ExtendedErrorDetails":{"messages":[{"code":99,"message":"Invalid Input : Collateral type ."}]}}}',
    'Collateral Dedupe Service API - Identifies and eliminates duplicate collateral records across multiple parameters including chassis number, engine number, registration details, account numbers, address, and insurance policy numbers. Supports comprehensive deduplication logic for vehicles, financial instruments, and property collateral.',
    '["Collateral", "Dedupe", "Validation", "Vehicle", "Property"]'::jsonb,
    '{"type": "object", "properties": {"CollateralDetails": {"type": "array", "items": {"type": "object", "properties": {"Status": {"type": "string"}, "RepoDate": {"type": "string"}, "Narration": {"type": "string"}}}}, "TransactionStatus": {"type": "object", "properties": {"ResponseCode": {"type": "string"}, "ResponseMessage": {"type": "string"}, "ValidationErrors": {"type": "array"}, "ExtendedErrorDetails": {"type": "object", "properties": {"messages": {"type": "array", "items": {"type": "object", "properties": {"code": {"type": "number"}, "message": {"type": "string"}}}}}}}}}'::jsonb,
    '{"sandbox": 100, "uat": 200, "production": 500}'::jsonb,
    30000,
    true,
    'bearer',
    '["loans:collateral", "loans:read"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 2. Collateral Enquiry Service API
(
    'collateral-enquiry-002',
    'faf2c6c8-4b0e-4fa7-94c8-f92527965e3e',
    'Loans',
    'Collateral Enquiry Service',
    '/CollateralSearchRestServiceNewV1/CollEnquiry',
    'POST',
    'Provides details of customer-linked collateral by fetching information such as collateral type, value, status, and associated loan accounts. This API enables comprehensive collateral portfolio viewing for loan management.',
    'Get detailed customer collateral information',
    '[
        {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "98765678890"},
        {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (5 characters max)", "example": "2011"},
        {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "98767890"},
        {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel/APP Name (5 characters max)", "example": "SFDC"},
        {"name": "CustomerId", "type": "string", "required": true, "description": "Customer ID (8 characters max)", "example": "27570007"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Collateral details retrieved successfully"},
        {"status": 400, "description": "Bad Request - Invalid customer ID or parameters"},
        {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
        {"status": 404, "description": "Not Found - No collateral found for customer"},
        {"status": 500, "description": "Internal Server Error - Something went wrong"}
    ]'::jsonb,
    '{"RequestId":"98767890","OriginatingChannel":"SFDC","ReferenceNumber":"98765678890","TransactionBranch":2011,"CustomerId":"27570007"}',
    '{"CollateralDetails":[{"Status":"0","RepoDate":"2022-10-21","Narration":"REPO WITHOUT RO"}],"TransactionStatus":{"ResponseCode":"99","ValidationErrors":[null],"ResponseMessage":"Failure","ExtendedErrorDetails":{"messages":[{"code":99,"message":"No collateral attached to linked accounts for customer."}]}}}',
    'Collateral Enquiry Service API - Fetches comprehensive collateral details for customers including collateral type, value, status, linked loan accounts, and security details. Provides complete collateral portfolio view for customer relationship management.',
    '["Collateral", "Enquiry", "Customer", "Portfolio", "Security"]'::jsonb,
    '{"type": "object", "properties": {"CollateralDetails": {"type": "array", "items": {"type": "object", "properties": {"Status": {"type": "string"}, "RepoDate": {"type": "string"}, "Narration": {"type": "string"}}}}, "TransactionStatus": {"type": "object", "properties": {"ResponseCode": {"type": "string"}, "ResponseMessage": {"type": "string"}, "ValidationErrors": {"type": "array"}, "ExtendedErrorDetails": {"type": "object", "properties": {"messages": {"type": "array", "items": {"type": "object", "properties": {"code": {"type": "number"}, "message": {"type": "string"}}}}}}}}}'::jsonb,
    '{"sandbox": 200, "uat": 500, "production": 1000}'::jsonb,
    30000,
    true,
    'bearer',
    '["loans:collateral", "loans:read"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 3. Collateral Linkage Modification Service API
(
    'collateral-linkage-modification-003',
    'faf2c6c8-4b0e-4fa7-94c8-f92527965e3e',
    'Loans',
    'Collateral Linkage Modification Service',
    '/CollateralModificationRestServiceV1/LoanCollLinkMod',
    'POST',
    'Allows modification or update of existing collateral linkage details against a loan account, ensuring accurate mapping of security with the respective loan. This API supports dynamic collateral management operations.',
    'Modify collateral linkage to loan accounts',
    '[
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
        {"name": "PrimaryOrSecondaryCollateral", "type": "string", "required": false, "description": "Collateral classification", "example": "Primary"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Collateral linkage modified successfully"},
        {"status": 400, "description": "Bad Request - Invalid linkage parameters"},
        {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
        {"status": 404, "description": "Not Found - Collateral or account not found"},
        {"status": 500, "description": "Internal Server Error - Something went wrong"}
    ]'::jsonb,
    '{"ReferenceNumber":"REF123456789012345678901234567890","TransactionBranch":100,"ReportingParam":{"MISClass":"LOAN","MISCode":"001"},"RequestId":"REQ123456789012345678901234567890","OriginatingChannel":"SFDC","FlgMode":"ADD","AccountID":"9001020451074496","CollateralCode":"COLL001","CollateralId":"12345678","CollateralPriority":"Primary","CollateralValue":"5000000","TDAccountNumber":"1234567890123456","PrimaryOrSecondaryCollateral":"Primary"}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success","ExtendedErrorDetails":{"messages":[{"code":0}]}}}',
    'Collateral Linkage Modification Service API - Enables dynamic modification of collateral linkage with loan accounts. Supports priority changes, value updates, deposit linkages, and comprehensive collateral portfolio management with flexible operation modes.',
    '["Collateral", "Linkage", "Modification", "Account", "Priority"]'::jsonb,
    '{"type": "object", "properties": {"TransactionStatus": {"type": "object", "properties": {"ResponseCode": {"type": "string"}, "ResponseMessage": {"type": "string"}, "ExtendedErrorDetails": {"type": "object", "properties": {"messages": {"type": "array", "items": {"type": "object", "properties": {"code": {"type": "number"}}}}}}}}}'::jsonb,
    '{"sandbox": 50, "uat": 100, "production": 300}'::jsonb,
    45000,
    true,
    'bearer',
    '["loans:collateral", "loans:write"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 4. Collateral Modification Service API
(
    'collateral-modification-012',
    'faf2c6c8-4b0e-4fa7-94c8-f92527965e3e',
    'Loans',
    'Collateral Modification Service',
    '/CollateralModificationRestServiceV1/CollMod',
    'POST',
    'Provides functionality to update or modify existing collateral details linked to a loan or customer account. This API supports comprehensive collateral management including automobile, property, and financial instrument modifications.',
    'Update and modify existing collateral details',
    '[
        {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "REF123456789012345678901234567890"},
        {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (5 characters max)", "example": "2011"},
        {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "REQ123456789012345678901234567890"},
        {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel/APP Name (5 characters max)", "example": "SFDC"},
        {"name": "CollateralId", "type": "string", "required": false, "description": "Collateral Id", "example": "COLL123456"},
        {"name": "CollateralCode", "type": "string", "required": false, "description": "Collateral Code", "example": "CC001"},
        {"name": "ChassisNumber", "type": "string", "required": false, "description": "Vehicle Chassis Number", "example": "ABC123456789DEF"},
        {"name": "EngineNumber", "type": "string", "required": false, "description": "Vehicle Engine Number", "example": "ENG123456789"},
        {"name": "RegistrationNumber", "type": "string", "required": false, "description": "Vehicle Registration Number", "example": "MH01AB1234"},
        {"name": "ModelName", "type": "string", "required": false, "description": "Vehicle Model Name", "example": "Swift VDI"},
        {"name": "ManufactureYearMonth", "type": "string", "required": false, "description": "Manufacture Year Month", "example": "2023-01"},
        {"name": "AutomobileDescription1", "type": "string", "required": false, "description": "Automobile Description 1", "example": "Maruti Suzuki Swift"},
        {"name": "AutomobileDescription2", "type": "string", "required": false, "description": "Automobile Description 2", "example": "VDI Variant"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Collateral modified successfully"},
        {"status": 400, "description": "Bad Request - Invalid modification parameters"},
        {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
        {"status": 404, "description": "Not Found - Collateral not found"},
        {"status": 500, "description": "Internal Server Error - Something went wrong"}
    ]'::jsonb,
    '{"ReferenceNumber":"REF123456789012345678901234567890","TransactionBranch":"2011","RequestId":"REQ123456789012345678901234567890","OriginatingChannel":"SFDC","CollateralId":"COLL123456","CollateralCode":"CC001","AutomobileCollModDetails":{"ChassisNumber":"ABC123456789DEF","EngineNumber":"ENG123456789","RegistrationNumber":"MH01AB1234","ModelName":"Swift VDI","ManufactureYearMonth":"2023-01","AutomobileDescription1":"Maruti Suzuki Swift","AutomobileDescription2":"VDI Variant"}}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success","ExtendedErrorDetails":{"messages":[{"code":0}]}}}',
    'Collateral Modification Service API - Comprehensive collateral modification supporting automobile details, property information, financial instruments, document management, and complete collateral lifecycle management with detailed validation.',
    '["Collateral", "Modification", "Automobile", "Property", "Update"]'::jsonb,
    '{"type": "object", "properties": {"TransactionStatus": {"type": "object", "properties": {"ResponseCode": {"type": "string"}, "ResponseMessage": {"type": "string"}, "ExtendedErrorDetails": {"type": "object", "properties": {"messages": {"type": "array", "items": {"type": "object", "properties": {"code": {"type": "number"}}}}}}}}}'::jsonb,
    '{"sandbox": 50, "uat": 100, "production": 300}'::jsonb,
    45000,
    true,
    'bearer',
    '["loans:collateral", "loans:write"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- =====================================================================
-- SECTION 2: DISBURSEMENT SERVICES (3 APIs)
-- =====================================================================

-- 5. Disburse Loan Calculate EMI Service API
(
    'disburse-loan-cal-emi-004',
    'faf2c6c8-4b0e-4fa7-94c8-f92527965e3e',
    'Loans',
    'Disburse Loan Calculate EMI Service',
    '/DisburseLoanCalEMIServiceV1/disburseLoan',
    'POST',
    'Calculates the Equated Monthly Installment (EMI) for a loan at the time of disbursement based on loan amount, interest rate, and tenure. This API provides accurate EMI calculations considering various parameters like subsidy, margin codes, and stage configurations.',
    'Calculate EMI for loan disbursement',
    '[
        {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "REF123456789012345678901234567890"},
        {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (5 characters max)", "example": "2011"},
        {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "REQ123456789012345678901234567890"},
        {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel/APP Name (5 characters max)", "example": "SFDC"},
        {"name": "TermMonths", "type": "string", "required": true, "description": "Term in Months (10 characters max)", "example": "60"},
        {"name": "RateChartCode", "type": "string", "required": true, "description": "Rate Chart Code (16 characters max)", "example": "RATE001"},
        {"name": "ScheduleTypeCode", "type": "string", "required": true, "description": "Schedule Type Code (16 characters max)", "example": "SCH001"},
        {"name": "AccountVarianceRate", "type": "string", "required": true, "description": "Account Variance Rate (10 characters max)", "example": "12.5"},
        {"name": "SanctionedAmount", "type": "string", "required": true, "description": "Sanctioned Loan Amount (10 characters max)", "example": "1000000"},
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
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - EMI calculated successfully"},
        {"status": 400, "description": "Bad Request - Invalid calculation parameters"},
        {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
        {"status": 500, "description": "Internal Server Error - EMI calculation failed"}
    ]'::jsonb,
    '{"ReferenceNumber":"REF123456789012345678901234567890","TransactionBranch":"2011","RequestId":"REQ123456789012345678901234567890","OriginatingChannel":"SFDC","TermMonths":"60","RateChartCode":"RATE001","ScheduleTypeCode":"SCH001","AccountVarianceRate":"12.5","SanctionedAmount":"1000000","ProductCode":"HLOAN","GenerationDate":"2024-12-20","InterestVarianceType":"01","StageNumber":"01","NumberOfPrincipalRepayments":"60","InterestRepaymentFrequency":"MONTHLY","FirstInterestRepaymentDate":"2025-01-10","FirstPrincipalRepaymentDate":"2025-01-10","FixedMarginCode":"01","SubsidyPercentShared":"50"}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success","ExtendedErrorDetails":{"messages":[{"code":0}]}},"EMIDetails":{"EMIAmount":"18534.37","TotalInterest":"112062.20","TotalAmount":"1112062.20","CalculationDate":"2024-12-20"}}',
    'Disburse Loan Calculate EMI Service API - Comprehensive EMI calculation engine supporting multiple loan products, subsidy structures, variable rates, stage-based calculations, and flexible repayment schedules with accurate interest computations.',
    '["Disbursement", "EMI", "Calculation", "Interest", "Loan"]'::jsonb,
    '{"type": "object", "properties": {"TransactionStatus": {"type": "object", "properties": {"ResponseCode": {"type": "string"}, "ResponseMessage": {"type": "string"}}}, "EMIDetails": {"type": "object", "properties": {"EMIAmount": {"type": "string"}, "TotalInterest": {"type": "string"}, "TotalAmount": {"type": "string"}, "CalculationDate": {"type": "string"}}}}}'::jsonb,
    '{"sandbox": 100, "uat": 200, "production": 500}'::jsonb,
    30000,
    true,
    'bearer',
    '["loans:disbursement", "loans:read"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 6. Disburse Loan Service API
(
    'disburse-loan-005',
    'faf2c6c8-4b0e-4fa7-94c8-f92527965e3e',
    'Loans',
    'Disburse Loan Service',
    '/DisburseLoanService/disburseLoan',
    'POST',
    'Initiates and processes the loan disbursement to the borrower\'s account as per approved terms. This API handles comprehensive disbursement operations including mode selection, deduction processing, and transaction execution.',
    'Initiate and process loan disbursement',
    '[
        {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "REF123456789012345678901234567890"},
        {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (5 characters max)", "example": "2011"},
        {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "REQ123456789012345678901234567890"},
        {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel/APP Name (5 characters max)", "example": "SFDC"},
        {"name": "UserId", "type": "string", "required": true, "description": "User ID initiating disbursement (10 characters max)", "example": "USER001"},
        {"name": "AccountId", "type": "string", "required": true, "description": "Loan Account ID (16 characters max)", "example": "9001020451074496"},
        {"name": "DisbursementMode", "type": "string", "required": true, "description": "Disbursement Mode (10 characters max)", "example": "NEFT"},
        {"name": "FromAccountNo", "type": "string", "required": true, "description": "Source Account Number (16 characters max)", "example": "1234567890123456"},
        {"name": "UserReferenceNumber", "type": "string", "required": true, "description": "User Reference Number (10 characters max)", "example": "URN001"},
        {"name": "SessionId", "type": "string", "required": true, "description": "Session ID", "example": "SESSION123"},
        {"name": "DisbursementDate", "type": "string", "required": true, "description": "Disbursement Date (10 characters max)", "example": "2024-12-20"},
        {"name": "DisbursementTransactionAmount", "type": "string", "required": true, "description": "Disbursement Transaction Amount (10 characters max)", "example": "1000000"},
        {"name": "ScheduleCode", "type": "string", "required": true, "description": "Schedule Code (10 characters max)", "example": "SCH001"},
        {"name": "ArrearsToBeCapitalized", "type": "string", "required": true, "description": "Arrears To Be Capitalized (10 characters max)", "example": "0"},
        {"name": "DeductTypeDeductionAmount", "type": "string", "required": true, "description": "Deduct Type Deduction Amount (10 characters max)", "example": "50000"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Loan disbursed successfully"},
        {"status": 400, "description": "Bad Request - Invalid disbursement parameters"},
        {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
        {"status": 500, "description": "Internal Server Error - Disbursement processing failed"}
    ]'::jsonb,
    '{"ReferenceNumber":"REF123456789012345678901234567890","TransactionBranch":"2011","RequestId":"REQ123456789012345678901234567890","OriginatingChannel":"SFDC","BranchDisbursementDetail":{"UserId":"USER001","AccountId":"9001020451074496","DisbursementMode":"NEFT","FromAccountNo":"1234567890123456","UserReferenceNumber":"URN001"},"HostDisbursementDetail":{"AccountId":"9001020451074496","SessionId":"SESSION123","DisbursementDate":"2024-12-20","DisbursementTransactionAmount":"1000000","ScheduleCode":"SCH001","ArrearsToBeCapitalized":"0","DeductTypeDeductionAmount":"50000"}}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success","ExtendedErrorDetails":{"messages":[{"code":0}]}},"DisbursementDetails":{"TransactionReference":"TXN123456789","DisbursementAmount":"950000","DeductionAmount":"50000","NetAmount":"950000","DisbursementDate":"2024-12-20"}}',
    'Disburse Loan Service API - Complete loan disbursement processing with multiple disbursement modes (NEFT, RTGS, Cheque), comprehensive deduction handling, beneficiary management, and real-time transaction processing with detailed audit trails.',
    '["Disbursement", "Loan", "Transaction", "NEFT", "Processing"]'::jsonb,
    '{"type": "object", "properties": {"TransactionStatus": {"type": "object", "properties": {"ResponseCode": {"type": "string"}, "ResponseMessage": {"type": "string"}}}, "DisbursementDetails": {"type": "object", "properties": {"TransactionReference": {"type": "string"}, "DisbursementAmount": {"type": "string"}, "DeductionAmount": {"type": "string"}, "NetAmount": {"type": "string"}, "DisbursementDate": {"type": "string"}}}}}'::jsonb,
    '{"sandbox": 50, "uat": 100, "production": 300}'::jsonb,
    60000,
    true,
    'bearer',
    '["loans:disbursement", "loans:write"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 7. Generate Disbursement Schedule Service API
(
    'generate-disbursement-schedule-006',
    'faf2c6c8-4b0e-4fa7-94c8-f92527965e3e',
    'Loans',
    'Generate Disbursement Schedule Service',
    '/DisburseLoanService/generateDisbursementSchedule',
    'POST',
    'Generates the loan disbursement schedule with details of installment amounts, dates, and payment stages. This API creates comprehensive repayment schedules considering various loan parameters and stage configurations.',
    'Generate loan disbursement schedule',
    '[
        {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "765456789"},
        {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (5 characters max)", "example": "2011"},
        {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "9876546789"},
        {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel/APP Name (5 characters max)", "example": "SFDC"},
        {"name": "SessionId", "type": "string", "required": true, "description": "Session ID (10 characters max)", "example": "124993"},
        {"name": "AccountId", "type": "string", "required": true, "description": "Loan Account ID (16 characters max)", "example": "9001020451074496"},
        {"name": "DisbursementDate", "type": "string", "required": true, "description": "Disbursement Date (10 characters max)", "example": "2025-09-02"},
        {"name": "StageNumber", "type": "string", "required": true, "description": "Stage Number (2 characters max)", "example": "1"},
        {"name": "NumberOfPrincipalRepayments", "type": "string", "required": true, "description": "Number Of Principal Repayments (10 characters max)", "example": "60"},
        {"name": "FirstPrincipalRepaymentDate", "type": "string", "required": true, "description": "First Principal Repayment Date (10 characters max)", "example": "2025-10-10"},
        {"name": "FirstInterestRepaymentDate", "type": "string", "required": true, "description": "First Interest Repayment Date (10 characters max)", "example": "2025-10-10"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Disbursement schedule generated successfully"},
        {"status": 400, "description": "Bad Request - Invalid schedule parameters"},
        {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
        {"status": 500, "description": "Internal Server Error - Schedule generation failed"}
    ]'::jsonb,
    '{"ReferenceNumber":"765456789","TransactionBranch":2011,"RequestId":"9876546789","OriginatingChannel":"SFDC","AccountId":"9001020451074496","SessionId":"124993","DisbursementDate":"2025-09-02","UserModifiedStageParameter":[{"StageNumber":1,"NumberOfPrincipalRepayments":60,"FirstPrincipalRepaymentDate":"2025-10-10","FirstInterestRepaymentDate":"2025-10-10"}]}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success","ExtendedErrorDetails":{"messages":[{"code":0}]}},"ScheduleDetails":{"SessionId":"72493","StageNumber":"1","InstallmentCounter":"1","InstallmentStartDate":"2025-09-03","InstallmentDate":"2025-10-10","InterestRate":"21","PrincipalAmount":"1756.0000000000","InterestAmount":"1759.0000000000","SubsidyAmount":"0","PremiumAmount":"0","ServiceChargeAmount":"0","CapitalizedAmount":"0","InstallmentAmount":"3515.0000000000","PrincipalBalanceAmount":"79744.0000000000","NumberOfDays":"37"}}',
    'Generate Disbursement Schedule Service API - Creates detailed loan repayment schedules with installment breakdowns, interest calculations, principal components, subsidy allocations, and comprehensive payment timelines for various loan products.',
    '["Disbursement", "Schedule", "Installment", "Repayment", "Planning"]'::jsonb,
    '{"type": "object", "properties": {"TransactionStatus": {"type": "object", "properties": {"ResponseCode": {"type": "string"}, "ResponseMessage": {"type": "string"}}}, "ScheduleDetails": {"type": "object", "properties": {"SessionId": {"type": "string"}, "StageNumber": {"type": "string"}, "InstallmentCounter": {"type": "string"}, "InstallmentDate": {"type": "string"}, "InterestRate": {"type": "string"}, "PrincipalAmount": {"type": "string"}, "InterestAmount": {"type": "string"}, "InstallmentAmount": {"type": "string"}, "PrincipalBalanceAmount": {"type": "string"}}}}}'::jsonb,
    '{"sandbox": 100, "uat": 200, "production": 500}'::jsonb,
    45000,
    true,
    'bearer',
    '["loans:disbursement", "loans:read"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- =====================================================================
-- SECTION 3: LOAN MANAGEMENT SERVICES (5 APIs)
-- =====================================================================

-- 8. Get Disbursement Deduction Details Service API
(
    'get-disbursement-deduction-details-007',
    'faf2c6c8-4b0e-4fa7-94c8-f92527965e3e',
    'Loans',
    'Get Disbursement Deduction Details Service',
    '/DisburseLoanService/getDisbursementDeductionDetails',
    'POST',
    'Fetches details of deductions made at the time of loan disbursement, including deduction type, amount, and applicable charges. This API provides comprehensive breakdown of all deductions applied during disbursement process.',
    'Get loan disbursement deduction details',
    '[
        {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "987656789"},
        {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel (5 characters max)", "example": "SFDC"},
        {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "09876545678"},
        {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (10 characters max)", "example": "2011"},
        {"name": "AccountId", "type": "string", "required": true, "description": "Account Id (20 characters max)", "example": "9001020150815100"},
        {"name": "DisbursementDate", "type": "string", "required": true, "description": "Disbursement Date (10 characters max)", "example": "2025-08-23"},
        {"name": "DisbursementMode", "type": "string", "required": true, "description": "Disbursement Mode (2 characters max)", "example": "5"},
        {"name": "DisbursementAmount", "type": "string", "required": true, "description": "Disbursement Amount (10 characters max)", "example": "500000"},
        {"name": "LineNumber", "type": "string", "required": false, "description": "Line Number (10 characters max)", "example": "1"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Deduction details retrieved successfully"},
        {"status": 400, "description": "Bad Request - Invalid parameters"},
        {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
        {"status": 404, "description": "Not Found - Deduction details not found"},
        {"status": 500, "description": "Internal Server Error - Something went wrong"}
    ]'::jsonb,
    '{"AccountId":"9001020150815100","RequestId":"987656789","OriginatingChannel":"SFDC","DisbursementDate":"2025-08-23","ReferenceNumber":"09876545678","TransactionBranch":2011,"DisbursementMode":"5","DisbursementAmount":500000,"LineNumber":""}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success","ExtendedErrorDetails":{"messages":[{"code":0}]}},"TotalAmountDeducted":"10111.6","TotalAmountDebited":"0","TotalAmountBilled":"0","DeductionDetails":{"SrlNumber":"1","DeductionAmountInLocalCurrency":"6100.6","IsWaived":"false","CtrSrlDednNo":"1","FlgDueOn":"1","IsSCDeductionAmortised":"false","ServiceChargeName":"Processing Fees Auto Loan (New)","DeductionMode":"1","ConversionRateTransactionCurrency":"1","ConversionRateAccountCurrency":"1","DeductionCode":"1042","AccountCurrencyCode":"1","TransactionCurrencyCode":"1","LocalCurrencyCode":"1","DeductionCurrencyCode":"1","DeductionType":"0","DeductionAmountInTransactionCurrency":"6100.6","DeductionAmountInAccountCurrency":"6100.6"}}',
    'Get Disbursement Deduction Details Service API - Provides comprehensive breakdown of all deductions applied during loan disbursement including processing fees, service charges, insurance premiums, and other applicable charges with detailed currency conversion information.',
    '["Disbursement", "Deduction", "Details", "Charges", "Fees"]'::jsonb,
    '{"type": "object", "properties": {"TransactionStatus": {"type": "object", "properties": {"ResponseCode": {"type": "string"}, "ResponseMessage": {"type": "string"}}}, "TotalAmountDeducted": {"type": "string"}, "TotalAmountDebited": {"type": "string"}, "TotalAmountBilled": {"type": "string"}, "DeductionDetails": {"type": "object", "properties": {"SrlNumber": {"type": "string"}, "DeductionAmountInLocalCurrency": {"type": "string"}, "IsWaived": {"type": "string"}, "ServiceChargeName": {"type": "string"}, "DeductionCode": {"type": "string"}}}}}'::jsonb,
    '{"sandbox": 200, "uat": 500, "production": 1000}'::jsonb,
    30000,
    true,
    'bearer',
    '["loans:disbursement", "loans:read"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 9. Get Disbursement Stage API
(
    'get-disbursement-stage-008',
    'faf2c6c8-4b0e-4fa7-94c8-f92527965e3e',
    'Loans',
    'Get Disbursement Stage API',
    '/DisburseLoanService/getDisbursementStage',
    'POST',
    'Provides the current stage/status of the loan disbursement process, helping track whether the disbursement is pending, in progress, or completed. This API offers detailed stage information with repayment terms and schedules.',
    'Get current disbursement stage and status',
    '[
        {"name": "RequestId", "type": "string", "required": true, "description": "Unique Reference number (32 characters max)", "example": "1772837221623123"},
        {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Application Name (5 characters max)", "example": "LOS"},
        {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (20 characters max)", "example": "HFT16733170300315403"},
        {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (5 characters max)", "example": "9000"},
        {"name": "AccountId", "type": "string", "required": true, "description": "Loan Account Number (16 characters max)", "example": "9001070630342629"},
        {"name": "DefinitionDate", "type": "string", "required": true, "description": "Disbursement date (10 characters max)", "example": "2023-02-08"},
        {"name": "DisbursementAmount", "type": "string", "required": false, "description": "Loan Disbursement amount (15 characters max)", "example": "1000000"},
        {"name": "DebitTypeDeductionAmount", "type": "string", "required": false, "description": "Deduction amount to be deducted (15 characters max)", "example": "0"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Disbursement stage retrieved successfully"},
        {"status": 400, "description": "Bad Request - Invalid parameters"},
        {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
        {"status": 404, "description": "Not Found - Disbursement stage not found"},
        {"status": 500, "description": "Internal Server Error - Something went wrong"}
    ]'::jsonb,
    '{"AccountId":9001070630342629,"RequestId":"1772837221623123","OriginatingChannel":"LOS","ReferenceNumber":"HFT16733170300315403","ScheduleTypeCode":1109,"TransactionBranch":9000,"DefinitionDate":"2023-02-08","DisbursementAmount":1000000,"DebitTypeDeductionAmount":0}',
    '{"LoanRepaymentStageDetails":[{"StageNumber":"1","PrincipalRepaymentFrequency":"0","PrincipalAmountToRepay":0,"CalendarPlan":"0","StageName":"INTEREST ONLY INSTALLMENTS","NumberOfPrincipalRepayments":"0","FirstInterestCompoundingDate":"2099-01-01","StageStartDate":"2023-02-08","InterestInstallmentAmount":0,"InstallmentRuleCode":"103","InterestRuleCode":"101","RestPeriodFrequency":"99","InstallmentAmount":0,"StageTermMonths":"0","FirstPrincipalRepaymentDate":"1950-01-01","InstallmentRuleName":"INTEREST ONLY INSTALLMENTS","InterestCompoundingFrequency":"0","FirstRestPeriodDate":"1950-01-01","NumberOfInterestRepayments":"36","InterestRepaymentFrequency":"1","StageTermYears":"3","FirstInterestRepaymentDate":"2023-03-08","StageEndDate":"2026-02-08"}],"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success","ExtendedErrorDetails":{"messages":[{"code":0}]}},"SessionId":4079}',
    'Get Disbursement Stage API - Tracks loan disbursement stages from initiation to completion with detailed repayment stage information, installment rules, interest calculations, and comprehensive stage lifecycle management.',
    '["Disbursement", "Stage", "Status", "Tracking", "Repayment"]'::jsonb,
    '{"type": "object", "properties": {"LoanRepaymentStageDetails": {"type": "array", "items": {"type": "object", "properties": {"StageNumber": {"type": "string"}, "StageName": {"type": "string"}, "StageStartDate": {"type": "string"}, "StageEndDate": {"type": "string"}, "InstallmentAmount": {"type": "number"}, "NumberOfPrincipalRepayments": {"type": "string"}, "NumberOfInterestRepayments": {"type": "string"}, "FirstPrincipalRepaymentDate": {"type": "string"}, "FirstInterestRepaymentDate": {"type": "string"}}}}, "TransactionStatus": {"type": "object", "properties": {"ResponseCode": {"type": "string"}, "ResponseMessage": {"type": "string"}}}, "SessionId": {"type": "number"}}}'::jsonb,
    '{"sandbox": 200, "uat": 500, "production": 1000}'::jsonb,
    30000,
    true,
    'bearer',
    '["loans:disbursement", "loans:read"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 10. Get Loan Account Statement Service API
(
    'get-loan-account-statement-009',
    'faf2c6c8-4b0e-4fa7-94c8-f92527965e3e',
    'Loans',
    'Get Loan Account Statement Service',
    '/AssetAccountService/getLoanAccountStatement',
    'POST',
    'Fetches the statement of loan account on date range with comprehensive transaction details, payment history, interest calculations, and running balance information. This API provides detailed loan account activity for specified periods.',
    'Get loan account statement for date range',
    '[
        {"name": "RequestId", "type": "string", "required": true, "description": "Unique Reference number (32 characters max)", "example": "1456787654345"},
        {"name": "Channel", "type": "string", "required": true, "description": "Application Name (3 characters max)", "example": "TGT"},
        {"name": "AccountID", "type": "string", "required": true, "description": "Loan Account Number (16 characters max)", "example": "9001030143360101"},
        {"name": "valueFromDate", "type": "string", "required": true, "description": "From value Date in \"yyyy-MM-dd\" format (8 characters max)", "example": "20250401"},
        {"name": "valueToDate", "type": "string", "required": true, "description": "To Value date in \"yyyy-MM-dd\" format (8 characters max)", "example": "20250613"},
        {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (10 characters max)", "example": "2011"},
        {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "987656789"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Loan account statement retrieved successfully"},
        {"status": 400, "description": "Bad Request - Invalid date range or parameters"},
        {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
        {"status": 404, "description": "Not Found - Account statement not found"},
        {"status": 500, "description": "Internal Server Error - Something went wrong"}
    ]'::jsonb,
    '{"AccountId":"9001030143360101","ValueToDate":"20250613","RequestId":"1456787654345","OriginatingChannel":"TGT","ReferenceNumber":"987656789","TransactionBranch":2011,"ValueFromDate":"20250401"}',
    '{"AccountID":"9001030143360101","TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success","ExtendedErrorDetails":{"messages":[{"code":0}]}},"LoanAccountStatement":[{"Description":"REGULAR INTEREST","FlgDrCr":"D","Amount":1333.00,"TxnDate":"2025-04-10","ValueDate":"2025-04-10","RunningBalance":71236.35},{"Description":"Payment for Loan EMI Payment 2301720250047509-2301720250047509-Shrawan Ram Meghwal","FlgDrCr":"C","Amount":17.00,"TxnDate":"2025-06-06","ValueDate":"2025-06-06","RunningBalance":74097.35}]}',
    'Get Loan Account Statement Service API - Comprehensive loan account statement with transaction history, interest postings, EMI payments, collection charges, principal and interest breakdowns, and running balance calculations for specified date ranges.',
    '["Loan", "Account", "Statement", "Transaction", "History"]'::jsonb,
    '{"type": "object", "properties": {"AccountID": {"type": "string"}, "TransactionStatus": {"type": "object", "properties": {"ResponseCode": {"type": "string"}, "ResponseMessage": {"type": "string"}}}, "LoanAccountStatement": {"type": "array", "items": {"type": "object", "properties": {"Description": {"type": "string"}, "FlgDrCr": {"type": "string"}, "Amount": {"type": "number"}, "TxnDate": {"type": "string"}, "ValueDate": {"type": "string"}, "RunningBalance": {"type": "number"}}}}}}'::jsonb,
    '{"sandbox": 200, "uat": 500, "production": 1000}'::jsonb,
    30000,
    true,
    'bearer',
    '["loans:account", "loans:read"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 11. Get Loan Closure Details API
(
    'get-loan-closure-details-010',
    'faf2c6c8-4b0e-4fa7-94c8-f92527965e3e',
    'Loans',
    'Get Loan Closure Details API',
    '/AssetAccountService/getLoanClosureDetails',
    'POST',
    'Provides complete information about the closure status of a loan account. It helps customers and systems verify whether a loan is fully paid, partially settled, or pending closure with detailed closure calculations.',
    'Get comprehensive loan closure details',
    '[
        {"name": "AccountID", "type": "string", "required": true, "description": "Account ID (16 characters max)", "example": "231121212"},
        {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "231212"},
        {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel (5 characters max)", "example": "CRM"},
        {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "23222"},
        {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (10 characters max)", "example": "2011"},
        {"name": "PenaltyMethod", "type": "string", "required": false, "description": "Penalty Method (10 characters max)", "example": "AUTO"},
        {"name": "PenaltyAmount", "type": "string", "required": true, "description": "Penalty Amount (10 characters max)", "example": "1000.00"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Loan closure details retrieved successfully"},
        {"status": 400, "description": "Bad Request - Invalid penalty method or parameters"},
        {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
        {"status": 404, "description": "Not Found - Loan account not found"},
        {"status": 500, "description": "Internal Server Error - Something went wrong"}
    ]'::jsonb,
    '{"ReferenceNumber":"23222","TransactionBranch":2011,"RequestId":"231212","OriginatingChannel":"CRM","AccountId":"231121212","PenaltyMethod":"","PenaltyAmount":1000.00}',
    '{"TransactionStatus":{"ResponseCode":"99","ResponseMessage":"Failure","ExtendedErrorDetails":{"messages":[{"code":99,"message":" Invalid Penalty method"}]}},"ErrorCode":"91783"}',
    'Get Loan Closure Details API - Comprehensive loan closure information including outstanding balance, penalty calculations, closure charges, settlement amounts, and complete closure requirements for loan account closure processing.',
    '["Loan", "Closure", "Settlement", "Outstanding", "Penalty"]'::jsonb,
    '{"type": "object", "properties": {"TransactionStatus": {"type": "object", "properties": {"ResponseCode": {"type": "string"}, "ResponseMessage": {"type": "string"}, "ExtendedErrorDetails": {"type": "object", "properties": {"messages": {"type": "array", "items": {"type": "object", "properties": {"code": {"type": "number"}, "message": {"type": "string"}}}}}}}}, "ErrorCode": {"type": "string"}}}'::jsonb,
    '{"sandbox": 100, "uat": 200, "production": 500}'::jsonb,
    30000,
    true,
    'bearer',
    '["loans:closure", "loans:read"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 12. Get Loan Disbursement Details Service API
(
    'get-loan-disbursement-details-011',
    'faf2c6c8-4b0e-4fa7-94c8-f92527965e3e',
    'Loans',
    'Get Loan Disbursement Details Service',
    '/DisburseLoanService/getLoanDisbursementDetails',
    'POST',
    'Provides complete information about the loan disbursement, including disbursed amount, disbursement date, payment mode, bank details, and transaction references. This API offers comprehensive disbursement tracking and verification.',
    'Get complete loan disbursement information',
    '[
        {"name": "RequestId", "type": "string", "required": true, "description": "Unique Request Id (32 characters max)", "example": "987651167890"},
        {"name": "OriginatingChannel", "type": "string", "required": true, "description": "Originating Channel (5 characters max)", "example": "HFT"},
        {"name": "ReferenceNumber", "type": "string", "required": true, "description": "Reference Number (32 characters max)", "example": "8761567819"},
        {"name": "TransactionBranch", "type": "string", "required": true, "description": "Transaction Branch (10 characters max)", "example": "2011"},
        {"name": "AccountId", "type": "string", "required": true, "description": "Account Id (20 characters max)", "example": "9001070849522150"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Loan disbursement details retrieved successfully"},
        {"status": 400, "description": "Bad Request - Invalid parameters"},
        {"status": 401, "description": "Unauthorized - Invalid authentication credentials"},
        {"status": 404, "description": "Not Found - Disbursement details not found"},
        {"status": 500, "description": "Internal Server Error - Something went wrong"}
    ]'::jsonb,
    '{"AccountId":"9001070849522150","RequestId":"987651167890","OriginatingChannel":"HFT","ReferenceNumber":"8761567819","TransactionBranch":2011}',
    '{"AccountTerm":0,"AccountBranchCode":0,"AccountCurrency":0,"ScheduleDrawnOn":0,"AccountScheduleCode":0,"TransactionStatus":{"ResponseCode":"99","ResponseMessage":"Failure","ExtendedErrorDetails":{"messages":[{"code":99,"message":"Multiple Disbursements cannot be done on the same day."}]}},"AccountProduct":0}',
    'Get Loan Disbursement Details Service API - Complete disbursement information including account details, schedule codes, currency information, disbursement tracking, and comprehensive transaction verification with detailed error handling.',
    '["Loan", "Disbursement", "Details", "Transaction", "Tracking"]'::jsonb,
    '{"type": "object", "properties": {"AccountTerm": {"type": "number"}, "AccountBranchCode": {"type": "number"}, "AccountCurrency": {"type": "number"}, "ScheduleDrawnOn": {"type": "number"}, "AccountScheduleCode": {"type": "number"}, "AccountProduct": {"type": "number"}, "TransactionStatus": {"type": "object", "properties": {"ResponseCode": {"type": "string"}, "ResponseMessage": {"type": "string"}, "ExtendedErrorDetails": {"type": "object", "properties": {"messages": {"type": "array", "items": {"type": "object", "properties": {"code": {"type": "number"}, "message": {"type": "string"}}}}}}}}}'::jsonb,
    '{"sandbox": 200, "uat": 500, "production": 1000}'::jsonb,
    30000,
    true,
    'bearer',
    '["loans:disbursement", "loans:read"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
);

-- =====================================================================
-- SCRIPT COMPLETION
-- =====================================================================

COMMIT;

-- Success Message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'AU BANK LOAN SERVICES INSERTION COMPLETE';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total APIs inserted: 12';
    RAISE NOTICE 'Collateral Management Services: 4 APIs';
    RAISE NOTICE 'Disbursement Services: 3 APIs';
    RAISE NOTICE 'Loan Management Services: 5 APIs';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'All services are now active and available';
    RAISE NOTICE 'in the AU Bank Developer Portal';
    RAISE NOTICE '========================================';
END $$;