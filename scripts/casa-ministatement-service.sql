-- CASA Mini Statement Service API
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
    'CASA Mini Statement Service',
    '/CBSCustCASATDLoanTDCBRMntService/cbr',
    'POST',
    'CBR (Customer Banking Record) maintenance service for CASA, Term Deposits, Loans and other banking products. Manages customer information, KYC details, risk categories, and portfolio data.',
    'Comprehensive CBR maintenance for customer banking records',
    '[
        {"name": "ReferenceNumber", "type": "string", "maxLength": 20, "required": true, "description": "Unique reference number for the transaction"},
        {"name": "TransactionBranch", "type": "integer", "maxLength": 10, "required": true, "description": "Branch code where transaction is processed"},
        {"name": "RequestId", "type": "string", "maxLength": 32, "required": true, "description": "Unique request identifier"},
        {"name": "OriginatingChannel", "type": "string", "maxLength": 10, "required": true, "description": "Channel from which request originated"},
        {
            "name": "CustCASATDLoanCBRRequest",
            "type": "object",
            "required": true,
            "description": "Main CBR request object with customer details",
            "properties": {
                "customerID": {"type": "string", "required": false, "description": "Customer ID"},
                "module": {"type": "string", "required": false, "description": "Module identifier (CUST, CASA, LOAN, TD)"},
                "accountNumber": {"type": "string", "required": false, "description": "Account number if applicable"},
                "COD_1": {"type": "string", "required": false, "description": "Last KYC Done"},
                "COD_5": {"type": "string", "required": false, "description": "BSR Code"},
                "COD_6": {"type": "string", "required": false, "description": "Risk Category"},
                "COD_34": {"type": "string", "required": false, "description": "Politically Exposed Person"},
                "NUM_1": {"type": "string", "required": false, "description": "UCIC (Unique Customer Identification Code)"}
            }
        }
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json"},
        {"name": "Authorization", "value": "Bearer {access_token}"}
    ]'::jsonb,
    '[
        {
            "status": "200",
            "description": "CBR maintenance completed successfully",
            "example": {
                "TransactionStatus": {
                    "ResponseCode": "0",
                    "ResponseMessage": "Success",
                    "ExtendedErrorDetails": {
                        "messages": [{"code": 0, "message": null}]
                    }
                }
            }
        },
        {"status": "400", "description": "Bad request - Invalid input parameters"},
        {"status": "401", "description": "Unauthorized - Invalid authentication credentials"},
        {"status": "500", "description": "Internal Server Error - Something went wrong"}
    ]'::jsonb,
    '{"ReferenceNumber":"1878172831723","TransactionBranch":2011,"RequestId":"1872381623716","OriginatingChannel":"CCO","CustCASATDLoanCBRRequest":{"accountNumber":"","customerID":"24079128","mode":"","module":"CUST","COD_1":"","COD_5":"Stable Money","COD_47":"Face to Face","NUM_1":""}}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success","ExtendedErrorDetails":{"messages":[{"code":0,"message":null}]},"ErrorDescription":null}}',
    'CBR (Customer Banking Record) maintenance service that manages comprehensive customer information across CASA accounts, Term Deposits, Loans, and other banking products. Handles KYC details, risk assessment, portfolio management, and regulatory compliance data.',
    '["liabilities", "casa", "cbr", "customer-maintenance", "kyc", "risk-management"]'::jsonb,
    45000,
    true,
    'bearer',
    'active',
    true,
    'v1',
    true,
    '["sandbox", "uat"]'::jsonb,
    '{"sandbox": 30, "uat": 150, "production": 300}'::jsonb
);