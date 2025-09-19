-- Cheque Book Request Service API
INSERT INTO api_endpoints (
    category_id,
    category,
    name,
    path,
    method,
    description,
    summary,
    parameters,
    headers,
    responses,
    request_example,
    response_example,
    documentation,
    tags,
    timeout,
    requires_auth,
    auth_type,
    status,
    is_active,
    version,
    is_internal,
    required_permissions,
    rate_limits
) VALUES (
    '7f74500f-d4f2-45c4-ab6b-bc4e1df129ad',
    'Liabilities',
    'Cheque Book Request Service',
    '/ChequeService/requestChequeBook',
    'POST',
    'Service to raise requests for cheque book issuance for CASA accounts. Supports multiple cheque books, customizable dispatch options, and branch-specific processing.',
    'Request new cheque books for account holders',
    '[
        {"name": "RequestId", "type": "string", "maxLength": 32, "required": true, "description": "Unique reference number for the cheque book request", "example": "CBR202501150001"},
        {"name": "OriginatingChannel", "type": "string", "maxLength": 5, "required": true, "description": "Application name or channel identifier", "example": "NTRNT"},
        {"name": "ReferenceNumber", "type": "string", "maxLength": 16, "required": true, "description": "Reference number for tracking", "example": "REF123456789"},
        {"name": "TransactionBranch", "type": "string", "maxLength": 30, "required": true, "description": "Branch code where transaction is processed", "example": "2011"},
        {"name": "AccountNumber", "type": "string", "maxLength": 16, "required": true, "description": "CASA account number for which cheque book is requested", "example": "1821201119736140"},
        {"name": "DespatchBranch", "type": "number", "maxLength": 5, "required": true, "description": "Dispatch branch code for cheque book delivery", "example": 2011},
        {"name": "NoOfLeaves", "type": "number", "maxLength": 3, "required": true, "description": "Number of leaves per cheque book (typically 25, 50, or 100)", "example": 25},
        {"name": "NoOfChqBooks", "type": "number", "maxLength": 3, "required": true, "description": "Number of cheque books to be issued", "example": 1},
        {"name": "FlgDespatch", "type": "string", "maxLength": 1, "required": true, "description": "Dispatch flag - B: Send to branch, C: Send to customer", "example": "C"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json"},
        {"name": "Authorization", "value": "Bearer {access_token}"}
    ]'::jsonb,
    '[
        {
            "status": "200",
            "description": "Cheque book request processed successfully",
            "example": {
                "TransactionStatus": {
                    "ResponseCode": "0",
                    "ResponseMessage": "Success",
                    "ExtendedErrorDetails": {
                        "messages": [{"code": 0, "message": "Success"}]
                    }
                }
            }
        },
        {"status": "400", "description": "Bad request - Invalid input parameters"},
        {"status": "401", "description": "Unauthorized - Invalid authentication credentials"},
        {"status": "404", "description": "Not Found - Account not found"},
        {"status": "500", "description": "Internal Server Error - Something went wrong"}
    ]'::jsonb,
    '{"ReferenceNumber":"REF123456789","TransactionBranch":"2011","RequestId":"CBR202501150001","OriginatingChannel":"NTRNT","AccountNumber":"1821201119736140","DespatchBranch":2011,"FlgDespatch":"C","NoOfChqBooks":1,"NoOfLeaves":25,"OriginatingBranchCode":2011}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success","ExtendedErrorDetails":{"messages":[{"code":0,"message":"Success"}]}}}',
    'Comprehensive cheque book request service for CASA account holders. Enables customers to request new cheque books with customizable options including number of leaves, dispatch preferences, and multiple book requests.',
    '["liabilities", "casa", "cheque-book", "account-services", "dispatch"]'::jsonb,
    45000,
    true,
    'bearer',
    'active',
    true,
    'v1',
    true,
    '["sandbox", "uat"]'::jsonb,
    '{"sandbox": 20, "uat": 100, "production": 200}'::jsonb
);