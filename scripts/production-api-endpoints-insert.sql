-- =====================================================================
-- AU BANK DEVELOPER PORTAL - PRODUCTION API ENDPOINTS INSERT SCRIPT
-- =====================================================================
-- 
-- GENERATED: December 2024
-- TOTAL APIs: 36 comprehensive API services
-- CATEGORIES: 
--   - Payments (4657e5d5-b563-4f88-a81f-b653f52a59db)
--   - Loans (faf2c6c8-4b0e-4fa7-94c8-f92527965e3e)
--   - Common Services (8a2b3c4d-5e6f-7890-ab12-cd34ef567890)
--
-- SERVICES INCLUDED:
-- 1. Additional BBPS Services (6 APIs)
-- 2. E-NACH Services (5 APIs)  
-- 3. UPI Payout Services (3 APIs)
-- 4. Collateral Management Services (4 APIs)
-- 5. Disbursement Services (3 APIs)
-- 6. Loan Management Services (5 APIs)
-- 7. Common Services (10 APIs)
--
-- ⚠️  PRODUCTION WARNING:
-- - This script modifies the production database
-- - Ensure you have proper backups before execution
-- - Test in UAT environment first if possible
-- - Verify all category IDs exist in target database
-- 
-- EXECUTION:
-- Run this script as a single transaction on production PostgreSQL
-- 
-- =====================================================================

BEGIN;

-- Verify all required categories exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM api_categories WHERE id = '4657e5d5-b563-4f88-a81f-b653f52a59db') THEN
        RAISE EXCEPTION 'Payments category not found. Please verify payment category_id before proceeding.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM api_categories WHERE id = 'faf2c6c8-4b0e-4fa7-94c8-f92527965e3e') THEN
        RAISE EXCEPTION 'Loans category not found. Please verify loans category_id before proceeding.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM api_categories WHERE id = '8a2b3c4d-5e6f-7890-ab12-cd34ef567890') THEN
        RAISE EXCEPTION 'Common Services category not found. Please verify common services category_id before proceeding.';
    END IF;
END $$;

-- =====================================================================
-- SECTION 1: ADDITIONAL BBPS SERVICES (6 APIs)
-- =====================================================================

INSERT INTO api_endpoints (
    id, category_id, category, name, path, method, description, summary, 
    parameters, headers, responses, request_example, response_example, 
    documentation, tags, response_schema, rate_limits, timeout, 
    requires_auth, auth_type, required_permissions, is_active, is_internal, 
    status, version, created_at, updated_at
) VALUES

-- 1. BBPS Bill Payment API
(
    'bbps-bill-payment-005',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'Bill Payment',
    '/bbpsservice/BillPayment',
    'POST',
    'Processes bill payments in the BBPS ecosystem. This API enables customers to pay their bills with comprehensive payment options, real-time processing, and detailed transaction tracking.',
    'Process bill payments with multiple payment modes',
    '[
        {"name": "ver", "type": "string", "required": true, "description": "Version of the API (e.g., 1.0)", "example": "1.0"},
        {"name": "ts", "type": "string", "required": true, "description": "Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format", "example": "2023-03-31T17:52:25+05:30"},
        {"name": "origInst", "type": "string", "required": true, "description": "Code assigned by NPCI to each BBPOU", "example": "AU01"},
        {"name": "refId", "type": "string", "required": true, "description": "Unique identification (35 characters) for end-to-end transaction tracking", "example": "AU01BBPSBillPayRequest3083130901752"},
        {"name": "msgId", "type": "string", "required": true, "description": "Unique identification to relate request and response message", "example": "AU01BBPSBillPayRequest3083130901752"},
        {"name": "txnReferenceId", "type": "string", "required": true, "description": "Unique Transaction reference (UTR) number (20 characters)", "example": "AU013090BEHJOTD30831"},
        {"name": "customerMobile", "type": "string", "required": true, "description": "Customer mobile number (10 digits)", "example": "9773326382"},
        {"name": "agentId", "type": "string", "required": true, "description": "Unique identification code allocated to the Agent by NPCI", "example": "AU01AU03AGT525314031"},
        {"name": "billerId", "type": "string", "required": true, "description": "Unique identification code allocated to the Biller by NPCI", "example": "AAVA00000NACCC"},
        {"name": "amount", "type": "string", "required": true, "description": "Transaction amount in paise format (without decimals)", "example": "10000"},
        {"name": "paymentMode", "type": "string", "required": true, "description": "Payment mode (Internet Banking, UPI, Debit Card, etc.)", "example": "Internet Banking"},
        {"name": "quickPay", "type": "string", "required": true, "description": "Flag indicating if payment is done without bill fetch (Yes/No)", "example": "No"},
        {"name": "splitPay", "type": "string", "required": true, "description": "Flag indicating if partial payment is done (Yes/No)", "example": "No"},
        {"name": "currency", "type": "string", "required": true, "description": "Currency code (default: 356 for INR)", "example": "356"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Bill payment processed successfully"},
        {"status": 400, "description": "Bad Request - Invalid payment parameters"},
        {"status": 402, "description": "Payment Required - Insufficient funds"}
    ]'::jsonb,
    '{"RequestId":"BBPS1677996401629","OriginatingChannel":"DEC","Head":{"Ver":"1.0","TS":"2023-03-31T17:52:25+05:30","OrigInst":"AU01","RefId":"AU01BBPSBillPayRequest3083130901752"},"Txn":{"MsgId":"AU01BBPSBillPayRequest3083130901752","TxnReferenceId":"AU013090BEHJOTD30831","TS":"2023-03-31T17:52:25+05:30","Type":"FORWARD TYPE REQUEST"},"Customer":{"Mobile":"9773326382"},"Agent":{"Id":"AU01AU03AGT525314031"},"BillDetails":{"BillerId":"AAVA00000NACCC","CustomerParams":[{"Name":"a","Value":"1"},{"Name":"a b","Value":"11"}]},"Amount":{"Amount":"10000","CustConvFee":"0","Currency":"356"},"PaymentMethod":{"QuickPay":"No","PaymentMode":"Internet Banking","SplitPay":"No","OffusPay":"Yes"}}',
    '{"Head":{"RefId":"AU01BBPSBillPayRequest3083130901752","Ver":"1.0","OrigInst":"AU11","TS":"2023-03-31T17:52:27+05:30"},"Reason":{"ApprovalRefNum":"AU01BBPSBillPayRequest3083130901752","ResponseCode":"000","ResponseReason":"Successful","ComplianceRespCd":"","ComplianceReason":""},"Txn":{"MsgId":"AU01BBPSBillPayRequest3083130901752","TxnReferenceId":"AU013090BEHJOTD30831","TS":"2023-03-31T17:52:27+05:30"},"BillerResponse":{"Amount":"10000","BillDate":"2023-03-31","BillNumber":"NA","CustomerName":"NA","DueDate":"2023-03-31"}}',
    'Bill Payment API - Processes bill payments in the BBPS ecosystem with comprehensive payment options, real-time processing, multiple payment modes, quick pay support, and transaction tracking with UTR.',
    '["BBPS", "Payment", "Transaction", "UTR", "QuickPay"]'::jsonb,
    '{"type": "object", "properties": {"Head": {"type": "object"}, "Reason": {"type": "object", "properties": {"ApprovalRefNum": {"type": "string"}, "ResponseCode": {"type": "string"}, "ResponseReason": {"type": "string"}}}, "Txn": {"type": "object", "properties": {"TxnReferenceId": {"type": "string"}}}}}'::jsonb,
    '{"sandbox": 50, "uat": 200, "production": 500}'::jsonb,
    45000,
    true,
    'bearer',
    '["bbps:payment", "bbps:write", "sandbox"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 2. BBPS Bill Validate API
(
    'bbps-bill-validate-006',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'Bill Validate',
    '/bbpsservice/BillValidation',
    'POST',
    'Validates bill details before payment processing. This API helps customer side BBPOU to validate bill information and ensure accuracy before proceeding with payment.',
    'Validate bill details before payment',
    '[
        {"name": "ver", "type": "string", "required": true, "description": "Version of the API (e.g., 1.0)", "example": "1.0"},
        {"name": "ts", "type": "string", "required": true, "description": "Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format", "example": "2023-03-18T11:58:45+05:30"},
        {"name": "origInst", "type": "string", "required": true, "description": "Code assigned by NPCI to each BBPOU", "example": "AU01"},
        {"name": "refId", "type": "string", "required": true, "description": "Unique identification (35 characters) for end-to-end process", "example": "AU01BillValidateBiller6045830771158"},
        {"name": "agentId", "type": "string", "required": false, "description": "Unique identification code allocated to the Agent by NPCI", "example": "AU01AU04MBBA00000002"},
        {"name": "billerId", "type": "string", "required": true, "description": "Unique identification code allocated to the Biller by NPCI", "example": "AIRT00000NAT87"},
        {"name": "customerParams", "type": "object", "required": true, "description": "Customer parameters for bill validation (max 5 parameters)", "example": "{\"Name\": \"Customer Id\", \"Value\": \"3001812613\"}"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Bill validation completed successfully"},
        {"status": 400, "description": "Bad Request - Invalid validation parameters"},
        {"status": 404, "description": "Not Found - Bill not found for validation"}
    ]'::jsonb,
    '{"ReferenceNumber":"BBPSBillValidate1679120925198","TransactionBranch":"0","RequestId":"BBPSCreateSI1677996401629","OriginatingChannel":"DEC","Header":{"Ver":"1.0","TimeStamp":"2023-03-18T11:58:45+05:30","OrigInst":"AU01","RefId":"AU01BillValidateBiller6045830771158"},"AgentId":"AU01AU04MBBA00000002","BillDetails":{"BillerId":"AIRT00000NAT87","CustomerParams":{"Name":"Customer Id","Value":"3001812613"}}}',
    '{"TransactionStatus":{"ResponseCode":"000","ResponseMessage":"Successful","ExtendedErrorDetails":{"messages":{"code":"000","message":"Successful"}}},"Header":{"RefId":"AU01BillValidateBiller6045830771158","OrigInst":"BBCU","TimeStamp":"2023-03-18T11:58:45+05:30","Ver":"1.0"},"Reason":{"ApprovalRefNum":"1007201755","ResponseCode":"000","ResponseReason":"Successful","ComplianceRespCd":"","ComplianceReason":""}}',
    'Bill Validate API - Validates bill details before payment processing. Ensures customer parameter accuracy, provides pre-validation for payment processing, and supports biller plan responses for prepaid services.',
    '["BBPS", "Validation", "Bill", "Verify", "Customer"]'::jsonb,
    '{"type": "object", "properties": {"TransactionStatus": {"type": "object", "properties": {"ResponseCode": {"type": "string"}, "ResponseMessage": {"type": "string"}}}, "Header": {"type": "object"}, "Reason": {"type": "object", "properties": {"ApprovalRefNum": {"type": "string"}, "ResponseCode": {"type": "string"}}}}}'::jsonb,
    '{"sandbox": 100, "uat": 500, "production": 1000}'::jsonb,
    30000,
    true,
    'bearer',
    '["bbps:validate", "bbps:read", "sandbox"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 3. BBPS Check Complaint Status API
(
    'bbps-check-complaint-status-007',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'Check Complaint Status',
    '/bbpsservice/CheckComplaintStatus',
    'POST',
    'Checks the status of complaints raised in the BBPS ecosystem. This API helps customer side BBPOU to track complaint progress and get current status information.',
    'Check status of raised complaints',
    '[
        {"name": "refId", "type": "string", "required": true, "description": "Unique identification (35 characters) for end-to-end process", "example": "ABCDE12345ABCDE12345ABCDE1A01192345"},
        {"name": "origInst", "type": "string", "required": true, "description": "Code assigned by NPCI to each BBPOU", "example": "AU01"},
        {"name": "ts", "type": "string", "required": true, "description": "Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format", "example": "2022-08-17T16:44:59+05:30"},
        {"name": "ver", "type": "string", "required": true, "description": "Version of the API (e.g., 1.0)", "example": "1.0"},
        {"name": "msgId", "type": "string", "required": true, "description": "Unique identification to relate request and response message", "example": "PYZAE12345ABCDE12345ABCDE1A01192345"},
        {"name": "xchangeId", "type": "string", "required": true, "description": "Exchange ID (506 for complaint status check)", "example": "506"},
        {"name": "complaintId", "type": "string", "required": true, "description": "Complaint ID generated by BBPCU", "example": "COMP123456789"},
        {"name": "complaintType", "type": "string", "required": true, "description": "Type of complaint (Transaction or Service)", "example": "Transaction"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Complaint status retrieved successfully"},
        {"status": 400, "description": "Bad Request - Invalid complaint ID or parameters"},
        {"status": 404, "description": "Not Found - Complaint not found"}
    ]'::jsonb,
    '{"head":{"ver":1.0,"origInst":"AU01","refId":"ABCDE12345ABCDE12345ABCDE1A01192345","ts":"2022-08-17T16:44:59+05:30"},"RequestId":"12323","OriginatingChannel":"CRM","ReferenceNumber":"1231231","TransactionBranch":100,"txn":{"xchangeId":"506","msgId":"PYZAE12345ABCDE12345ABCDE1A01192345","ts":"2022-08-17T16:44:59+05:30"},"complaintDetails":{"complaintId":"COMP123456789","complaintType":"Transaction"}}',
    '{"head":{"ver":1.0,"origInst":"AU01","refId":"ABCDE12345ABCDE12345ABCDE1A01192345","ts":"2022-08-17T16:44:59"},"reason":{"responseReason":"Successful","responseCode":"000"},"txn":{"xchangeId":"506","msgId":"PYZAE12345ABCDE12345ABCDE1A01192345","ts":"2022-08-17T16:44:59"},"complaintDetails":{"complaintStatus":"In Progress","complaintId":"COMP123456789","assigned":"Support Team A","remarks":"Under investigation by technical team"}}',
    'Check Complaint Status API - Tracks complaint progress and resolution in the BBPS ecosystem. Provides real-time status tracking, assignment information, and progress remarks for customer service operations.',
    '["BBPS", "Complaint", "Status", "Support", "Tracking"]'::jsonb,
    '{"type": "object", "properties": {"head": {"type": "object"}, "reason": {"type": "object", "properties": {"responseCode": {"type": "string"}, "responseReason": {"type": "string"}}}, "complaintDetails": {"type": "object", "properties": {"complaintId": {"type": "string"}, "complaintStatus": {"type": "string"}, "assigned": {"type": "string"}}}}}'::jsonb,
    '{"sandbox": 100, "uat": 500, "production": 1000}'::jsonb,
    30000,
    true,
    'bearer',
    '["bbps:complaint", "bbps:read", "sandbox"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 4. BBPS Get Circle Biller API
(
    'bbps-get-circle-biller-008',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'Get Circle Biller',
    '/bbpsservice/GetCircleBiller',
    'POST',
    'Retrieves circle and biller information based on mobile number prefix (MSISDN series). This API helps determine the appropriate circle and biller for mobile-based services.',
    'Get circle and biller info by mobile prefix',
    '[
        {"name": "ver", "type": "string", "required": true, "description": "Version of the API (e.g., 1.0)", "example": "1.0"},
        {"name": "ts", "type": "string", "required": true, "description": "Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format", "example": "2024-12-09T14:13:02+05:30"},
        {"name": "origInst", "type": "string", "required": true, "description": "Code assigned by NPCI to each agent institution", "example": "AU01"},
        {"name": "refId", "type": "string", "required": true, "description": "Unique identification (35 characters) for end-to-end process", "example": "ABCDE12345ABCDE12345ABCDE1A01192345"},
        {"name": "msisdnSeries", "type": "string", "required": true, "description": "First 4 digits of mobile number of customer", "example": "9413"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Circle and biller information retrieved successfully"},
        {"status": 400, "description": "Bad Request - Invalid MSISDN series"},
        {"status": 404, "description": "Not Found - No biller found for given MSISDN series"}
    ]'::jsonb,
    '{"Search":{"msisdnSeries":"9413"}}',
    '{"status":"success","data":{"bbpsResponseStatus":{"responseCode":"000","message":"Successful"},"Head":{"Ver":"1.0","OrigInst":"AU01","RefId":null,"TimeStamp":"2024-12-09T14:13:02","TS":null},"TransactionStatus":{"ResponseCode":"000","ResponseMessage":"Successful","ExtendedErrorDetails":{"messages":[{"code":"0","message":"Successful"}]}},"Reason":{"ResponseCode":0,"ComplianceReason":null,"ComplianceRespCd":null,"ResponseReason":"Successful"},"billerId":"MAHA00000MUM01","circleName":"Rajasthan"}}',
    'Get Circle Biller API - Retrieves circle and biller information based on mobile number prefix. Supports telecom bill payment operations, automatic biller selection, and regional service area detection.',
    '["BBPS", "Circle", "MSISDN", "Mobile", "Telecom"]'::jsonb,
    '{"type": "object", "properties": {"status": {"type": "string"}, "data": {"type": "object", "properties": {"bbpsResponseStatus": {"type": "object"}, "Head": {"type": "object"}, "billerId": {"type": "string"}, "circleName": {"type": "string"}}}}}'::jsonb,
    '{"sandbox": 100, "uat": 500, "production": 1000}'::jsonb,
    30000,
    true,
    'bearer',
    '["bbps:read", "sandbox"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 5. BBPS Raise Complaint API
(
    'bbps-raise-complaint-009',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'Raise Complaint',
    '/bbpsservice/RaiseComplaint',
    'POST',
    'Raises complaints in the BBPS ecosystem for transaction or service-related issues. This API enables customers to register complaints and track resolution progress.',
    'Raise complaints for transactions or services',
    '[
        {"name": "refId", "type": "string", "required": true, "description": "Unique identification (35 characters) for end-to-end process", "example": "BBPSAU01RaiseComplaint7744820982154"},
        {"name": "origInst", "type": "string", "required": true, "description": "Code assigned by NPCI to each BBPOU", "example": "AU01"},
        {"name": "ts", "type": "string", "required": true, "description": "Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format", "example": "2022-04-08T21:54:14+05:30"},
        {"name": "ver", "type": "string", "required": true, "description": "Version of the API (e.g., 1.0)", "example": "1.0"},
        {"name": "msgId", "type": "string", "required": true, "description": "Unique identification to relate request and response message", "example": "BBPSAU01RaiseComplaint7744820982154"},
        {"name": "xchangeId", "type": "string", "required": true, "description": "Exchange ID (501 for complaint registration)", "example": "501"},
        {"name": "complaintType", "type": "string", "required": true, "description": "Type of complaint (Transaction or Service)", "example": "Transaction"},
        {"name": "description", "type": "string", "required": true, "description": "Detailed description of the complaint (150 characters)", "example": "loan account not updated"},
        {"name": "disposition", "type": "string", "required": true, "description": "Pre-defined disposition for the complaint (55 characters)", "example": "Transaction Successful, account not updated"},
        {"name": "txnReferenceId", "type": "string", "required": true, "description": "Unique Transaction reference (UTR) number for transaction complaints", "example": "AU012098BNBNJBY02354"},
        {"name": "otp", "type": "string", "required": false, "description": "OTP for complaint registration verification (10 digits)", "example": "123456"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Complaint raised successfully"},
        {"status": 400, "description": "Bad Request - Invalid complaint parameters"},
        {"status": 422, "description": "Unprocessable Entity - Complaint validation failed"}
    ]'::jsonb,
    '{"ReferenceNumber":"BBPSRaiseComplaint1649435054921","TransactionBranch":"0","complaintDetails":{"complaintType":"Transaction","description":"loan account not updated","disposition":"Transaction Successful, account not updated","txnReferenceId":"AU012098BNBNJBY02354"},"head":{"origInst":"AU01","refId":"BBPSAU01RaiseComplaint7744820982154","ts":"2022-04-08T21:54:14+05:30","ver":"1.0"},"txn":{"msgId":"BBPSAU01RaiseComplaint7744820982154","ts":"2022-04-08T21:54:14+05:30","xchangeId":"501"}}',
    '{"head":{"ver":1.0,"origInst":"AU01","refId":"BBPSAU01RaiseComplaint7744820982154","ts":"2022-04-08T21:54:14"},"reason":{"responseReason":"Successful","responseCode":"000"},"txn":{"xchangeId":"501","msgId":"BBPSAU01RaiseComplaint7744820982154","ts":"2022-04-08T21:54:14"},"complaintDetails":{"OpenComplaint":true,"complaintId":"COMP123456789","assigned":"Support Team A","ComplaintStatus":"Open"}}',
    'Raise Complaint API - Enables customer complaint registration in the BBPS ecosystem. Supports transaction and service complaints, automatic complaint ID generation, OTP verification, and assignment to support teams.',
    '["BBPS", "Complaint", "Registration", "Support", "Dispute"]'::jsonb,
    '{"type": "object", "properties": {"head": {"type": "object"}, "reason": {"type": "object", "properties": {"responseCode": {"type": "string"}, "responseReason": {"type": "string"}}}, "complaintDetails": {"type": "object", "properties": {"complaintId": {"type": "string"}, "assigned": {"type": "string"}, "ComplaintStatus": {"type": "string"}}}}}'::jsonb,
    '{"sandbox": 50, "uat": 200, "production": 500}'::jsonb,
    30000,
    true,
    'bearer',
    '["bbps:complaint", "bbps:write", "sandbox"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 6. BBPS Transaction Status Mobile API
(
    'bbps-transaction-status-mobile-010',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'Transaction Status Mobile',
    '/bbpsservice/TransactionStatusMobile',
    'POST',
    'Retrieves transaction status information based on mobile number and date range. This API helps track transaction history and status for mobile-based queries.',
    'Get transaction status by mobile number',
    '[
        {"name": "refId", "type": "string", "required": true, "description": "Unique identification (35 characters) for end-to-end process", "example": "BBPSAU01TxnStatusMobil1105322091854"},
        {"name": "origInst", "type": "string", "required": true, "description": "Code assigned by NPCI to each BBPOU", "example": "AU01"},
        {"name": "ts", "type": "string", "required": true, "description": "Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format", "example": "2022-07-28T18:54:18+05:30"},
        {"name": "ver", "type": "string", "required": true, "description": "Version of the API (e.g., 1.0)", "example": "1.0"},
        {"name": "msgId", "type": "string", "required": true, "description": "Unique identification to relate request and response message", "example": "BBPSAU01TxnStatusMobil1105322091854"},
        {"name": "xchangeId", "type": "string", "required": true, "description": "Exchange ID (401 for transaction status)", "example": "401"},
        {"name": "mobile", "type": "string", "required": true, "description": "Mobile number to search transactions (10 digits)", "example": "9358816069"},
        {"name": "fromDate", "type": "string", "required": true, "description": "From date for transaction search (YYYY-MM-DD format)", "example": "2022-07-01"},
        {"name": "toDate", "type": "string", "required": false, "description": "To date for transaction search (YYYY-MM-DD format)", "example": "2022-07-28"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Transaction status retrieved successfully"},
        {"status": 400, "description": "Bad Request - Invalid mobile number or date range"},
        {"status": 404, "description": "Not Found - No transactions found for given criteria"}
    ]'::jsonb,
    '{"TransactionStatusMobileRequest":{"ReferenceNumber":"BBPSTxnStatusMobile1659014658092","TransactionBranch":"0","head":{"origInst":"AU01","refId":"BBPSAU01TxnStatusMobil1105322091854","ts":"2022-07-28T18:54:18+05:30","ver":"1.0"},"transactionDetails":{"fromDate":"2022-07-01","mobile":"9358816069","toDate":"2022-07-28"},"txn":{"msgId":"BBPSAU01TxnStatusMobil1105322091854","ts":"2022-07-28T18:54:18+05:30","xchangeId":"401"}}}',
    '{"head":{"refId":"BBPSAU01TxnStatusMobil1105322091854","origInst":"AU01","ts":"2022-07-28T18:54:18","ver":"1.0"},"reason":{"responseCode":"000","responseReason":"Successful"},"txn":{"msgId":"BBPSAU01TxnStatusMobil1105322091854","ts":"2022-07-28T18:54:18","xchangeId":"401"},"txnList":[{"txnReferenceId":"AU012202CODODMD67209","agentId":"AU01AU02INB529957923","billerId":"AAVA00000NACCC","amount":"100000","txnDate":"2022-07-21T13:06:11+05:30","txnStatus":"Success"}],"customerDetails":{"mobile":"9358816069"}}',
    'Transaction Status Mobile API - Retrieves transaction status information based on mobile number and date range. Supports transaction history tracking, customer service inquiries, and payment reconciliation.',
    '["BBPS", "Transaction", "Status", "Mobile", "History"]'::jsonb,
    '{"type": "object", "properties": {"head": {"type": "object"}, "reason": {"type": "object", "properties": {"responseCode": {"type": "string"}, "responseReason": {"type": "string"}}}, "txnList": {"type": "array", "items": {"type": "object", "properties": {"txnReferenceId": {"type": "string"}, "agentId": {"type": "string"}, "billerId": {"type": "string"}, "amount": {"type": "string"}, "txnStatus": {"type": "string"}}}}, "customerDetails": {"type": "object", "properties": {"mobile": {"type": "string"}}}}}'::jsonb,
    '{"sandbox": 100, "uat": 500, "production": 1000}'::jsonb,
    30000,
    true,
    'bearer',
    '["bbps:read", "bbps:transaction", "sandbox"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- =====================================================================
-- SECTION 2: E-NACH SERVICES (5 APIs)
-- =====================================================================

-- 7. E-NACH OAuth Token Generation API
(
    'enach-token-generation-001',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'E-NACH OAuth Token Generation',
    '/oauth/accesstoken',
    'GET',
    'Generates OAuth 2.0 access token for E-NACH API authentication. This service provides secure access tokens required for all E-NACH mandate creation and status inquiry operations.',
    'Generate OAuth access token for E-NACH services',
    '[
        {"name": "grant_type", "type": "string", "required": true, "description": "OAuth 2.0 grant type (client_credentials)", "example": "client_credentials"}
    ]'::jsonb,
    '[
        {"name": "Authorization", "value": "Basic <base64(client_id:client_secret)>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Access token generated successfully"},
        {"status": 401, "description": "Unauthorized - Invalid client credentials"}
    ]'::jsonb,
    'GET /oauth/accesstoken?grant_type=client_credentials\nAuthorization: Basic <base64_encoded_credentials>',
    '{"refresh_token_expires_in":"0","api_product_list":"[LDAP, Oauth, Payment, Customer Onboarding, karza, CBSMiniStatementService, test]","api_product_list_json":["LDAP","Oauth","Payment","Customer Onboarding","karza","CBSMiniStatementService","test"],"organization_name":"au-apigee-nprod","developer.email":"kunal.boriwal@aubank.in","token_type":"BearerToken","issued_at":"1704950669618","client_id":"2I7UVNalTfFBxm3ZYxOtzYXwXX1PMIJCSSFf6AMipK0H0zR9","access_token":"lEbnG39cJwC4lKUe5fliVA9HFcyR","application_name":"f0556c9d-6c97-40aa-8d4e-c6bb190ef2ce","scope":"","expires_in":"86399","refresh_count":"0","status":"approved"}',
    'E-NACH OAuth Token Generation API - Provides secure OAuth 2.0 authentication for E-NACH services. Supports client credentials flow with GCM encryption. Token valid 24hrs UAT, 6 months production.',
    '["E-NACH", "Authentication", "OAuth", "Token", "Security"]'::jsonb,
    '{"type": "object", "properties": {"access_token": {"type": "string"}, "token_type": {"type": "string"}, "expires_in": {"type": "string"}, "issued_at": {"type": "string"}, "client_id": {"type": "string"}, "status": {"type": "string"}}}'::jsonb,
    '{"sandbox": 1000, "uat": 1000, "production": 5000}'::jsonb,
    10000,
    true,
    'basic',
    '["enach:auth", "oauth:generate"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 8. E-NACH Mandate Creation (Without User Confirmation) API
(
    'enach-mandate-without-user-002',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'E-NACH Mandate Creation (Without User Confirmation)',
    '/EmandateUserRegistrationRestService/withoutUserConfirmation',
    'POST',
    'Creates E-NACH mandate registration without user confirmation. Customer authenticates directly at NPCI online mandate page during request initiation. Used when customer is available with corporate user during mandate registration.',
    'Create E-NACH mandate with direct customer authentication',
    '[
        {"name": "requestId", "type": "string", "required": true, "description": "Unique request identifier (20 characters max)", "example": "2031133004241123"},
        {"name": "channel", "type": "string", "required": true, "description": "Channel name provided by bank in production (3 characters max)", "example": "BijliPay"},
        {"name": "referenceCode", "type": "string", "required": true, "description": "Any unique generated identifier (10 characters max)", "example": "203113300424123"},
        {"name": "mbSponserBankCode", "type": "string", "required": true, "description": "Registered sponsor bank code (20 characters max)", "example": "AUBL0000001"},
        {"name": "mbSvcProviderCode", "type": "string", "required": true, "description": "NPCI registered provider code - Corporate utility code (20 characters max)", "example": "NACH00000000000015"},
        {"name": "mbSvcProviderName", "type": "string", "required": true, "description": "Corporate name registered with NPCI (50 characters max)", "example": "AUBL"},
        {"name": "mbAmount", "type": "string", "required": true, "description": "Mandate maximum amount (10 characters max)", "example": "20000"},
        {"name": "mbCustFonCellNum", "type": "string", "required": true, "description": "Mandate holder mobile number (13 characters max)", "example": "9116621202"},
        {"name": "mbCustMailId", "type": "string", "required": true, "description": "Mandate holder email address (40 characters max)", "example": "customer@example.com"},
        {"name": "mbCustName", "type": "string", "required": true, "description": "Mandate holder customer name (40 characters max)", "example": "Barry Allen"},
        {"name": "mbDateFrom", "type": "string", "required": true, "description": "Mandate start date in MM/DD/YYYY format (10 characters max)", "example": "10/28/2024"},
        {"name": "mbDateTo", "type": "string", "required": true, "description": "Mandate end date in MM/DD/YYYY format (10 characters max)", "example": "02/31/2026"},
        {"name": "mbDRAccountNumber", "type": "string", "required": true, "description": "Mandate holder account number (20 characters max)", "example": "2301244951696922"},
        {"name": "mbDRAccountType", "type": "string", "required": true, "description": "Mandate account type: CA (Current Account) or SB (Savings Bank) (4 characters max)", "example": "SB"},
        {"name": "mbDRBankCode", "type": "string", "required": true, "description": "Mandate destination bank code (4 characters max)", "example": "AUBL"},
        {"name": "mbFixedAmount", "type": "string", "required": true, "description": "Fixed amount flag: Y (Fixed amount) or N (Maximum amount) (1 character)", "example": "Y"},
        {"name": "mbFrequencyCode", "type": "string", "required": true, "description": "Frequency code: MNTH (Monthly), QURT (Quarterly), YEAR (Yearly), BIMN (Bimonthly), DAIL (Daily), WEEK (Weekly), ADHO (As and when presented) (4 characters max)", "example": "MNTH"},
        {"name": "mbFrequencyType", "type": "string", "required": true, "description": "Frequency type: RCUR (Recurring) or OOFF (One Off) (4 characters max)", "example": "RCUR"},
        {"name": "mbMandateCategory", "type": "string", "required": true, "description": "Mandate category: L001 (Loan instalment), E001 (Education fees), I001 (Insurance premium), B001 (Bill payment credit card), M001 (Mutual fund), F001 (Subscription fees) (4 characters max)", "example": "L001"},
        {"name": "mbPaymentType", "type": "string", "required": true, "description": "Payment type: DebitCard, NetBanking, or Aadhaar (20 characters max)", "example": "DebitCard"},
        {"name": "mbRefNumber", "type": "string", "required": false, "description": "Customer reference number (20 characters max)", "example": "CUST0001"},
        {"name": "mbRelRefNumber", "type": "string", "required": false, "description": "Scheme name / Plan reference number (20 characters max)", "example": "SCHM0001"},
        {"name": "mbMandateType", "type": "string", "required": true, "description": "Mandate type - always DEBIT (10 characters max)", "example": "DEBIT"},
        {"name": "mbCustPAN", "type": "string", "required": false, "description": "Customer PAN number (10 characters max)", "example": "ABCDE1234F"},
        {"name": "mbCustFonLandNum", "type": "string", "required": false, "description": "Customer landline number (20 characters max)", "example": "02212345678"},
        {"name": "responseURL", "type": "string", "required": false, "description": "Redirect URL after mandate completion (120 characters max)", "example": "https://example.com/callback"},
        {"name": "username", "type": "string", "required": true, "description": "Username registered with AU bank for eNACH portal (50 characters max)", "example": "vsharma"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Mandate creation initiated, user redirected to NPCI portal"},
        {"status": 400, "description": "Bad Request - Invalid mandate parameters"},
        {"status": 401, "description": "Unauthorized - Invalid authentication token"},
        {"status": 500, "description": "Internal Server Error - System error"}
    ]'::jsonb,
    '{"requestId":"2031133004241123","channel":"BijliPay","referenceCode":"203113300424123","mbSponserBankCode":"AUBL0000001","mbSvcProviderCode":"NACH00000000000015","mbSvcProviderName":"AUBL","mbAmount":"20000","mbCustFonCellNum":"9116621202","mbCustMailId":"customer@example.com","mbCustName":"Barry Allen","mbDateFrom":"10/28/2024","mbDateTo":"02/31/2026","mbDRAccountNumber":"2301244951696922","mbDRAccountType":"SB","mbDRBankCode":"AUBL","mbFixedAmount":"Y","mbFrequencyCode":"MNTH","mbFrequencyType":"RCUR","mbMandateCategory":"L001","mbPaymentType":"DebitCard","mbRefNumber":"CUST0001","mbRelRefNumber":"SCHM0001","mbMandateType":"DEBIT","mbCustPAN":"ABCDE1234F","mbCustFonLandNum":"02212345678","responseURL":"https://example.com/callback","username":"vsharma"}',
    '{"ResponseCode":"0","ResponseMessage":"Success","Message":"<html><head></head><body><form id=\\"TheForm\\" action=\\"https://enachuat.npci.org.in:8086/onmags_new/sendRequest\\" method=\\"POST\\" content-type=\\"application/json\\">"}',
    'E-NACH Mandate Creation (Without User Confirmation) API - Creates recurring payment mandates with direct customer authentication. Supports multiple categories (loan, insurance, education), frequencies, and payment methods. Uses MM/DD/YYYY date format.',
    '["E-NACH", "Mandate", "Registration", "Direct-Auth", "Collections"]'::jsonb,
    '{"type": "object", "properties": {"TransactionStatus": {"type": "string"}, "ResponseCode": {"type": "string"}, "ResponseMessage": {"type": "string"}, "Code": {"type": "string"}, "message": {"type": "string"}, "description": {"type": "string"}}}'::jsonb,
    '{"sandbox": 50, "uat": 100, "production": 500}'::jsonb,
    45000,
    true,
    'bearer',
    '["enach:mandate", "enach:create"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 9. E-NACH Mandate Creation (With User Confirmation) API
(
    'enach-mandate-with-user-003',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'E-NACH Mandate Creation (With User Confirmation)',
    '/EmandateUserRegistrationRestService/userconfirmation',
    'POST',
    'Creates E-NACH mandate registration with user confirmation via SMS/Email. Corporate initiates request and customer receives link to authorize mandate. Used when customer is not available during mandate registration.',
    'Create E-NACH mandate with SMS/Email confirmation',
    '[
        {"name": "requestId", "type": "string", "required": true, "description": "Unique request identifier (20 characters max)", "example": "2031133004241123"},
        {"name": "channel", "type": "string", "required": true, "description": "Channel name provided by bank in production (3 characters max)", "example": "BijliPay"},
        {"name": "referenceCode", "type": "string", "required": true, "description": "Any unique generated identifier (10 characters max)", "example": "203113300424123"},
        {"name": "mbSponserBankCode", "type": "string", "required": true, "description": "Registered sponsor bank code (20 characters max)", "example": "AUBL0000001"},
        {"name": "mbSvcProviderCode", "type": "string", "required": true, "description": "NPCI registered provider code - Corporate utility code (20 characters max)", "example": "NACH00000000000015"},
        {"name": "mbSvcProviderName", "type": "string", "required": true, "description": "Corporate name registered with NPCI (50 characters max)", "example": "AUBL"},
        {"name": "mbAmount", "type": "string", "required": true, "description": "Mandate maximum amount (10 characters max)", "example": "20000"},
        {"name": "mbCustFonCellNum", "type": "string", "required": true, "description": "Mandate holder mobile number (13 characters max)", "example": "9116621202"},
        {"name": "mbCustMailId", "type": "string", "required": true, "description": "Mandate holder email address (40 characters max)", "example": "customer@example.com"},
        {"name": "mbCustName", "type": "string", "required": true, "description": "Mandate holder customer name (40 characters max)", "example": "Barry Allen"},
        {"name": "mbDateFrom", "type": "string", "required": true, "description": "Mandate start date in YYYYMMDD format (8 characters)", "example": "20240821"},
        {"name": "mbDateTo", "type": "string", "required": true, "description": "Mandate end date in YYYYMMDD format (8 characters)", "example": "20250928"},
        {"name": "mbDRAccountNumber", "type": "string", "required": true, "description": "Mandate holder account number (20 characters max)", "example": "2301244951696922"},
        {"name": "mbDRAccountType", "type": "string", "required": true, "description": "Mandate account type: CA (Current Account) or SB (Savings Bank) (4 characters max)", "example": "SB"},
        {"name": "mbDRBankCode", "type": "string", "required": true, "description": "Mandate destination bank code (4 characters max)", "example": "AUBL"},
        {"name": "mbFixedAmount", "type": "string", "required": true, "description": "Fixed amount flag: Y (Fixed amount) or N (Maximum amount) (1 character)", "example": "Y"},
        {"name": "mbFrequencyCode", "type": "string", "required": true, "description": "Frequency code: MNTH (Monthly), QURT (Quarterly), YEAR (Yearly), BIMN (Bimonthly), DAIL (Daily), WEEK (Weekly), ADHO (As and when presented) (4 characters max)", "example": "MNTH"},
        {"name": "mbFrequencyType", "type": "string", "required": true, "description": "Frequency type: RCUR (Recurring) or OOFF (One Off) (4 characters max)", "example": "RCUR"},
        {"name": "mbMandateCategory", "type": "string", "required": true, "description": "Mandate category: L001 (Loan instalment), E001 (Education fees), I001 (Insurance premium), B001 (Bill payment credit card), M001 (Mutual fund), F001 (Subscription fees) (4 characters max)", "example": "L001"},
        {"name": "mbPaymentType", "type": "string", "required": true, "description": "Payment type: DebitCard, NetBanking, or Aadhaar (20 characters max)", "example": "DebitCard"},
        {"name": "mbRefNumber", "type": "string", "required": false, "description": "Customer reference number (20 characters max)", "example": "CUST0001"},
        {"name": "mbRelRefNumber", "type": "string", "required": false, "description": "Scheme name / Plan reference number (20 characters max)", "example": "SCHM0001"},
        {"name": "mbMandateType", "type": "string", "required": true, "description": "Mandate type - always DEBIT (10 characters max)", "example": "DEBIT"},
        {"name": "mbCustPAN", "type": "string", "required": false, "description": "Customer PAN number (10 characters max)", "example": "ABCDE1234F"},
        {"name": "mbCustFonLandNum", "type": "string", "required": false, "description": "Customer landline number (20 characters max)", "example": "02212345678"},
        {"name": "responseURL", "type": "string", "required": false, "description": "Redirect URL after mandate completion (120 characters max)", "example": "https://example.com/callback"},
        {"name": "username", "type": "string", "required": true, "description": "Username registered with AU bank for eNACH portal (50 characters max)", "example": "vsharma"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - SMS/Email link generated successfully"},
        {"status": 400, "description": "Bad Request - Invalid mandate parameters"},
        {"status": 401, "description": "Unauthorized - Invalid authentication token"},
        {"status": 500, "description": "Internal Server Error - System error"}
    ]'::jsonb,
    '{"requestId":"2031133004241123","channel":"BijliPay","referenceCode":"203113300424123","mbSponserBankCode":"AUBL0000001","mbSvcProviderCode":"NACH00000000000015","mbSvcProviderName":"AUBL","mbAmount":"20000","mbCustFonCellNum":"9116621202","mbCustMailId":"customer@example.com","mbCustName":"Barry Allen","mbDateFrom":"20240821","mbDateTo":"20250928","mbDRAccountNumber":"2301244951696922","mbDRAccountType":"SB","mbDRBankCode":"AUBL","mbFixedAmount":"Y","mbFrequencyCode":"MNTH","mbFrequencyType":"RCUR","mbMandateCategory":"L001","mbPaymentType":"DebitCard","mbRefNumber":"CUST0001","mbRelRefNumber":"SCHM0001","mbMandateType":"DEBIT","mbCustPAN":"ABCDE1234F","mbCustFonLandNum":"02212345678","responseURL":"https://example.com/callback","username":"vsharma"}',
    '{"Status":"Accepted","Description":"Link generated Successfully","Code":"0"}',
    'E-NACH Mandate Creation (With User Confirmation) API - Creates mandates with SMS/Email confirmation. Customer receives secure link for remote authorization. Uses YYYYMMDD date format. Supports asynchronous mandate registration workflow.',
    '["E-NACH", "Mandate", "Registration", "SMS-Email", "Remote-Auth"]'::jsonb,
    '{"type": "object", "properties": {"Status": {"type": "string"}, "Description": {"type": "string"}, "Code": {"type": "string"}}}'::jsonb,
    '{"sandbox": 50, "uat": 100, "production": 500}'::jsonb,
    45000,
    true,
    'bearer',
    '["enach:mandate", "enach:create", "enach:notification"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 10. E-NACH Status Inquiry (By Reference Code) API
(
    'enach-status-by-reference-004',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'E-NACH Status Inquiry (By Reference Code)',
    '/EmandateStatusService/enquirybyrefId',
    'POST',
    'Retrieves E-NACH mandate registration status using reference code. This API helps track the current status of mandate registration initiated through mandate creation APIs.',
    'Get mandate status using reference code',
    '[
        {"name": "RequestId", "type": "string", "required": true, "description": "Unique request identifier from mandate registration", "example": "SFDC2031303304241123"},
        {"name": "ReferenceCode", "type": "string", "required": true, "description": "Reference code from mandate registration API", "example": "2705572814"},
        {"name": "Channel", "type": "string", "required": true, "description": "Channel identifier", "example": "CV"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Mandate status retrieved successfully"},
        {"status": 400, "description": "Bad Request - Invalid reference parameters"},
        {"status": 404, "description": "Not Found - Mandate not found for given reference"}
    ]'::jsonb,
    '{"RequestId":"SFDC2031303304241123","ReferenceCode":"2705572814","Channel":"CV"}',
    '{"MndtReqId":"MNDT000000017238703554338453381657","RejectBy":"NULL","ReasonDesc":"NULL","MerchantID":"NACH00000000017900","NpciRefMsgID":"MNDT000000017238703554338453381657","ReasonCode":"NULL","MndtId":"AUBL7031708241000306","CycleDate":"NULL","Accptd":"true","ErrorDesc":"NA","ReferenceCode":"2705572814","ErrorCode":"000","ReqInitDate":"2024-08-17","AccptRefNo":"2962036"}',
    'E-NACH Status Inquiry (By Reference Code) API - Tracks mandate registration progress using reference code. Provides detailed mandate information, UMRN generation status, acceptance details, and comprehensive error handling.',
    '["E-NACH", "Status", "Inquiry", "Reference", "Tracking"]'::jsonb,
    '{"type": "object", "properties": {"MndtReqId": {"type": "string"}, "MndtId": {"type": "string"}, "Accptd": {"type": "string"}, "ErrorCode": {"type": "string"}, "ErrorDesc": {"type": "string"}, "ReferenceCode": {"type": "string"}, "ReqInitDate": {"type": "string"}, "AccptRefNo": {"type": "string"}}}'::jsonb,
    '{"sandbox": 100, "uat": 200, "production": 1000}'::jsonb,
    30000,
    true,
    'bearer',
    '["enach:inquiry", "enach:read"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 11. E-NACH Status Inquiry (By UMRN) API
(
    'enach-status-by-umrn-005',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'E-NACH Status Inquiry (By UMRN)',
    '/EmandateStatusService/enquirybyumrn',
    'POST',
    'Retrieves E-NACH mandate registration status using UMRN (Unique Mandate Reference Number). This API helps track mandate status using the unique identifier assigned to each successful mandate.',
    'Get mandate status using UMRN',
    '[
        {"name": "RequestId", "type": "string", "required": true, "description": "Unique request identifier for this inquiry", "example": "uwu928131"},
        {"name": "Channel", "type": "string", "required": true, "description": "Channel identifier", "example": "CV"},
        {"name": "UMRN", "type": "string", "required": true, "description": "Unique Mandate Reference Number (UMRN)", "example": "AUBL7031708241000306"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - UMRN status retrieved successfully"},
        {"status": 400, "description": "Bad Request - Invalid UMRN or parameters"},
        {"status": 404, "description": "Not Found - UMRN not found"}
    ]'::jsonb,
    '{"RequestId":"uwu928131","Channel":"CV","UMRN":"AUBL7031708241000306"}',
    '{"MndtReqId":"MNDT000000017238703554338453381657","RejectBy":"NULL","ReasonDesc":"NULL","MerchantID":"NACH00000000017900","NpciRefMsgID":"MNDT000000017238703554338453381657","ReasonCode":"NULL","MndtId":"AUBL7031708241000306","CycleDate":"NULL","Accptd":"true","ErrorDesc":"NA","ReferenceCode":"2705572814","ErrorCode":"000","ReqInitDate":"2024-08-17","AccptRefNo":"2962036"}',
    'E-NACH Status Inquiry (By UMRN) API - Validates and retrieves mandate status using UMRN. Supports pre-transaction validation, customer service inquiries, and operational mandate verification with comprehensive lifecycle tracking.',
    '["E-NACH", "Status", "Inquiry", "UMRN", "Validation"]'::jsonb,
    '{"type": "object", "properties": {"MndtReqId": {"type": "string"}, "MndtId": {"type": "string"}, "Accptd": {"type": "string"}, "ErrorCode": {"type": "string"}, "ErrorDesc": {"type": "string"}, "ReferenceCode": {"type": "string"}, "ReqInitDate": {"type": "string"}, "AccptRefNo": {"type": "string"}, "MerchantID": {"type": "string"}, "RejectBy": {"type": "string"}, "ReasonDesc": {"type": "string"}}}'::jsonb,
    '{"sandbox": 100, "uat": 200, "production": 1000}'::jsonb,
    30000,
    true,
    'bearer',
    '["enach:inquiry", "enach:read", "umrn:validate"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- =====================================================================
-- SECTION 3: UPI PAYOUT SERVICES (3 APIs)
-- =====================================================================

-- 12. UPI Verify VPA API
(
    'upi-verify-vpa-001',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'UPI Verify VPA',
    '/api/upi-psp-service/v1/verify-vpa',
    'POST',
    'Verifies Virtual Payment Address (VPA) and retrieves associated bank account name and Merchant Category Code (MCC). This is a mandatory API call before initiating any UPI payout transaction.',
    'Verify VPA and get account details with MCC',
    '[
        {"name": "vpa", "type": "string", "required": true, "description": "Virtual Payment Address to be verified (50 characters max)", "example": "astest09@aubank"},
        {"name": "isVpa", "type": "boolean", "required": true, "description": "Flag indicating if the provided string is a VPA (always true)", "example": true},
        {"name": "type", "type": "string", "required": true, "description": "Transaction type identifier (5 characters max)", "example": "INET"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - VPA verified successfully with account details"},
        {"status": 400, "description": "Bad Request - Invalid VPA or parameters"},
        {"status": 401, "description": "Unauthorized - Invalid authentication token"}
    ]'::jsonb,
    '{"vpa":"astest09@aubank","isVpa":true,"type":"INET"}',
    '{"status":"success","data":{"vpaResponseStatus":{"responseCode":"00","message":"Success"},"externalReferenceNumber":null,"limitRestoredMessage":null,"transactionInfo":{"transactionid":"AUS20250409TS5449TE820409A6293B4E07","transactiondatetime":"2025-04-09 06:34:53 PM","result":{"code":"00","message":"SUCCESS","isactive":"true"},"attributes":{"accountname":"Sahab Ram Puniya","mcc":"0000","VPA":"astest09"}},"ChkValue":"kbBUNQnpUXG5f+Qufz3/3t8itQkWUZARPg/o3z4Dy/8=","txnStatus":null},"error":null,"successfulResponse":true}',
    'UPI Verify VPA API - Mandatory verification before UPI payout transactions. Validates VPA, retrieves account holder name and MCC for transaction processing. Uses GCM encryption and real-time NPCI network validation.',
    '["UPI", "VPA", "Verification", "MCC", "Validation"]'::jsonb,
    '{"type": "object", "properties": {"status": {"type": "string"}, "data": {"type": "object", "properties": {"vpaResponseStatus": {"type": "object", "properties": {"responseCode": {"type": "string"}, "message": {"type": "string"}}}, "transactionInfo": {"type": "object", "properties": {"transactionid": {"type": "string"}, "transactiondatetime": {"type": "string"}, "result": {"type": "object", "properties": {"code": {"type": "string"}, "message": {"type": "string"}, "isactive": {"type": "string"}}}, "attributes": {"type": "object", "properties": {"accountname": {"type": "string"}, "mcc": {"type": "string"}, "VPA": {"type": "string"}}}}}}}}}'::jsonb,
    '{"sandbox": 200, "uat": 500, "production": 2000}'::jsonb,
    15000,
    true,
    'bearer',
    '["upi:verify", "upi:read"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 13. UPI Payout API
(
    'upi-payout-002',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'UPI Payout',
    '/api/upi-psp-service/v1/req-pay-transaction',
    'POST',
    'Initiates UPI payment transactions for instant real-time payments. Supports peer-to-peer, person-to-merchant transactions with transaction limits of INR 1 to INR 100,000 (INR 200,000 for loan disbursement).',
    'Initiate UPI payment transaction',
    '[
        {"name": "type", "type": "string", "required": true, "description": "Transaction type identifier (5 characters max)", "example": "INET"},
        {"name": "amount", "type": "string", "required": true, "description": "Transaction amount with decimal precision (10 characters max)", "example": "101.28"},
        {"name": "payeeName", "type": "string", "required": true, "description": "Beneficiary account holder name (100 characters max)", "example": "Sahab Ram Puniya"},
        {"name": "payeeVpa", "type": "string", "required": true, "description": "Beneficiary Virtual Payment Address (50 characters max)", "example": "astest09@aubank"},
        {"name": "payeeMcc", "type": "string", "required": true, "description": "Merchant Category Code from Verify VPA API (10 characters max)", "example": "0000"},
        {"name": "payerName", "type": "string", "required": true, "description": "Payer/merchant name (100 characters max)", "example": "VISHNU CAR SERVICES"},
        {"name": "payerVpa", "type": "string", "required": true, "description": "Payer Virtual Payment Address (50 characters max)", "example": "anirudhaumbcrp1@aubank"},
        {"name": "remarks", "type": "string", "required": true, "description": "Transaction remarks/description (100 characters max)", "example": "test aumbcrp"},
        {"name": "transactionType", "type": "string", "required": true, "description": "Transaction type: Pay or Collect (25 characters max)", "example": "Pay"},
        {"name": "initiationMode", "type": "string", "required": true, "description": "Payment initiation mode code (10 characters max)", "example": "01"},
        {"name": "clTransactionId", "type": "string", "required": true, "description": "Client transaction identifier (40 characters max)", "example": "AUS2045227TS9344E663796615469200081"},
        {"name": "transactionMode", "type": "string", "required": true, "description": "Transaction mode: VPA, ACCOUNT, or MOBILE (15 characters max)", "example": "VPA"},
        {"name": "payerAccount", "type": "string", "required": true, "description": "Payer account number (16 characters max)", "example": "2402227262656964"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - UPI payment transaction initiated successfully"},
        {"status": 400, "description": "Bad Request - Transaction limit exceeded or invalid parameters"},
        {"status": 401, "description": "Unauthorized - Invalid authentication token"},
        {"status": 500, "description": "Internal Server Error - Transaction processing failed"}
    ]'::jsonb,
    '{"type":"INET","amount":"101.28","payeeName":"Sahab Ram Puniya","payeeVpa":"astest09@aubank","payeeMcc":"0000","payerName":"VISHNU CAR SERVICES","payerVpa":"anirudhaumbcrp1@aubank","remarks":"test aumbcrp","transactionType":"Pay","initiationMode":"01","clTransactionId":"AUS2045227TS9344E663796615469200081","transactionMode":"VPA","payerAccount":"2402227262656964"}',
    '{"status":"success","data":{"vpaResponseStatus":{"responseCode":"00","message":"Success"},"externalReferenceNumber":"510115355404","upiId":null,"upiBankName":null,"upiFlow":null,"limitRestoredMessage":null,"transactionInfo":{"transactionid":"AUS2045227TS9344E663796615469200081","transactiondatetime":"2025-04-11 04:50:49 PM","result":{"code":"00","message":"SUCCESS","isactive":"true"},"attributes":{"transactiontype":"Pay","initiationmode":"01","payervpa":"anirudhaumbcrp1@aubank","payeraccount":"2402227262656964","payeename":"Sahab Ram Puniya","payeevpa":"astest09@aubank","payeemcc":"0000","amount":"101.28","remarks":"test aumbcrp","transdatetime":"2025-04-11 04:50:49 PM"}},"ChkValue":"516RC8K3AeJm8S0udjQeC6U29rh+abndL0idBgF15F8=","txnStatus":null},"error":null,"successfulResponse":true}',
    'UPI Payout API - Instant real-time UPI payments with limits INR 1-100,000 (200,000 for loans). Supports P2P, P2M transactions with comprehensive tracking, external reference numbers, and GCM encryption.',
    '["UPI", "Payout", "Payment", "Transaction", "NPCI"]'::jsonb,
    '{"type": "object", "properties": {"status": {"type": "string"}, "data": {"type": "object", "properties": {"vpaResponseStatus": {"type": "object", "properties": {"responseCode": {"type": "string"}, "message": {"type": "string"}}}, "externalReferenceNumber": {"type": "string"}, "transactionInfo": {"type": "object", "properties": {"transactionid": {"type": "string"}, "transactiondatetime": {"type": "string"}, "result": {"type": "object", "properties": {"code": {"type": "string"}, "message": {"type": "string"}, "isactive": {"type": "string"}}}, "attributes": {"type": "object", "properties": {"transactiontype": {"type": "string"}, "amount": {"type": "string"}, "payeename": {"type": "string"}}}}}}}}}'::jsonb,
    '{"sandbox": 100, "uat": 200, "production": 1000}'::jsonb,
    30000,
    true,
    'bearer',
    '["upi:payout", "upi:write", "payment:process"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 14. UPI Transaction Status API
(
    'upi-transaction-status-003',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'UPI Transaction Status',
    '/api/upi-psp-service/v1/get-transaction-status',
    'POST',
    'Retrieves the current status of UPI payout transactions. This API helps track transaction progress, verify completion status, and get detailed transaction information for reconciliation purposes.',
    'Get UPI transaction status and details',
    '[
        {"name": "vpa", "type": "string", "required": true, "description": "Virtual Payment Address of the payer (50 characters max)", "example": "anirudhaumbcrp1@aubank"},
        {"name": "transactionId", "type": "string", "required": true, "description": "Client transaction identifier from payout request (35 characters max)", "example": "AUS2045227TS9344E663796615469200081"},
        {"name": "requestType", "type": "string", "required": true, "description": "Type of transaction to query (20 characters max)", "example": "Pay"},
        {"name": "type", "type": "string", "required": true, "description": "Transaction type identifier (5 characters max)", "example": "INET"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Transaction status retrieved successfully"},
        {"status": 400, "description": "Bad Request - Invalid transaction ID or parameters"},
        {"status": 404, "description": "Not Found - Transaction not found"}
    ]'::jsonb,
    '{"vpa":"anirudhaumbcrp1@aubank","transactionId":"AUS2045227TS9344E663796615469200081","requestType":"Pay","type":"INET"}',
    '{"status":"success","data":{"vpaResponseStatus":{"responseCode":"00","message":"Success"},"externalReferenceNumber":null,"upiId":null,"upiBankName":null,"neftEnabled":false,"rtgsEnabled":false,"upiFlow":null,"limitRestoredMessage":null,"transactionInfo":{"transactionid":"AUS20250411TS9067TE141B8185B8674CCB","transactiondatetime":"2025-04-11 04:59:20 PM","result":{"code":"00","message":"SUCCESS","isactive":"true","codedescription":""},"attributes":{"transactionid":"AUS2045227TS9344E663796615469200081","transactiontype":"PAY","amount":"101.28","remarks":"test aumbcrp","code":"00","direction":"outward","status":"SUCCESS","custrefnumber":"510115355404","RefId":"AUS20250411MS1MEBC4FD9E00BF94E61B52"}},"ChkValue":"pMnlIYaqEsLQqh9RNrG5FP+bUdiI0X7WNlKaX3IqPYA=","txnStatus":null},"error":null,"successfulResponse":true}',
    'UPI Transaction Status API - Real-time transaction status tracking with detailed attributes, reference numbers, direction tracking, and comprehensive reconciliation support. Includes SUCCESS/PENDING/FAILED status monitoring.',
    '["UPI", "Status", "Transaction", "Inquiry", "Reconciliation"]'::jsonb,
    '{"type": "object", "properties": {"status": {"type": "string"}, "data": {"type": "object", "properties": {"vpaResponseStatus": {"type": "object", "properties": {"responseCode": {"type": "string"}, "message": {"type": "string"}}}, "transactionInfo": {"type": "object", "properties": {"transactionid": {"type": "string"}, "transactiondatetime": {"type": "string"}, "result": {"type": "object", "properties": {"code": {"type": "string"}, "message": {"type": "string"}, "isactive": {"type": "string"}}}, "attributes": {"type": "object", "properties": {"transactionid": {"type": "string"}, "transactiontype": {"type": "string"}, "amount": {"type": "string"}, "status": {"type": "string"}, "custrefnumber": {"type": "string"}, "direction": {"type": "string"}}}}}}}}}'::jsonb,
    '{"sandbox": 500, "uat": 1000, "production": 5000}'::jsonb,
    20000,
    true,
    'bearer',
    '["upi:inquiry", "upi:read", "transaction:status"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- =====================================================================
-- SECTION 4: COLLATERAL MANAGEMENT SERVICES (4 APIs)
-- =====================================================================

-- 15. Collateral Dedupe Service API
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

-- 16. Collateral Enquiry Service API
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

-- 17. Collateral Linkage Modification Service API
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

-- 18. Collateral Modification Service API
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
-- SECTION 5: DISBURSEMENT SERVICES (3 APIs)
-- =====================================================================

-- 19. Disburse Loan Calculate EMI Service API
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

-- 20. Disburse Loan Service API
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

-- 21. Generate Disbursement Schedule Service API
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
-- SECTION 6: LOAN MANAGEMENT SERVICES (5 APIs)
-- =====================================================================

-- 22. Get Disbursement Deduction Details Service API
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

-- 23. Get Disbursement Stage API
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

-- 24. Get Loan Account Statement Service API
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

-- 25. Get Loan Closure Details API
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

-- 26. Get Loan Disbursement Details Service API
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
-- SECTION 4: COMMON SERVICES (10 APIs)
-- =====================================================================

INSERT INTO api_endpoints (
    id, category_id, category, name, path, method, description, summary, 
    parameters, headers, responses, request_example, response_example, 
    documentation, tags, response_schema, rate_limits, timeout, 
    requires_auth, auth_type, required_permissions, is_active, is_internal, 
    status, version, created_at, updated_at
) VALUES

-- 1. SMS Communication Service
(
    'common-communications-sms-send-001',
    '8a2b3c4d-5e6f-7890-ab12-cd34ef567890',
    'Common Services',
    'SMS Communication Service',
    '/CommunicationRestService/sendSMS',
    'POST',
    'Send SMS communications to customers for debit, credit, and spend alerts with whitelisted templates and OTP/Non-OTP message types.',
    'Send SMS notifications to customers',
    '[{"name": "RequestId", "type": "string", "required": true, "description": "Unique Reference number (32 characters max)", "example": "12343566"}, {"name": "Channel", "type": "string", "required": true, "description": "Channel name to identify from which application request received (10 characters max)", "example": "DEC"}, {"name": "GroupID", "type": "string", "required": true, "description": "Static identifier (6 characters max)", "example": "AUBANK"}, {"name": "ContentType", "type": "string", "required": true, "description": "Static content type indicator", "example": "1"}, {"name": "NationalorInternational", "type": "string", "required": true, "description": "National/International indicator (1 for National, 2 for International)", "example": "1"}, {"name": "MessageType", "type": "string", "required": true, "description": "Static message type", "example": "S"}, {"name": "IsOTPMessage", "type": "string", "required": true, "description": "OTP/NON-OTP indicator (0 for non-OTP, 1 for OTP)", "example": "1"}, {"name": "LanguageId", "type": "string", "required": true, "description": "Language identifier", "example": "en"}, {"name": "Message.MobileNumber", "type": "string", "required": true, "description": "Customer mobile number (12 characters max)", "example": "7358506535"}, {"name": "Message.MessageText", "type": "string", "required": true, "description": "Message text with whitelisted template (100 characters max)", "example": "213054 is your OTP to verify your Mobile no. 9636329727 for your Savings Account"}]'::jsonb,
    '[{"name": "Content-Type", "value": "application/json", "required": true}, {"name": "Authorization", "value": "Bearer <access_token>", "required": true}]'::jsonb,
    '[{"status": 200, "description": "Success - SMS sent successfully", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"0\",\"ResponseMessage\":\"Success\",\"ExtendedErrorDetails\":{\"messages\":{\"code\":\"0\",\"message\":\"7358506535 : APP-DECIMAL-1757395359743-386-DC0101: Success\"}}}}"}, {"status": 400, "description": "Bad Request - Invalid SMS parameters", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"400\",\"ResponseMessage\":\"Bad Request\"}}"}, {"status": 401, "description": "Unauthorized - Invalid authentication credentials", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"401\",\"ResponseMessage\":\"Unauthorized\"}}"}]'::jsonb,
    '{"Message": {"MobileNumber": "7358506535", "MessageText": "213054 is your OTP to verify your Mobile no. 9636329727 for your Savings Account"}, "RequestId": "12343566", "Channel": "DEC", "GroupID": "AUBANK", "ContentType": "1", "NationalorInternational": "1", "MessageType": "S", "IsOTPMessage": "1", "LanguageId": "en"}',
    '{"TransactionStatus": {"ResponseCode": "0", "ResponseMessage": "Success", "ExtendedErrorDetails": {"messages": {"code": "0", "message": "7358506535 : APP-DECIMAL-1757395359743-386-DC0101: Success"}}}}',
    'SMS communication service for customer notifications and alerts',
    '["Common", "Communications", "SMS"]'::jsonb,
    '{"type": "object", "properties": {"TransactionStatus": {"type": "object", "properties": {"ResponseCode": {"type": "string"}, "ResponseMessage": {"type": "string"}, "ExtendedErrorDetails": {"type": "object"}}}}}'::jsonb,
    '{"sandbox": 100, "production": 1000}'::jsonb,
    30000,
    true,
    'bearer',
    '["common:communications", "common:read"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 2. Email Communication Service
(
    'common-communications-email-send-002',
    '8a2b3c4d-5e6f-7890-ab12-cd34ef567890',
    'Common Services',
    'Email Communication Service',
    '/CommunicationRestService/mail',
    'POST',
    'Send email communications to customers with support for TO, CC, BCC recipients and customizable subject and body content.',
    'Send email notifications to customers',
    '[{"name": "RequestId", "type": "string", "required": true, "description": "Unique Reference number (32 characters max)", "example": "123456"}, {"name": "Channel", "type": "string", "required": true, "description": "Channel name to identify from which application request received (10 characters max)", "example": "DEC"}, {"name": "TO", "type": "string", "required": true, "description": "Primary email address (20 characters max)", "example": "customer@example.com"}, {"name": "CC", "type": "string", "required": false, "description": "CC email address (20 characters max)", "example": "cc@example.com"}, {"name": "BCC", "type": "string", "required": false, "description": "BCC email address (20 characters max)", "example": "bcc@example.com"}, {"name": "Subject", "type": "string", "required": true, "description": "Email subject line (30 characters max)", "example": "Account Alert Notification"}, {"name": "Text", "type": "string", "required": true, "description": "Email body text (100 characters max)", "example": "Your account has been updated successfully."}]'::jsonb,
    '[{"name": "Content-Type", "value": "application/json", "required": true}, {"name": "Authorization", "value": "Bearer <access_token>", "required": true}]'::jsonb,
    '[{"status": 200, "description": "Success - Email sent successfully", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"0\",\"ResponseMessage\":\"Success\",\"ExtendedErrorDetails\":{\"messages\":{\"code\":\"0\",\"message\":\"Email Request has been Acknowledged\"}}}}"}, {"status": 400, "description": "Bad Request - Invalid email parameters", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"400\",\"ResponseMessage\":\"Bad Request\"}}"}, {"status": 401, "description": "Unauthorized - Invalid authentication credentials", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"401\",\"ResponseMessage\":\"Unauthorized\"}}"}]'::jsonb,
    '{"RequestId": "123456", "Channel": "DEC", "TO": "customer@example.com", "CC": "cc@example.com", "BCC": "bcc@example.com", "Subject": "Account Alert Notification", "Text": "Your account has been updated successfully."}',
    '{"TransactionStatus": {"ResponseCode": "0", "ResponseMessage": "Success", "ExtendedErrorDetails": {"messages": {"code": "0", "message": "Email Request has been Acknowledged"}}}}',
    'Email communication service for customer notifications and alerts',
    '["Common", "Communications", "Email"]'::jsonb,
    '{"type": "object", "properties": {"TransactionStatus": {"type": "object", "properties": {"ResponseCode": {"type": "string"}, "ResponseMessage": {"type": "string"}, "ExtendedErrorDetails": {"type": "object"}}}}}'::jsonb,
    '{"sandbox": 100, "production": 1000}'::jsonb,
    30000,
    true,
    'bearer',
    '["common:communications", "common:read"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 3. Generate OTP
(
    'common-otp-generate-005',
    '8a2b3c4d-5e6f-7890-ab12-cd34ef567890',
    'Common Services',
    'Generate OTP',
    '/OTPEngineRestService/generateOTP',
    'POST',
    'Generate one-time password (OTP) for customer verification with configurable length, timeout, and delivery via SMS and email.',
    'Generate OTP for customer verification',
    '[{"name": "requestId", "type": "string", "required": true, "description": "Unique Reference number (32 characters max)", "example": "4543656546"}, {"name": "channel", "type": "string", "required": true, "description": "Channel name (10 characters max)", "example": "FABL"}, {"name": "otptype", "type": "string", "required": true, "description": "OTP type indicator", "example": "1"}, {"name": "msgContent", "type": "string", "required": true, "description": "SMS message content with OTP placeholder (100 characters max)", "example": "The Otp is {0} generated sucessfully - AU Bank"}, {"name": "emailContent", "type": "string", "required": true, "description": "Email content with OTP placeholder (100 characters max)", "example": "The Otp is {0} generated sucessfully - AU Bank"}, {"name": "mobile", "type": "string", "required": true, "description": "Customer mobile number (32 characters max)", "example": "7989443652"}, {"name": "custRef", "type": "string", "required": true, "description": "Customer reference number (20 characters max)", "example": "3012011"}, {"name": "emailId", "type": "string", "required": true, "description": "Customer email ID (20 characters max)", "example": "customer@example.com"}, {"name": "otptimeout", "type": "string", "required": true, "description": "OTP timeout in seconds (10 characters max)", "example": "180"}, {"name": "otplength", "type": "string", "required": true, "description": "OTP length (6 characters max)", "example": "6"}]'::jsonb,
    '[{"name": "Content-Type", "value": "application/json", "required": true}, {"name": "Authorization", "value": "Bearer <access_token>", "required": true}]'::jsonb,
    '[{"status": 200, "description": "Success - OTP generated successfully", "example": "{\"StatusDesc\":\"The Otp is generated successfully\",\"CustRef\":\"3012011\",\"StatusCode\":100,\"RequestStatus\":\"Success\"}"}, {"status": 400, "description": "Bad Request - Invalid OTP parameters", "example": "{\"StatusDesc\":\"Invalid parameters\",\"StatusCode\":400,\"RequestStatus\":\"Failed\"}"}, {"status": 401, "description": "Unauthorized - Invalid authentication credentials", "example": "{\"StatusDesc\":\"Unauthorized\",\"StatusCode\":401,\"RequestStatus\":\"Failed\"}"}]'::jsonb,
    '{"otptype": "1", "msgContent": "The Otp is {0} generated sucessfully - AU Bank", "requestId": "4543656546", "channel": "FABL", "emailContent": "The Otp is {0} generated sucessfully - AU Bank", "mobile": "7989443652", "custRef": "3012011", "emailId": "customer@example.com", "otptimeout": "180", "otplength": "6"}',
    '{"StatusDesc": "The Otp is generated successfully", "CustRef": "3012011", "StatusCode": 100, "RequestStatus": "Success"}',
    'OTP generation service for secure customer verification',
    '["Common", "OTP", "Security", "Authentication"]'::jsonb,
    '{"type": "object", "properties": {"StatusDesc": {"type": "string"}, "CustRef": {"type": "string"}, "StatusCode": {"type": "number"}, "RequestStatus": {"type": "string"}}}'::jsonb,
    '{"sandbox": 20, "production": 200}'::jsonb,
    30000,
    true,
    'bearer',
    '["common:otp", "common:read"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 4. Validate OTP
(
    'common-otp-validate-006',
    '8a2b3c4d-5e6f-7890-ab12-cd34ef567890',
    'Common Services',
    'Validate OTP',
    '/OTPEngineRestService/validateOTP',
    'POST',
    'Validate customer-provided OTP against previously generated OTP for secure transaction verification.',
    'Validate customer OTP',
    '[{"name": "requestId", "type": "string", "required": true, "description": "Unique Reference number (32 characters max)", "example": "65465656"}, {"name": "channel", "type": "string", "required": true, "description": "Channel name (10 characters max)", "example": "FABL"}, {"name": "mobile", "type": "string", "required": true, "description": "Customer mobile number (12 characters max)", "example": "7989443652"}, {"name": "custRef", "type": "string", "required": true, "description": "Customer reference from generate OTP (20 characters max)", "example": "8606661204"}, {"name": "emailId", "type": "string", "required": true, "description": "Customer email ID (20 characters max)", "example": "customer@example.com"}, {"name": "otp", "type": "string", "required": true, "description": "OTP in encrypted format (30 characters max)", "example": "kf4kgcTRxSAQd4J+u62RVw=="}]'::jsonb,
    '[{"name": "Content-Type", "value": "application/json", "required": true}, {"name": "Authorization", "value": "Bearer <access_token>", "required": true}]'::jsonb,
    '[{"status": 200, "description": "Success - OTP validated successfully", "example": "{\"StatusDesc\":\"OTP Verified successfully\",\"CustRef\":\"8606661204\",\"StatusCode\":100,\"RequestStatus\":\"Success\"}"}, {"status": 400, "description": "Bad Request - Invalid OTP or parameters", "example": "{\"StatusDesc\":\"Invalid OTP\",\"StatusCode\":400,\"RequestStatus\":\"Failed\"}"}, {"status": 401, "description": "Unauthorized - Invalid authentication credentials", "example": "{\"StatusDesc\":\"Unauthorized\",\"StatusCode\":401,\"RequestStatus\":\"Failed\"}"}]'::jsonb,
    '{"channel": "FABL", "requestId": "65465656", "mobile": "7989443652", "emailId": "customer@example.com", "otp": "kf4kgcTRxSAQd4J+u62RVw==", "custRef": "8606661204"}',
    '{"StatusDesc": "OTP Verified successfully", "CustRef": "8606661204", "StatusCode": 100, "RequestStatus": "Success"}',
    'OTP validation service for secure customer verification',
    '["Common", "OTP", "Security", "Validation"]'::jsonb,
    '{"type": "object", "properties": {"StatusDesc": {"type": "string"}, "CustRef": {"type": "string"}, "StatusCode": {"type": "number"}, "RequestStatus": {"type": "string"}}}'::jsonb,
    '{"sandbox": 50, "production": 500}'::jsonb,
    15000,
    true,
    'bearer',
    '["common:otp", "common:read"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 5. WhatsApp Send Message
(
    'common-whatsapp-send-message-010',
    '8a2b3c4d-5e6f-7890-ab12-cd34ef567890',
    'Common Services',
    'WhatsApp Send Message',
    '/ValueFirstWhatsappIntegration/Message',
    'POST',
    'Send WhatsApp messages to customers with support for various message types including text, images, and templates.',
    'Send WhatsApp messages to customers',
    '[{"name": "DLR.URL", "type": "string", "required": false, "description": "Delivery receipt URL", "example": ""}, {"name": "SMS[0].TYPE", "type": "string", "required": true, "description": "Message type (text/image)", "example": "image"}, {"name": "SMS[0].TEMPLATENAME", "type": "string", "required": true, "description": "WhatsApp template name", "example": "raf_amazon~Customer"}, {"name": "SMS[0].LANGUAGE", "type": "string", "required": true, "description": "Message language", "example": "english"}, {"name": "SMS[0].CONTENTTYPE", "type": "string", "required": true, "description": "Content MIME type", "example": "image/jpeg"}, {"name": "SMS[0].MSGTYPE", "type": "string", "required": true, "description": "Message type code", "example": "3"}, {"name": "SMS[0].MEDIADATA", "type": "string", "required": false, "description": "Media URL for images/files", "example": "https://example.com/image.jpg"}, {"name": "SMS[0].ADDRESS[0].FROM", "type": "string", "required": true, "description": "Sender WhatsApp number", "example": "919116002622"}, {"name": "SMS[0].ADDRESS[0].TO", "type": "string", "required": true, "description": "Recipient WhatsApp number", "example": "911552741000"}, {"name": "SMS[0].ADDRESS[0].SEQ", "type": "string", "required": true, "description": "Sequence number", "example": "1"}, {"name": "SMS[0].ADDRESS[0].TAG", "type": "string", "required": true, "description": "Message tag identifier", "example": "65099088~1447482036"}]'::jsonb,
    '[{"name": "Content-Type", "value": "application/json", "required": true}, {"name": "Authorization", "value": "Bearer <access_token>", "required": true}]'::jsonb,
    '[{"status": 200, "description": "Success - WhatsApp message sent successfully", "example": "{\"MESSAGEACK\":{\"GUID\":[{\"GUID\":\"kp99l0153580k4f440e00sa726AUBANKWAXM\",\"SUBMITDATE\":\"2025-09-09 21:01:53\",\"ID\":\"1\",\"ERROR\":{\"SEQ\":\"1\",\"CODE\":\"28673\"}}]}}"}, {"status": 400, "description": "Bad Request - Invalid message parameters", "example": "{\"error\":\"Bad Request\",\"code\":400}"}, {"status": 401, "description": "Unauthorized - Invalid authentication credentials", "example": "{\"error\":\"Unauthorized\",\"code\":401}"}]'::jsonb,
    '{"DLR": {"URL": ""}, "SMS": [{"TYPE": "image", "TEMPLATENAME": "raf_amazon~Customer", "LANGUAGE": "english", "CONTENTTYPE": "image/jpeg", "BTN_PAYLOADS": [], "MSGTYPE": "3", "MEDIADATA": "https://example.com/image.jpg", "ADDRESS": [{"FROM": "919116002622", "TO": "911552741000", "SEQ": "1", "TAG": "65099088~1447482036"}]}]}',
    '{"MESSAGEACK": {"GUID": [{"GUID": "kp99l0153580k4f440e00sa726AUBANKWAXM", "SUBMITDATE": "2025-09-09 21:01:53", "ID": "1", "ERROR": {"SEQ": "1", "CODE": "28673"}}]}}',
    'WhatsApp integration service for customer messaging',
    '["Common", "WhatsApp", "Messaging", "Communication"]'::jsonb,
    '{"type": "object", "properties": {"MESSAGEACK": {"type": "object", "properties": {"GUID": {"type": "array", "items": {"type": "object"}}}}}}'::jsonb,
    '{"sandbox": 50, "production": 1000}'::jsonb,
    30000,
    true,
    'bearer',
    '["common:messaging", "common:read"]'::jsonb,
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
    RAISE NOTICE 'AU BANK API ENDPOINTS INSERTION COMPLETE';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total APIs inserted: 36';
    RAISE NOTICE 'Additional BBPS Services: 6 APIs';
    RAISE NOTICE 'E-NACH Services: 5 APIs';
    RAISE NOTICE 'UPI Payout Services: 3 APIs';
    RAISE NOTICE 'Collateral Management Services: 4 APIs';
    RAISE NOTICE 'Disbursement Services: 3 APIs';
    RAISE NOTICE 'Loan Management Services: 5 APIs';
    RAISE NOTICE 'Common Services: 10 APIs';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'All services are now active and available';
    RAISE NOTICE 'in the AU Bank Developer Portal';
    RAISE NOTICE '========================================';
END $$;