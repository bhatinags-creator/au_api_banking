import { sql } from 'drizzle-orm';
import { db } from '../server/db.js';
import { apiEndpoints } from '../shared/schema.js';

const PAYMENTS_CATEGORY_ID = '4657e5d5-b563-4f88-a81f-b653f52a59db';

const bbpsServices = [
  {
    id: 'bbps-get-all-circles-001',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'Get All Circles',
    path: '/bbpsservice/GetAllCircleBiller',
    method: 'POST',
    description: 'Retrieves all available circles for a specific biller in the BBPS system. This API helps agent institutions get circle information for billers registered with NPCI.',
    summary: 'Get all circles for a biller',
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
        example: '2023-04-03T11:18:11+05:30'
      },
      {
        name: 'origInst',
        type: 'string',
        required: true,
        description: 'Code assigned by NPCI to each agent institution (4 characters)',
        example: 'OU01'
      },
      {
        name: 'refId',
        type: 'string',
        required: true,
        description: 'Unique identification (35 characters) with format: 27 random chars + YDDDhhmm',
        example: 'ABCDE12345ABCDE12345ABCDE1A01192345'
      },
      {
        name: 'billerId',
        type: 'string',
        required: true,
        description: 'Unique identification code allocated to the Biller by NPCI (14 characters)',
        example: 'MAHA00000MUM01'
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
        description: 'Success - Circle information retrieved successfully',
        example: {
          Header: {
            Ver: '1.0',
            OrigInst: 'AU01',
            RefId: 'ABCDE12345ABCDE12345ABCDE1A01192345',
            TimeStamp: '2023-04-03T11:18:11+05:30'
          },
          TransactionStatus: {
            ResponseCode: '000',
            ResponseMessage: 'Successful'
          },
          circleNme: 'Maharashtra',
          billerId: 'MAHA00000MUM01'
        }
      },
      {
        status: 400,
        description: 'Bad Request - Invalid parameters',
        example: {
          ResponseCode: '001',
          ResponseReason: 'Invalid BillerId'
        }
      },
      {
        status: 500,
        description: 'Internal Server Error',
        example: {
          ResponseCode: '999',
          ResponseReason: 'System Error'
        }
      }
    ],
    requestExample: `{
  "ReferenceNumber": "string",
  "TransactionBranch": 100,
  "RequestId": "string",
  "OriginatingChannel": "string",
  "Header": {
    "Ver": 1.051732E+7,
    "TimeStamp": "string",
    "OrigInst": "string",
    "RefId": "string"
  },
  "Search": {
    "BillerId": "string"
  }
}`,
    responseExample: `{
  "Header": {
    "Ver": "1.0",
    "OrigInst": "AU01",
    "RefId": "ABCDE12345ABCDE12345ABCDE1A01192345",
    "TimeStamp": "2023-04-03T11:18:11+05:30"
  },
  "TransactionStatus": {
    "ResponseCode": "000",
    "ResponseMessage": "Successful"
  },
  "Reason": {
    "ResponseCode": 0,
    "ResponseReason": "Successful"
  },
  "circleNme": "Maharashtra",
  "billerId": "MAHA00000MUM01"
}`,
    documentation: `# Get All Circles API

This API retrieves all available circles for a specific biller in the BBPS (Bharat Bill Payment System) ecosystem.

## Purpose
- Get circle information for billers registered with NPCI
- Support agent institutions in bill payment operations
- Provide geographic coverage details for billers

## Key Features
- Circle name retrieval for specific billers
- NPCI compliant request/response format
- Comprehensive error handling
- Real-time circle information

## Authentication
Requires valid BBPOU credentials and API authentication token.

## Rate Limits
- Sandbox: 100 requests/hour
- UAT: 500 requests/hour  
- Production: 1000 requests/hour

## Error Codes
- 000: Success
- 001: Invalid BillerId
- 002: Biller not found
- 999: System error`,
    tags: ['BBPS', 'Biller', 'Circles', 'NPCI'],
    responseSchema: {
      type: 'object',
      properties: {
        Header: {
          type: 'object',
          properties: {
            Ver: { type: 'string' },
            OrigInst: { type: 'string' },
            RefId: { type: 'string' },
            TimeStamp: { type: 'string' }
          }
        },
        TransactionStatus: {
          type: 'object',
          properties: {
            ResponseCode: { type: 'string' },
            ResponseMessage: { type: 'string' }
          }
        },
        circleNme: { type: 'string' },
        billerId: { type: 'string' }
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
    id: 'bbps-bill-fetch-002',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'Bill Fetch',
    path: '/bbpsservice/BillFetch',
    method: 'POST',
    description: 'Fetches bill details for a customer from the biller system. This API allows customers to retrieve their pending bills with amount, due date, and other relevant information.',
    summary: 'Fetch customer bill details',
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
        example: '2023-03-28T13:19:09+05:30'
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
        example: 'AU01BBPSBillFetchRqust3561730871319'
      },
      {
        name: 'msgId',
        type: 'string',
        required: true,
        description: 'Unique identification to relate request and response message',
        example: 'AU01BBPSBillFetchRqust3561730871319'
      },
      {
        name: 'customerMobile',
        type: 'string',
        required: true,
        description: 'Customer mobile number (10 digits)',
        example: '9922998872'
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
        example: 'SHAL00000NAT8K'
      },
      {
        name: 'customerParams',
        type: 'array',
        required: true,
        description: 'Customer parameters for bill fetch (max 5 parameters)',
        example: '[{"Name": "SL Number", "Value": "Mo004"}, {"Name": "Mobile Number", "Value": "9090909090"}]'
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
        description: 'Success - Bill details retrieved successfully',
        example: {
          Head: {
            Ver: '1.0',
            OrigInst: 'AU11',
            RefId: 'AU01BBPSBillFetchRqust3561730871319',
            TS: '2023-03-29T16:25:17+05:30'
          },
          BillerResponse: {
            Amount: 121300,
            CustomerName: 'Hitesh Kapoor',
            DueDate: '2023-04-15',
            BillDate: '2023-03-01',
            BillNumber: 'BILL123456',
            BillPeriod: 'March 2023'
          },
          TransactionStatus: {
            ResponseCode: '000',
            ResponseMessage: 'Successful'
          }
        }
      },
      {
        status: 400,
        description: 'Bad Request - Invalid customer parameters',
        example: {
          ResponseCode: '001',
          ResponseReason: 'Invalid Customer Parameters'
        }
      },
      {
        status: 404,
        description: 'Not Found - Bill not found for given parameters',
        example: {
          ResponseCode: '002',
          ResponseReason: 'Bill Not Found'
        }
      }
    ],
    requestExample: `{
  "Agent": {
    "Device": [
      {
        "Value": "INTB",
        "Name": "INITIATING_CHANNEL"
      },
      {
        "Value": "10.57.18.74", 
        "Name": "IP"
      },
      {
        "Value": "00-14-4F-FA-1E-B4",
        "Name": "MAC"
      }
    ],
    "Id": "AU01AU03AGT525314031"
  },
  "Head": {
    "Ver": "1.0",
    "OrigInst": "AU01",
    "RefId": "AU01BBPSBillFetchRqust3561730871319",
    "TS": "2023-03-28T13:19:09+05:30"
  },
  "Customer": {
    "Mobile": "9922998872",
    "Tags": {
      "Value": "abc@gmail.com",
      "Name": "EMAIL"
    }
  },
  "BillDetails": {
    "CustomerParams": [
      {
        "Value": "Mo004",
        "Name": "SL Number"
      },
      {
        "Value": "9090909090",
        "Name": "Mobile Number"
      }
    ],
    "BillerId": "SHAL00000NAT8K"
  }
}`,
    responseExample: `{
  "Head": {
    "Ver": "1.0",
    "OrigInst": "AU11",
    "RefId": "AU01BBPSBillFetchRqust3561730871319",
    "TS": "2023-03-29T16:25:17+05:30"
  },
  "BillerResponse": {
    "BillPeriod": "March 2023",
    "Amount": 121300,
    "CustomerName": "Hitesh Kapoor",
    "DueDate": "2023-04-15",
    "BillDate": "2023-03-01",
    "BillNumber": "BILL123456",
    "Tags": [
      {
        "Value": "12130",
        "Name": "Monthly EMI"
      }
    ]
  },
  "TransactionStatus": {
    "ResponseCode": "000",
    "ResponseMessage": "Successful"
  },
  "Reason": {
    "ResponseCode": 0,
    "ApprovalRefNum": "AU01BBPSBillFetchRqust3561730871319",
    "ResponseReason": "Successful"
  }
}`,
    documentation: `# Bill Fetch API

This API fetches bill details for customers from biller systems in the BBPS ecosystem.

## Purpose
- Retrieve pending bill information for customers
- Get bill amount, due date, and billing period
- Support real-time bill fetch operations
- Enable seamless bill payment workflows

## Key Features
- Real-time bill information retrieval
- Customer parameter validation
- Comprehensive bill details including amount in paise format
- Support for additional information tags
- Risk scoring and analytics integration

## Bill Amount Format
The amount is returned in paise format (without decimals). For example:
- Bill Amount: ₹36.50 = 3650 (in response)
- Bill Amount: ₹1,213.00 = 121300 (in response)

## Customer Parameters
Maximum 5 customer parameters can be configured by biller:
- Connection ID
- Mobile Number  
- Account Number
- Meter Number
- Policy Number

## Authentication
Requires valid BBPOU credentials and proper agent authentication.

## Rate Limits
- Sandbox: 100 requests/hour
- UAT: 500 requests/hour
- Production: 1000 requests/hour

## Error Codes
- 000: Success
- 001: Invalid Customer Parameters
- 002: Bill Not Found
- 003: Biller Service Unavailable
- 999: System Error`,
    tags: ['BBPS', 'Bill', 'Fetch', 'Customer', 'Payment'],
    responseSchema: {
      type: 'object',
      properties: {
        Head: {
          type: 'object',
          properties: {
            Ver: { type: 'string' },
            OrigInst: { type: 'string' },
            RefId: { type: 'string' },
            TS: { type: 'string' }
          }
        },
        BillerResponse: {
          type: 'object',
          properties: {
            Amount: { type: 'number' },
            CustomerName: { type: 'string' },
            DueDate: { type: 'string' },
            BillDate: { type: 'string' },
            BillNumber: { type: 'string' },
            BillPeriod: { type: 'string' }
          }
        },
        TransactionStatus: {
          type: 'object',
          properties: {
            ResponseCode: { type: 'string' },
            ResponseMessage: { type: 'string' }
          }
        }
      }
    },
    rateLimits: {
      sandbox: 100,
      uat: 500,
      production: 1000
    },
    timeout: 45000,
    requiresAuth: true,
    authType: 'bearer',
    requiredPermissions: ['bbps:read', 'bbps:fetch', 'sandbox'],
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1'
  },
  {
    id: 'bbps-biller-details-003',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'Biller Details',
    path: '/bbpsservice/BillerDetails',
    method: 'POST',
    description: 'Retrieves comprehensive details of a specific biller registered with NPCI. This API provides complete biller information including payment modes, channels, parameters, and configuration details.',
    summary: 'Get detailed information about a specific biller',
    parameters: [
      {
        name: 'ver',
        type: 'string',
        required: false,
        description: 'Version of the API (e.g., 1.0)',
        example: '1.0'
      },
      {
        name: 'origInst',
        type: 'string',
        required: false,
        description: 'Code assigned by NPCI to each agent institution',
        example: 'AU01'
      },
      {
        name: 'refId',
        type: 'string',
        required: false,
        description: 'Unique identification for transaction tracking',
        example: 'ABCDE12345ABCDE12345ABCDE1A01192345'
      },
      {
        name: 'ts',
        type: 'string',
        required: false,
        description: 'Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format',
        example: '2023-04-03T10:50:17+05:30'
      },
      {
        name: 'billerId',
        type: 'string',
        required: true,
        description: 'Unique identification code allocated to the Biller by NPCI',
        example: 'ALFA00000RAJH1'
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
        description: 'Success - Biller details retrieved successfully',
        example: {
          Header: {
            Ver: 1.0,
            OrigInst: 'AU01',
            TimeStamp: '2023-04-03T10:50:17'
          },
          Biller: {
            BillerId: 'ALFA00000RAJH1',
            BillerName: 'ALFASTAR INDIA NIDHI LIMITED',
            BillerAliasName: 'ALFASTAR INDIA NIDHI LIMITED',
            BillerCategoryName: 'Loan Repayment',
            BillerMode: 'OFFLINEA',
            BillerAcceptsAdhoc: 'false',
            Status: 'Active',
            FetchRequirement: 'MANDATORY',
            PaymentAmountExactness: 'EXACT UP'
          },
          TransactionStatus: {
            ResponseCode: '000',
            ResponseMessage: 'Successful'
          }
        }
      },
      {
        status: 400,
        description: 'Bad Request - Invalid biller ID',
        example: {
          ResponseCode: '001',
          ResponseReason: 'Invalid BillerId'
        }
      },
      {
        status: 404,
        description: 'Not Found - Biller not found',
        example: {
          ResponseCode: '002',
          ResponseReason: 'Biller Not Found'
        }
      }
    ],
    requestExample: `{
  "ReferenceNumber": "9172837123",
  "TransactionBranch": "2001",
  "RequestId": "BBPSCreateSI1677996401629",
  "OriginatingChannel": "DEC",
  "Biller": {
    "BillerId": "ALFA00000RAJH1"
  }
}`,
    responseExample: `{
  "Header": {
    "Ver": 1.0,
    "OrigInst": "AU01",
    "RefId": null,
    "TimeStamp": "2023-04-03T10:50:17"
  },
  "Biller": {
    "BillerId": "ALFA00000RAJH1",
    "BillerName": "ALFASTAR INDIA NIDHI LIMITED",
    "BillerAliasName": "ALFASTAR INDIA NIDHI LIMITED",
    "BillerCategoryName": "Loan Repayment",
    "BillerMode": "OFFLINEA",
    "BillerAcceptsAdhoc": "false",
    "ParentBiller": "false",
    "BillerOwnerShp": "Private",
    "BillerCoverage": "IND-RAJ",
    "FetchRequirement": "MANDATORY",
    "PaymentAmountExactness": "EXACT UP",
    "SupportBillValidation": "NOT_SUPPORTED",
    "SupportDeemed": "Yes",
    "SupportPendingStatus": "No",
    "Status": "Active",
    "BillerEffectiveFrom": "20-02-2023",
    "BillerEffectiveTo": "31-12-2033",
    "BillerPaymentModes": [
      {
        "PaymentMode": "UPI",
        "MinLimit": 100,
        "MaxLimit": 10000000
      },
      {
        "PaymentMode": "NEFT",
        "MinLimit": 100,
        "MaxLimit": 10000000
      }
    ],
    "BillerCustomerParams": [
      {
        "ParamName": "Loan Number",
        "DataType": "ALPHANUMERIC",
        "Optional": "false",
        "MinLength": 5,
        "MaxLength": 20
      },
      {
        "ParamName": "Mobile Number",
        "DataType": "NUMERIC",
        "Optional": "true",
        "MinLength": 10,
        "MaxLength": 10
      }
    ]
  },
  "TransactionStatus": {
    "ResponseCode": "000",
    "ResponseMessage": "Successful"
  }
}`,
    documentation: `# Biller Details API

This API retrieves comprehensive details of billers registered with NPCI in the BBPS ecosystem.

## Purpose
- Get complete biller information and configuration
- Understand biller capabilities and requirements
- Support agent institutions in biller integration
- Provide payment mode and channel details

## Key Information Provided
- Biller basic information (name, category, mode)
- Payment modes and limits
- Customer parameters required for bill fetch
- Interchange fee configuration
- Effective dates and status
- Support flags for various features

## Biller Modes
- **ONLINE**: Real-time connectivity
- **OFFLINEA**: Offline mode A
- **OFFLINEB**: Offline mode B

## Payment Amount Exactness
- **EXACT**: Only exact payment allowed
- **EXACT DOWN**: Partial payment allowed
- **EXACT UP**: Advance payment allowed

## Authentication
Requires valid agent institution credentials.

## Rate Limits
- Sandbox: 100 requests/hour
- UAT: 500 requests/hour
- Production: 1000 requests/hour

## Error Codes
- 000: Success
- 001: Invalid BillerId
- 002: Biller Not Found
- 003: Access Denied
- 999: System Error`,
    tags: ['BBPS', 'Biller', 'Details', 'Configuration', 'NPCI'],
    responseSchema: {
      type: 'object',
      properties: {
        Header: {
          type: 'object',
          properties: {
            Ver: { type: 'number' },
            OrigInst: { type: 'string' },
            TimeStamp: { type: 'string' }
          }
        },
        Biller: {
          type: 'object',
          properties: {
            BillerId: { type: 'string' },
            BillerName: { type: 'string' },
            BillerCategoryName: { type: 'string' },
            BillerMode: { type: 'string' },
            Status: { type: 'string' },
            FetchRequirement: { type: 'string' },
            PaymentAmountExactness: { type: 'string' }
          }
        },
        TransactionStatus: {
          type: 'object',
          properties: {
            ResponseCode: { type: 'string' },
            ResponseMessage: { type: 'string' }
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
    id: 'bbps-biller-list-004',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'Biller List',
    path: '/bbpsservice/BillerList',
    method: 'POST',
    description: 'Retrieves a list of all billers registered with NPCI in the BBPS ecosystem. This API allows filtering by category and last updated date to get relevant biller information.',
    summary: 'Get list of registered billers',
    parameters: [
      {
        name: 'ver',
        type: 'string',
        required: true,
        description: 'Version of the API (e.g., 1.0)',
        example: '1.0'
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
        description: 'Unique identification for end-to-end process tracking',
        example: 'ABCDE12345ABCDE12345ABCDE1A01192345'
      },
      {
        name: 'ts',
        type: 'string',
        required: true,
        description: 'Timestamp in YYYY-MM-DDTHH24:MM:SS+05:30 format',
        example: '2023-04-03T11:18:11+05:30'
      },
      {
        name: 'category',
        type: 'string',
        required: false,
        description: 'Category of Biller (e.g., Electricity, Water, DTH, Mobile Postpaid)',
        example: 'Mobile Postpaid'
      },
      {
        name: 'lastUpdated',
        type: 'string',
        required: false,
        description: 'Date when biller was last updated (YYYY-MM-DD format)',
        example: '2023-03-01'
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
        description: 'Success - Biller list retrieved successfully',
        example: {
          Billers: [
            {
              BillerId: 'TELECOM00NAT01',
              BillerName: 'Air Voice',
              BillerAliasName: 'BHIM Biller',
              BillerCategoryName: 'Mobile Postpaid',
              Status: 'Active',
              LastUpdated: '23-10-2021'
            },
            {
              BillerId: 'ARCL00000NAT01',
              BillerName: 'Aircel Postpaid',
              BillerAliasName: 'AIRCELOB',
              BillerCategoryName: 'Mobile Postpaid',
              Status: 'Active',
              LastUpdated: '22-12-2020'
            }
          ],
          Header: {
            Ver: 1.0,
            OrigInst: 'AU01',
            TimeStamp: '2023-04-03T11:18:11'
          },
          TransactionStatus: {
            ResponseCode: '000',
            ResponseMessage: 'Successful'
          }
        }
      },
      {
        status: 400,
        description: 'Bad Request - Invalid category or parameters',
        example: {
          ResponseCode: '001',
          ResponseReason: 'Invalid Category'
        }
      },
      {
        status: 404,
        description: 'Not Found - No billers found for given criteria',
        example: {
          ResponseCode: '002',
          ResponseReason: 'No Billers Found'
        }
      }
    ],
    requestExample: `{
  "ReferenceNumber": "BBPSListBiller1577427162167",
  "TransactionBranch": "0",
  "RequestId": "BBPSCreateSI1677996401629",
  "OriginatingChannel": "DEC",
  "Search": {
    "Category": "Mobile Postpaid"
  }
}`,
    responseExample: `{
  "Billers": [
    {
      "Status": "Active",
      "BillerCategoryName": "Mobile Postpaid",
      "BillerId": "TELECOM00NAT01",
      "BillerName": "Air Voice",
      "BillerAliasName": "BHIM Biller",
      "LastUpdated": "23-10-2021"
    },
    {
      "Status": "Active",
      "BillerCategoryName": "Mobile Postpaid",
      "BillerId": "ARCL00000NAT01",
      "BillerName": "Aircel Postpaid",
      "BillerAliasName": "AIRCELOB",
      "LastUpdated": "22-12-2020"
    },
    {
      "Status": "Active",
      "BillerCategoryName": "Mobile Postpaid",
      "BillerId": "VODA00000NAT02",
      "BillerName": "Vodafone Postpaid (Test)",
      "BillerAliasName": "VODA POSTPAID",
      "LastUpdated": "22-12-2020"
    }
  ],
  "Header": {
    "Ver": 1.0,
    "OrigInst": "AU01",
    "RefId": null,
    "TimeStamp": "2023-04-03T11:18:11"
  },
  "TransactionStatus": {
    "ResponseCode": "000",
    "ResponseMessage": "Successful",
    "ExtendedErrorDetails": {
      "messages": [
        {
          "code": 0,
          "message": "Successful"
        }
      ]
    }
  },
  "Reason": {
    "ResponseCode": 0,
    "complianceReason": null,
    "complianceRespCd": null,
    "ResponseReason": "Successful"
  }
}`,
    documentation: `# Biller List API

This API retrieves a list of all billers registered with NPCI in the BBPS ecosystem.

## Purpose
- Get comprehensive list of available billers
- Filter billers by category and last updated date
- Support biller discovery for agent institutions
- Enable dynamic biller selection in applications

## Filtering Options
- **Category**: Filter by biller category (Electricity, Water, DTH, Mobile, etc.)
- **Last Updated**: Get billers updated after a specific date
- **No Filter**: Retrieve all registered billers

## Biller Categories
Common categories include:
- Electricity
- Water
- Gas
- DTH (Direct to Home)
- Mobile Postpaid
- Mobile Prepaid
- Insurance
- Loan Repayment
- Cable TV
- Broadband

## Biller Status
- **Active**: Biller is operational and accepting payments
- **Inactive**: Biller is temporarily unavailable

## Pagination
Large result sets may be paginated. Check response headers for pagination information.

## Authentication
Requires valid agent institution credentials.

## Rate Limits
- Sandbox: 100 requests/hour
- UAT: 500 requests/hour
- Production: 1000 requests/hour

## Error Codes
- 000: Success
- 001: Invalid Category
- 002: No Billers Found
- 003: Access Denied
- 999: System Error`,
    tags: ['BBPS', 'Biller', 'List', 'Directory', 'Categories'],
    responseSchema: {
      type: 'object',
      properties: {
        Billers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              BillerId: { type: 'string' },
              BillerName: { type: 'string' },
              BillerAliasName: { type: 'string' },
              BillerCategoryName: { type: 'string' },
              Status: { type: 'string' },
              LastUpdated: { type: 'string' }
            }
          }
        },
        Header: {
          type: 'object',
          properties: {
            Ver: { type: 'number' },
            OrigInst: { type: 'string' },
            TimeStamp: { type: 'string' }
          }
        },
        TransactionStatus: {
          type: 'object',
          properties: {
            ResponseCode: { type: 'string' },
            ResponseMessage: { type: 'string' }
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
  }
];

async function insertBbpsServices() {
  try {
    console.log('🔄 Starting BBPS services insertion...');
    
    for (const service of bbpsServices) {
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
    
    console.log('🎉 All BBPS services inserted successfully!');
    console.log(`📊 Total services inserted: ${bbpsServices.length}`);
    
  } catch (error) {
    console.error('❌ Error inserting BBPS services:', error);
    throw error;
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  insertBbpsServices().then(() => {
    console.log('🏁 Script completed successfully');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

export { insertBbpsServices, bbpsServices };