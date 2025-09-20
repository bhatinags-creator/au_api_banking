import { sql } from 'drizzle-orm';
import { db } from '../server/db.js';
import { apiEndpoints } from '../shared/schema.js';

const PAYMENTS_CATEGORY_ID = '4657e5d5-b563-4f88-a81f-b653f52a59db';

const upiPayoutServices = [
  {
    id: 'upi-verify-vpa-001',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'UPI Verify VPA',
    path: '/api/upi-psp-service/v1/verify-vpa',
    method: 'POST',
    description: 'Verifies Virtual Payment Address (VPA) and retrieves associated bank account name and Merchant Category Code (MCC). This is a mandatory API call before initiating any UPI payout transaction.',
    summary: 'Verify VPA and get account details with MCC',
    parameters: [
      {
        name: 'vpa',
        type: 'string',
        required: true,
        description: 'Virtual Payment Address to be verified (50 characters max)',
        example: 'astest09@aubank'
      },
      {
        name: 'isVpa',
        type: 'boolean',
        required: true,
        description: 'Flag indicating if the provided string is a VPA (always true)',
        example: true
      },
      {
        name: 'type',
        type: 'string',
        required: true,
        description: 'Transaction type identifier (5 characters max)',
        example: 'INET'
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
        description: 'Success - VPA verified successfully with account details',
        example: {
          status: 'success',
          data: {
            vpaResponseStatus: {
              responseCode: '00',
              message: 'Success'
            },
            transactionInfo: {
              transactionid: 'AUS20250409TS5449TE820409A6293B4E07',
              transactiondatetime: '2025-04-09 06:34:53 PM',
              result: {
                code: '00',
                message: 'SUCCESS',
                isactive: 'true'
              },
              attributes: {
                accountname: 'Sahab Ram Puniya',
                mcc: '0000',
                VPA: 'astest09'
              }
            }
          }
        }
      },
      {
        status: 400,
        description: 'Bad Request - Invalid VPA or parameters',
        example: {
          status: 'success',
          data: {
            vpaResponseStatus: {
              responseCode: '99',
              message: 'FAILURE'
            },
            transactionInfo: {
              result: {
                code: '99',
                message: 'FAILURE',
                isactive: 'false'
              },
              attributes: {
                accountname: 'FAILURE',
                mcc: '0000'
              }
            }
          }
        }
      },
      {
        status: 401,
        description: 'Unauthorized - Invalid authentication token',
        example: {
          error: 'Unauthorized',
          message: 'Invalid authentication credentials'
        }
      }
    ],
    requestExample: `{
  "vpa": "astest09@aubank",
  "isVpa": true,
  "type": "INET"
}`,
    responseExample: `{
  "status": "success",
  "data": {
    "vpaResponseStatus": {
      "responseCode": "00",
      "message": "Success"
    },
    "externalReferenceNumber": null,
    "limitRestoredMessage": null,
    "transactionInfo": {
      "transactionid": "AUS20250409TS5449TE820409A6293B4E07",
      "transactiondatetime": "2025-04-09 06:34:53 PM",
      "result": {
        "code": "00",
        "message": "SUCCESS",
        "isactive": "true"
      },
      "attributes": {
        "accountname": "Sahab Ram Puniya",
        "mcc": "0000",
        "VPA": "astest09"
      }
    },
    "ChkValue": "kbBUNQnpUXG5f+Qufz3/3t8itQkWUZARPg/o3z4Dy/8=",
    "txnStatus": null
  },
  "error": null,
  "successfulResponse": true
}`,
    documentation: `# UPI Verify VPA API

This API verifies Virtual Payment Address (VPA) and retrieves associated account details and MCC.

## Purpose
- Validate VPA before initiating UPI payout transactions
- Retrieve account holder name for verification
- Get Merchant Category Code (MCC) for transaction processing
- Ensure VPA is active and operational

## Key Features
- **Mandatory Verification**: Required before any UPI payout transaction
- **Account Name Retrieval**: Get beneficiary account holder name
- **MCC Validation**: Retrieve Merchant Category Code for compliance
- **Real-time Validation**: Instant VPA status verification
- **GCM Encryption**: Secure data transmission

## VPA Format
- **Structure**: username@bankcode (e.g., astest09@aubank)
- **Maximum Length**: 50 characters
- **Bank Codes**: Standard UPI bank identifiers
- **Validation**: Real-time NPCI network validation

## Response Codes
- **00**: Success - VPA is valid and active
- **99**: Failure - VPA is invalid or inactive
- **Other codes**: Specific error conditions

## Account Name Validation
- **Success**: Returns actual account holder name
- **Failure**: Returns "FAILURE" as account name
- **Use Case**: Verify recipient details before payment

## MCC (Merchant Category Code)
- **Format**: 4-digit numeric code
- **Purpose**: Transaction categorization and compliance
- **Default**: 0000 for standard transactions
- **Usage**: Required for UPI payout API calls

## Integration Flow
1. Call Verify VPA API with target VPA
2. Validate response code (00 = success)
3. Extract account name and MCC from response
4. Use MCC in subsequent UPI payout API call
5. Proceed with payment transaction

## Security Features
- **OAuth 2.0 Authentication**: Bearer token required
- **GCM Encryption**: Request/response encryption
- **Transaction Tracking**: Unique transaction ID for each verification
- **Audit Trail**: Complete verification history

## Error Handling
- **Invalid VPA**: Returns code 99 with failure message
- **Network Issues**: Standard HTTP error codes
- **Authentication**: 401 for invalid tokens
- **Rate Limiting**: Controlled verification requests

## Best Practices
- **Always Verify**: Never skip VPA verification before payout
- **Cache Results**: Store MCC for repeated transactions to same VPA
- **Error Handling**: Implement proper retry logic for network failures
- **User Experience**: Show account name to user for confirmation
- **Compliance**: Use MCC for regulatory reporting

## Rate Limits
- UAT: 500 requests/hour
- Production: 2000 requests/hour

## Prerequisites
- Valid OAuth 2.0 access token
- GCM encryption setup
- Registered merchant account with UPI PSP access`,
    tags: ['UPI', 'VPA', 'Verification', 'MCC', 'Validation'],
    responseSchema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            vpaResponseStatus: {
              type: 'object',
              properties: {
                responseCode: { type: 'string' },
                message: { type: 'string' }
              }
            },
            transactionInfo: {
              type: 'object',
              properties: {
                transactionid: { type: 'string' },
                transactiondatetime: { type: 'string' },
                result: {
                  type: 'object',
                  properties: {
                    code: { type: 'string' },
                    message: { type: 'string' },
                    isactive: { type: 'string' }
                  }
                },
                attributes: {
                  type: 'object',
                  properties: {
                    accountname: { type: 'string' },
                    mcc: { type: 'string' },
                    VPA: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    rateLimits: {
      sandbox: 200,
      uat: 500,
      production: 2000
    },
    timeout: 15000,
    requiresAuth: true,
    authType: 'bearer',
    requiredPermissions: ['upi:verify', 'upi:read'],
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1'
  },
  {
    id: 'upi-payout-002',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'UPI Payout',
    path: '/api/upi-psp-service/v1/req-pay-transaction',
    method: 'POST',
    description: 'Initiates UPI payment transactions for instant real-time payments. Supports peer-to-peer, person-to-merchant transactions with transaction limits of INR 1 to INR 100,000 (INR 200,000 for loan disbursement).',
    summary: 'Initiate UPI payment transaction',
    parameters: [
      {
        name: 'type',
        type: 'string',
        required: true,
        description: 'Transaction type identifier (5 characters max)',
        example: 'INET'
      },
      {
        name: 'amount',
        type: 'string',
        required: true,
        description: 'Transaction amount with decimal precision (10 characters max)',
        example: '101.28'
      },
      {
        name: 'payeeName',
        type: 'string',
        required: true,
        description: 'Beneficiary account holder name (100 characters max)',
        example: 'Sahab Ram Puniya'
      },
      {
        name: 'payeeVpa',
        type: 'string',
        required: true,
        description: 'Beneficiary Virtual Payment Address (50 characters max)',
        example: 'astest09@aubank'
      },
      {
        name: 'payeeMcc',
        type: 'string',
        required: true,
        description: 'Merchant Category Code from Verify VPA API (10 characters max)',
        example: '0000'
      },
      {
        name: 'payerName',
        type: 'string',
        required: true,
        description: 'Payer/merchant name (100 characters max)',
        example: 'VISHNU CAR SERVICES'
      },
      {
        name: 'payerVpa',
        type: 'string',
        required: true,
        description: 'Payer Virtual Payment Address (50 characters max)',
        example: 'anirudhaumbcrp1@aubank'
      },
      {
        name: 'remarks',
        type: 'string',
        required: true,
        description: 'Transaction remarks/description (100 characters max)',
        example: 'test aumbcrp'
      },
      {
        name: 'transactionType',
        type: 'string',
        required: true,
        description: 'Transaction type: Pay or Collect (25 characters max)',
        example: 'Pay'
      },
      {
        name: 'initiationMode',
        type: 'string',
        required: true,
        description: 'Payment initiation mode code (10 characters max)',
        example: '01'
      },
      {
        name: 'clTransactionId',
        type: 'string',
        required: true,
        description: 'Client transaction identifier (40 characters max)',
        example: 'AUS2045227TS9344E663796615469200081'
      },
      {
        name: 'transactionMode',
        type: 'string',
        required: true,
        description: 'Transaction mode: VPA, ACCOUNT, or MOBILE (15 characters max)',
        example: 'VPA'
      },
      {
        name: 'payerAccount',
        type: 'string',
        required: true,
        description: 'Payer account number (16 characters max)',
        example: '2402227262656964'
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
        description: 'Success - UPI payment transaction initiated successfully',
        example: {
          status: 'success',
          data: {
            vpaResponseStatus: {
              responseCode: '00',
              message: 'Success'
            },
            externalReferenceNumber: '510115355404',
            transactionInfo: {
              transactionid: 'AUS2045227TS9344E663796615469200081',
              transactiondatetime: '2025-04-11 04:50:49 PM',
              result: {
                code: '00',
                message: 'SUCCESS',
                isactive: 'true'
              },
              attributes: {
                transactiontype: 'Pay',
                payeename: 'Sahab Ram Puniya',
                amount: '101.28'
              }
            }
          }
        }
      },
      {
        status: 400,
        description: 'Bad Request - Transaction limit exceeded or invalid parameters',
        example: {
          status: 'error',
          error: {
            statusCode: 400,
            errorCode: 'LMT0422',
            message: 'Merchant per day limit has been exceeded.',
            timeStamp: '2025-04-11T16:54:37.277041196'
          }
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
        description: 'Internal Server Error - Transaction processing failed',
        example: {
          status: 'error',
          error: {
            statusCode: 500,
            message: 'Something went wrong'
          }
        }
      }
    ],
    requestExample: `{
  "type": "INET",
  "amount": "101.28",
  "payeeName": "Sahab Ram Puniya",
  "payeeVpa": "astest09@aubank",
  "payeeMcc": "0000",
  "payerName": "VISHNU CAR SERVICES",
  "payerVpa": "anirudhaumbcrp1@aubank",
  "remarks": "test aumbcrp",
  "transactionType": "Pay",
  "initiationMode": "01",
  "clTransactionId": "AUS2045227TS9344E663796615469200081",
  "transactionMode": "VPA",
  "payerAccount": "2402227262656964"
}`,
    responseExample: `{
  "status": "success",
  "data": {
    "vpaResponseStatus": {
      "responseCode": "00",
      "message": "Success"
    },
    "externalReferenceNumber": "510115355404",
    "upiId": null,
    "upiBankName": null,
    "upiFlow": null,
    "limitRestoredMessage": null,
    "transactionInfo": {
      "transactionid": "AUS2045227TS9344E663796615469200081",
      "transactiondatetime": "2025-04-11 04:50:49 PM",
      "result": {
        "code": "00",
        "message": "SUCCESS",
        "isactive": "true"
      },
      "attributes": {
        "transactiontype": "Pay",
        "initiationmode": "01",
        "payervpa": "anirudhaumbcrp1@aubank",
        "payeraccount": "2402227262656964",
        "payeename": "Sahab Ram Puniya",
        "payeevpa": "astest09@aubank",
        "payeemcc": "0000",
        "amount": "101.28",
        "remarks": "test aumbcrp",
        "transdatetime": "2025-04-11 04:50:49 PM"
      }
    },
    "ChkValue": "516RC8K3AeJm8S0udjQeC6U29rh+abndL0idBgF15F8=",
    "txnStatus": null
  },
  "error": null,
  "successfulResponse": true
}`,
    documentation: `# UPI Payout API

This API initiates UPI payment transactions for instant real-time payments between accounts.

## Purpose
- Process instant UPI payments to beneficiaries
- Support peer-to-peer and person-to-merchant transactions
- Enable automated payment disbursals
- Facilitate bulk payment processing

## Transaction Limits
- **Minimum Amount**: INR 1.00
- **Maximum Amount**: INR 100,000 (Regular transactions)
- **Loan Disbursement**: INR 200,000 (Special category)
- **Decimal Precision**: Supported (e.g., 101.28)

## Key Features
- **Instant Processing**: Real-time payment settlement
- **Multiple Modes**: VPA, Account, Mobile number support
- **Transaction Tracking**: Unique client and system transaction IDs
- **External Reference**: Bank reference number for reconciliation
- **Comprehensive Logging**: Complete transaction audit trail

## Transaction Types
- **Pay**: Direct payment to beneficiary
- **Collect**: Payment request to payer (if supported)

## Transaction Modes
- **VPA**: Virtual Payment Address based transaction
- **ACCOUNT**: Direct account number based transaction
- **MOBILE**: Mobile number based transaction

## Initiation Modes
- **01**: Standard payment initiation
- **Other codes**: Specific initiation scenarios

## Prerequisites
- **Verify VPA**: Must call Verify VPA API first to get MCC
- **OAuth Token**: Valid access token required
- **Account Balance**: Sufficient balance in payer account
- **Merchant Limits**: Within daily/monthly transaction limits

## Processing Flow
1. Validate all input parameters
2. Check merchant transaction limits
3. Verify payer account balance
4. Process UPI transaction through NPCI
5. Return transaction status and reference number
6. Update merchant account balance

## Response Fields
- **externalReferenceNumber**: Bank's transaction reference
- **transactionid**: System generated transaction ID
- **transactiondatetime**: Processing timestamp
- **result.code**: Transaction result code (00 = success)
- **attributes**: Complete transaction details

## Error Handling
- **LMT0422**: Daily merchant limit exceeded
- **Insufficient Balance**: Account balance insufficient
- **Invalid VPA**: Beneficiary VPA validation failed
- **Technical Errors**: System processing failures

## Security Features
- **GCM Encryption**: End-to-end payload encryption
- **OAuth 2.0**: Secure authentication mechanism
- **ChkValue**: Response integrity checksum
- **Transaction Logging**: Complete audit trail

## Best Practices
- **VPA Verification**: Always verify VPA before payment
- **Unique Client ID**: Use unique clTransactionId for each transaction
- **Error Handling**: Implement proper retry and fallback logic
- **Limit Monitoring**: Track daily transaction limits
- **Reconciliation**: Use externalReferenceNumber for settlement

## Common Error Codes
- **00**: Success - Transaction processed successfully
- **99**: Failure - Generic transaction failure
- **LMT0422**: Merchant daily limit exceeded
- **INS**: Insufficient funds in payer account

## Rate Limits
- UAT: 200 requests/hour
- Production: 1000 requests/hour

## Compliance & Regulatory
- **NPCI Guidelines**: Adheres to UPI transaction guidelines
- **RBI Regulations**: Compliant with payment regulations
- **KYC Requirements**: Merchant KYC verification required
- **Transaction Reporting**: Automatic regulatory reporting`,
    tags: ['UPI', 'Payout', 'Payment', 'Transaction', 'NPCI'],
    responseSchema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            vpaResponseStatus: {
              type: 'object',
              properties: {
                responseCode: { type: 'string' },
                message: { type: 'string' }
              }
            },
            externalReferenceNumber: { type: 'string' },
            transactionInfo: {
              type: 'object',
              properties: {
                transactionid: { type: 'string' },
                transactiondatetime: { type: 'string' },
                result: {
                  type: 'object',
                  properties: {
                    code: { type: 'string' },
                    message: { type: 'string' },
                    isactive: { type: 'string' }
                  }
                },
                attributes: {
                  type: 'object',
                  properties: {
                    transactiontype: { type: 'string' },
                    amount: { type: 'string' },
                    payeename: { type: 'string' }
                  }
                }
              }
            }
          }
        }
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
    requiredPermissions: ['upi:payout', 'upi:write', 'payment:process'],
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1'
  },
  {
    id: 'upi-transaction-status-003',
    categoryId: PAYMENTS_CATEGORY_ID,
    category: 'Payments',
    name: 'UPI Transaction Status',
    path: '/api/upi-psp-service/v1/get-transaction-status',
    method: 'POST',
    description: 'Retrieves the current status of UPI payout transactions. This API helps track transaction progress, verify completion status, and get detailed transaction information for reconciliation purposes.',
    summary: 'Get UPI transaction status and details',
    parameters: [
      {
        name: 'vpa',
        type: 'string',
        required: true,
        description: 'Virtual Payment Address of the payer (50 characters max)',
        example: 'anirudhaumbcrp1@aubank'
      },
      {
        name: 'transactionId',
        type: 'string',
        required: true,
        description: 'Client transaction identifier from payout request (35 characters max)',
        example: 'AUS2045227TS9344E663796615469200081'
      },
      {
        name: 'requestType',
        type: 'string',
        required: true,
        description: 'Type of transaction to query (20 characters max)',
        example: 'Pay'
      },
      {
        name: 'type',
        type: 'string',
        required: true,
        description: 'Transaction type identifier (5 characters max)',
        example: 'INET'
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
        description: 'Success - Transaction status retrieved successfully',
        example: {
          status: 'success',
          data: {
            vpaResponseStatus: {
              responseCode: '00',
              message: 'Success'
            },
            transactionInfo: {
              transactionid: 'AUS20250411TS9067TE141B8185B8674CCB',
              transactiondatetime: '2025-04-11 04:59:20 PM',
              result: {
                code: '00',
                message: 'SUCCESS',
                isactive: 'true'
              },
              attributes: {
                transactionid: 'AUS2045227TS9344E663796615469200081',
                transactiontype: 'PAY',
                amount: '101.28',
                status: 'SUCCESS',
                custrefnumber: '510115355404'
              }
            }
          }
        }
      },
      {
        status: 400,
        description: 'Bad Request - Invalid transaction ID or parameters',
        example: {
          status: 'success',
          data: {
            vpaResponseStatus: {
              responseCode: '99',
              message: 'FAILURE'
            },
            transactionInfo: {
              result: {
                code: '99',
                message: 'FAILURE',
                codedescription: 'No Record Found.'
              }
            }
          }
        }
      },
      {
        status: 404,
        description: 'Not Found - Transaction not found',
        example: {
          status: 'error',
          error: {
            statusCode: 404,
            message: 'Transaction not found'
          }
        }
      }
    ],
    requestExample: `{
  "vpa": "anirudhaumbcrp1@aubank",
  "transactionId": "AUS2045227TS9344E663796615469200081",
  "requestType": "Pay",
  "type": "INET"
}`,
    responseExample: `{
  "status": "success",
  "data": {
    "vpaResponseStatus": {
      "responseCode": "00",
      "message": "Success"
    },
    "externalReferenceNumber": null,
    "upiId": null,
    "upiBankName": null,
    "neftEnabled": false,
    "rtgsEnabled": false,
    "upiFlow": null,
    "limitRestoredMessage": null,
    "transactionInfo": {
      "transactionid": "AUS20250411TS9067TE141B8185B8674CCB",
      "transactiondatetime": "2025-04-11 04:59:20 PM",
      "result": {
        "code": "00",
        "message": "SUCCESS",
        "isactive": "true",
        "codedescription": ""
      },
      "attributes": {
        "transactionid": "AUS2045227TS9344E663796615469200081",
        "transactiontype": "PAY",
        "amount": "101.28",
        "remarks": "test aumbcrp",
        "code": "00",
        "direction": "outward",
        "status": "SUCCESS",
        "custrefnumber": "510115355404",
        "RefId": "AUS20250411MS1MEBC4FD9E00BF94E61B52"
      }
    },
    "ChkValue": "pMnlIYaqEsLQqh9RNrG5FP+bUdiI0X7WNlKaX3IqPYA=",
    "txnStatus": null
  },
  "error": null,
  "successfulResponse": true
}`,
    documentation: `# UPI Transaction Status API

This API retrieves the current status and details of UPI payout transactions.

## Purpose
- Track transaction processing status
- Verify transaction completion
- Get detailed transaction information
- Support reconciliation processes
- Monitor payment success/failure

## Key Features
- **Real-time Status**: Current transaction state information
- **Detailed Attributes**: Complete transaction details
- **Reference Numbers**: Customer and system reference numbers
- **Direction Tracking**: Inward/outward payment direction
- **Comprehensive Logging**: Full transaction audit trail

## Transaction Status Values
- **SUCCESS**: Transaction completed successfully
- **PENDING**: Transaction is being processed
- **FAILED**: Transaction failed to process
- **TIMEOUT**: Transaction timed out
- **CANCELLED**: Transaction was cancelled

## Response Code Interpretation
- **00**: Success - Transaction found and status retrieved
- **99**: Failure - Transaction not found or error occurred
- **Other codes**: Specific error conditions

## Key Response Fields
- **transactionid**: Original client transaction ID
- **transactiontype**: PAY, COLLECT, etc.
- **amount**: Transaction amount
- **status**: Current transaction status
- **custrefnumber**: Bank customer reference number
- **RefId**: System reference identifier
- **direction**: outward (payment sent), inward (payment received)

## Use Cases
- **Status Dashboard**: Real-time transaction monitoring
- **Reconciliation**: Match payments with bank statements
- **Customer Service**: Provide status updates to customers
- **Automated Processing**: Trigger follow-up actions based on status
- **Reporting**: Generate transaction status reports
- **Retry Logic**: Determine if failed transactions can be retried

## Query Parameters
- **vpa**: Payer VPA used in original transaction
- **transactionId**: Client transaction ID from payout request
- **requestType**: Must match original transaction type (Pay/Collect)
- **type**: Transaction type identifier (INET)

## Integration Guidelines
- **Regular Polling**: Check status periodically for pending transactions
- **Error Handling**: Handle "No Record Found" scenarios gracefully
- **Caching**: Store successful status responses to reduce API calls
- **Reconciliation**: Use custrefnumber for bank statement matching
- **Monitoring**: Alert on transactions stuck in pending status

## Status Tracking Flow
1. Initiate UPI payout transaction
2. Store client transaction ID for tracking
3. Poll transaction status API periodically
4. Update internal systems based on status
5. Complete reconciliation process

## Error Scenarios
- **No Record Found**: Transaction ID not found in system
- **Invalid Parameters**: Incorrect VPA or transaction details
- **Authentication Failure**: Invalid or expired access token
- **System Error**: Temporary processing issues

## Best Practices
- **Timeout Handling**: Set appropriate timeouts for status queries
- **Retry Strategy**: Implement exponential backoff for retries
- **Status Mapping**: Map API status to internal system states
- **Logging**: Log all status query responses for audit
- **Performance**: Batch status queries where possible

## Security Features
- **OAuth Authentication**: Secure API access
- **GCM Encryption**: Encrypted request/response
- **Access Control**: VPA-based access validation
- **Audit Trail**: Complete query history

## Rate Limits
- UAT: 1000 requests/hour
- Production: 5000 requests/hour

## Common Integration Patterns
- **Webhook Alternative**: Use for systems without webhook support
- **Batch Reconciliation**: Query multiple transactions for settlement
- **Customer Portal**: Show real-time status to end users
- **Exception Handling**: Identify and handle failed transactions`,
    tags: ['UPI', 'Status', 'Transaction', 'Inquiry', 'Reconciliation'],
    responseSchema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            vpaResponseStatus: {
              type: 'object',
              properties: {
                responseCode: { type: 'string' },
                message: { type: 'string' }
              }
            },
            transactionInfo: {
              type: 'object',
              properties: {
                transactionid: { type: 'string' },
                transactiondatetime: { type: 'string' },
                result: {
                  type: 'object',
                  properties: {
                    code: { type: 'string' },
                    message: { type: 'string' },
                    isactive: { type: 'string' }
                  }
                },
                attributes: {
                  type: 'object',
                  properties: {
                    transactionid: { type: 'string' },
                    transactiontype: { type: 'string' },
                    amount: { type: 'string' },
                    status: { type: 'string' },
                    custrefnumber: { type: 'string' },
                    direction: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    rateLimits: {
      sandbox: 500,
      uat: 1000,
      production: 5000
    },
    timeout: 20000,
    requiresAuth: true,
    authType: 'bearer',
    requiredPermissions: ['upi:inquiry', 'upi:read', 'transaction:status'],
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1'
  }
];

async function insertUpiPayoutServices() {
  try {
    console.log('🔄 Starting UPI Payout services insertion...');
    
    for (const service of upiPayoutServices) {
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
    
    console.log('🎉 All UPI Payout services inserted successfully!');
    console.log(`📊 Total services inserted: ${upiPayoutServices.length}`);
    
  } catch (error) {
    console.error('❌ Error inserting UPI Payout services:', error);
    throw error;
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  insertUpiPayoutServices().then(() => {
    console.log('🏁 Script completed successfully');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

export { insertUpiPayoutServices, upiPayoutServices };