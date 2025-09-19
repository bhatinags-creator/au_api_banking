-- RD Calculator Service API
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
    'RD Calculator Service',
    '/CBSRDCalculatorRESTService',
    'POST',
    'Recurring Deposit (RD) calculator service that computes maturity amounts, interest calculations, and term details based on installment amounts, tenure, and product specifications.',
    'Calculate RD maturity and interest details',
    '[
        {"name": "RequestId", "type": "string", "maxLength": 32, "required": true, "description": "Unique reference number for the calculation request", "example": "767565454534"},
        {"name": "OriginatingChannel", "type": "string", "maxLength": 5, "required": true, "description": "Originating channel identifier", "example": "AUAPI"},
        {"name": "Term_Months", "type": "string", "maxLength": 30, "required": true, "description": "Term duration in months", "example": "24"},
        {"name": "TransactionBranch", "type": "string", "maxLength": 10, "required": true, "description": "Branch code where calculation is processed", "example": "2011"},
        {"name": "InstallmentAmount", "type": "string", "maxLength": 16, "required": true, "description": "Monthly installment amount for RD", "example": "1000"},
        {"name": "Term_Years", "type": "string", "maxLength": 20, "required": true, "description": "Term duration in years", "example": "0"},
        {"name": "RDProductCode", "type": "string", "maxLength": 30, "required": true, "description": "RD product code for interest rate determination", "example": "20401"},
        {"name": "DebitAccount", "type": "string", "required": false, "description": "Debit account for installment payments", "example": "2201210944285554"}
    ]'::jsonb,
    '[
        {"name": "Content-Type", "value": "application/json"},
        {"name": "Authorization", "value": "Bearer {access_token}"}
    ]'::jsonb,
    '[
        {
            "status": "200",
            "description": "RD calculation completed successfully",
            "example": {
                "TransactionStatus": {
                    "ResponseCode": "0",
                    "ResponseMessage": "Success",
                    "ExtendedErrorDetails": {
                        "messages": {"code": "0", "message": "Success"}
                    }
                },
                "RD_Cal_MaturityDetials": "Result",
                "RatInt": "7",
                "Amt_MaturityValue": "789065",
                "Date_Maturity": "129785435"
            }
        },
        {"status": "400", "description": "Bad request - Invalid input parameters"},
        {"status": "401", "description": "Unauthorized - Invalid authentication credentials"},
        {"status": "404", "description": "Not Found - Product code or branch not found"},
        {"status": "500", "description": "Internal Server Error - Something went wrong"}
    ]'::jsonb,
    '{"RequestId":"767565454534","OriginatingChannel":"AUAPI","Term_Months":"24","TransactionBranch":"2011","InstallmentAmount":"1000","Term_Years":"0","RDProductCode":"20401","DebitAccount":"2201210944285554"}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success","ExtendedErrorDetails":{"messages":{"code":"0","message":"Success"}}},"RD_Cal_MaturityDetials":"Result","RatInt":"7","Amt_MaturityValue":"789065","Date_Maturity":"129785435"}',
    'Comprehensive RD calculator service that helps customers and bank staff calculate recurring deposit maturity amounts, interest earnings, and tenure details. Supports various RD products with different interest rates and compounding frequencies.',
    '["liabilities", "rd", "calculator", "maturity-calculation", "interest-calculation"]'::jsonb,
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