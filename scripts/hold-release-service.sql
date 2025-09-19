-- Hold Release Service API
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
    'Hold Release Service',
    '/ASBAmaintanService/HoldRelease',
    'POST',
    'ASBA hold release service used for releasing IPO hold amounts from customer accounts. Enables the release of previously blocked amounts after IPO allocation or application cancellation.',
    'Release IPO hold amounts from customer accounts',
    '[
        {"name": "RequestId", "type": "string", "maxLength": 32, "required": true, "description": "Unique reference number for the hold release request", "example": "458968575465"},
        {"name": "OriginatingChannel", "type": "string", "maxLength": 5, "required": true, "description": "Application name or channel identifier", "example": "ASBA"},
        {"name": "ReferenceNumber", "type": "string", "maxLength": 30, "required": true, "description": "Reference number for tracking the release transaction", "example": "REL20250904140545848593"},
        {"name": "TransactionBranch", "type": "string", "maxLength": 10, "required": true, "description": "Branch code where transaction is processed", "example": "2445"},
        {"name": "AccountNumber", "type": "string", "maxLength": 16, "required": true, "description": "Account number from which hold amount will be released", "example": "2211223144629231"},
        {"name": "IPOreferenceNo", "type": "string", "maxLength": 20, "required": true, "description": "IPO reference number for tracking the original hold", "example": "51701155830409c8a5b9"},
        {"name": "UserReferenceNumber", "type": "string", "maxLength": 30, "required": true, "description": "User-defined reference number for tracking", "example": "USER_REL_001"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json"},
        {"name": "Authorization", "value": "Bearer {access_token}"}
    ]'::jsonb,
    '[
        {
            "status": "200",
            "description": "Hold release processed successfully",
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
        {"status": "404", "description": "Not Found - Account or hold reference not found"},
        {"status": "500", "description": "Internal Server Error - Something went wrong"}
    ]'::jsonb,
    '{"ReferenceNumber":"REL20250904140545848593","TransactionBranch":"2445","RequestId":"458968575465","OriginatingChannel":"ASBA","AccountNumber":"2211223144629231","IPOreferenceNo":"51701155830409c8a5b9","UserReferenceNumber":"USER_REL_001"}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success","ExtendedErrorDetails":{"messages":[{"code":0,"message":"Success"}]}}}',
    'ASBA hold release service that enables the release of previously blocked amounts from customer accounts. This API is typically used after IPO allocation processing, application cancellation, or when hold amounts need to be freed up.',
    '["liabilities", "asba", "ipo", "hold-release", "unblock-amount"]'::jsonb,
    45000,
    true,
    'bearer',
    'active',
    true,
    'v1',
    true,
    '["sandbox", "uat"]'::jsonb,
    '{"sandbox": 15, "uat": 75, "production": 150}'::jsonb
);