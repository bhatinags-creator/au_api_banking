import { sql } from 'drizzle-orm';
import { db } from '../server/db.js';
import { apiEndpoints } from '../shared/schema.js';

const PAYMENTS_CATEGORY_ID = '4657e5d5-b563-4f88-a81f-b653f52a59db';

const enachServices = [
  {
    id: 'enach-token-generation-001',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'E-NACH OAuth Token Generation',
    path: '/oauth/accesstoken',
    method: 'GET',
    description: 'Generates OAuth 2.0 access token for E-NACH API authentication. This service provides secure access tokens required for all E-NACH mandate creation and status inquiry operations.',
    summary: 'Generate OAuth access token for E-NACH services',
    parameters: [
      {
        name: 'grant_type',
        type: 'string',
        required: true,
        description: 'OAuth 2.0 grant type (client_credentials)',
        example: 'client_credentials'
      }
    ],
    headers: [
      {
        name: 'Authorization',
        value: 'Basic <base64(client_id:client_secret)>',
        required: true
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Success - Access token generated successfully',
        example: {
          refresh_token_expires_in: '0',
          api_product_list: '[LDAP, Oauth, Payment, Customer Onboarding, karza, CBSMiniStatementService, test]',
          organization_name: 'au-apigee-nprod',
          token_type: 'BearerToken',
          issued_at: '1704950669618',
          client_id: '2I7UVNalTfFBxm3ZYxOtzYXwXX1PMIJCSSFf6AMipK0H0zR9',
          access_token: 'lEbnG39cJwC4lKUe5fliVA9HFcyR',
          application_name: 'f0556c9d-6c97-40aa-8d4e-c6bb190ef2ce',
          scope: '',
          expires_in: '86399',
          refresh_count: '0',
          status: 'approved'
        }
      },
      {
        status: 401,
        description: 'Unauthorized - Invalid client credentials',
        example: {
          error: 'invalid_client',
          error_description: 'Invalid client credentials'
        }
      }
    ],
    requestExample: `GET /oauth/accesstoken?grant_type=client_credentials
Authorization: Basic <base64_encoded_credentials>`,
    responseExample: `{
  "refresh_token_expires_in": "0",
  "api_product_list": "[LDAP, Oauth, Payment, Customer Onboarding, karza, CBSMiniStatementService, test]",
  "api_product_list_json": [
    "LDAP", "Oauth", "Payment", "Customer Onboarding", "karza", "CBSMiniStatementService", "test"
  ],
  "organization_name": "au-apigee-nprod",
  "developer.email": "kunal.boriwal@aubank.in",
  "token_type": "BearerToken",
  "issued_at": "1704950669618",
  "client_id": "2I7UVNalTfFBxm3ZYxOtzYXwXX1PMIJCSSFf6AMipK0H0zR9",
  "access_token": "lEbnG39cJwC4lKUe5fliVA9HFcyR",
  "application_name": "f0556c9d-6c97-40aa-8d4e-c6bb190ef2ce",
  "scope": "",
  "expires_in": "86399",
  "refresh_count": "0",
  "status": "approved"
}`,
    documentation: `# E-NACH OAuth Token Generation API

This API generates OAuth 2.0 access tokens for secure E-NACH API authentication.

## Purpose
- Provide secure authentication for E-NACH services
- Generate bearer tokens for mandate creation and status inquiry
- Support OAuth 2.0 client credentials flow

## Authentication Method
Uses Basic Authentication with client_id as username and client_secret as password.

## Token Validity
- **UAT Environment**: 24 hours (86399 seconds)
- **Production Environment**: 6 months

## Security Features
- GCM encryption algorithm for data security
- OAuth 2.0 standard compliance
- Automatic token expiration and refresh

## Prerequisites
- Valid client_id and client_secret from AU Bank
- Registered public IP address
- E-NACH setup completion

## Usage Flow
1. Encode client_id:client_secret in base64
2. Send GET request with Authorization header
3. Extract access_token from response
4. Use token for subsequent E-NACH API calls

## Rate Limits
- UAT: 1000 requests/hour
- Production: 5000 requests/hour

## Error Codes
- 200: Success
- 401: Invalid credentials
- 429: Rate limit exceeded
- 500: Internal server error`,
    tags: ['E-NACH', 'Authentication', 'OAuth', 'Token', 'Security'],
    responseSchema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        token_type: { type: 'string' },
        expires_in: { type: 'string' },
        issued_at: { type: 'string' },
        client_id: { type: 'string' },
        status: { type: 'string' }
      }
    },
    rateLimits: {
      sandbox: 1000,
      uat: 1000,
      production: 5000
    },
    timeout: 10000,
    requiresAuth: true,
    authType: 'basic',
    requiredPermissions: ['enach:auth', 'oauth:generate'],
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1'
  },
  {
    id: 'enach-mandate-without-user-002',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'E-NACH Mandate Creation (Without User Confirmation)',
    path: '/EmandateUserRegistrationRestService/withoutUserConfirmation',
    method: 'POST',
    description: 'Creates E-NACH mandate registration without user confirmation. Customer authenticates directly at NPCI online mandate page during request initiation. Used when customer is available with corporate user during mandate registration.',
    summary: 'Create E-NACH mandate with direct customer authentication',
    parameters: [
      {
        name: 'requestId',
        type: 'string',
        required: true,
        description: 'Unique request identifier (20 characters max)',
        example: '2031133004241123'
      },
      {
        name: 'channel',
        type: 'string',
        required: true,
        description: 'Channel name provided by bank in production (3 characters max)',
        example: 'BijliPay'
      },
      {
        name: 'referenceCode',
        type: 'string',
        required: true,
        description: 'Any unique generated identifier (10 characters max)',
        example: '203113300424123'
      },
      {
        name: 'mbSponserBankCode',
        type: 'string',
        required: true,
        description: 'Registered sponsor bank code (20 characters max)',
        example: 'AUBL0000001'
      },
      {
        name: 'mbSvcProviderCode',
        type: 'string',
        required: true,
        description: 'NPCI registered provider code - Corporate utility code (20 characters max)',
        example: 'NACH00000000000015'
      },
      {
        name: 'mbSvcProviderName',
        type: 'string',
        required: true,
        description: 'Corporate name registered with NPCI (50 characters max)',
        example: 'AUBL'
      },
      {
        name: 'mbAmount',
        type: 'string',
        required: true,
        description: 'Mandate maximum amount (10 characters max)',
        example: '20000'
      },
      {
        name: 'mbCustFonCellNum',
        type: 'string',
        required: true,
        description: 'Mandate holder mobile number (13 characters max)',
        example: '9116621202'
      },
      {
        name: 'mbCustMailId',
        type: 'string',
        required: true,
        description: 'Mandate holder email address (40 characters max)',
        example: 'customer@example.com'
      },
      {
        name: 'mbCustName',
        type: 'string',
        required: true,
        description: 'Mandate holder customer name (40 characters max)',
        example: 'Barry Allen'
      },
      {
        name: 'mbDateFrom',
        type: 'string',
        required: true,
        description: 'Mandate start date in MM/DD/YYYY format (10 characters max)',
        example: '10/28/2024'
      },
      {
        name: 'mbDateTo',
        type: 'string',
        required: true,
        description: 'Mandate end date in MM/DD/YYYY format (10 characters max)',
        example: '02/31/2026'
      },
      {
        name: 'mbDRAccountNumber',
        type: 'string',
        required: true,
        description: 'Mandate holder account number (20 characters max)',
        example: '2301244951696922'
      },
      {
        name: 'mbDRAccountType',
        type: 'string',
        required: true,
        description: 'Mandate account type: CA (Current Account) or SB (Savings Bank) (4 characters max)',
        example: 'SB'
      },
      {
        name: 'mbDRBankCode',
        type: 'string',
        required: true,
        description: 'Mandate destination bank code (4 characters max)',
        example: 'AUBL'
      },
      {
        name: 'mbFixedAmount',
        type: 'string',
        required: true,
        description: 'Fixed amount flag: Y (Fixed amount) or N (Maximum amount) (1 character)',
        example: 'Y'
      },
      {
        name: 'mbFrequencyCode',
        type: 'string',
        required: true,
        description: 'Frequency code: MNTH (Monthly), QURT (Quarterly), YEAR (Yearly), BIMN (Bimonthly), DAIL (Daily), WEEK (Weekly), ADHO (As and when presented) (4 characters max)',
        example: 'MNTH'
      },
      {
        name: 'mbFrequencyType',
        type: 'string',
        required: true,
        description: 'Frequency type: RCUR (Recurring) or OOFF (One Off) (4 characters max)',
        example: 'RCUR'
      },
      {
        name: 'mbMandateCategory',
        type: 'string',
        required: true,
        description: 'Mandate category: L001 (Loan instalment), E001 (Education fees), I001 (Insurance premium), B001 (Bill payment credit card), M001 (Mutual fund), F001 (Subscription fees) (4 characters max)',
        example: 'L001'
      },
      {
        name: 'mbPaymentType',
        type: 'string',
        required: true,
        description: 'Payment type: DebitCard, NetBanking, or Aadhaar (20 characters max)',
        example: 'DebitCard'
      },
      {
        name: 'mbRefNumber',
        type: 'string',
        required: false,
        description: 'Customer reference number (20 characters max)',
        example: 'CUST0001'
      },
      {
        name: 'mbRelRefNumber',
        type: 'string',
        required: false,
        description: 'Scheme name / Plan reference number (20 characters max)',
        example: 'SCHM0001'
      },
      {
        name: 'mbMandateType',
        type: 'string',
        required: true,
        description: 'Mandate type - always DEBIT (10 characters max)',
        example: 'DEBIT'
      },
      {
        name: 'mbCustPAN',
        type: 'string',
        required: false,
        description: 'Customer PAN number (10 characters max)',
        example: 'ABCDE1234F'
      },
      {
        name: 'mbCustFonLandNum',
        type: 'string',
        required: false,
        description: 'Customer landline number (20 characters max)',
        example: '02212345678'
      },
      {
        name: 'responseURL',
        type: 'string',
        required: false,
        description: 'Redirect URL after mandate completion (120 characters max)',
        example: 'https://example.com/callback'
      },
      {
        name: 'username',
        type: 'string',
        required: true,
        description: 'Username registered with AU bank for eNACH portal (50 characters max)',
        example: 'vsharma'
      }
    ],
    headers: [
      {
        name: 'Content-Type',
        value: 'application/json',
        required: true
      },
      {
        name: 'Authorization',
        value: 'Bearer <access_token>',
        required: true
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Success - Mandate creation initiated, user redirected to NPCI portal',
        example: {
          ResponseCode: '0',
          ResponseMessage: 'Success',
          Message: '<html><head></head><body><form id="TheForm" action="https://enachuat.npci.org.in:8086/onmags_new/sendRequest" method="POST" content-type="application/json">'
        }
      },
      {
        status: 400,
        description: 'Bad Request - Invalid mandate parameters',
        example: {
          ResponseCode: '99',
          ResponseMessage: 'Failure',
          message: 'Invalid request parameters'
        }
      },
      {
        status: 401,
        description: 'Unauthorized - Invalid authentication token',
        example: {
          error: 'Unauthorized',
          message: 'Invalid authentication credentials'
        }
      },
      {
        status: 500,
        description: 'Internal Server Error - System error',
        example: {
          ResponseCode: '99',
          ResponseMessage: 'Failure',
          message: 'Something went wrong'
        }
      }
    ],
    requestExample: `{
  "requestId": "2031133004241123",
  "channel": "BijliPay",
  "referenceCode": "203113300424123",
  "mbSponserBankCode": "AUBL0000001",
  "mbSvcProviderCode": "NACH00000000000015",
  "mbSvcProviderName": "AUBL",
  "mbAmount": "20000",
  "mbCustFonCellNum": "9116621202",
  "mbCustMailId": "customer@example.com",
  "mbCustName": "Barry Allen",
  "mbDateFrom": "10/28/2024",
  "mbDateTo": "02/31/2026",
  "mbDRAccountNumber": "2301244951696922",
  "mbDRAccountType": "SB",
  "mbDRBankCode": "AUBL",
  "mbFixedAmount": "Y",
  "mbFrequencyCode": "MNTH",
  "mbFrequencyType": "RCUR",
  "mbMandateCategory": "L001",
  "mbPaymentType": "DebitCard",
  "mbRefNumber": "CUST0001",
  "mbRelRefNumber": "SCHM0001",
  "mbMandateType": "DEBIT",
  "mbCustPAN": "ABCDE1234F",
  "mbCustFonLandNum": "02212345678",
  "responseURL": "https://example.com/callback",
  "username": "vsharma"
}`,
    responseExample: `{
  "ResponseCode": "0",
  "ResponseMessage": "Success",
  "Message": "<html><head></head><body><form id='TheForm' action='https://enachuat.npci.org.in:8086/onmags_new/sendRequest' method='POST' content-type='application/json'>"
}`,
    documentation: `# E-NACH Mandate Creation (Without User Confirmation) API

This API creates E-NACH mandate registration where the customer authenticates directly during request initiation.

## Purpose
- Create recurring payment mandates for various purposes
- Enable automatic bill payments, loan EMIs, insurance premiums
- Streamline collection processes for businesses
- Support direct customer authentication flow

## Key Features
- **Direct Authentication**: Customer authenticates immediately at NPCI portal
- **Multiple Categories**: Support for loans, insurance, education, bills, mutual funds
- **Flexible Frequency**: Daily, weekly, monthly, quarterly, yearly, or ad-hoc
- **Payment Options**: Debit card, net banking, Aadhaar-based authentication
- **Account Types**: Both savings and current accounts supported

## Mandate Categories
- **L001**: Loan instalment payment
- **E001**: Education fees
- **I001**: Insurance premium
- **B001**: Bill payment credit card
- **M001**: Mutual fund payment
- **F001**: Subscription fees

## Frequency Codes
- **MNTH**: Monthly
- **QURT**: Quarterly  
- **YEAR**: Yearly
- **BIMN**: Bimonthly
- **DAIL**: Daily
- **WEEK**: Weekly
- **ADHO**: As and when presented

## Payment Authentication Methods
- **DebitCard**: Debit card based authentication
- **NetBanking**: Internet banking authentication
- **Aadhaar**: Aadhaar-based OTP authentication

## Account Types
- **SB**: Savings Bank Account
- **CA**: Current Account

## Date Format
Uses MM/DD/YYYY format for mandate start and end dates.

## Workflow
1. Corporate initiates mandate with customer present
2. Customer redirected to NPCI online portal
3. Customer completes authentication
4. Mandate gets registered with UMRN generation
5. Status can be tracked via status inquiry APIs

## Validation Rules
- Maximum mandate validity: 40 years
- All mandatory fields must be provided
- Valid bank codes required (refer NPCI bank list)
- Proper date format and sequence validation
- Account number and bank code validation

## Security & Encryption
- Uses GCM algorithm for encryption
- OAuth 2.0 authentication required
- Encrypted payload transmission
- Secure NPCI portal integration

## Error Handling
- Comprehensive error codes and descriptions
- Field-level validation messages
- HTTP status code based error classification
- Detailed failure reason descriptions

## Rate Limits
- UAT: 100 requests/hour
- Production: 500 requests/hour

## Prerequisites
- Valid AU Bank E-NACH setup
- Registered public IP address
- NPCI provider code and registration
- OAuth credentials and encryption keys`,
    tags: ['E-NACH', 'Mandate', 'Registration', 'Direct-Auth', 'Collections'],
    responseSchema: {
      type: 'object',
      properties: {
        TransactionStatus: { type: 'string' },
        ResponseCode: { type: 'string' },
        ResponseMessage: { type: 'string' },
        Code: { type: 'string' },
        message: { type: 'string' },
        description: { type: 'string' }
      }
    },
    rateLimits: {
      sandbox: 50,
      uat: 100,
      production: 500
    },
    timeout: 45000,
    requiresAuth: true,
    authType: 'bearer',
    requiredPermissions: ['enach:mandate', 'enach:create'],
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1'
  },
  {
    id: 'enach-mandate-with-user-003',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'E-NACH Mandate Creation (With User Confirmation)',
    path: '/EmandateUserRegistrationRestService/userconfirmation',
    method: 'POST',
    description: 'Creates E-NACH mandate registration with user confirmation via SMS/Email. Corporate initiates request and customer receives link to authorize mandate. Used when customer is not available during mandate registration.',
    summary: 'Create E-NACH mandate with SMS/Email confirmation',
    parameters: [
      {
        name: 'requestId',
        type: 'string',
        required: true,
        description: 'Unique request identifier (20 characters max)',
        example: '2031133004241123'
      },
      {
        name: 'channel',
        type: 'string',
        required: true,
        description: 'Channel name provided by bank in production (3 characters max)',
        example: 'BijliPay'
      },
      {
        name: 'referenceCode',
        type: 'string',
        required: true,
        description: 'Any unique generated identifier (10 characters max)',
        example: '203113300424123'
      },
      {
        name: 'mbSponserBankCode',
        type: 'string',
        required: true,
        description: 'Registered sponsor bank code (20 characters max)',
        example: 'AUBL0000001'
      },
      {
        name: 'mbSvcProviderCode',
        type: 'string',
        required: true,
        description: 'NPCI registered provider code - Corporate utility code (20 characters max)',
        example: 'NACH00000000000015'
      },
      {
        name: 'mbSvcProviderName',
        type: 'string',
        required: true,
        description: 'Corporate name registered with NPCI (50 characters max)',
        example: 'AUBL'
      },
      {
        name: 'mbAmount',
        type: 'string',
        required: true,
        description: 'Mandate maximum amount (10 characters max)',
        example: '20000'
      },
      {
        name: 'mbCustFonCellNum',
        type: 'string',
        required: true,
        description: 'Mandate holder mobile number (13 characters max)',
        example: '9116621202'
      },
      {
        name: 'mbCustMailId',
        type: 'string',
        required: true,
        description: 'Mandate holder email address (40 characters max)',
        example: 'customer@example.com'
      },
      {
        name: 'mbCustName',
        type: 'string',
        required: true,
        description: 'Mandate holder customer name (40 characters max)',
        example: 'Barry Allen'
      },
      {
        name: 'mbDateFrom',
        type: 'string',
        required: true,
        description: 'Mandate start date in YYYYMMDD format (8 characters)',
        example: '20240821'
      },
      {
        name: 'mbDateTo',
        type: 'string',
        required: true,
        description: 'Mandate end date in YYYYMMDD format (8 characters)',
        example: '20250928'
      },
      {
        name: 'mbDRAccountNumber',
        type: 'string',
        required: true,
        description: 'Mandate holder account number (20 characters max)',
        example: '2301244951696922'
      },
      {
        name: 'mbDRAccountType',
        type: 'string',
        required: true,
        description: 'Mandate account type: CA (Current Account) or SB (Savings Bank) (4 characters max)',
        example: 'SB'
      },
      {
        name: 'mbDRBankCode',
        type: 'string',
        required: true,
        description: 'Mandate destination bank code (4 characters max)',
        example: 'AUBL'
      },
      {
        name: 'mbFixedAmount',
        type: 'string',
        required: true,
        description: 'Fixed amount flag: Y (Fixed amount) or N (Maximum amount) (1 character)',
        example: 'Y'
      },
      {
        name: 'mbFrequencyCode',
        type: 'string',
        required: true,
        description: 'Frequency code: MNTH (Monthly), QURT (Quarterly), YEAR (Yearly), BIMN (Bimonthly), DAIL (Daily), WEEK (Weekly), ADHO (As and when presented) (4 characters max)',
        example: 'MNTH'
      },
      {
        name: 'mbFrequencyType',
        type: 'string',
        required: true,
        description: 'Frequency type: RCUR (Recurring) or OOFF (One Off) (4 characters max)',
        example: 'RCUR'
      },
      {
        name: 'mbMandateCategory',
        type: 'string',
        required: true,
        description: 'Mandate category: L001 (Loan instalment), E001 (Education fees), I001 (Insurance premium), B001 (Bill payment credit card), M001 (Mutual fund), F001 (Subscription fees) (4 characters max)',
        example: 'L001'
      },
      {
        name: 'mbPaymentType',
        type: 'string',
        required: true,
        description: 'Payment type: DebitCard, NetBanking, or Aadhaar (20 characters max)',
        example: 'DebitCard'
      },
      {
        name: 'mbRefNumber',
        type: 'string',
        required: false,
        description: 'Customer reference number (20 characters max)',
        example: 'CUST0001'
      },
      {
        name: 'mbRelRefNumber',
        type: 'string',
        required: false,
        description: 'Scheme name / Plan reference number (20 characters max)',
        example: 'SCHM0001'
      },
      {
        name: 'mbMandateType',
        type: 'string',
        required: true,
        description: 'Mandate type - always DEBIT (10 characters max)',
        example: 'DEBIT'
      },
      {
        name: 'mbCustPAN',
        type: 'string',
        required: false,
        description: 'Customer PAN number (10 characters max)',
        example: 'ABCDE1234F'
      },
      {
        name: 'mbCustFonLandNum',
        type: 'string',
        required: false,
        description: 'Customer landline number (20 characters max)',
        example: '02212345678'
      },
      {
        name: 'responseURL',
        type: 'string',
        required: false,
        description: 'Redirect URL after mandate completion (120 characters max)',
        example: 'https://example.com/callback'
      },
      {
        name: 'username',
        type: 'string',
        required: true,
        description: 'Username registered with AU bank for eNACH portal (50 characters max)',
        example: 'vsharma'
      }
    ],
    headers: [
      {
        name: 'Content-Type',
        value: 'application/json',
        required: true
      },
      {
        name: 'Authorization',
        value: 'Bearer <access_token>',
        required: true
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Success - SMS/Email link generated successfully',
        example: {
          Status: 'Accepted',
          Description: 'Link generated Successfully',
          Code: '0'
        }
      },
      {
        status: 400,
        description: 'Bad Request - Invalid mandate parameters',
        example: {
          Status: 'Rejected',
          Description: 'Invalid request parameters',
          Code: '99'
        }
      },
      {
        status: 401,
        description: 'Unauthorized - Invalid authentication token',
        example: {
          error: 'Unauthorized',
          message: 'Invalid authentication credentials'
        }
      },
      {
        status: 500,
        description: 'Internal Server Error - System error',
        example: {
          Status: 'Failed',
          Description: 'Something went wrong',
          Code: '99'
        }
      }
    ],
    requestExample: `{
  "requestId": "2031133004241123",
  "channel": "BijliPay",
  "referenceCode": "203113300424123",
  "mbSponserBankCode": "AUBL0000001",
  "mbSvcProviderCode": "NACH00000000000015",
  "mbSvcProviderName": "AUBL",
  "mbAmount": "20000",
  "mbCustFonCellNum": "9116621202",
  "mbCustMailId": "customer@example.com",
  "mbCustName": "Barry Allen",
  "mbDateFrom": "20240821",
  "mbDateTo": "20250928",
  "mbDRAccountNumber": "2301244951696922",
  "mbDRAccountType": "SB",
  "mbDRBankCode": "AUBL",
  "mbFixedAmount": "Y",
  "mbFrequencyCode": "MNTH",
  "mbFrequencyType": "RCUR",
  "mbMandateCategory": "L001",
  "mbPaymentType": "DebitCard",
  "mbRefNumber": "CUST0001",
  "mbRelRefNumber": "SCHM0001",
  "mbMandateType": "DEBIT",
  "mbCustPAN": "ABCDE1234F",
  "mbCustFonLandNum": "02212345678",
  "responseURL": "https://example.com/callback",
  "username": "vsharma"
}`,
    responseExample: `{
  "Status": "Accepted",
  "Description": "Link generated Successfully",
  "Code": "0"
}`,
    documentation: `# E-NACH Mandate Creation (With User Confirmation) API

This API creates E-NACH mandate registration with user confirmation via SMS/Email link.

## Purpose
- Create mandates when customer is not available during initiation
- Send authorization links via SMS and email
- Enable remote mandate approval process
- Support asynchronous mandate registration workflow

## Key Differences from Without User Confirmation
- **Date Format**: Uses YYYYMMDD instead of MM/DD/YYYY
- **Response**: Returns "Link generated Successfully" instead of redirect
- **Customer Flow**: Customer receives SMS/Email link to complete mandate
- **Timing**: Customer can authorize mandate at their convenience

## Workflow
1. Corporate initiates mandate request with customer details
2. System generates unique authorization link
3. Customer receives SMS and/or email with secure link
4. Customer clicks link and redirected to NPCI portal
5. Customer completes authentication process
6. Mandate gets registered with UMRN generation

## SMS/Email Link Features
- **Security**: Links are time-limited and single-use
- **Multi-channel**: Sent to both mobile and email
- **Tracking**: Link generation and usage tracked
- **Expiry**: Links expire after 24-48 hours

## Authentication Methods (Same as Direct)
- **DebitCard**: Customer authenticates using debit card
- **NetBanking**: Customer uses internet banking credentials
- **Aadhaar**: Customer uses Aadhaar-based OTP

## Mandate Categories
- **L001**: Loan instalment payment
- **E001**: Education fees
- **I001**: Insurance premium
- **B001**: Bill payment credit card
- **M001**: Mutual fund payment
- **F001**: Subscription fees

## Use Cases
- **Remote Registration**: Customer not physically present
- **Bulk Registration**: Multiple mandates for different customers
- **Self-Service**: Customers can authorize at convenient time
- **Documentation**: Email serves as mandate request record

## Advantages
- **Flexibility**: Customer can authorize when convenient
- **Documentation**: Email trail for mandate requests
- **Compliance**: Clear consent through link click
- **Efficiency**: No need for customer to be present during initiation

## Date Format Validation
- **Start Date**: YYYYMMDD format (e.g., 20240821)
- **End Date**: YYYYMMDD format (e.g., 20250928)
- **Validation**: End date must be after start date
- **Maximum**: 40-year mandate validity supported

## Link Security Features
- **Encryption**: Links are encrypted and secure
- **Unique Tokens**: Each link has unique token
- **IP Validation**: Optional IP-based validation
- **Audit Trail**: Complete tracking of link usage

## Error Handling
- Same comprehensive error handling as direct method
- Additional validation for email and mobile formats
- Link generation failure handling
- SMS/Email delivery confirmation

## Rate Limits
- UAT: 100 requests/hour
- Production: 500 requests/hour

## Prerequisites
- Same as direct method
- Valid SMS/Email gateway configuration
- Customer mobile and email must be active`,
    tags: ['E-NACH', 'Mandate', 'Registration', 'SMS-Email', 'Remote-Auth'],
    responseSchema: {
      type: 'object',
      properties: {
        Status: { type: 'string' },
        Description: { type: 'string' },
        Code: { type: 'string' }
      }
    },
    rateLimits: {
      sandbox: 50,
      uat: 100,
      production: 500
    },
    timeout: 45000,
    requiresAuth: true,
    authType: 'bearer',
    requiredPermissions: ['enach:mandate', 'enach:create', 'enach:notification'],
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1'
  },
  {
    id: 'enach-status-by-reference-004',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'E-NACH Status Inquiry (By Reference Code)',
    path: '/EmandateStatusService/enquirybyrefId',
    method: 'POST',
    description: 'Retrieves E-NACH mandate registration status using reference code. This API helps track the current status of mandate registration initiated through mandate creation APIs.',
    summary: 'Get mandate status using reference code',
    parameters: [
      {
        name: 'RequestId',
        type: 'string',
        required: true,
        description: 'Unique request identifier from mandate registration',
        example: 'SFDC2031303304241123'
      },
      {
        name: 'ReferenceCode',
        type: 'string',
        required: true,
        description: 'Reference code from mandate registration API',
        example: '2705572814'
      },
      {
        name: 'Channel',
        type: 'string',
        required: true,
        description: 'Channel identifier',
        example: 'CV'
      }
    ],
    headers: [
      {
        name: 'Content-Type',
        value: 'application/json',
        required: true
      },
      {
        name: 'Authorization',
        value: 'Bearer <access_token>',
        required: true
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Success - Mandate status retrieved successfully',
        example: {
          MndtReqId: 'MNDT000000017238703554338453381657',
          RejectBy: 'NULL',
          ReasonDesc: 'NULL',
          MerchantID: 'NACH00000000017900',
          NpciRefMsgID: 'MNDT000000017238703554338453381657',
          ReasonCode: 'NULL',
          MndtId: 'AUBL7031708241000306',
          CycleDate: 'NULL',
          Accptd: 'true',
          ErrorDesc: 'NA',
          ReferenceCode: '2705572814',
          ErrorCode: '000',
          ReqInitDate: '2024-08-17',
          AccptRefNo: '2962036'
        }
      },
      {
        status: 400,
        description: 'Bad Request - Invalid reference parameters',
        example: {
          ErrorCode: '01',
          ErrorDesc: 'Invalid Request Parameters',
          Accptd: 'false'
        }
      },
      {
        status: 404,
        description: 'Not Found - Mandate not found for given reference',
        example: {
          ErrorCode: '02',
          ErrorDesc: 'Mandate Not Found',
          Accptd: 'false'
        }
      }
    ],
    requestExample: `{
  "RequestId": "SFDC2031303304241123",
  "ReferenceCode": "2705572814",
  "Channel": "CV"
}`,
    responseExample: `{
  "MndtReqId": "MNDT000000017238703554338453381657",
  "RejectBy": "NULL",
  "ReasonDesc": "NULL",
  "MerchantID": "NACH00000000017900",
  "NpciRefMsgID": "MNDT000000017238703554338453381657",
  "ReasonCode": "NULL",
  "MndtId": "AUBL7031708241000306",
  "CycleDate": "NULL",
  "Accptd": "true",
  "ErrorDesc": "NA",
  "ReferenceCode": "2705572814",
  "ErrorCode": "000",
  "ReqInitDate": "2024-08-17",
  "AccptRefNo": "2962036"
}`,
    documentation: `# E-NACH Status Inquiry (By Reference Code) API

This API retrieves the current status of E-NACH mandate registration using the reference code.

## Purpose
- Track mandate registration progress
- Verify mandate approval status
- Get detailed mandate information
- Monitor registration workflow completion

## Key Response Fields
- **MndtReqId**: NPCI mandate request identifier
- **MndtId**: Generated mandate ID (UMRN)
- **Accptd**: Acceptance status (true/false)
- **ErrorCode**: Status code (000 = success)
- **ErrorDesc**: Detailed status description
- **ReqInitDate**: Mandate initiation date
- **AccptRefNo**: NPCI acceptance reference number

## Status Interpretation
- **Accptd = "true"**: Mandate successfully registered
- **Accptd = "false"**: Mandate registration failed or pending
- **ErrorCode = "000"**: Success
- **ErrorCode != "000"**: Error or rejection

## Common Error Codes
- **000**: Success - Mandate accepted
- **01**: Invalid request parameters
- **02**: Mandate not found
- **03**: Mandate rejected by customer
- **04**: Mandate rejected by bank
- **05**: Technical error during processing
- **08**: Invalid inquiry request

## Mandate Lifecycle Tracking
1. **Initiated**: Mandate creation request submitted
2. **Pending**: Customer authentication in progress
3. **Accepted**: Mandate successfully registered
4. **Rejected**: Mandate rejected by customer or bank
5. **Failed**: Technical failure during processing

## Response Field Details
- **RejectBy**: Entity that rejected mandate (if applicable)
- **ReasonDesc**: Detailed reason for rejection
- **ReasonCode**: Standardized reason code
- **MerchantID**: Corporate/merchant identifier
- **NpciRefMsgID**: NPCI internal reference
- **CycleDate**: Next processing cycle date

## Use Cases
- **Status Dashboard**: Real-time mandate status updates
- **Reconciliation**: Matching internal records with NPCI status
- **Customer Service**: Providing status updates to customers
- **Automated Processing**: Triggering next steps based on status
- **Reporting**: Generating mandate registration reports

## Integration Points
- Use RequestId and ReferenceCode from mandate creation response
- Call periodically to track mandate progress
- Store UMRN (MndtId) for future transaction processing
- Update internal systems based on status changes

## Best Practices
- **Polling Strategy**: Check status every 15-30 minutes initially
- **Error Handling**: Implement retry logic for temporary failures
- **Data Storage**: Store all response fields for audit trail
- **Notification**: Alert customers of status changes
- **Reconciliation**: Daily reconciliation of all mandate statuses

## Rate Limits
- UAT: 200 requests/hour
- Production: 1000 requests/hour

## Security Features
- OAuth 2.0 authentication required
- Encrypted request/response payload
- Audit trail for all inquiries
- Access control based on merchant ID`,
    tags: ['E-NACH', 'Status', 'Inquiry', 'Reference', 'Tracking'],
    responseSchema: {
      type: 'object',
      properties: {
        MndtReqId: { type: 'string' },
        MndtId: { type: 'string' },
        Accptd: { type: 'string' },
        ErrorCode: { type: 'string' },
        ErrorDesc: { type: 'string' },
        ReferenceCode: { type: 'string' },
        ReqInitDate: { type: 'string' },
        AccptRefNo: { type: 'string' }
      }
    },
    rateLimits: {
      sandbox: 100,
      uat: 200,
      production: 1000
    },
    timeout: 30000,
    requiresAuth: true,
    authType: 'bearer',
    requiredPermissions: ['enach:inquiry', 'enach:read'],
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1'
  },
  {
    id: 'enach-status-by-umrn-005',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'E-NACH Status Inquiry (By UMRN)',
    path: '/EmandateStatusService/enquirybyumrn',
    method: 'POST',
    description: 'Retrieves E-NACH mandate registration status using UMRN (Unique Mandate Reference Number). This API helps track mandate status using the unique identifier assigned to each successful mandate.',
    summary: 'Get mandate status using UMRN',
    parameters: [
      {
        name: 'RequestId',
        type: 'string',
        required: true,
        description: 'Unique request identifier for this inquiry',
        example: 'uwu928131'
      },
      {
        name: 'Channel',
        type: 'string',
        required: true,
        description: 'Channel identifier',
        example: 'CV'
      },
      {
        name: 'UMRN',
        type: 'string',
        required: true,
        description: 'Unique Mandate Reference Number (UMRN)',
        example: 'AUBL7031708241000306'
      }
    ],
    headers: [
      {
        name: 'Content-Type',
        value: 'application/json',
        required: true
      },
      {
        name: 'Authorization',
        value: 'Bearer <access_token>',
        required: true
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Success - UMRN status retrieved successfully',
        example: {
          MndtReqId: 'MNDT000000017238703554338453381657',
          RejectBy: 'NULL',
          ReasonDesc: 'NULL',
          MerchantID: 'NACH00000000017900',
          NpciRefMsgID: 'MNDT000000017238703554338453381657',
          ReasonCode: 'NULL',
          MndtId: 'AUBL7031708241000306',
          CycleDate: 'NULL',
          Accptd: 'true',
          ErrorDesc: 'NA',
          ReferenceCode: '2705572814',
          ErrorCode: '000',
          ReqInitDate: '2024-08-17',
          AccptRefNo: '2962036'
        }
      },
      {
        status: 400,
        description: 'Bad Request - Invalid UMRN or parameters',
        example: {
          MndtId: 'INVALID_UMRN',
          ErrorCode: '08',
          ErrorDesc: 'Inquiry Request sent is invalid.',
          Accptd: 'NULL'
        }
      },
      {
        status: 404,
        description: 'Not Found - UMRN not found',
        example: {
          MndtId: 'UNKNOWN_UMRN',
          ErrorCode: '02',
          ErrorDesc: 'UMRN Not Found',
          Accptd: 'false'
        }
      }
    ],
    requestExample: `{
  "RequestId": "uwu928131",
  "Channel": "CV",
  "UMRN": "AUBL7031708241000306"
}`,
    responseExample: `{
  "MndtReqId": "MNDT000000017238703554338453381657",
  "RejectBy": "NULL",
  "ReasonDesc": "NULL",
  "MerchantID": "NACH00000000017900",
  "NpciRefMsgID": "MNDT000000017238703554338453381657",
  "ReasonCode": "NULL",
  "MndtId": "AUBL7031708241000306",
  "CycleDate": "NULL",
  "Accptd": "true",
  "ErrorDesc": "NA",
  "ReferenceCode": "2705572814",
  "ErrorCode": "000",
  "ReqInitDate": "2024-08-17",
  "AccptRefNo": "2962036"
}`,
    documentation: `# E-NACH Status Inquiry (By UMRN) API

This API retrieves the current status of E-NACH mandates using the UMRN (Unique Mandate Reference Number).

## Purpose
- Verify mandate status using UMRN
- Validate mandate existence and validity
- Get comprehensive mandate information
- Support transaction processing validations

## UMRN (Unique Mandate Reference Number)
- **Format**: Bank-specific identifier (e.g., AUBL7031708241000306)
- **Uniqueness**: Globally unique across NPCI network
- **Generation**: Created upon successful mandate registration
- **Usage**: Required for all subsequent mandate operations

## Key Differences from Reference Code Inquiry
- **Input**: Uses UMRN instead of reference code
- **Scope**: Can query any mandate with valid UMRN
- **Usage**: Typically used for operational queries
- **Access**: May have different access controls

## Response Structure
Same as reference code inquiry but specifically validates UMRN:
- **MndtId**: Returns the queried UMRN
- **Accptd**: Current mandate status
- **ErrorCode**: Validation and status code
- **ErrorDesc**: Detailed status information

## UMRN Validation Scenarios
1. **Valid Active UMRN**: Returns complete mandate details
2. **Invalid UMRN**: Returns error code 08 with description
3. **Expired UMRN**: Returns status with expiry information
4. **Cancelled UMRN**: Returns cancellation details

## Common Use Cases
- **Pre-Transaction Validation**: Verify mandate before processing
- **Customer Service**: Look up mandate details for customers
- **Reconciliation**: Verify mandate status during settlement
- **Compliance**: Audit mandate validity for regulatory purposes
- **System Integration**: Validate mandates from external systems

## UMRN Lifecycle Status
- **Active**: Mandate is valid and can process transactions
- **Pending**: Mandate registration still in progress
- **Expired**: Mandate validity period has ended
- **Cancelled**: Mandate has been cancelled by customer or bank
- **Suspended**: Mandate temporarily suspended
- **Rejected**: Mandate registration was rejected

## Error Code Interpretation
- **000**: Success - Valid active mandate
- **01**: Invalid UMRN format
- **02**: UMRN not found in system
- **03**: Mandate expired
- **04**: Mandate cancelled
- **05**: Mandate suspended
- **08**: Invalid inquiry request format

## Integration Guidelines
- **UMRN Storage**: Store UMRNs securely for future reference
- **Validation**: Always validate UMRN format before API call
- **Caching**: Cache active mandate status to reduce API calls
- **Error Handling**: Implement proper error handling for all scenarios
- **Logging**: Log all UMRN inquiries for audit purposes

## Performance Considerations
- **Response Time**: Typically faster than reference code lookup
- **Caching**: NPCI may cache UMRN lookups
- **Rate Limits**: Higher limits due to operational nature
- **Batch Processing**: Consider batch APIs for bulk inquiries

## Security Features
- **Access Control**: UMRN access may be restricted by merchant
- **Audit Trail**: All UMRN inquiries are logged
- **Data Privacy**: Sensitive mandate details protected
- **Encryption**: Full request/response encryption

## Best Practices
- **Format Validation**: Validate UMRN format before API call
- **Error Retry**: Implement exponential backoff for retries
- **Status Mapping**: Map API responses to internal status codes
- **Monitoring**: Monitor UMRN inquiry success rates
- **Documentation**: Maintain UMRN to customer mapping

## Rate Limits
- UAT: 200 requests/hour
- Production: 1000 requests/hour`,
    tags: ['E-NACH', 'Status', 'Inquiry', 'UMRN', 'Validation'],
    responseSchema: {
      type: 'object',
      properties: {
        MndtReqId: { type: 'string' },
        MndtId: { type: 'string' },
        Accptd: { type: 'string' },
        ErrorCode: { type: 'string' },
        ErrorDesc: { type: 'string' },
        ReferenceCode: { type: 'string' },
        ReqInitDate: { type: 'string' },
        AccptRefNo: { type: 'string' },
        MerchantID: { type: 'string' },
        RejectBy: { type: 'string' },
        ReasonDesc: { type: 'string' }
      }
    },
    rateLimits: {
      sandbox: 100,
      uat: 200,
      production: 1000
    },
    timeout: 30000,
    requiresAuth: true,
    authType: 'bearer',
    requiredPermissions: ['enach:inquiry', 'enach:read', 'umrn:validate'],
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1'
  }
];

async function insertEnachServices() {
  try {
    console.log('🔄 Starting E-NACH services insertion...');
    
    for (const service of enachServices) {
      console.log(`📝 Inserting ${service.name}...`);
      
      await db.insert(apiEndpoints).values({
        id: service.id,
        categoryId: service.categoryId,
        category: service.category,
        name: service.name,
        path: service.path,
        method: service.method,
        description: service.description,
        summary: service.summary,
        parameters: service.parameters,
        headers: service.headers,
        responses: service.responses,
        requestExample: service.requestExample,
        responseExample: service.responseExample,
        documentation: service.documentation,
        tags: service.tags,
        responseSchema: service.responseSchema,
        rateLimits: service.rateLimits,
        timeout: service.timeout,
        requiresAuth: service.requiresAuth,
        authType: service.authType,
        requiredPermissions: service.requiredPermissions,
        isActive: service.isActive,
        isInternal: service.isInternal,
        status: service.status,
        version: service.version,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`✅ Successfully inserted ${service.name}`);
    }
    
    console.log('🎉 All E-NACH services inserted successfully!');
    console.log(`📊 Total services inserted: ${enachServices.length}`);
    
  } catch (error) {
    console.error('❌ Error inserting E-NACH services:', error);
    throw error;
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  insertEnachServices().then(() => {
    console.log('🏁 Script completed successfully');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

export { insertEnachServices, enachServices };