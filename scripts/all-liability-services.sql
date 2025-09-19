-- Master SQL file to insert all 9 Liability banking services
-- Execute this file to insert all banking services into the api_endpoints table

-- CASA FD&RD Creation Service API
INSERT INTO api_endpoints (
    category_id, category, name, path, method, description, summary, parameters, headers, responses, 
    request_example, response_example, documentation, tags, timeout, requires_auth, auth_type, 
    status, is_active, version, is_internal, required_permissions, rate_limits
) VALUES (
    '7f74500f-d4f2-45c4-ab6b-bc4e1df129ad', 'Liabilities', 'CASA FD&RD Creation Service', 
    '/CASAFDRDCreaeationServiceNewV1/Create', 'POST',
    'Service to create CASA (Current Account Savings Account), Fixed Deposits (FD) and Recurring Deposits (RD) with nominee details and payment configurations',
    'Create new FD/RD accounts with comprehensive setup options',
    '[{"name": "FDCreation", "type": "object", "required": true, "description": "Main FD creation request object"}]'::jsonb,
    '[{"name": "Content-Type", "value": "application/json"}, {"name": "Authorization", "value": "Bearer {access_token}"}]'::jsonb,
    '[{"status": "200", "description": "FD/RD created successfully"}, {"status": "400", "description": "Bad request"}, {"status": "401", "description": "Unauthorized"}, {"status": "500", "description": "Internal Server Error"}]'::jsonb,
    '{"FDCreation":{"flgTransactionType":"P","channel":"VDEC","branchCode":"2011","productCode":"20302","customerID":"39893699"}}',
    '{"FDCreationResponse":{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success"}}}',
    'Comprehensive API for creating Fixed Deposits (FD) and Recurring Deposits (RD) accounts under CASA services.',
    '["liabilities", "deposits", "casa", "fd", "rd", "account-creation"]'::jsonb,
    60000, true, 'bearer', 'active', true, 'v1', true,
    '["sandbox", "uat"]'::jsonb, '{"sandbox": 20, "uat": 100, "production": 200}'::jsonb
);

-- CASA Mini Statement Service API
INSERT INTO api_endpoints (
    category_id, category, name, path, method, description, summary, parameters, headers, responses, 
    request_example, response_example, documentation, tags, timeout, requires_auth, auth_type, 
    status, is_active, version, is_internal, required_permissions, rate_limits
) VALUES (
    '7f74500f-d4f2-45c4-ab6b-bc4e1df129ad', 'Liabilities', 'CASA Mini Statement Service', 
    '/CBSCustCASATDLoanTDCBRMntService/cbr', 'POST',
    'CBR (Customer Banking Record) maintenance service for CASA, Term Deposits, Loans and other banking products. Manages customer information, KYC details, risk categories, and portfolio data.',
    'Comprehensive CBR maintenance for customer banking records',
    '[{"name": "ReferenceNumber", "type": "string", "required": true}, {"name": "CustCASATDLoanCBRRequest", "type": "object", "required": true}]'::jsonb,
    '[{"name": "Content-Type", "value": "application/json"}, {"name": "Authorization", "value": "Bearer {access_token}"}]'::jsonb,
    '[{"status": "200", "description": "CBR maintenance completed successfully"}, {"status": "400", "description": "Bad request"}, {"status": "401", "description": "Unauthorized"}, {"status": "500", "description": "Internal Server Error"}]'::jsonb,
    '{"ReferenceNumber":"1878172831723","TransactionBranch":2011,"RequestId":"1872381623716","OriginatingChannel":"CCO","CustCASATDLoanCBRRequest":{"customerID":"24079128","module":"CUST"}}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success"}}',
    'CBR maintenance service that manages comprehensive customer information across CASA accounts, Term Deposits, Loans, and other banking products.',
    '["liabilities", "casa", "cbr", "customer-maintenance", "kyc", "risk-management"]'::jsonb,
    45000, true, 'bearer', 'active', true, 'v1', true,
    '["sandbox", "uat"]'::jsonb, '{"sandbox": 30, "uat": 150, "production": 300}'::jsonb
);

-- RD Details Service API
INSERT INTO api_endpoints (
    category_id, category, name, path, method, description, summary, parameters, headers, responses, 
    request_example, response_example, documentation, tags, timeout, requires_auth, auth_type, 
    status, is_active, version, is_internal, required_permissions, rate_limits
) VALUES (
    '7f74500f-d4f2-45c4-ab6b-bc4e1df129ad', 'Liabilities', 'RD Details Service', 
    '/CBSRDDetailsRestService/RDDetails', 'GET',
    'Fetch comprehensive Recurring Deposit (RD) account details including balance, maturity information, installment details, and account status based on account number and deposit number.',
    'Retrieve detailed RD account information and status',
    '[{"name": "RequestId", "type": "string", "required": true}, {"name": "OriginatingChannel", "type": "string", "required": true}, {"name": "AccountNo", "type": "string", "required": true}]'::jsonb,
    '[{"name": "Content-Type", "value": "application/json"}, {"name": "Authorization", "value": "Bearer {access_token}"}]'::jsonb,
    '[{"status": "200", "description": "RD details retrieved successfully"}, {"status": "400", "description": "Bad request"}, {"status": "401", "description": "Unauthorized"}, {"status": "404", "description": "Not Found"}, {"status": "500", "description": "Internal Server Error"}]'::jsonb,
    '{"RequestId":"5432578880545","OriginatingChannel":"TGT","AccountNo":"10895340459"}',
    '{"ErrorCode":"0","ErrorDescription":"Success","RDAccountNo":"10895340459","AccountTitle":"Account Holder Name","InstallmentAmount":"5000.00","AvailableBalance":"125000.00"}',
    'Comprehensive API for retrieving Recurring Deposit (RD) account details with complete information including balance, maturity value, and account status.',
    '["liabilities", "rd", "recurring-deposit", "account-details", "balance-inquiry"]'::jsonb,
    30000, true, 'bearer', 'active', true, 'v1', true,
    '["sandbox", "uat"]'::jsonb, '{"sandbox": 50, "uat": 200, "production": 500}'::jsonb
);

-- Cheque Book Request Service API
INSERT INTO api_endpoints (
    category_id, category, name, path, method, description, summary, parameters, headers, responses, 
    request_example, response_example, documentation, tags, timeout, requires_auth, auth_type, 
    status, is_active, version, is_internal, required_permissions, rate_limits
) VALUES (
    '7f74500f-d4f2-45c4-ab6b-bc4e1df129ad', 'Liabilities', 'Cheque Book Request Service', 
    '/ChequeService/requestChequeBook', 'POST',
    'Service to raise requests for cheque book issuance for CASA accounts. Supports multiple cheque books, customizable dispatch options, and branch-specific processing.',
    'Request new cheque books for account holders',
    '[{"name": "RequestId", "type": "string", "required": true}, {"name": "AccountNumber", "type": "string", "required": true}, {"name": "NoOfLeaves", "type": "number", "required": true}, {"name": "NoOfChqBooks", "type": "number", "required": true}]'::jsonb,
    '[{"name": "Content-Type", "value": "application/json"}, {"name": "Authorization", "value": "Bearer {access_token}"}]'::jsonb,
    '[{"status": "200", "description": "Cheque book request processed successfully"}, {"status": "400", "description": "Bad request"}, {"status": "401", "description": "Unauthorized"}, {"status": "404", "description": "Not Found"}, {"status": "500", "description": "Internal Server Error"}]'::jsonb,
    '{"ReferenceNumber":"REF123456789","TransactionBranch":"2011","RequestId":"CBR202501150001","AccountNumber":"1821201119736140","NoOfLeaves":25,"NoOfChqBooks":1}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success"}}',
    'Comprehensive cheque book request service for CASA account holders with customizable dispatch options.',
    '["liabilities", "casa", "cheque-book", "account-services", "dispatch"]'::jsonb,
    45000, true, 'bearer', 'active', true, 'v1', true,
    '["sandbox", "uat"]'::jsonb, '{"sandbox": 20, "uat": 100, "production": 200}'::jsonb
);

-- Hold Marking Service API
INSERT INTO api_endpoints (
    category_id, category, name, path, method, description, summary, parameters, headers, responses, 
    request_example, response_example, documentation, tags, timeout, requires_auth, auth_type, 
    status, is_active, version, is_internal, required_permissions, rate_limits
) VALUES (
    '7f74500f-d4f2-45c4-ab6b-bc4e1df129ad', 'Liabilities', 'Hold Marking Service', 
    '/ASBAmaintanService/HoldMarking', 'POST',
    'ASBA (Applications Supported by Blocked Amount) maintenance service used for creating IPO hold amounts on CBS. Allows marking and holding specific amounts in customer accounts for IPO applications.',
    'Create IPO hold amounts on customer accounts',
    '[{"name": "RequestId", "type": "string", "required": true}, {"name": "AccountNumber", "type": "string", "required": true}, {"name": "HoldAmount", "type": "string", "required": true}, {"name": "IPOreferenceNo", "type": "string", "required": true}]'::jsonb,
    '[{"name": "Content-Type", "value": "application/json"}, {"name": "Authorization", "value": "Bearer {access_token}"}]'::jsonb,
    '[{"status": "200", "description": "Hold marking processed successfully"}, {"status": "400", "description": "Bad request"}, {"status": "401", "description": "Unauthorized"}, {"status": "404", "description": "Not Found"}, {"status": "500", "description": "Internal Server Error"}]'::jsonb,
    '{"ReferenceNumber":"ASBA20250904140545848593","TransactionBranch":"2445","RequestId":"458968575464","AccountNumber":"2211223144629231","HoldAmount":"50000.00","IPOreferenceNo":"51701155830409c8a5b9"}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success"},"IPOreferenceNo":"51701155830409c8a5b9","CasaAccountNumber":"2211223144629231","availableBalance":"20331583.10"}',
    'ASBA maintenance service for IPO applications that allows banks to mark and hold specific amounts in customer accounts for IPO subscription purposes.',
    '["liabilities", "asba", "ipo", "hold-marking", "blocked-amount"]'::jsonb,
    45000, true, 'bearer', 'active', true, 'v1', true,
    '["sandbox", "uat"]'::jsonb, '{"sandbox": 15, "uat": 75, "production": 150}'::jsonb
);

-- Hold Release Service API
INSERT INTO api_endpoints (
    category_id, category, name, path, method, description, summary, parameters, headers, responses, 
    request_example, response_example, documentation, tags, timeout, requires_auth, auth_type, 
    status, is_active, version, is_internal, required_permissions, rate_limits
) VALUES (
    '7f74500f-d4f2-45c4-ab6b-bc4e1df129ad', 'Liabilities', 'Hold Release Service', 
    '/ASBAmaintanService/HoldRelease', 'POST',
    'ASBA hold release service used for releasing IPO hold amounts from customer accounts. Enables the release of previously blocked amounts after IPO allocation or application cancellation.',
    'Release IPO hold amounts from customer accounts',
    '[{"name": "RequestId", "type": "string", "required": true}, {"name": "AccountNumber", "type": "string", "required": true}, {"name": "IPOreferenceNo", "type": "string", "required": true}]'::jsonb,
    '[{"name": "Content-Type", "value": "application/json"}, {"name": "Authorization", "value": "Bearer {access_token}"}]'::jsonb,
    '[{"status": "200", "description": "Hold release processed successfully"}, {"status": "400", "description": "Bad request"}, {"status": "401", "description": "Unauthorized"}, {"status": "404", "description": "Not Found"}, {"status": "500", "description": "Internal Server Error"}]'::jsonb,
    '{"ReferenceNumber":"REL20250904140545848593","TransactionBranch":"2445","RequestId":"458968575465","AccountNumber":"2211223144629231","IPOreferenceNo":"51701155830409c8a5b9"}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success"}}',
    'ASBA hold release service that enables the release of previously blocked amounts from customer accounts after IPO allocation processing.',
    '["liabilities", "asba", "ipo", "hold-release", "unblock-amount"]'::jsonb,
    45000, true, 'bearer', 'active', true, 'v1', true,
    '["sandbox", "uat"]'::jsonb, '{"sandbox": 15, "uat": 75, "production": 150}'::jsonb
);

-- RD Calculator Service API
INSERT INTO api_endpoints (
    category_id, category, name, path, method, description, summary, parameters, headers, responses, 
    request_example, response_example, documentation, tags, timeout, requires_auth, auth_type, 
    status, is_active, version, is_internal, required_permissions, rate_limits
) VALUES (
    '7f74500f-d4f2-45c4-ab6b-bc4e1df129ad', 'Liabilities', 'RD Calculator Service', 
    '/CBSRDCalculatorRESTService', 'POST',
    'Recurring Deposit (RD) calculator service that computes maturity amounts, interest calculations, and term details based on installment amounts, tenure, and product specifications.',
    'Calculate RD maturity and interest details',
    '[{"name": "RequestId", "type": "string", "required": true}, {"name": "InstallmentAmount", "type": "string", "required": true}, {"name": "Term_Months", "type": "string", "required": true}, {"name": "RDProductCode", "type": "string", "required": true}]'::jsonb,
    '[{"name": "Content-Type", "value": "application/json"}, {"name": "Authorization", "value": "Bearer {access_token}"}]'::jsonb,
    '[{"status": "200", "description": "RD calculation completed successfully"}, {"status": "400", "description": "Bad request"}, {"status": "401", "description": "Unauthorized"}, {"status": "404", "description": "Not Found"}, {"status": "500", "description": "Internal Server Error"}]'::jsonb,
    '{"RequestId":"767565454534","OriginatingChannel":"AUAPI","Term_Months":"24","TransactionBranch":"2011","InstallmentAmount":"1000","RDProductCode":"20401"}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success"},"RD_Cal_MaturityDetials":"Result","RatInt":"7","Amt_MaturityValue":"789065"}',
    'Comprehensive RD calculator service that helps customers calculate recurring deposit maturity amounts and interest earnings.',
    '["liabilities", "rd", "calculator", "maturity-calculation", "interest-calculation"]'::jsonb,
    30000, true, 'bearer', 'active', true, 'v1', true,
    '["sandbox", "uat"]'::jsonb, '{"sandbox": 50, "uat": 200, "production": 500}'::jsonb
);

-- Stop Cheque Service API
INSERT INTO api_endpoints (
    category_id, category, name, path, method, description, summary, parameters, headers, responses, 
    request_example, response_example, documentation, tags, timeout, requires_auth, auth_type, 
    status, is_active, version, is_internal, required_permissions, rate_limits
) VALUES (
    '7f74500f-d4f2-45c4-ab6b-bc4e1df129ad', 'Liabilities', 'Stop Cheque Service', 
    '/ChequeService/requestStopCheque', 'POST',
    'Service to stop cheques on CBS system based on cheque number and account number. Allows customers to request stop payment on issued cheques for security and fraud prevention.',
    'Stop payment on issued cheques',
    '[{"name": "RequestId", "type": "string", "required": true}, {"name": "AccountId", "type": "string", "required": true}, {"name": "ChequeStartNumber", "type": "string", "required": true}, {"name": "ChequeEndNumber", "type": "string", "required": true}, {"name": "StopChequeReason", "type": "string", "required": true}]'::jsonb,
    '[{"name": "Content-Type", "value": "application/json"}, {"name": "Authorization", "value": "Bearer {access_token}"}]'::jsonb,
    '[{"status": "200", "description": "Stop cheque request processed successfully"}, {"status": "400", "description": "Bad request"}, {"status": "401", "description": "Unauthorized"}, {"status": "404", "description": "Not Found"}, {"status": "500", "description": "Internal Server Error"}]'::jsonb,
    '{"ReferenceNumber":"REF123456789","TransactionBranch":"2011","RequestId":"STC202501150001","AccountId":"1821201119736140","ChequeStartNumber":"123456","ChequeEndNumber":"123456","StopChequeReason":"Lost cheque book"}',
    '{"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success"}}',
    'Comprehensive stop cheque service that allows customers to request stop payment on issued cheques with proper audit trail.',
    '["liabilities", "casa", "stop-cheque", "fraud-prevention", "payment-control"]'::jsonb,
    45000, true, 'bearer', 'active', true, 'v1', true,
    '["sandbox", "uat"]'::jsonb, '{"sandbox": 20, "uat": 100, "production": 200}'::jsonb
);

-- TD Calculation Service API
INSERT INTO api_endpoints (
    category_id, category, name, path, method, description, summary, parameters, headers, responses, 
    request_example, response_example, documentation, tags, timeout, requires_auth, auth_type, 
    status, is_active, version, is_internal, required_permissions, rate_limits
) VALUES (
    '7f74500f-d4f2-45c4-ab6b-bc4e1df129ad', 'Liabilities', 'TD Calculation Service', 
    '/CBSTDCaluculationDetailServiceNewV1/tdcal', 'POST',
    'Term Deposit (TD) calculation service used to calculate maturity amounts, interest earnings, tax deductions, and other deposit-related computations based on deposit amount, tenure, and product specifications.',
    'Calculate TD maturity and interest details',
    '[{"name": "RequestId", "type": "string", "required": true}, {"name": "TDCalculationRequest", "type": "object", "required": true}]'::jsonb,
    '[{"name": "Content-Type", "value": "application/json"}, {"name": "Authorization", "value": "Bearer {access_token}"}]'::jsonb,
    '[{"status": "200", "description": "TD calculation completed successfully"}, {"status": "400", "description": "Bad request"}, {"status": "401", "description": "Unauthorized"}, {"status": "404", "description": "Not Found"}, {"status": "500", "description": "Internal Server Error"}]'::jsonb,
    '{"ReferenceNumber":"LD1115423757217697190","TransactionBranch":2011,"RequestId":"6970567345345","TDCalculationRequest":{"CustomerId":"39276222","DepositAmount":32000.00,"Months":36,"ProductCode":20301}}',
    '{"TDCalculationResponse":{"InterestAmount":8148,"TaxAmount":814.80,"TDInterestRate":7.63,"BalancePrincipal":32000.00,"TDMatAmount":40148.00},"TransactionStatus":{"ResponseCode":"0","ResponseMessage":"Success"}}',
    'Comprehensive Term Deposit calculation service that computes maturity amounts, interest earnings, tax deductions, and net returns.',
    '["liabilities", "td", "term-deposit", "calculation", "maturity-calculation", "interest-calculation"]'::jsonb,
    30000, true, 'bearer', 'active', true, 'v1', true,
    '["sandbox", "uat"]'::jsonb, '{"sandbox": 50, "uat": 200, "production": 500}'::jsonb
);