-- E-NACH Services SQL Insert Script
-- Generated from AU Small Finance Bank E-NACH API Banking Integration Document v1.1
-- Category: Payments

INSERT INTO api_endpoints (
    id, category_id, category, name, path, method, description, summary, 
    parameters, headers, responses, request_example, response_example, 
    documentation, tags, response_schema, rate_limits, timeout, 
    requires_auth, auth_type, required_permissions, is_active, is_internal, 
    status, version, created_at, updated_at
) VALUES

-- 1. E-NACH OAuth Token Generation API
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

-- 2. E-NACH Mandate Creation (Without User Confirmation) API
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

-- 3. E-NACH Mandate Creation (With User Confirmation) API
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

-- 4. E-NACH Status Inquiry (By Reference Code) API
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

-- 5. E-NACH Status Inquiry (By UMRN) API
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
  AND name LIKE '%E-NACH%'
ORDER BY name;