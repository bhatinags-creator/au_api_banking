-- Stop Cheque Service API
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
    'Stop Cheque Service',
    '/ChequeService/requestStopCheque',
    'POST',
    'Service to stop cheques on CBS system based on cheque number and account number. Allows customers to request stop payment on issued cheques for security and fraud prevention.',
    'Stop payment on issued cheques',
    '[
        {"name": "RequestId", "type": "string", "maxLength": 32, "required": true, "description": "Unique reference number for the stop cheque request", "example": "STC202501150001"},
        {"name": "OriginatingChannel", "type": "string", "maxLength": 5, "required": true, "description": "Application name or channel identifier", "example": "NTRNT"},
        {"name": "ReferenceNumber", "type": "string", "maxLength": 16, "required": true, "description": "Reference number for tracking", "example": "REF123456789"},
        {"name": "TransactionBranch", "type": "string", "maxLength": 30, "required": true, "description": "Branch code where transaction is processed", "example": "2011"},
        {"name": "AccountId", "type": "string", "maxLength": 16, "required": true, "description": "Account ID for which cheque stop is requested", "example": "1821201119736140"},
        {"name": "ChequeEndNumber", "type": "string", "maxLength": 36, "required": true, "description": "Ending cheque number in the range to be stopped", "example": "123456"},
        {"name": "ChequeStartNumber", "type": "string", "maxLength": 36, "required": true, "description": "Starting cheque number in the range to be stopped", "example": "123456"},
        {"name": "ChequeStatus", "type": "string", "maxLength": 1, "required": true, "description": "Cheque status code (S for Stop)", "example": "S"},
        {"name": "StopChequeAmount", "type": "string", "maxLength": 14, "required": false, "description": "Amount for which cheque is to be stopped", "example": "1000.00"},
        {"name": "StopChequeReason", "type": "string", "maxLength": 45, "required": true, "description": "Reason description for stopping the cheque", "example": "Lost cheque book"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json"},
        {"name": "Authorization", "value": "Bearer {access_token}"}
    ]'::jsonb,
    '[
        {
            "status": "200",
            "description": "Stop cheque request processed successfully",
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
        {"status": "404", "description": "Not Found - Account or cheque not found"},
        {"status": "500", "description": "Internal Server Error - Something went wrong"}
    ]'::jsonb,
    '{"ReferenceNumber":"REF123456789","TransactionBranch":"2011","RequestId":"STC202501150001","OriginatingChannel":"NTRNT","AccountId":"1821201119736140","ChequeEndNumber":"123456","ChequeStartNumber":"123456","ChequeStatus":"S","StopChequeAmount":"1000.00","StopChequeDate":"20250115","StopChequeInstructionDate":"20250115","StopChequeReason":"Lost cheque book"}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success","ExtendedErrorDetails":{"messages":[{"code":0,"message":"Success"}]}}}',
    'Comprehensive stop cheque service that allows customers to request stop payment on issued cheques. Supports single cheque or range-based stop requests with proper reason codes and audit trail.',
    '["liabilities", "casa", "stop-cheque", "fraud-prevention", "payment-control"]'::jsonb,
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