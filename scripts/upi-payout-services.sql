-- UPI Payout Services SQL Insert Script
-- Generated from AU Bank UPI Payout API Banking Integration Document v1.0
-- Category: Payments

INSERT INTO api_endpoints (
    id, category_id, category, name, path, method, description, summary, 
    parameters, headers, responses, request_example, response_example, 
    documentation, tags, response_schema, rate_limits, timeout, 
    requires_auth, auth_type, required_permissions, is_active, is_internal, 
    status, version, created_at, updated_at
) VALUES

-- 1. UPI Verify VPA API
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

-- 2. UPI Payout API
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

-- 3. UPI Transaction Status API
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
  AND name LIKE '%UPI%'
ORDER BY name;