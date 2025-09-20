-- Additional BBPS Services SQL Insert Script
-- Generated from BBPS API documentation (Bill Payment, Bill Validate, Check Complaint Status, Get Circle Biller, Raise Complaint, Transaction Status Mobile)
-- Category: Payments

INSERT INTO api_endpoints (
    id, category_id, category, name, path, method, description, summary, 
    parameters, headers, responses, request_example, response_example, 
    documentation, tags, response_schema, rate_limits, timeout, 
    requires_auth, auth_type, required_permissions, is_active, is_internal, 
    status, version, created_at, updated_at
) VALUES

-- 5. Bill Payment API
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

-- 6. Bill Validate API
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

-- 7. Check Complaint Status API
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

-- 8. Get Circle Biller API
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

-- 9. Raise Complaint API
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

-- 10. Transaction Status Mobile API
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
);

-- Verification Query
SELECT 
    name,
    method,
    path,
    category,
    status,
    is_active
FROM api_endpoints 
WHERE category = 'Payments' 
  AND name IN ('Bill Payment', 'Bill Validate', 'Check Complaint Status', 'Get Circle Biller', 'Raise Complaint', 'Transaction Status Mobile')
ORDER BY name;