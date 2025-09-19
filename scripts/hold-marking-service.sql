-- Hold Marking Service API
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
    'Hold Marking Service',
    '/ASBAmaintanService/HoldMarking',
    'POST',
    'ASBA (Applications Supported by Blocked Amount) maintenance service used for creating IPO hold amounts on CBS. Allows marking and holding specific amounts in customer accounts for IPO applications.',
    'Create IPO hold amounts on customer accounts',
    '[
        {"name": "RequestId", "type": "string", "maxLength": 32, "required": true, "description": "Unique reference number for the hold marking request", "example": "458968575464"},
        {"name": "OriginatingChannel", "type": "string", "maxLength": 5, "required": true, "description": "Application name or channel identifier", "example": "2445"},
        {"name": "ReferenceNumber", "type": "string", "maxLength": 30, "required": true, "description": "Reference number for tracking the transaction", "example": "ASBA20250904140545848593"},
        {"name": "TransactionBranch", "type": "string", "maxLength": 10, "required": true, "description": "Branch code where transaction is processed", "example": "2445"},
        {"name": "AccountNumber", "type": "string", "maxLength": 16, "required": true, "description": "Account number where hold amount will be marked", "example": "2211223144629231"},
        {"name": "HoldAmount", "type": "string", "maxLength": 16, "required": true, "description": "Amount to be held for IPO application", "example": "50000.00"},
        {"name": "ReasonForEarMark", "type": "string", "maxLength": 6, "required": true, "description": "Reason code for marking the amount", "example": "IPO001"},
        {"name": "EarMarkType", "type": "string", "maxLength": 5, "required": true, "description": "Type of earmark (hold type)", "example": "ASBA"},
        {"name": "HoldNarrative", "type": "string", "maxLength": 120, "required": true, "description": "Narrative description for the hold transaction", "example": "IPO hold for XYZ company application"},
        {"name": "IPOreferenceNo", "type": "string", "maxLength": 20, "required": true, "description": "IPO reference number for tracking", "example": "51701155830409c8a5b9"},
        {"name": "UserReferenceNumber", "type": "string", "maxLength": 30, "required": true, "description": "User-defined reference number", "example": "USER_REF_001"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json"},
        {"name": "Authorization", "value": "Bearer {access_token}"}
    ]'::jsonb,
    '[
        {
            "status": "200",
            "description": "Hold marking processed successfully",
            "example": {
                "TransactionStatus": {
                    "ResponseCode": "0",
                    "ResponseMessage": "Success",
                    "ExtendedErrorDetails": {
                        "messages": {"code": "0", "message": "Success"}
                    }
                },
                "IPOreferenceNo": "51701155830409c8a5b9",
                "CasaAccountNumber": "2211223144629231",
                "availableBalance": "20331583.10",
                "BalanceHold": "19243937.87",
                "CustomerShortName": "Himmat Singh"
            }
        },
        {"status": "400", "description": "Bad request - Invalid input parameters"},
        {"status": "401", "description": "Unauthorized - Invalid authentication credentials"},
        {"status": "404", "description": "Not Found - Account or resource not found"},
        {"status": "500", "description": "Internal Server Error - Something went wrong"}
    ]'::jsonb,
    '{"ReferenceNumber":"ASBA20250904140545848593","TransactionBranch":"2445","RequestId":"458968575464","OriginatingChannel":"2445","AccountNumber":"2211223144629231","HoldAmount":"50000.00","ReasonForEarMark":"IPO001","EarMarkType":"ASBA","HoldNarrative":"IPO hold for XYZ company application","IPOreferenceNo":"51701155830409c8a5b9","UserReferenceNumber":"USER_REF_001"}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success","ExtendedErrorDetails":{"messages":{"code":"0","message":"Success"}}},"IPOreferenceNo":"51701155830409c8a5b9","CasaAccountNumber":"2211223144629231","AuthorisedDebits":"0","availableBalance":"20331583.10","BalanceHold":"19243937.87","CustomerShortName":"Himmat Singh","IfoholdNo":"4","reasoncode":"7","releaseamount":"9978.06","unclearfunds":"0.00","version":"0"}',
    'ASBA (Applications Supported by Blocked Amount) maintenance service for IPO applications. This API allows banks to mark and hold specific amounts in customer accounts for IPO subscription purposes.',
    '["liabilities", "asba", "ipo", "hold-marking", "blocked-amount"]'::jsonb,
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