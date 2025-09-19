-- CASA FD&RD Creation Service API
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
    'CASA FD&RD Creation Service',
    '/CASAFDRDCreaeationServiceNewV1/Create',
    'POST',
    'Service to create CASA (Current Account Savings Account), Fixed Deposits (FD) and Recurring Deposits (RD) with nominee details and payment configurations',
    'Create new FD/RD accounts with comprehensive setup options',
    '[
        {
            "name": "FDCreation",
            "type": "object",
            "required": true,
            "description": "Main FD creation request object",
            "properties": {
                "referenceNumber": {"type": "string", "maxLength": 5, "required": true, "description": "Application reference number"},
                "channel": {"type": "string", "maxLength": 16, "required": true, "description": "Channel identifier"},
                "accountNo": {"type": "string", "maxLength": 30, "required": true, "description": "Account number"},
                "acctCurrency": {"type": "string", "required": true, "description": "Account currency code"},
                "branchCode": {"type": "string", "required": true, "description": "Branch code"},
                "customerID": {"type": "string", "required": true, "description": "Customer ID"},
                "flgJointHolder": {"type": "string", "required": false, "description": "Joint holder flag (Y/N)"},
                "flgRestrictAcct": {"type": "string", "required": false, "description": "Account restriction flag (Y/N)"},
                "flgSCWaive": {"type": "string", "required": false, "description": "Service charge waiver flag (Y/N)"},
                "flgTransactionType": {"type": "string", "required": true, "description": "Transaction type flag"},
                "minorAcctStatus": {"type": "string", "required": false, "description": "Minor account status"},
                "productCode": {"type": "string", "required": true, "description": "Product code for FD/RD"}
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
            "description": "FD/RD created successfully",
            "example": {
                "FDCreationResponse": {
                    "TransactionStatus": {
                        "ResponseCode": "0",
                        "ResponseMessage": "Success"
                    },
                    "CASAAccountReturn": {
                        "AccountNumber": "2503201141360993",
                        "TDAccounPayin": {
                            "DepositNo": "1",
                            "AccountTitle": "Account Holder Name",
                            "NetInterestRate": "7.25",
                            "PayinAmount": "1000.00",
                            "MaturityAmount": "1000.00",
                            "MaturityDate": "20260907"
                        }
                    }
                }
            }
        },
        {"status": "400", "description": "Bad request - Invalid input parameters"},
        {"status": "401", "description": "Unauthorized - Invalid authentication credentials"},
        {"status": "500", "description": "Internal Server Error - Something went wrong"}
    ]'::jsonb,
    '{"FDCreation":{"flgTransactionType":"P","channel":"VDEC","valueDate":"20250907","flgRestrictAcct":"N","branchCode":"2011","flgSCWaive":"Y","productCode":"20302","acctCurrency":"1","referenceNumber":"442746636629","customerAndRelation":[{"customerId":"39893699","customerName":"Account Holder","relation":"SOW"}],"flgJointHolder":"N","xfaceTDAccountPayinRequestDTO":{"depositAmount":"1000.00","payoutType":"1","branchCodeGL":"2011","termDays":"0","intCompoundingFrequency":"0","intPayoutFrequency":"6","fromAccountNo":"160611048","branchCodeTD":"2011","termMonths":"12","referenceNoGL":"160611048","depositIntVariance":"0","payinNarration":"FD Funding-442746636629","payoutAccountNo":"1821201119736140"},"customerID":"39893699"}}',
    '{"FDCreationResponse":{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success","ExtendedErrorDetails":{"messages":[{"code":"0","message":null}]}},"CASAAccountReturn":{"AccountNumber":"2503201141360993","TDAccounPayin":{"DepositNo":"1","AccountTitle":"Account Holder Name","NetInterestRate":"7.25","PayinAmount":"1000.00","MaturityAmount":"1000.00","MaturityDate":"20260907"}}}}',
    'Comprehensive API for creating Fixed Deposits (FD) and Recurring Deposits (RD) accounts under CASA services. Supports nominee configuration, payment setup, and term customization. Requires proper authentication and branch authorization.',
    '["liabilities", "deposits", "casa", "fd", "rd", "account-creation"]'::jsonb,
    60000,
    true,
    'bearer',
    'active',
    true,
    'v1',
    true,
    '["sandbox", "uat"]'::jsonb,
    '{"sandbox": 20, "uat": 100, "production": 200}'::jsonb
);