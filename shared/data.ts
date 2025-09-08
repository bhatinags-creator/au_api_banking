// Centralized API and Category Data Store
// This is the single source of truth for all API categories, endpoints, documentation, and sandbox configuration
// Both admin panel and main portal reference this data to ensure synchronization

export interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  example?: string;
}

export interface APIEndpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  category: string;
  description: string;
  summary: string;
  requiresAuth: boolean;
  authType: 'bearer' | 'apiKey' | 'oauth2' | 'basic';
  parameters: APIParameter[];
  headers: { name: string; required: boolean; description: string; example: string; }[];
  responses: { statusCode: number; description: string; schema: any; example: string; }[];
  requestExample: string;
  responseExample: string;
  responseSchema: any;
  status: 'active' | 'deprecated' | 'beta';
  tags: string[];
  rateLimits: { sandbox: number; production: number; };
  timeout: number;
  documentation: string;
  sandbox: {
    enabled: boolean;
    testData: any[];
    mockResponse: any;
    rateLimits: { sandbox: number; production: number; };
  };
}

export interface APICategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  displayOrder: number;
  isActive: boolean;
  apis: APIEndpoint[];
}

// Comprehensive AU Bank API Categories and Endpoints
export const API_CATEGORIES: APICategory[] = [
  {
    id: "authentication",
    name: "Authentication",
    description: "Essential APIs for secure authentication and authorization including OAuth, JWT tokens, and user management",
    icon: "Shield",
    color: "#603078",
    displayOrder: 1,
    isActive: true,
    apis: [
      {
        id: "oauth-token",
        name: "OAuth 2.0 Token",
        method: "POST",
        path: "/oauth/token",
        category: "Authentication",
        description: "Generate OAuth access token for API authentication with secure token management",
        summary: "OAuth token generation endpoint",
        requiresAuth: false,
        authType: "basic",
        parameters: [
          {
            name: "grant_type",
            type: "string",
            required: true,
            description: "OAuth grant type",
            example: "client_credentials"
          },
          {
            name: "scope",
            type: "string",
            required: false,
            description: "Access scope",
            example: "read write"
          }
        ],
        headers: [
          { name: "Authorization", required: true, description: "Basic auth with client credentials", example: "Basic Y2xpZW50X2lkOmNsaWVudF9zZWNyZXQ=" },
          { name: "Content-Type", required: true, description: "Content type", example: "application/x-www-form-urlencoded" }
        ],
        responses: [
          {
            statusCode: 200,
            description: "Access token generated successfully",
            schema: { access_token: "string", token_type: "string", expires_in: "number" },
            example: '{"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "token_type": "Bearer", "expires_in": 3600}'
          }
        ],
        requestExample: 'grant_type=client_credentials&scope=read+write',
        responseExample: '{"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "token_type": "Bearer", "expires_in": 3600}',
        responseSchema: { access_token: "string", token_type: "string", expires_in: "number" },
        status: "active",
        tags: ["authentication", "oauth", "security"],
        rateLimits: { sandbox: 100, production: 1000 },
        timeout: 30000,
        documentation: "OAuth 2.0 token endpoint for secure API authentication. Use client credentials flow for server-to-server authentication.",
        sandbox: {
          enabled: true,
          testData: [{ grant_type: "client_credentials", scope: "read write" }],
          mockResponse: { access_token: "test_token_123", token_type: "Bearer", expires_in: 3600 },
          rateLimits: { sandbox: 100, production: 1000 }
        }
      }
    ]
  },
  {
    id: "digital-payments",
    name: "Digital Payments",
    description: "Modern payment processing APIs including UPI, digital wallets, and real-time payment systems",
    icon: "CreditCard",
    color: "#2563eb",
    displayOrder: 2,
    isActive: true,
    apis: [
      {
        id: "upi-payment",
        name: "UPI Payment Processing",
        method: "POST",
        path: "/payments/upi",
        category: "Digital Payments",
        description: "Process UPI payments with real-time settlement and instant notifications",
        summary: "UPI payment processing endpoint",
        requiresAuth: true,
        authType: "bearer",
        parameters: [
          {
            name: "amount",
            type: "number",
            required: true,
            description: "Payment amount in INR",
            example: "1000.00"
          },
          {
            name: "vpa",
            type: "string",
            required: true,
            description: "Virtual Payment Address",
            example: "user@paytm"
          },
          {
            name: "reference_id",
            type: "string",
            required: true,
            description: "Unique transaction reference",
            example: "TXN123456789"
          }
        ],
        headers: [
          { name: "Authorization", required: true, description: "Bearer token", example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          { name: "Content-Type", required: true, description: "Content type", example: "application/json" }
        ],
        responses: [
          {
            statusCode: 200,
            description: "Payment processed successfully",
            schema: { transaction_id: "string", status: "string", amount: "number", timestamp: "string" },
            example: '{"transaction_id": "UPI123456", "status": "SUCCESS", "amount": 1000.00, "timestamp": "2024-01-01T10:00:00Z"}'
          }
        ],
        requestExample: '{"amount": 1000.00, "vpa": "user@paytm", "reference_id": "TXN123456789"}',
        responseExample: '{"transaction_id": "UPI123456", "status": "SUCCESS", "amount": 1000.00, "timestamp": "2024-01-01T10:00:00Z"}',
        responseSchema: { transaction_id: "string", status: "string", amount: "number", timestamp: "string" },
        status: "active",
        tags: ["payments", "upi", "real-time"],
        rateLimits: { sandbox: 50, production: 500 },
        timeout: 45000,
        documentation: "UPI payment processing with real-time settlement. Supports all major UPI providers and instant payment confirmation.",
        sandbox: {
          enabled: true,
          testData: [{ amount: 1000.00, vpa: "test@paytm", reference_id: "TEST123" }],
          mockResponse: { transaction_id: "UPI_TEST_123", status: "SUCCESS", amount: 1000.00, timestamp: "2024-01-01T10:00:00Z" },
          rateLimits: { sandbox: 50, production: 500 }
        }
      }
    ]
  },
  {
    id: "customer",
    name: "Customer",
    description: "Essential APIs for integrating with core banking services. Run checks and validations using fundamental APIs such as KYC verification, account validation, and identity checks.",
    icon: "Shield",
    color: "#2563eb",
    displayOrder: 3,
    isActive: true,
    apis: [
      {
        id: "customer-360-service",
        name: "Customer 360 Service",
        method: "POST",
        path: "/api/sandbox/customer360service",
        category: "Customer",
        description: "Comprehensive customer information API providing complete customer profile, account details, and relationship information",
        summary: "Get complete customer profile data",
        requiresAuth: true,
        authType: "bearer",
        parameters: [
          {
            name: "customerID",
            type: "string",
            required: true,
            description: "Customer identification number",
            example: "CUST123456"
          }
        ],
        headers: [
          { name: "Authorization", required: true, description: "Bearer token for authentication", example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          { name: "Content-Type", required: true, description: "Content type header", example: "application/json" }
        ],
        responses: [
          {
            statusCode: 200,
            description: "Customer profile retrieved successfully",
            schema: { customerBasicInquiry: "object", accountDetails: "array", transactionStatus: "object" },
            example: '{"customerBasicInquiry": {"customerID": "CUST123456", "customerName": "John Doe", "mobileNumber": "9876543210"}, "accountDetails": [], "transactionStatus": {"status": "ACTIVE"}}'
          }
        ],
        requestExample: '{"customerID": "CUST123456"}',
        responseExample: '{"customerBasicInquiry": {"customerID": "CUST123456", "customerName": "John Doe", "mobileNumber": "9876543210"}, "accountDetails": [], "transactionStatus": {"status": "ACTIVE"}}',
        responseSchema: { customerBasicInquiry: "object", accountDetails: "array", transactionStatus: "object" },
        status: "active",
        tags: ["customer", "profile"],
        rateLimits: { sandbox: 100, production: 1000 },
        timeout: 30000,
        documentation: "Retrieve comprehensive customer information including profile, accounts, and transaction status",
        sandbox: {
          enabled: true,
          testData: [{ customerID: "CUST123456" }],
          mockResponse: { customerBasicInquiry: { customerID: "CUST123456", customerName: "John Doe" }, accountDetails: [], transactionStatus: { status: "ACTIVE" } },
          rateLimits: { sandbox: 100, production: 1000 }
        }
      },
      {
        id: "kyc-verification",
        name: "KYC Verification",
        method: "POST",
        path: "/api/kyc/verify",
        category: "Customer",
        description: "Know Your Customer verification with document validation and identity checks",
        summary: "Verify customer identity and documents",
        requiresAuth: true,
        authType: "bearer",
        parameters: [
          {
            name: "document_type",
            type: "string",
            required: true,
            description: "Type of document for verification",
            example: "AADHAAR"
          },
          {
            name: "document_number",
            type: "string",
            required: true,
            description: "Document number",
            example: "1234-5678-9012"
          }
        ],
        headers: [
          { name: "Authorization", required: true, description: "Bearer token", example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          { name: "Content-Type", required: true, description: "Content type", example: "application/json" }
        ],
        responses: [
          {
            statusCode: 200,
            description: "KYC verification completed",
            schema: { verification_status: "string", confidence_score: "number", details: "object" },
            example: '{"verification_status": "VERIFIED", "confidence_score": 95, "details": {"name_match": true, "address_verified": true}}'
          }
        ],
        requestExample: '{"document_type": "AADHAAR", "document_number": "1234-5678-9012"}',
        responseExample: '{"verification_status": "VERIFIED", "confidence_score": 95, "details": {"name_match": true, "address_verified": true}}',
        responseSchema: { verification_status: "string", confidence_score: "number", details: "object" },
        status: "active",
        tags: ["kyc", "verification", "compliance"],
        rateLimits: { sandbox: 50, production: 500 },
        timeout: 60000,
        documentation: "Comprehensive KYC verification with document validation, identity checks, and compliance scoring",
        sandbox: {
          enabled: true,
          testData: [{ document_type: "AADHAAR", document_number: "1234-5678-9012" }],
          mockResponse: { verification_status: "VERIFIED", confidence_score: 95, details: { name_match: true, address_verified: true } },
          rateLimits: { sandbox: 50, production: 500 }
        }
      }
    ]
  },
  {
    id: "loans",
    name: "Loans",
    description: "Comprehensive loan management APIs for personal loans, home loans, and business financing with automated approval workflows and real-time status tracking.",
    icon: "CreditCard",
    color: "#16a34a",
    displayOrder: 4,
    isActive: true,
    apis: [
      {
        id: "loan-application",
        name: "Loan Application",
        method: "POST",
        path: "/api/loans/apply",
        category: "Loans",
        description: "Submit loan application with automated processing and instant pre-approval",
        summary: "Apply for various types of loans",
        requiresAuth: true,
        authType: "bearer",
        parameters: [
          {
            name: "loan_type",
            type: "string",
            required: true,
            description: "Type of loan",
            example: "PERSONAL"
          },
          {
            name: "amount",
            type: "number",
            required: true,
            description: "Loan amount requested",
            example: "500000"
          },
          {
            name: "tenure_months",
            type: "number",
            required: true,
            description: "Loan tenure in months",
            example: "36"
          }
        ],
        headers: [
          { name: "Authorization", required: true, description: "Bearer token", example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          { name: "Content-Type", required: true, description: "Content type", example: "application/json" }
        ],
        responses: [
          {
            statusCode: 200,
            description: "Loan application submitted successfully",
            schema: { application_id: "string", status: "string", pre_approved_amount: "number" },
            example: '{"application_id": "LOAN123456", "status": "PRE_APPROVED", "pre_approved_amount": 450000}'
          }
        ],
        requestExample: '{"loan_type": "PERSONAL", "amount": 500000, "tenure_months": 36}',
        responseExample: '{"application_id": "LOAN123456", "status": "PRE_APPROVED", "pre_approved_amount": 450000}',
        responseSchema: { application_id: "string", status: "string", pre_approved_amount: "number" },
        status: "active",
        tags: ["loans", "application", "personal"],
        rateLimits: { sandbox: 25, production: 250 },
        timeout: 45000,
        documentation: "Submit loan applications with automated credit scoring and instant pre-approval decisions",
        sandbox: {
          enabled: true,
          testData: [{ loan_type: "PERSONAL", amount: 500000, tenure_months: 36 }],
          mockResponse: { application_id: "LOAN_TEST_123", status: "PRE_APPROVED", pre_approved_amount: 450000 },
          rateLimits: { sandbox: 25, production: 250 }
        }
      }
    ]
  },
  {
    id: "liabilities",
    name: "Liabilities",
    description: "Enable customers to invest and bank with you by integrating savings accounts, corporate accounts, fixed deposits, and recurring deposit services.",
    icon: "Database",
    color: "#9333ea",
    displayOrder: 5,
    isActive: true,
    apis: [
      {
        id: "account-balance",
        name: "Account Balance",
        method: "GET",
        path: "/api/accounts/{account_id}/balance",
        category: "Liabilities",
        description: "Get real-time account balance with transaction history and available balance",
        summary: "Retrieve account balance and details",
        requiresAuth: true,
        authType: "bearer",
        parameters: [
          {
            name: "account_id",
            type: "string",
            required: true,
            description: "Account identifier",
            example: "ACC123456789"
          }
        ],
        headers: [
          { name: "Authorization", required: true, description: "Bearer token", example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
        ],
        responses: [
          {
            statusCode: 200,
            description: "Account balance retrieved successfully",
            schema: { account_id: "string", available_balance: "number", current_balance: "number", currency: "string" },
            example: '{"account_id": "ACC123456789", "available_balance": 50000.00, "current_balance": 52000.00, "currency": "INR"}'
          }
        ],
        requestExample: 'GET /api/accounts/ACC123456789/balance',
        responseExample: '{"account_id": "ACC123456789", "available_balance": 50000.00, "current_balance": 52000.00, "currency": "INR"}',
        responseSchema: { account_id: "string", available_balance: "number", current_balance: "number", currency: "string" },
        status: "active",
        tags: ["accounts", "balance", "liabilities"],
        rateLimits: { sandbox: 200, production: 2000 },
        timeout: 15000,
        documentation: "Real-time account balance inquiry with available and current balance information",
        sandbox: {
          enabled: true,
          testData: [{ account_id: "ACC123456789" }],
          mockResponse: { account_id: "ACC123456789", available_balance: 50000.00, current_balance: 52000.00, currency: "INR" },
          rateLimits: { sandbox: 200, production: 2000 }
        }
      }
    ]
  },
  {
    id: "cards",
    name: "Cards",
    description: "Empower your corporate banking with seamless APIs for credit card management, debit card services, and card transaction processing.",
    icon: "CreditCard",
    color: "#ea580c",
    displayOrder: 6,
    isActive: true,
    apis: [
      {
        id: "card-application",
        name: "Card Application",
        method: "POST",
        path: "/api/cards/apply",
        category: "Cards",
        description: "Apply for credit or debit cards with instant eligibility check and digital card issuance",
        summary: "Apply for new cards",
        requiresAuth: true,
        authType: "bearer",
        parameters: [
          {
            name: "card_type",
            type: "string",
            required: true,
            description: "Type of card to apply for",
            example: "CREDIT"
          },
          {
            name: "card_variant",
            type: "string",
            required: true,
            description: "Card variant or category",
            example: "PLATINUM"
          }
        ],
        headers: [
          { name: "Authorization", required: true, description: "Bearer token", example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          { name: "Content-Type", required: true, description: "Content type", example: "application/json" }
        ],
        responses: [
          {
            statusCode: 200,
            description: "Card application processed successfully",
            schema: { application_id: "string", status: "string", estimated_delivery: "string" },
            example: '{"application_id": "CARD123456", "status": "APPROVED", "estimated_delivery": "7-10 business days"}'
          }
        ],
        requestExample: '{"card_type": "CREDIT", "card_variant": "PLATINUM"}',
        responseExample: '{"application_id": "CARD123456", "status": "APPROVED", "estimated_delivery": "7-10 business days"}',
        responseSchema: { application_id: "string", status: "string", estimated_delivery: "string" },
        status: "active",
        tags: ["cards", "application", "credit"],
        rateLimits: { sandbox: 20, production: 200 },
        timeout: 30000,
        documentation: "Card application processing with instant eligibility verification and approval workflow",
        sandbox: {
          enabled: true,
          testData: [{ card_type: "CREDIT", card_variant: "PLATINUM" }],
          mockResponse: { application_id: "CARD_TEST_123", status: "APPROVED", estimated_delivery: "7-10 business days" },
          rateLimits: { sandbox: 20, production: 200 }
        }
      }
    ]
  },
  {
    id: "payments",
    name: "Payments",
    description: "Industry-leading payment APIs to introduce tailored payment services. Multiple payment options to integrate your services with the outside world.",
    icon: "Building2",
    color: "#dc2626",
    displayOrder: 7,
    isActive: true,
    apis: [
      {
        id: "cnb-payment",
        name: "CNB Payment Creation",
        method: "POST",
        path: "/api/payments/cnb",
        category: "Payments",
        description: "Create CNB (Core Banking) payments with real-time processing and settlement",
        summary: "Process CNB payments",
        requiresAuth: true,
        authType: "bearer",
        parameters: [
          {
            name: "from_account",
            type: "string",
            required: true,
            description: "Source account number",
            example: "ACC123456789"
          },
          {
            name: "to_account",
            type: "string",
            required: true,
            description: "Destination account number",
            example: "ACC987654321"
          },
          {
            name: "amount",
            type: "number",
            required: true,
            description: "Payment amount",
            example: "5000.00"
          }
        ],
        headers: [
          { name: "Authorization", required: true, description: "Bearer token", example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          { name: "Content-Type", required: true, description: "Content type", example: "application/json" }
        ],
        responses: [
          {
            statusCode: 200,
            description: "CNB payment processed successfully",
            schema: { transaction_id: "string", status: "string", amount: "number", settlement_time: "string" },
            example: '{"transaction_id": "CNB123456", "status": "SUCCESS", "amount": 5000.00, "settlement_time": "2024-01-01T10:00:00Z"}'
          }
        ],
        requestExample: '{"from_account": "ACC123456789", "to_account": "ACC987654321", "amount": 5000.00}',
        responseExample: '{"transaction_id": "CNB123456", "status": "SUCCESS", "amount": 5000.00, "settlement_time": "2024-01-01T10:00:00Z"}',
        responseSchema: { transaction_id: "string", status: "string", amount: "number", settlement_time: "string" },
        status: "active",
        tags: ["payments", "cnb", "transfer"],
        rateLimits: { sandbox: 50, production: 500 },
        timeout: 60000,
        documentation: "CNB payment processing with real-time settlement and transaction tracking",
        sandbox: {
          enabled: true,
          testData: [{ from_account: "ACC123456789", to_account: "ACC987654321", amount: 5000.00 }],
          mockResponse: { transaction_id: "CNB_TEST_123", status: "SUCCESS", amount: 5000.00, settlement_time: "2024-01-01T10:00:00Z" },
          rateLimits: { sandbox: 50, production: 500 }
        }
      }
    ]
  },
  {
    id: "trade-services",
    name: "Trade Services",
    description: "Incorporate remittances and bank guarantees APIs to make trade and business operations easy with our latest market-tailored offerings.",
    icon: "FileCheck",
    color: "#be185d",
    displayOrder: 8,
    isActive: true,
    apis: [
      {
        id: "letter-of-credit",
        name: "Letter of Credit",
        method: "POST",
        path: "/api/trade/lc",
        category: "Trade Services",
        description: "Issue and manage letters of credit for international trade transactions",
        summary: "Letter of credit management",
        requiresAuth: true,
        authType: "bearer",
        parameters: [
          {
            name: "lc_type",
            type: "string",
            required: true,
            description: "Type of letter of credit",
            example: "IMPORT"
          },
          {
            name: "amount",
            type: "number",
            required: true,
            description: "LC amount",
            example: "100000.00"
          },
          {
            name: "beneficiary",
            type: "string",
            required: true,
            description: "Beneficiary details",
            example: "ABC Trading Company"
          }
        ],
        headers: [
          { name: "Authorization", required: true, description: "Bearer token", example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          { name: "Content-Type", required: true, description: "Content type", example: "application/json" }
        ],
        responses: [
          {
            statusCode: 200,
            description: "Letter of credit issued successfully",
            schema: { lc_number: "string", status: "string", expiry_date: "string" },
            example: '{"lc_number": "LC123456789", "status": "ISSUED", "expiry_date": "2024-12-31"}'
          }
        ],
        requestExample: '{"lc_type": "IMPORT", "amount": 100000.00, "beneficiary": "ABC Trading Company"}',
        responseExample: '{"lc_number": "LC123456789", "status": "ISSUED", "expiry_date": "2024-12-31"}',
        responseSchema: { lc_number: "string", status: "string", expiry_date: "string" },
        status: "active",
        tags: ["trade", "lc", "international"],
        rateLimits: { sandbox: 10, production: 100 },
        timeout: 120000,
        documentation: "Letter of credit issuance and management for international trade financing",
        sandbox: {
          enabled: true,
          testData: [{ lc_type: "IMPORT", amount: 100000.00, beneficiary: "ABC Trading Company" }],
          mockResponse: { lc_number: "LC_TEST_123", status: "ISSUED", expiry_date: "2024-12-31" },
          rateLimits: { sandbox: 10, production: 100 }
        }
      }
    ]
  },
  {
    id: "corporate",
    name: "Corporate API Suite",
    description: "A curated collection of APIs specially selected to cater to evolving corporate client needs, studied after careful analysis of corporate journeys.",
    icon: "Layers",
    color: "#4338ca",
    displayOrder: 9,
    isActive: true,
    apis: [
      {
        id: "bulk-payments",
        name: "Bulk Payments",
        method: "POST",
        path: "/api/corporate/bulk-payments",
        category: "Corporate API Suite",
        description: "Process multiple payments in a single batch with corporate approval workflows",
        summary: "Bulk payment processing",
        requiresAuth: true,
        authType: "bearer",
        parameters: [
          {
            name: "batch_id",
            type: "string",
            required: true,
            description: "Batch identifier",
            example: "BATCH123456"
          },
          {
            name: "payments",
            type: "array",
            required: true,
            description: "Array of payment details",
            example: "[{\"to_account\": \"ACC123\", \"amount\": 1000}]"
          }
        ],
        headers: [
          { name: "Authorization", required: true, description: "Bearer token", example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          { name: "Content-Type", required: true, description: "Content type", example: "application/json" }
        ],
        responses: [
          {
            statusCode: 200,
            description: "Bulk payments processed successfully",
            schema: { batch_id: "string", total_amount: "number", successful_payments: "number", failed_payments: "number" },
            example: '{"batch_id": "BATCH123456", "total_amount": 50000.00, "successful_payments": 10, "failed_payments": 0}'
          }
        ],
        requestExample: '{"batch_id": "BATCH123456", "payments": [{"to_account": "ACC123", "amount": 1000}, {"to_account": "ACC456", "amount": 2000}]}',
        responseExample: '{"batch_id": "BATCH123456", "total_amount": 50000.00, "successful_payments": 10, "failed_payments": 0}',
        responseSchema: { batch_id: "string", total_amount: "number", successful_payments: "number", failed_payments: "number" },
        status: "active",
        tags: ["corporate", "bulk", "payments"],
        rateLimits: { sandbox: 5, production: 50 },
        timeout: 300000,
        documentation: "Bulk payment processing for corporate clients with batch approval and reconciliation",
        sandbox: {
          enabled: true,
          testData: [{ batch_id: "BATCH123456", payments: [{ to_account: "ACC123", amount: 1000 }] }],
          mockResponse: { batch_id: "BATCH123456", total_amount: 1000.00, successful_payments: 1, failed_payments: 0 },
          rateLimits: { sandbox: 5, production: 50 }
        }
      }
    ]
  }
];

// Get total counts
export const getTotalApiCount = (): number => {
  return API_CATEGORIES.reduce((total, category) => total + category.apis.length, 0);
};

export const getTotalCategoryCount = (): number => {
  return API_CATEGORIES.length;
};

export const getActiveApiCount = (): number => {
  return API_CATEGORIES.reduce((total, category) => 
    total + category.apis.filter(api => api.status === 'active').length, 0);
};

export const getActiveCategoryCount = (): number => {
  return API_CATEGORIES.filter(category => category.isActive).length;
};

// Get APIs by category
export const getApisByCategory = (categoryName: string): APIEndpoint[] => {
  const category = API_CATEGORIES.find(cat => cat.name === categoryName);
  return category ? category.apis : [];
};

// Get category by ID
export const getCategoryById = (categoryId: string): APICategory | undefined => {
  return API_CATEGORIES.find(cat => cat.id === categoryId);
};

// Get API by ID
export const getApiById = (apiId: string): APIEndpoint | undefined => {
  for (const category of API_CATEGORIES) {
    const api = category.apis.find(api => api.id === apiId);
    if (api) return api;
  }
  return undefined;
};