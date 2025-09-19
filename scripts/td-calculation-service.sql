-- TD Calculation Service API
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
    'TD Calculation Service',
    '/CBSTDCaluculationDetailServiceNewV1/tdcal',
    'POST',
    'Term Deposit (TD) calculation service used to calculate maturity amounts, interest earnings, tax deductions, and other deposit-related computations based on deposit amount, tenure, and product specifications.',
    'Calculate TD maturity and interest details',
    '[
        {"name": "RequestId", "type": "string", "maxLength": 32, "required": true, "description": "Unique reference number for the calculation request", "example": "6970567345345"},
        {"name": "OriginatingChannel", "type": "string", "maxLength": 5, "required": true, "description": "Application name or channel identifier", "example": "TGT"},
        {"name": "ReferenceNumber", "type": "string", "maxLength": 16, "required": true, "description": "Unique alpha numeric reference (same as Request Id)", "example": "LD1115423757217697190"},
        {"name": "TransactionBranch", "type": "string", "maxLength": 30, "required": true, "description": "Branch code where calculation is processed", "example": "2011"},
        {
            "name": "TDCalculationRequest",
            "type": "object",
            "required": true,
            "description": "TD calculation request object with deposit details",
            "properties": {
                "CustomerId": {"type": "string", "maxLength": 20, "required": true, "description": "Customer ID"},
                "CustomerType": {"type": "string", "maxLength": 10, "required": true, "description": "Customer type (individual/corporate)"},
                "Days": {"type": "string", "maxLength": 20, "required": true, "description": "Term duration in days"},
                "DepositAmount": {"type": "string", "maxLength": 10, "required": true, "description": "Principal deposit amount"},
                "DepositTerm": {"type": "string", "maxLength": 10, "required": true, "description": "Deposit term period"},
                "DepUnit": {"type": "string", "maxLength": 10, "required": false, "description": "Deposit unit (0 for months)"},
                "Months": {"type": "string", "maxLength": 10, "required": true, "description": "Term duration in months"},
                "ProductCode": {"type": "string", "maxLength": 20, "required": true, "description": "TD product code for interest rate"}
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
            "description": "TD calculation completed successfully",
            "example": {
                "TDCalculationResponse": {
                    "InterestAmount": 8148,
                    "TaxAmount": 814.80,
                    "TDMatInterest": 8148,
                    "TDInterestRate": 7.63000011444091796875,
                    "BalancePrincipal": 32000.00,
                    "TDMatAmount": 40148.00
                },
                "TransactionStatus": {
                    "ResponseCode": "0",
                    "ResponseMessage": "Success",
                    "ExtendedErrorDetails": {
                        "messages": [{"code": 0}]
                    }
                }
            }
        },
        {"status": "400", "description": "Bad request - Invalid input parameters"},
        {"status": "401", "description": "Unauthorized - Invalid authentication credentials"},
        {"status": "404", "description": "Not Found - Product code or customer not found"},
        {"status": "500", "description": "Internal Server Error - Something went wrong"}
    ]'::jsonb,
    '{"ReferenceNumber":"LD1115423757217697190","TransactionBranch":2011,"RequestId":"6970567345345","OriginatingChannel":"TGT","TDCalculationRequest":{"CustomerId":"39276222","CustomerType":"","Days":0,"DepositAmount":32000.00,"DepositTerm":0,"DepUnit":"0","Months":36,"ProductCode":20301}}',
    '{"TDCalculationResponse":{"InterestAmount":8148,"TaxAmount":814.80,"TDMatInterest":8148,"TDInterestRate":7.63000011444091796875,"BalancePrincipal":32000.00,"TDMatAmount":40148.00},"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success","ExtendedErrorDetails":{"messages":[{"code":0}]}}}',
    'Comprehensive Term Deposit calculation service that computes maturity amounts, interest earnings, tax deductions, and net returns based on deposit amount, tenure, and customer type. Supports various TD products with different interest rates and compounding frequencies.',
    '["liabilities", "td", "term-deposit", "calculation", "maturity-calculation", "interest-calculation"]'::jsonb,
    30000,
    true,
    'bearer',
    'active',
    true,
    'v1',
    true,
    '["sandbox", "uat"]'::jsonb,
    '{"sandbox": 50, "uat": 200, "production": 500}'::jsonb
);