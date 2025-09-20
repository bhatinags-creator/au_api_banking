import { sql } from 'drizzle-orm';
import { db } from '../server/db.js';
import { apiEndpoints } from '../shared/schema.js';

const PAYMENTS_CATEGORY_ID = '4657e5d5-b563-4f88-a81f-b653f52a59db';

const additionalBbpsServices = [
  {
    id: 'bbps-bill-payment-005',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'Bill Payment',
    path: '/bbpsservice/BillPayment',
    method: 'POST',
    description: 'Processes bill payments in the BBPS ecosystem. This API enables customers to pay their bills with comprehensive payment options, real-time processing, and detailed transaction tracking.',
    summary: 'Process bill payments with multiple payment modes',
    parameters: [
      {
        name: 'ver',
        type: 'string',
        required: true,
        description: 'Version of the API (e.g., 1.0)',
        example: '1.0'
      },
      {
        name: 'ts',
        type: 'string',
        required: true,
        description: 'Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format',
        example: '2023-03-31T17:52:25+05:30'
      },
      {
        name: 'origInst',
        type: 'string',
        required: true,
        description: 'Code assigned by NPCI to each BBPOU',
        example: 'AU01'
      },
      {
        name: 'refId',
        type: 'string',
        required: true,
        description: 'Unique identification (35 characters) for end-to-end transaction tracking',
        example: 'AU01BBPSBillPayRequest3083130901752'
      },
      {
        name: 'msgId',
        type: 'string',
        required: true,
        description: 'Unique identification to relate request and response message',
        example: 'AU01BBPSBillPayRequest3083130901752'
      },
      {
        name: 'txnReferenceId',
        type: 'string',
        required: true,
        description: 'Unique Transaction reference (UTR) number (20 characters)',
        example: 'AU013090BEHJOTD30831'
      },
      {
        name: 'customerMobile',
        type: 'string',
        required: true,
        description: 'Customer mobile number (10 digits)',
        example: '9773326382'
      },
      {
        name: 'agentId',
        type: 'string',
        required: true,
        description: 'Unique identification code allocated to the Agent by NPCI',
        example: 'AU01AU03AGT525314031'
      },
      {
        name: 'billerId',
        type: 'string',
        required: true,
        description: 'Unique identification code allocated to the Biller by NPCI',
        example: 'AAVA00000NACCC'
      },
      {
        name: 'amount',
        type: 'string',
        required: true,
        description: 'Transaction amount in paise format (without decimals)',
        example: '10000'
      },
      {
        name: 'paymentMode',
        type: 'string',
        required: true,
        description: 'Payment mode (Internet Banking, UPI, Debit Card, etc.)',
        example: 'Internet Banking'
      },
      {
        name: 'quickPay',
        type: 'string',
        required: true,
        description: 'Flag indicating if payment is done without bill fetch (Yes/No)',
        example: 'No'
      },
      {
        name: 'splitPay',
        type: 'string',
        required: true,
        description: 'Flag indicating if partial payment is done (Yes/No)',
        example: 'No'
      },
      {
        name: 'currency',
        type: 'string',
        required: true,
        description: 'Currency code (default: 356 for INR)',
        example: '356'
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
        value: 'Bearer <token>',
        required: true
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Success - Bill payment processed successfully',
        example: {
          Head: {
            RefId: 'AU01BBPSBillPayRequest3083130901752',
            Ver: '1.0',
            OrigInst: 'AU11',
            TS: '2023-03-31T17:52:27+05:30'
          },
          Reason: {
            ApprovalRefNum: 'AU01BBPSBillPayRequest3083130901752',
            ResponseCode: '000',
            ResponseReason: 'Successful'
          },
          Txn: {
            TxnReferenceId: 'AU013090BEHJOTD30831'
          }
        }
      },
      {
        status: 400,
        description: 'Bad Request - Invalid payment parameters',
        example: {
          ResponseCode: '001',
          ResponseReason: 'Invalid Payment Details'
        }
      },
      {
        status: 402,
        description: 'Payment Required - Insufficient funds',
        example: {
          ResponseCode: '002',
          ResponseReason: 'Insufficient Balance'
        }
      }
    ],
    requestExample: `{
  "RequestId": "BBPS1677996401629",
  "OriginatingChannel": "DEC",
  "Head": {
    "Ver": "1.0",
    "TS": "2023-03-31T17:52:25+05:30",
    "OrigInst": "AU01",
    "RefId": "AU01BBPSBillPayRequest3083130901752"
  },
  "Txn": {
    "MsgId": "AU01BBPSBillPayRequest3083130901752",
    "TxnReferenceId": "AU013090BEHJOTD30831",
    "TS": "2023-03-31T17:52:25+05:30",
    "Type": "FORWARD TYPE REQUEST"
  },
  "Customer": {
    "Mobile": "9773326382"
  },
  "Agent": {
    "Id": "AU01AU03AGT525314031"
  },
  "BillDetails": {
    "BillerId": "AAVA00000NACCC",
    "CustomerParams": [
      {"Name": "a", "Value": "1"},
      {"Name": "a b", "Value": "11"}
    ]
  },
  "Amount": {
    "Amount": "10000",
    "CustConvFee": "0",
    "Currency": "356"
  },
  "PaymentMethod": {
    "QuickPay": "No",
    "PaymentMode": "Internet Banking",
    "SplitPay": "No",
    "OffusPay": "Yes"
  }
}`,
    responseExample: `{
  "Head": {
    "RefId": "AU01BBPSBillPayRequest3083130901752",
    "Ver": "1.0",
    "OrigInst": "AU11",
    "TS": "2023-03-31T17:52:27+05:30"
  },
  "Reason": {
    "ApprovalRefNum": "AU01BBPSBillPayRequest3083130901752",
    "ResponseCode": "000",
    "ResponseReason": "Successful",
    "ComplianceRespCd": "",
    "ComplianceReason": ""
  },
  "Txn": {
    "MsgId": "AU01BBPSBillPayRequest3083130901752",
    "TxnReferenceId": "AU013090BEHJOTD30831",
    "TS": "2023-03-31T17:52:27+05:30"
  },
  "BillerResponse": {
    "Amount": "10000",
    "BillDate": "2023-03-31",
    "BillNumber": "NA",
    "CustomerName": "NA",
    "DueDate": "2023-03-31"
  }
}`,
    documentation: `# Bill Payment API

This API processes bill payments in the BBPS ecosystem with comprehensive payment options and real-time processing.

## Purpose
- Process customer bill payments securely
- Support multiple payment modes and channels
- Provide real-time payment confirmation
- Enable split payments and convenience fee handling

## Key Features
- Multiple payment modes (UPI, Internet Banking, Cards, etc.)
- Quick Pay option (without bill fetch)
- Split payment support for partial amounts
- Real-time payment processing
- Comprehensive transaction tracking with UTR
- Risk scoring and analytics integration

## Payment Modes Supported
- Internet Banking
- UPI
- Debit Card
- Credit Card
- Net Banking
- Wallet
- AEPS

## Amount Format
Amount should be passed in paise format (without decimals):
- Payment Amount: ₹100.00 = 10000 (in request)
- Payment Amount: ₹365.50 = 36550 (in request)

## Transaction Reference
UTR format: OU ID (4 chars) + Julian date (4 chars) + Random (12 chars)
Example: AU013090BEHJOTD30831

## Authentication
Requires valid BBPOU credentials and proper agent authentication.

## Rate Limits
- Sandbox: 50 requests/hour
- UAT: 200 requests/hour
- Production: 500 requests/hour

## Error Codes
- 000: Success
- 001: Invalid Payment Details
- 002: Insufficient Balance
- 003: Payment Failed
- 004: Biller Service Unavailable
- 999: System Error`,
    tags: ['BBPS', 'Payment', 'Transaction', 'UTR', 'QuickPay'],
    responseSchema: {
      type: 'object',
      properties: {
        Head: {
          type: 'object',
          properties: {
            RefId: { type: 'string' },
            Ver: { type: 'string' },
            OrigInst: { type: 'string' },
            TS: { type: 'string' }
          }
        },
        Reason: {
          type: 'object',
          properties: {
            ApprovalRefNum: { type: 'string' },
            ResponseCode: { type: 'string' },
            ResponseReason: { type: 'string' }
          }
        },
        Txn: {
          type: 'object',
          properties: {
            TxnReferenceId: { type: 'string' },
            MsgId: { type: 'string' }
          }
        }
      }
    },
    rateLimits: {
      sandbox: 50,
      uat: 200,
      production: 500
    },
    timeout: 45000,
    requiresAuth: true,
    authType: 'bearer',
    requiredPermissions: ['bbps:payment', 'bbps:write', 'sandbox'],
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1'
  },
  {
    id: 'bbps-bill-validate-006',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'Bill Validate',
    path: '/bbpsservice/BillValidation',
    method: 'POST',
    description: 'Validates bill details before payment processing. This API helps customer side BBPOU to validate bill information and ensure accuracy before proceeding with payment.',
    summary: 'Validate bill details before payment',
    parameters: [
      {
        name: 'ver',
        type: 'string',
        required: true,
        description: 'Version of the API (e.g., 1.0)',
        example: '1.0'
      },
      {
        name: 'ts',
        type: 'string',
        required: true,
        description: 'Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format',
        example: '2023-03-18T11:58:45+05:30'
      },
      {
        name: 'origInst',
        type: 'string',
        required: true,
        description: 'Code assigned by NPCI to each BBPOU',
        example: 'AU01'
      },
      {
        name: 'refId',
        type: 'string',
        required: true,
        description: 'Unique identification (35 characters) for end-to-end process',
        example: 'AU01BillValidateBiller6045830771158'
      },
      {
        name: 'agentId',
        type: 'string',
        required: false,
        description: 'Unique identification code allocated to the Agent by NPCI',
        example: 'AU01AU04MBBA00000002'
      },
      {
        name: 'billerId',
        type: 'string',
        required: true,
        description: 'Unique identification code allocated to the Biller by NPCI',
        example: 'AIRT00000NAT87'
      },
      {
        name: 'customerParams',
        type: 'object',
        required: true,
        description: 'Customer parameters for bill validation (max 5 parameters)',
        example: '{"Name": "Customer Id", "Value": "3001812613"}'
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
        value: 'Bearer <token>',
        required: true
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Success - Bill validation completed successfully',
        example: {
          TransactionStatus: {
            ResponseCode: '000',
            ResponseMessage: 'Successful'
          },
          Header: {
            RefId: 'AU01BillValidateBiller6045830771158',
            OrigInst: 'BBCU',
            TimeStamp: '2023-03-18T11:58:45+05:30',
            Ver: '1.0'
          },
          Reason: {
            ApprovalRefNum: '1007201755',
            ResponseCode: '000',
            ResponseReason: 'Successful'
          }
        }
      },
      {
        status: 400,
        description: 'Bad Request - Invalid validation parameters',
        example: {
          ResponseCode: '001',
          ResponseReason: 'Invalid Customer Parameters'
        }
      },
      {
        status: 404,
        description: 'Not Found - Bill not found for validation',
        example: {
          ResponseCode: '002',
          ResponseReason: 'Bill Not Found'
        }
      }
    ],
    requestExample: `{
  "ReferenceNumber": "BBPSBillValidate1679120925198",
  "TransactionBranch": "0",
  "RequestId": "BBPSCreateSI1677996401629",
  "OriginatingChannel": "DEC",
  "Header": {
    "Ver": "1.0",
    "TimeStamp": "2023-03-18T11:58:45+05:30",
    "OrigInst": "AU01",
    "RefId": "AU01BillValidateBiller6045830771158"
  },
  "AgentId": "AU01AU04MBBA00000002",
  "BillDetails": {
    "BillerId": "AIRT00000NAT87",
    "CustomerParams": {
      "Name": "Customer Id",
      "Value": "3001812613"
    }
  }
}`,
    responseExample: `{
  "TransactionStatus": {
    "ResponseCode": "000",
    "ResponseMessage": "Successful",
    "ExtendedErrorDetails": {
      "messages": {
        "code": "000",
        "message": "Successful"
      }
    }
  },
  "Header": {
    "RefId": "AU01BillValidateBiller6045830771158",
    "OrigInst": "BBCU",
    "TimeStamp": "2023-03-18T11:58:45+05:30",
    "Ver": "1.0"
  },
  "Reason": {
    "ApprovalRefNum": "1007201755",
    "ResponseCode": "000",
    "ResponseReason": "Successful",
    "ComplianceRespCd": "",
    "ComplianceReason": ""
  }
}`,
    documentation: `# Bill Validate API

This API validates bill details before payment processing in the BBPS ecosystem.

## Purpose
- Validate bill information before payment
- Ensure customer parameter accuracy
- Pre-validation for payment processing
- Support agent institutions in bill verification

## Key Features
- Real-time bill validation
- Customer parameter verification
- Compliance validation
- Error detection before payment
- Biller plan response for prepaid services

## Validation Process
1. Customer provides bill parameters
2. System validates against biller records
3. Returns validation status with details
4. Provides recommended plans if applicable

## Customer Parameters
Maximum 5 customer parameters can be validated:
- Customer ID
- Account Number
- Mobile Number
- Service Number
- Policy Number

## Authentication
Requires valid agent institution credentials.

## Rate Limits
- Sandbox: 100 requests/hour
- UAT: 500 requests/hour
- Production: 1000 requests/hour

## Error Codes
- 000: Success
- 001: Invalid Customer Parameters
- 002: Bill Not Found
- 003: Validation Failed
- 004: Biller Service Unavailable
- 999: System Error`,
    tags: ['BBPS', 'Validation', 'Bill', 'Verify', 'Customer'],
    responseSchema: {
      type: 'object',
      properties: {
        TransactionStatus: {
          type: 'object',
          properties: {
            ResponseCode: { type: 'string' },
            ResponseMessage: { type: 'string' }
          }
        },
        Header: {
          type: 'object',
          properties: {
            RefId: { type: 'string' },
            OrigInst: { type: 'string' },
            TimeStamp: { type: 'string' },
            Ver: { type: 'string' }
          }
        },
        Reason: {
          type: 'object',
          properties: {
            ApprovalRefNum: { type: 'string' },
            ResponseCode: { type: 'string' },
            ResponseReason: { type: 'string' }
          }
        }
      }
    },
    rateLimits: {
      sandbox: 100,
      uat: 500,
      production: 1000
    },
    timeout: 30000,
    requiresAuth: true,
    authType: 'bearer',
    requiredPermissions: ['bbps:validate', 'bbps:read', 'sandbox'],
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1'
  },
  {
    id: 'bbps-check-complaint-status-007',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'Check Complaint Status',
    path: '/bbpsservice/CheckComplaintStatus',
    method: 'POST',
    description: 'Checks the status of complaints raised in the BBPS ecosystem. This API helps customer side BBPOU to track complaint progress and get current status information.',
    summary: 'Check status of raised complaints',
    parameters: [
      {
        name: 'refId',
        type: 'string',
        required: true,
        description: 'Unique identification (35 characters) for end-to-end process',
        example: 'ABCDE12345ABCDE12345ABCDE1A01192345'
      },
      {
        name: 'origInst',
        type: 'string',
        required: true,
        description: 'Code assigned by NPCI to each BBPOU',
        example: 'AU01'
      },
      {
        name: 'ts',
        type: 'string',
        required: true,
        description: 'Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format',
        example: '2022-08-17T16:44:59+05:30'
      },
      {
        name: 'ver',
        type: 'string',
        required: true,
        description: 'Version of the API (e.g., 1.0)',
        example: '1.0'
      },
      {
        name: 'msgId',
        type: 'string',
        required: true,
        description: 'Unique identification to relate request and response message',
        example: 'PYZAE12345ABCDE12345ABCDE1A01192345'
      },
      {
        name: 'xchangeId',
        type: 'string',
        required: true,
        description: 'Exchange ID (506 for complaint status check)',
        example: '506'
      },
      {
        name: 'complaintId',
        type: 'string',
        required: true,
        description: 'Complaint ID generated by BBPCU',
        example: 'COMP123456789'
      },
      {
        name: 'complaintType',
        type: 'string',
        required: true,
        description: 'Type of complaint (Transaction or Service)',
        example: 'Transaction'
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
        value: 'Bearer <token>',
        required: true
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Success - Complaint status retrieved successfully',
        example: {
          head: {
            ver: 1.0,
            origInst: 'AU01',
            refId: 'ABCDE12345ABCDE12345ABCDE1A01192345',
            ts: '2022-08-17T16:44:59'
          },
          reason: {
            responseCode: '000',
            responseReason: 'Successful'
          },
          complaintDetails: {
            complaintId: 'COMP123456789',
            complaintStatus: 'In Progress',
            assigned: 'Support Team A',
            remarks: 'Under investigation'
          }
        }
      },
      {
        status: 400,
        description: 'Bad Request - Invalid complaint ID or parameters',
        example: {
          ResponseCode: '001',
          ResponseReason: 'Invalid Complaint ID'
        }
      },
      {
        status: 404,
        description: 'Not Found - Complaint not found',
        example: {
          ResponseCode: '002',
          ResponseReason: 'Complaint Not Found'
        }
      }
    ],
    requestExample: `{
  "head": {
    "ver": 1.0,
    "origInst": "AU01",
    "refId": "ABCDE12345ABCDE12345ABCDE1A01192345",
    "ts": "2022-08-17T16:44:59+05:30"
  },
  "RequestId": "12323",
  "OriginatingChannel": "CRM",
  "ReferenceNumber": "1231231",
  "TransactionBranch": 100,
  "txn": {
    "xchangeId": "506",
    "msgId": "PYZAE12345ABCDE12345ABCDE1A01192345",
    "ts": "2022-08-17T16:44:59+05:30"
  },
  "complaintDetails": {
    "complaintId": "COMP123456789",
    "complaintType": "Transaction"
  }
}`,
    responseExample: `{
  "head": {
    "ver": 1.0,
    "origInst": "AU01",
    "refId": "ABCDE12345ABCDE12345ABCDE1A01192345",
    "ts": "2022-08-17T16:44:59"
  },
  "reason": {
    "responseReason": "Successful",
    "responseCode": "000"
  },
  "txn": {
    "xchangeId": "506",
    "msgId": "PYZAE12345ABCDE12345ABCDE1A01192345",
    "ts": "2022-08-17T16:44:59"
  },
  "complaintDetails": {
    "complaintStatus": "In Progress",
    "complaintId": "COMP123456789",
    "assigned": "Support Team A",
    "remarks": "Under investigation by technical team"
  }
}`,
    documentation: `# Check Complaint Status API

This API checks the status of complaints raised in the BBPS ecosystem.

## Purpose
- Track complaint progress and resolution
- Get current status of raised complaints
- Monitor complaint assignment and updates
- Support customer service operations

## Key Features
- Real-time complaint status tracking
- Assignment information
- Progress remarks and updates
- Complaint history tracking
- Multi-type complaint support

## Exchange IDs
- 401: Transaction Status
- 501: Complaint Registration
- 502: Complaint Re-assignment
- 506: Complaint Status Check (this API)
- 507: Complaint Closure

## Complaint Types
- **Transaction**: Related to specific payment transactions
- **Service**: Related to general service issues

## Complaint Status Values
- **Open**: Newly raised complaint
- **In Progress**: Under investigation
- **Pending**: Waiting for additional information
- **Resolved**: Issue has been fixed
- **Closed**: Complaint completed

## Authentication
Requires valid BBPOU credentials.

## Rate Limits
- Sandbox: 100 requests/hour
- UAT: 500 requests/hour
- Production: 1000 requests/hour

## Error Codes
- 000: Success
- 001: Invalid Complaint ID
- 002: Complaint Not Found
- 003: Access Denied
- 999: System Error`,
    tags: ['BBPS', 'Complaint', 'Status', 'Support', 'Tracking'],
    responseSchema: {
      type: 'object',
      properties: {
        head: {
          type: 'object',
          properties: {
            ver: { type: 'number' },
            origInst: { type: 'string' },
            refId: { type: 'string' },
            ts: { type: 'string' }
          }
        },
        reason: {
          type: 'object',
          properties: {
            responseCode: { type: 'string' },
            responseReason: { type: 'string' }
          }
        },
        complaintDetails: {
          type: 'object',
          properties: {
            complaintId: { type: 'string' },
            complaintStatus: { type: 'string' },
            assigned: { type: 'string' },
            remarks: { type: 'string' }
          }
        }
      }
    },
    rateLimits: {
      sandbox: 100,
      uat: 500,
      production: 1000
    },
    timeout: 30000,
    requiresAuth: true,
    authType: 'bearer',
    requiredPermissions: ['bbps:complaint', 'bbps:read', 'sandbox'],
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1'
  },
  {
    id: 'bbps-get-circle-biller-008',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'Get Circle Biller',
    path: '/bbpsservice/GetCircleBiller',
    method: 'POST',
    description: 'Retrieves circle and biller information based on mobile number prefix (MSISDN series). This API helps determine the appropriate circle and biller for mobile-based services.',
    summary: 'Get circle and biller info by mobile prefix',
    parameters: [
      {
        name: 'ver',
        type: 'string',
        required: true,
        description: 'Version of the API (e.g., 1.0)',
        example: '1.0'
      },
      {
        name: 'ts',
        type: 'string',
        required: true,
        description: 'Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format',
        example: '2024-12-09T14:13:02+05:30'
      },
      {
        name: 'origInst',
        type: 'string',
        required: true,
        description: 'Code assigned by NPCI to each agent institution',
        example: 'AU01'
      },
      {
        name: 'refId',
        type: 'string',
        required: true,
        description: 'Unique identification (35 characters) for end-to-end process',
        example: 'ABCDE12345ABCDE12345ABCDE1A01192345'
      },
      {
        name: 'msisdnSeries',
        type: 'string',
        required: true,
        description: 'First 4 digits of mobile number of customer',
        example: '9413'
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
        value: 'Bearer <token>',
        required: true
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Success - Circle and biller information retrieved successfully',
        example: {
          status: 'success',
          data: {
            bbpsResponseStatus: {
              responseCode: '000',
              message: 'Successful'
            },
            Head: {
              Ver: '1.0',
              OrigInst: 'AU01',
              TimeStamp: '2024-12-09T14:13:02'
            },
            TransactionStatus: {
              ResponseCode: '000',
              ResponseMessage: 'Successful'
            },
            billerId: 'MAHA00000MUM01',
            circleName: 'Rajasthan'
          }
        }
      },
      {
        status: 400,
        description: 'Bad Request - Invalid MSISDN series',
        example: {
          ResponseCode: '001',
          ResponseReason: 'Invalid MSISDN Series'
        }
      },
      {
        status: 404,
        description: 'Not Found - No biller found for given MSISDN series',
        example: {
          ResponseCode: '002',
          ResponseReason: 'Biller Not Found'
        }
      }
    ],
    requestExample: `{
  "Search": {
    "msisdnSeries": "9413"
  }
}`,
    responseExample: `{
  "status": "success",
  "data": {
    "bbpsResponseStatus": {
      "responseCode": "000",
      "message": "Successful"
    },
    "Head": {
      "Ver": "1.0",
      "OrigInst": "AU01",
      "RefId": null,
      "TimeStamp": "2024-12-09T14:13:02",
      "TS": null
    },
    "TransactionStatus": {
      "ResponseCode": "000",
      "ResponseMessage": "Successful",
      "ExtendedErrorDetails": {
        "messages": [
          {
            "code": "0",
            "message": "Successful"
          }
        ]
      }
    },
    "Reason": {
      "ResponseCode": 0,
      "ComplianceReason": null,
      "ComplianceRespCd": null,
      "ResponseReason": "Successful"
    },
    "billerId": "MAHA00000MUM01",
    "circleName": "Rajasthan"
  }
}`,
    documentation: `# Get Circle Biller API

This API retrieves circle and biller information based on mobile number prefix (MSISDN series).

## Purpose
- Determine appropriate circle for mobile services
- Get biller information based on mobile number prefix
- Support telecom bill payment operations
- Enable automatic biller selection

## Key Features
- MSISDN series-based lookup
- Circle identification for mobile operators
- Biller mapping for telecom services
- Regional service area detection
- Real-time circle information

## MSISDN Series
Mobile number prefixes in India are allocated to different operators and circles:
- Different prefixes map to different telecom circles
- Each circle has specific billers associated
- Helps in automatic operator and circle detection

## Common Circles
- Delhi
- Mumbai
- Kolkata
- Chennai
- Gujarat
- Rajasthan
- Maharashtra
- Karnataka
- Andhra Pradesh
- Tamil Nadu

## Use Cases
- Mobile bill payment
- Recharge services
- Operator identification
- Circle-specific service offerings

## Authentication
Requires valid agent institution credentials.

## Rate Limits
- Sandbox: 100 requests/hour
- UAT: 500 requests/hour
- Production: 1000 requests/hour

## Error Codes
- 000: Success
- 001: Invalid MSISDN Series
- 002: Biller Not Found
- 003: Circle Not Available
- 999: System Error`,
    tags: ['BBPS', 'Circle', 'MSISDN', 'Mobile', 'Telecom'],
    responseSchema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            bbpsResponseStatus: {
              type: 'object',
              properties: {
                responseCode: { type: 'string' },
                message: { type: 'string' }
              }
            },
            Head: {
              type: 'object',
              properties: {
                Ver: { type: 'string' },
                OrigInst: { type: 'string' },
                TimeStamp: { type: 'string' }
              }
            },
            billerId: { type: 'string' },
            circleName: { type: 'string' }
          }
        }
      }
    },
    rateLimits: {
      sandbox: 100,
      uat: 500,
      production: 1000
    },
    timeout: 30000,
    requiresAuth: true,
    authType: 'bearer',
    requiredPermissions: ['bbps:read', 'sandbox'],
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1'
  },
  {
    id: 'bbps-raise-complaint-009',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'Raise Complaint',
    path: '/bbpsservice/RaiseComplaint',
    method: 'POST',
    description: 'Raises complaints in the BBPS ecosystem for transaction or service-related issues. This API enables customers to register complaints and track resolution progress.',
    summary: 'Raise complaints for transactions or services',
    parameters: [
      {
        name: 'refId',
        type: 'string',
        required: true,
        description: 'Unique identification (35 characters) for end-to-end process',
        example: 'BBPSAU01RaiseComplaint7744820982154'
      },
      {
        name: 'origInst',
        type: 'string',
        required: true,
        description: 'Code assigned by NPCI to each BBPOU',
        example: 'AU01'
      },
      {
        name: 'ts',
        type: 'string',
        required: true,
        description: 'Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format',
        example: '2022-04-08T21:54:14+05:30'
      },
      {
        name: 'ver',
        type: 'string',
        required: true,
        description: 'Version of the API (e.g., 1.0)',
        example: '1.0'
      },
      {
        name: 'msgId',
        type: 'string',
        required: true,
        description: 'Unique identification to relate request and response message',
        example: 'BBPSAU01RaiseComplaint7744820982154'
      },
      {
        name: 'xchangeId',
        type: 'string',
        required: true,
        description: 'Exchange ID (501 for complaint registration)',
        example: '501'
      },
      {
        name: 'complaintType',
        type: 'string',
        required: true,
        description: 'Type of complaint (Transaction or Service)',
        example: 'Transaction'
      },
      {
        name: 'description',
        type: 'string',
        required: true,
        description: 'Detailed description of the complaint (150 characters)',
        example: 'loan account not updated'
      },
      {
        name: 'disposition',
        type: 'string',
        required: true,
        description: 'Pre-defined disposition for the complaint (55 characters)',
        example: 'Transaction Successful, account not updated'
      },
      {
        name: 'txnReferenceId',
        type: 'string',
        required: true,
        description: 'Unique Transaction reference (UTR) number for transaction complaints',
        example: 'AU012098BNBNJBY02354'
      },
      {
        name: 'otp',
        type: 'string',
        required: false,
        description: 'OTP for complaint registration verification (10 digits)',
        example: '123456'
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
        value: 'Bearer <token>',
        required: true
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Success - Complaint raised successfully',
        example: {
          head: {
            ver: 1.0,
            origInst: 'AU01',
            refId: 'BBPSAU01RaiseComplaint7744820982154',
            ts: '2022-04-08T21:54:14'
          },
          reason: {
            responseCode: '000',
            responseReason: 'Successful'
          },
          complaintDetails: {
            complaintId: 'COMP123456789',
            assigned: 'Support Team A',
            ComplaintStatus: 'Open'
          }
        }
      },
      {
        status: 400,
        description: 'Bad Request - Invalid complaint parameters',
        example: {
          ResponseCode: '001',
          ResponseReason: 'Invalid Complaint Details'
        }
      },
      {
        status: 422,
        description: 'Unprocessable Entity - Complaint validation failed',
        example: {
          ResponseCode: '002',
          ResponseReason: 'Complaint Validation Failed'
        }
      }
    ],
    requestExample: `{
  "ReferenceNumber": "BBPSRaiseComplaint1649435054921",
  "TransactionBranch": "0",
  "complaintDetails": {
    "complaintType": "Transaction",
    "description": "loan account not updated",
    "disposition": "Transaction Successful, account not updated",
    "txnReferenceId": "AU012098BNBNJBY02354"
  },
  "head": {
    "origInst": "AU01",
    "refId": "BBPSAU01RaiseComplaint7744820982154",
    "ts": "2022-04-08T21:54:14+05:30",
    "ver": "1.0"
  },
  "txn": {
    "msgId": "BBPSAU01RaiseComplaint7744820982154",
    "ts": "2022-04-08T21:54:14+05:30",
    "xchangeId": "501"
  }
}`,
    responseExample: `{
  "head": {
    "ver": 1.0,
    "origInst": "AU01",
    "refId": "BBPSAU01RaiseComplaint7744820982154",
    "ts": "2022-04-08T21:54:14"
  },
  "reason": {
    "responseReason": "Successful",
    "responseCode": "000"
  },
  "txn": {
    "xchangeId": "501",
    "msgId": "BBPSAU01RaiseComplaint7744820982154",
    "ts": "2022-04-08T21:54:14"
  },
  "complaintDetails": {
    "OpenComplaint": true,
    "complaintId": "COMP123456789",
    "assigned": "Support Team A",
    "ComplaintStatus": "Open"
  }
}`,
    documentation: `# Raise Complaint API

This API enables customers to raise complaints in the BBPS ecosystem for transaction or service-related issues.

## Purpose
- Register customer complaints for transactions
- Track complaint resolution progress
- Support customer service operations
- Enable dispute resolution workflow

## Key Features
- Transaction and service complaint support
- Automatic complaint ID generation
- OTP verification for mobile validation
- Pre-defined disposition categories
- Real-time complaint registration
- Assignment to support teams

## Complaint Types
- **Transaction**: Issues related to specific payment transactions
  - Payment failed but amount debited
  - Bill not updated after payment
  - Wrong amount debited
  - Transaction timeout issues

- **Service**: General service-related issues
  - Service unavailability
  - Poor customer support
  - Technical issues
  - Account-related problems

## Exchange IDs
- 501: Complaint Registration (this API)
- 502: Complaint Re-assignment
- 506: Complaint Status Check
- 507: Complaint Closure

## Pre-defined Dispositions
- Transaction Successful, account not updated
- Transaction Failed, amount debited
- Wrong amount charged
- Service unavailable
- Technical error encountered

## OTP Verification
Optional OTP can be used to verify the mobile number during complaint registration for additional security.

## Authentication
Requires valid BBPOU credentials.

## Rate Limits
- Sandbox: 50 requests/hour
- UAT: 200 requests/hour
- Production: 500 requests/hour

## Error Codes
- 000: Success
- 001: Invalid Complaint Details
- 002: Complaint Validation Failed
- 003: OTP Verification Failed
- 999: System Error`,
    tags: ['BBPS', 'Complaint', 'Registration', 'Support', 'Dispute'],
    responseSchema: {
      type: 'object',
      properties: {
        head: {
          type: 'object',
          properties: {
            ver: { type: 'number' },
            origInst: { type: 'string' },
            refId: { type: 'string' },
            ts: { type: 'string' }
          }
        },
        reason: {
          type: 'object',
          properties: {
            responseCode: { type: 'string' },
            responseReason: { type: 'string' }
          }
        },
        complaintDetails: {
          type: 'object',
          properties: {
            complaintId: { type: 'string' },
            assigned: { type: 'string' },
            ComplaintStatus: { type: 'string' }
          }
        }
      }
    },
    rateLimits: {
      sandbox: 50,
      uat: 200,
      production: 500
    },
    timeout: 30000,
    requiresAuth: true,
    authType: 'bearer',
    requiredPermissions: ['bbps:complaint', 'bbps:write', 'sandbox'],
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1'
  },
  {
    id: 'bbps-transaction-status-mobile-010',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'Transaction Status Mobile',
    path: '/bbpsservice/TransactionStatusMobile',
    method: 'POST',
    description: 'Retrieves transaction status information based on mobile number and date range. This API helps track transaction history and status for mobile-based queries.',
    summary: 'Get transaction status by mobile number',
    parameters: [
      {
        name: 'refId',
        type: 'string',
        required: true,
        description: 'Unique identification (35 characters) for end-to-end process',
        example: 'BBPSAU01TxnStatusMobil1105322091854'
      },
      {
        name: 'origInst',
        type: 'string',
        required: true,
        description: 'Code assigned by NPCI to each BBPOU',
        example: 'AU01'
      },
      {
        name: 'ts',
        type: 'string',
        required: true,
        description: 'Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format',
        example: '2022-07-28T18:54:18+05:30'
      },
      {
        name: 'ver',
        type: 'string',
        required: true,
        description: 'Version of the API (e.g., 1.0)',
        example: '1.0'
      },
      {
        name: 'msgId',
        type: 'string',
        required: true,
        description: 'Unique identification to relate request and response message',
        example: 'BBPSAU01TxnStatusMobil1105322091854'
      },
      {
        name: 'xchangeId',
        type: 'string',
        required: true,
        description: 'Exchange ID (401 for transaction status)',
        example: '401'
      },
      {
        name: 'mobile',
        type: 'string',
        required: true,
        description: 'Mobile number to search transactions (10 digits)',
        example: '9358816069'
      },
      {
        name: 'fromDate',
        type: 'string',
        required: true,
        description: 'From date for transaction search (YYYY-MM-DD format)',
        example: '2022-07-01'
      },
      {
        name: 'toDate',
        type: 'string',
        required: false,
        description: 'To date for transaction search (YYYY-MM-DD format)',
        example: '2022-07-28'
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
        value: 'Bearer <token>',
        required: true
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Success - Transaction status retrieved successfully',
        example: {
          head: {
            refId: 'BBPSAU01TxnStatusMobil1105322091854',
            origInst: 'AU01',
            ts: '2022-07-28T18:54:18',
            ver: '1.0'
          },
          reason: {
            responseCode: '000',
            responseReason: 'Successful'
          },
          txnList: [
            {
              txnReferenceId: 'AU012202CODODMD67209',
              agentId: 'AU01AU02INB529957923',
              billerId: 'AAVA00000NACCC',
              amount: '100000',
              txnDate: '2022-07-21T13:06:11+05:30',
              txnStatus: 'Success'
            }
          ],
          customerDetails: {
            mobile: '9358816069'
          }
        }
      },
      {
        status: 400,
        description: 'Bad Request - Invalid mobile number or date range',
        example: {
          ResponseCode: '001',
          ResponseReason: 'Invalid Mobile Number'
        }
      },
      {
        status: 404,
        description: 'Not Found - No transactions found for given criteria',
        example: {
          ResponseCode: '002',
          ResponseReason: 'No Transactions Found'
        }
      }
    ],
    requestExample: `{
  "TransactionStatusMobileRequest": {
    "ReferenceNumber": "BBPSTxnStatusMobile1659014658092",
    "TransactionBranch": "0",
    "head": {
      "origInst": "AU01",
      "refId": "BBPSAU01TxnStatusMobil1105322091854",
      "ts": "2022-07-28T18:54:18+05:30",
      "ver": "1.0"
    },
    "transactionDetails": {
      "fromDate": "2022-07-01",
      "mobile": "9358816069",
      "toDate": "2022-07-28"
    },
    "txn": {
      "msgId": "BBPSAU01TxnStatusMobil1105322091854",
      "ts": "2022-07-28T18:54:18+05:30",
      "xchangeId": "401"
    }
  }
}`,
    responseExample: `{
  "head": {
    "refId": "BBPSAU01TxnStatusMobil1105322091854",
    "origInst": "AU01",
    "ts": "2022-07-28T18:54:18",
    "ver": "1.0"
  },
  "reason": {
    "responseCode": "000",
    "responseReason": "Successful"
  },
  "txn": {
    "msgId": "BBPSAU01TxnStatusMobil1105322091854",
    "ts": "2022-07-28T18:54:18",
    "xchangeId": "401"
  },
  "txnList": [
    {
      "txnReferenceId": "AU012202CODODMD67209",
      "agentId": "AU01AU02INB529957923",
      "billerId": "AAVA00000NACCC",
      "amount": "100000",
      "txnDate": "2022-07-21T13:06:11+05:30",
      "txnStatus": "Success"
    }
  ],
  "customerDetails": {
    "mobile": "9358816069"
  }
}`,
    documentation: `# Transaction Status Mobile API

This API retrieves transaction status information based on mobile number and date range.

## Purpose
- Track transaction history by mobile number
- Get transaction status for specific date ranges
- Support customer service inquiries
- Enable transaction reconciliation
- Monitor payment success/failure rates

## Key Features
- Mobile number-based transaction search
- Date range filtering for transaction history
- Comprehensive transaction details
- Customer information retrieval
- Multiple transaction status support
- Real-time status updates

## Transaction Status Values
- **Success**: Transaction completed successfully
- **Failure**: Transaction failed
- **Pending**: Transaction in progress
- **Timeout**: Transaction timed out
- **Cancelled**: Transaction cancelled by user

## Search Criteria
- **Mobile Number**: 10-digit Indian mobile number
- **Date Range**: From date (mandatory) and to date (optional)
- **Exchange ID**: 401 for transaction status queries

## Transaction Details Provided
- Transaction Reference ID (UTR)
- Agent ID who processed the transaction
- Biller ID for the transaction
- Transaction amount (in paise format)
- Transaction date and time
- Current transaction status

## Date Format
All dates should be in YYYY-MM-DD format:
- fromDate: 2022-07-01
- toDate: 2022-07-28

## Authentication
Requires valid BBPOU credentials.

## Rate Limits
- Sandbox: 100 requests/hour
- UAT: 500 requests/hour
- Production: 1000 requests/hour

## Error Codes
- 000: Success
- 001: Invalid Mobile Number
- 002: No Transactions Found
- 003: Invalid Date Range
- 004: Access Denied
- 999: System Error`,
    tags: ['BBPS', 'Transaction', 'Status', 'Mobile', 'History'],
    responseSchema: {
      type: 'object',
      properties: {
        head: {
          type: 'object',
          properties: {
            refId: { type: 'string' },
            origInst: { type: 'string' },
            ts: { type: 'string' },
            ver: { type: 'string' }
          }
        },
        reason: {
          type: 'object',
          properties: {
            responseCode: { type: 'string' },
            responseReason: { type: 'string' }
          }
        },
        txnList: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              txnReferenceId: { type: 'string' },
              agentId: { type: 'string' },
              billerId: { type: 'string' },
              amount: { type: 'string' },
              txnDate: { type: 'string' },
              txnStatus: { type: 'string' }
            }
          }
        },
        customerDetails: {
          type: 'object',
          properties: {
            mobile: { type: 'string' }
          }
        }
      }
    },
    rateLimits: {
      sandbox: 100,
      uat: 500,
      production: 1000
    },
    timeout: 30000,
    requiresAuth: true,
    authType: 'bearer',
    requiredPermissions: ['bbps:read', 'bbps:transaction', 'sandbox'],
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1'
  }
];

async function insertAdditionalBbpsServices() {
  try {
    console.log('🔄 Starting additional BBPS services insertion...');
    
    for (const service of additionalBbpsServices) {
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
    
    console.log('🎉 All additional BBPS services inserted successfully!');
    console.log(`📊 Total services inserted: ${additionalBbpsServices.length}`);
    
  } catch (error) {
    console.error('❌ Error inserting additional BBPS services:', error);
    throw error;
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  insertAdditionalBbpsServices().then(() => {
    console.log('🏁 Script completed successfully');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

export { insertAdditionalBbpsServices, additionalBbpsServices };