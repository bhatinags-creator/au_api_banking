-- =====================================================================
-- AU BANK DEVELOPER PORTAL - PRODUCTION API ENDPOINTS INSERT SCRIPT
-- =====================================================================
-- 
-- GENERATED: December 2024
-- TOTAL APIs: 14 comprehensive API services
-- CATEGORY: Payments (4657e5d5-b563-4f88-a81f-b653f52a59db)
--
-- SERVICES INCLUDED:
-- 1. Additional BBPS Services (6 APIs)
-- 2. E-NACH Services (5 APIs)  
-- 3. UPI Payout Services (3 APIs)
--
-- ⚠️  PRODUCTION WARNING:
-- - This script modifies the production database
-- - Ensure you have proper backups before execution
-- - Test in UAT environment first if possible
-- - Verify payment category ID exists in target database
-- 
-- EXECUTION:
-- Run this script as a single transaction on production PostgreSQL
-- 
-- =====================================================================

BEGIN;

-- Verify Payments category exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM api_categories WHERE id = '4657e5d5-b563-4f88-a81f-b653f52a59db') THEN
        RAISE EXCEPTION 'Payments category not found. Please verify category_id before proceeding.';
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
    RAISE NOTICE 'Total APIs inserted: 14';
    RAISE NOTICE 'Additional BBPS Services: 6 APIs';
    RAISE NOTICE 'E-NACH Services: 5 APIs';
    RAISE NOTICE 'UPI Payout Services: 3 APIs';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'All services are now active and available';
    RAISE NOTICE 'in the AU Bank Developer Portal';
    RAISE NOTICE '========================================';
END $$;