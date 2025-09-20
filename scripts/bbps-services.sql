-- BBPS Services SQL Insert Script
-- Generated from BBPS API documentation (Biller Details, Bill Fetch, Biller Details, Biller List)
-- Category: Payments

INSERT INTO api_endpoints (
    id, category_id, category, name, path, method, description, summary, 
    parameters, headers, responses, request_example, response_example, 
    documentation, tags, response_schema, rate_limits, timeout, 
    requires_auth, auth_type, required_permissions, is_active, is_internal, 
    status, version, created_at, updated_at
) VALUES

-- 1. Get All Circles API
(
    'bbps-get-all-circles-001',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'Get All Circles',
    '/bbpsservice/GetAllCircleBiller',
    'POST',
    'Retrieves all available circles for a specific biller in the BBPS system. This API helps agent institutions get circle information for billers registered with NPCI.',
    'Get all circles for a biller',
    '[
        {"name": "ver", "type": "string", "required": true, "description": "Version of the API (e.g., 1.0)", "example": "1.0"},
        {"name": "ts", "type": "string", "required": true, "description": "Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format", "example": "2023-04-03T11:18:11+05:30"},
        {"name": "origInst", "type": "string", "required": true, "description": "Code assigned by NPCI to each agent institution (4 characters)", "example": "OU01"},
        {"name": "refId", "type": "string", "required": true, "description": "Unique identification (35 characters) with format: 27 random chars + YDDDhhmm", "example": "ABCDE12345ABCDE12345ABCDE1A01192345"},
        {"name": "billerId", "type": "string", "required": true, "description": "Unique identification code allocated to the Biller by NPCI (14 characters)", "example": "MAHA00000MUM01"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Circle information retrieved successfully"},
        {"status": 400, "description": "Bad Request - Invalid parameters"},
        {"status": 500, "description": "Internal Server Error"}
    ]'::jsonb,
    '{"ReferenceNumber":"string","TransactionBranch":100,"RequestId":"string","OriginatingChannel":"string","Header":{"Ver":1.051732E+7,"TimeStamp":"string","OrigInst":"string","RefId":"string"},"Search":{"BillerId":"string"}}',
    '{"Header":{"Ver":"1.0","OrigInst":"AU01","RefId":"ABCDE12345ABCDE12345ABCDE1A01192345","TimeStamp":"2023-04-03T11:18:11+05:30"},"TransactionStatus":{"ResponseCode":"000","ResponseMessage":"Successful"},"Reason":{"ResponseCode":0,"ResponseReason":"Successful"},"circleNme":"Maharashtra","billerId":"MAHA00000MUM01"}',
    'Get All Circles API - Retrieves all available circles for a specific biller in the BBPS system. Supports agent institutions in bill payment operations with comprehensive error handling and real-time circle information.',
    '["BBPS", "Biller", "Circles", "NPCI"]'::jsonb,
    '{"type": "object", "properties": {"Header": {"type": "object"}, "TransactionStatus": {"type": "object"}, "circleNme": {"type": "string"}, "billerId": {"type": "string"}}}'::jsonb,
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

-- 2. Bill Fetch API
(
    'bbps-bill-fetch-002',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'Bill Fetch',
    '/bbpsservice/BillFetch',
    'POST',
    'Fetches bill details for a customer from the biller system. This API allows customers to retrieve their pending bills with amount, due date, and other relevant information.',
    'Fetch customer bill details',
    '[
        {"name": "ver", "type": "string", "required": true, "description": "Version of the API (e.g., 1.0)", "example": "1.0"},
        {"name": "ts", "type": "string", "required": true, "description": "Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format", "example": "2023-03-28T13:19:09+05:30"},
        {"name": "origInst", "type": "string", "required": true, "description": "Code assigned by NPCI to each BBPOU", "example": "AU01"},
        {"name": "refId", "type": "string", "required": true, "description": "Unique identification (35 characters) for end-to-end transaction tracking", "example": "AU01BBPSBillFetchRqust3561730871319"},
        {"name": "msgId", "type": "string", "required": true, "description": "Unique identification to relate request and response message", "example": "AU01BBPSBillFetchRqust3561730871319"},
        {"name": "customerMobile", "type": "string", "required": true, "description": "Customer mobile number (10 digits)", "example": "9922998872"},
        {"name": "agentId", "type": "string", "required": true, "description": "Unique identification code allocated to the Agent by NPCI", "example": "AU01AU03AGT525314031"},
        {"name": "billerId", "type": "string", "required": true, "description": "Unique identification code allocated to the Biller by NPCI", "example": "SHAL00000NAT8K"},
        {"name": "customerParams", "type": "array", "required": true, "description": "Customer parameters for bill fetch (max 5 parameters)", "example": "[{\"Name\": \"SL Number\", \"Value\": \"Mo004\"}, {\"Name\": \"Mobile Number\", \"Value\": \"9090909090\"}]"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Bill details retrieved successfully"},
        {"status": 400, "description": "Bad Request - Invalid customer parameters"},
        {"status": 404, "description": "Not Found - Bill not found for given parameters"}
    ]'::jsonb,
    '{"Agent":{"Device":[{"Value":"INTB","Name":"INITIATING_CHANNEL"},{"Value":"10.57.18.74","Name":"IP"},{"Value":"00-14-4F-FA-1E-B4","Name":"MAC"}],"Id":"AU01AU03AGT525314031"},"Head":{"Ver":"1.0","OrigInst":"AU01","RefId":"AU01BBPSBillFetchRqust3561730871319","TS":"2023-03-28T13:19:09+05:30"},"Customer":{"Mobile":"9922998872","Tags":{"Value":"abc@gmail.com","Name":"EMAIL"}},"BillDetails":{"CustomerParams":[{"Value":"Mo004","Name":"SL Number"},{"Value":"9090909090","Name":"Mobile Number"}],"BillerId":"SHAL00000NAT8K"}}',
    '{"Head":{"Ver":"1.0","OrigInst":"AU11","RefId":"AU01BBPSBillFetchRqust3561730871319","TS":"2023-03-29T16:25:17+05:30"},"BillerResponse":{"BillPeriod":"March 2023","Amount":121300,"CustomerName":"Hitesh Kapoor","DueDate":"2023-04-15","BillDate":"2023-03-01","BillNumber":"BILL123456","Tags":[{"Value":"12130","Name":"Monthly EMI"}]},"TransactionStatus":{"ResponseCode":"000","ResponseMessage":"Successful"},"Reason":{"ResponseCode":0,"ApprovalRefNum":"AU01BBPSBillFetchRqust3561730871319","ResponseReason":"Successful"}}',
    'Bill Fetch API - Fetches bill details for customers from biller systems in the BBPS ecosystem. Provides real-time bill information with amount in paise format, customer validation, and comprehensive error handling.',
    '["BBPS", "Bill", "Fetch", "Customer", "Payment"]'::jsonb,
    '{"type": "object", "properties": {"Head": {"type": "object"}, "BillerResponse": {"type": "object", "properties": {"Amount": {"type": "number"}, "CustomerName": {"type": "string"}, "DueDate": {"type": "string"}}}, "TransactionStatus": {"type": "object"}}}'::jsonb,
    '{"sandbox": 100, "uat": 500, "production": 1000}'::jsonb,
    45000,
    true,
    'bearer',
    '["bbps:read", "bbps:fetch", "sandbox"]'::jsonb,
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 3. Biller Details API
(
    'bbps-biller-details-003',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'Biller Details',
    '/bbpsservice/BillerDetails',
    'POST',
    'Retrieves comprehensive details of a specific biller registered with NPCI. This API provides complete biller information including payment modes, channels, parameters, and configuration details.',
    'Get detailed information about a specific biller',
    '[
        {"name": "ver", "type": "string", "required": false, "description": "Version of the API (e.g., 1.0)", "example": "1.0"},
        {"name": "origInst", "type": "string", "required": false, "description": "Code assigned by NPCI to each agent institution", "example": "AU01"},
        {"name": "refId", "type": "string", "required": false, "description": "Unique identification for transaction tracking", "example": "ABCDE12345ABCDE12345ABCDE1A01192345"},
        {"name": "ts", "type": "string", "required": false, "description": "Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format", "example": "2023-04-03T10:50:17+05:30"},
        {"name": "billerId", "type": "string", "required": true, "description": "Unique identification code allocated to the Biller by NPCI", "example": "ALFA00000RAJH1"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Biller details retrieved successfully"},
        {"status": 400, "description": "Bad Request - Invalid biller ID"},
        {"status": 404, "description": "Not Found - Biller not found"}
    ]'::jsonb,
    '{"ReferenceNumber":"9172837123","TransactionBranch":"2001","RequestId":"BBPSCreateSI1677996401629","OriginatingChannel":"DEC","Biller":{"BillerId":"ALFA00000RAJH1"}}',
    '{"Header":{"Ver":1.0,"OrigInst":"AU01","RefId":null,"TimeStamp":"2023-04-03T10:50:17"},"Biller":{"BillerId":"ALFA00000RAJH1","BillerName":"ALFASTAR INDIA NIDHI LIMITED","BillerAliasName":"ALFASTAR INDIA NIDHI LIMITED","BillerCategoryName":"Loan Repayment","BillerMode":"OFFLINEA","BillerAcceptsAdhoc":"false","ParentBiller":"false","BillerOwnerShp":"Private","BillerCoverage":"IND-RAJ","FetchRequirement":"MANDATORY","PaymentAmountExactness":"EXACT UP","SupportBillValidation":"NOT_SUPPORTED","SupportDeemed":"Yes","SupportPendingStatus":"No","Status":"Active","BillerEffectiveFrom":"20-02-2023","BillerEffectiveTo":"31-12-2033"},"TransactionStatus":{"ResponseCode":"000","ResponseMessage":"Successful"}}',
    'Biller Details API - Retrieves comprehensive details of billers registered with NPCI. Provides complete biller information, payment modes, customer parameters, interchange fee configuration, and support flags.',
    '["BBPS", "Biller", "Details", "Configuration", "NPCI"]'::jsonb,
    '{"type": "object", "properties": {"Header": {"type": "object"}, "Biller": {"type": "object", "properties": {"BillerId": {"type": "string"}, "BillerName": {"type": "string"}, "BillerCategoryName": {"type": "string"}, "BillerMode": {"type": "string"}, "Status": {"type": "string"}}}, "TransactionStatus": {"type": "object"}}}'::jsonb,
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

-- 4. Biller List API
(
    'bbps-biller-list-004',
    '4657e5d5-b563-4f88-a81f-b653f52a59db',
    'Payments',
    'Biller List',
    '/bbpsservice/BillerList',
    'POST',
    'Retrieves a list of all billers registered with NPCI in the BBPS ecosystem. This API allows filtering by category and last updated date to get relevant biller information.',
    'Get list of registered billers',
    '[
        {"name": "ver", "type": "string", "required": true, "description": "Version of the API (e.g., 1.0)", "example": "1.0"},
        {"name": "origInst", "type": "string", "required": true, "description": "Code assigned by NPCI to each agent institution", "example": "AU01"},
        {"name": "refId", "type": "string", "required": true, "description": "Unique identification for end-to-end process tracking", "example": "ABCDE12345ABCDE12345ABCDE1A01192345"},
        {"name": "ts", "type": "string", "required": true, "description": "Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format", "example": "2023-04-03T11:18:11+05:30"},
        {"name": "category", "type": "string", "required": false, "description": "Category of Biller (e.g., Electricity, Water, DTH, Mobile Postpaid)", "example": "Mobile Postpaid"},
        {"name": "lastUpdated", "type": "string", "required": false, "description": "Date when biller was last updated (YYYY-MM-DD format)", "example": "2023-03-01"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json", "required": true},
        {"name": "Authorization", "value": "Bearer <token>", "required": true}
    ]'::jsonb,
    '[
        {"status": 200, "description": "Success - Biller list retrieved successfully"},
        {"status": 400, "description": "Bad Request - Invalid category or parameters"},
        {"status": 404, "description": "Not Found - No billers found for given criteria"}
    ]'::jsonb,
    '{"ReferenceNumber":"BBPSListBiller1577427162167","TransactionBranch":"0","RequestId":"BBPSCreateSI1677996401629","OriginatingChannel":"DEC","Search":{"Category":"Mobile Postpaid"}}',
    '{"Billers":[{"Status":"Active","BillerCategoryName":"Mobile Postpaid","BillerId":"TELECOM00NAT01","BillerName":"Air Voice","BillerAliasName":"BHIM Biller","LastUpdated":"23-10-2021"},{"Status":"Active","BillerCategoryName":"Mobile Postpaid","BillerId":"ARCL00000NAT01","BillerName":"Aircel Postpaid","BillerAliasName":"AIRCELOB","LastUpdated":"22-12-2020"},{"Status":"Active","BillerCategoryName":"Mobile Postpaid","BillerId":"VODA00000NAT02","BillerName":"Vodafone Postpaid (Test)","BillerAliasName":"VODA POSTPAID","LastUpdated":"22-12-2020"}],"Header":{"Ver":1.0,"OrigInst":"AU01","RefId":null,"TimeStamp":"2023-04-03T11:18:11"},"TransactionStatus":{"ResponseCode":"000","ResponseMessage":"Successful"},"Reason":{"ResponseCode":0,"ResponseReason":"Successful"}}',
    'Biller List API - Retrieves a comprehensive list of all billers registered with NPCI. Supports filtering by category and date, enabling dynamic biller discovery for agent institutions.',
    '["BBPS", "Biller", "List", "Directory", "Categories"]'::jsonb,
    '{"type": "object", "properties": {"Billers": {"type": "array", "items": {"type": "object", "properties": {"BillerId": {"type": "string"}, "BillerName": {"type": "string"}, "BillerCategoryName": {"type": "string"}, "Status": {"type": "string"}}}}, "Header": {"type": "object"}, "TransactionStatus": {"type": "object"}}}'::jsonb,
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
  AND name IN ('Get All Circles', 'Bill Fetch', 'Biller Details', 'Biller List')
ORDER BY name;