import { db } from '../server/storage';

const COMMON_SERVICES_CATEGORY_ID = '8a2b3c4d-5e6f-7890-ab12-cd34ef567890';

export const commonServicesApis = [
  // Communication Service APIs
  {
    id: 'common-communications-sms-send-001',
    categoryId: COMMON_SERVICES_CATEGORY_ID,
    category: 'Common Services',
    name: 'SMS Communication Service',
    path: '/CommunicationRestService/sendSMS',
    method: 'POST',
    description: 'Send SMS communications to customers for debit, credit, and spend alerts with whitelisted templates and OTP/Non-OTP message types.',
    summary: 'Send SMS notifications to customers',
    parameters: [
      {"name": "RequestId", "type": "string", "required": true, "description": "Unique Reference number (32 characters max)", "example": "12343566"},
      {"name": "Channel", "type": "string", "required": true, "description": "Channel name to identify from which application request received (10 characters max)", "example": "DEC"},
      {"name": "GroupID", "type": "string", "required": true, "description": "Static identifier (6 characters max)", "example": "AUBANK"},
      {"name": "ContentType", "type": "string", "required": true, "description": "Static content type indicator", "example": "1"},
      {"name": "NationalorInternational", "type": "string", "required": true, "description": "National/International indicator (1 for National, 2 for International)", "example": "1"},
      {"name": "MessageType", "type": "string", "required": true, "description": "Static message type", "example": "S"},
      {"name": "IsOTPMessage", "type": "string", "required": true, "description": "OTP/NON-OTP indicator (0 for non-OTP, 1 for OTP)", "example": "1"},
      {"name": "LanguageId", "type": "string", "required": true, "description": "Language identifier", "example": "en"},
      {"name": "Message.MobileNumber", "type": "string", "required": true, "description": "Customer mobile number (12 characters max)", "example": "7358506535"},
      {"name": "Message.MessageText", "type": "string", "required": true, "description": "Message text with whitelisted template (100 characters max)", "example": "213054 is your OTP to verify your Mobile no. 9636329727 for your Savings Account"}
    ],
    headers: [
      {"name": "Content-Type", "value": "application/json", "required": true},
      {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ],
    responses: [
      {"status": 200, "description": "Success - SMS sent successfully", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"0\",\"ResponseMessage\":\"Success\",\"ExtendedErrorDetails\":{\"messages\":{\"code\":\"0\",\"message\":\"7358506535 : APP-DECIMAL-1757395359743-386-DC0101: Success\"}}}}"},
      {"status": 400, "description": "Bad Request - Invalid SMS parameters", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"400\",\"ResponseMessage\":\"Bad Request\"}}"},
      {"status": 401, "description": "Unauthorized - Invalid authentication credentials", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"401\",\"ResponseMessage\":\"Unauthorized\"}}"}
    ],
    requestExample: JSON.stringify({
      "Message": {
        "MobileNumber": "7358506535",
        "MessageText": "213054 is your OTP to verify your Mobile no. 9636329727 for your Savings Account"
      },
      "RequestId": "12343566",
      "Channel": "DEC",
      "GroupID": "AUBANK",
      "ContentType": "1",
      "NationalorInternational": "1",
      "MessageType": "S",
      "IsOTPMessage": "1",
      "LanguageId": "en"
    }),
    responseExample: JSON.stringify({
      "TransactionStatus": {
        "ResponseCode": "0",
        "ResponseMessage": "Success",
        "ExtendedErrorDetails": {
          "messages": {
            "code": "0",
            "message": "7358506535 : APP-DECIMAL-1757395359743-386-DC0101: Success"
          }
        }
      }
    }),
    tags: ['Common', 'Communications', 'SMS'],
    requiresAuth: true,
    authType: 'bearer',
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1',
    rateLimits: {sandbox: 100, production: 1000},
    timeout: 30000,
    documentation: 'SMS communication service for customer notifications and alerts'
  },
  {
    id: 'common-communications-email-send-002',
    categoryId: COMMON_SERVICES_CATEGORY_ID,
    category: 'Common Services',
    name: 'Email Communication Service',
    path: '/CommunicationRestService/mail',
    method: 'POST',
    description: 'Send email communications to customers with support for TO, CC, BCC recipients and customizable subject and body content.',
    summary: 'Send email notifications to customers',
    parameters: [
      {"name": "RequestId", "type": "string", "required": true, "description": "Unique Reference number (32 characters max)", "example": "123456"},
      {"name": "Channel", "type": "string", "required": true, "description": "Channel name to identify from which application request received (10 characters max)", "example": "DEC"},
      {"name": "TO", "type": "string", "required": true, "description": "Primary email address (20 characters max)", "example": "customer@example.com"},
      {"name": "CC", "type": "string", "required": false, "description": "CC email address (20 characters max)", "example": "cc@example.com"},
      {"name": "BCC", "type": "string", "required": false, "description": "BCC email address (20 characters max)", "example": "bcc@example.com"},
      {"name": "Subject", "type": "string", "required": true, "description": "Email subject line (30 characters max)", "example": "Account Alert Notification"},
      {"name": "Text", "type": "string", "required": true, "description": "Email body text (100 characters max)", "example": "Your account has been updated successfully."}
    ],
    headers: [
      {"name": "Content-Type", "value": "application/json", "required": true},
      {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ],
    responses: [
      {"status": 200, "description": "Success - Email sent successfully", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"0\",\"ResponseMessage\":\"Success\",\"ExtendedErrorDetails\":{\"messages\":{\"code\":\"0\",\"message\":\"Email Request has been Acknowledged\"}}}}"},
      {"status": 400, "description": "Bad Request - Invalid email parameters", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"400\",\"ResponseMessage\":\"Bad Request\"}}"},
      {"status": 401, "description": "Unauthorized - Invalid authentication credentials", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"401\",\"ResponseMessage\":\"Unauthorized\"}}"}
    ],
    requestExample: JSON.stringify({
      "RequestId": "123456",
      "Channel": "DEC",
      "TO": "customer@example.com",
      "CC": "cc@example.com",
      "BCC": "bcc@example.com",
      "Subject": "Account Alert Notification",
      "Text": "Your account has been updated successfully."
    }),
    responseExample: JSON.stringify({
      "TransactionStatus": {
        "ResponseCode": "0",
        "ResponseMessage": "Success",
        "ExtendedErrorDetails": {
          "messages": {
            "code": "0",
            "message": "Email Request has been Acknowledged"
          }
        }
      }
    }),
    tags: ['Common', 'Communications', 'Email'],
    requiresAuth: true,
    authType: 'bearer',
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1',
    rateLimits: {sandbox: 100, production: 1000},
    timeout: 30000,
    documentation: 'Email communication service for customer notifications and alerts'
  },

  // Emandate User Registration APIs
  {
    id: 'common-emandate-register-without-confirmation-003',
    categoryId: COMMON_SERVICES_CATEGORY_ID,
    category: 'Common Services',
    name: 'Emandate User Registration (Without Confirmation)',
    path: '/EmandateUserRegistrationRestService/withoutUserConfirmation',
    method: 'POST',
    description: 'Register user mandate without user confirmation for automated mandate creation and processing.',
    summary: 'Register emandate without user confirmation',
    parameters: [
      {"name": "requestId", "type": "string", "required": true, "description": "Unique Reference number (32 characters max)", "example": "175741972981981910"},
      {"name": "channel", "type": "string", "required": true, "description": "Channel name (10 characters max)", "example": "Monedo"},
      {"name": "referenceCode", "type": "string", "required": true, "description": "Reference code for tracking", "example": "175741972981981910"},
      {"name": "mbSponserBankCode", "type": "string", "required": true, "description": "Sponsor bank code", "example": "AUBL0000001"},
      {"name": "mbSvcProviderCode", "type": "string", "required": true, "description": "Service provider code", "example": "NACH00000000013151"},
      {"name": "mbSvcProviderName", "type": "string", "required": true, "description": "Service provider name", "example": "MONEDO FINANCIAL SERVICES PVT LTD"},
      {"name": "mbAmount", "type": "string", "required": true, "description": "Mandate amount", "example": "33942"},
      {"name": "mbCustFonCellNum", "type": "string", "required": true, "description": "Customer mobile number", "example": "9740971030"},
      {"name": "mbCustMailId", "type": "string", "required": true, "description": "Customer email ID", "example": "customer@example.com"},
      {"name": "mbCustName", "type": "string", "required": true, "description": "Customer name", "example": "CUSTOMER NAME"},
      {"name": "mbDateFrom", "type": "string", "required": true, "description": "Mandate start date", "example": "09/09/2025"},
      {"name": "mbDateTo", "type": "string", "required": true, "description": "Mandate end date", "example": "12/05/2030"},
      {"name": "mbDRAccountNumber", "type": "string", "required": true, "description": "Debit account number", "example": "16430100068478"},
      {"name": "mbDRAccountType", "type": "string", "required": true, "description": "Debit account type", "example": "SB"},
      {"name": "mbDRBankCode", "type": "string", "required": true, "description": "Debit bank code", "example": "FDRL"},
      {"name": "mbFrequencyCode", "type": "string", "required": true, "description": "Frequency code", "example": "MNTH"},
      {"name": "mbFrequencyType", "type": "string", "required": true, "description": "Frequency type", "example": "RCUR"},
      {"name": "mbMandateCategory", "type": "string", "required": true, "description": "Mandate category", "example": "L001"},
      {"name": "mbPaymentType", "type": "string", "required": true, "description": "Payment type", "example": "DebitCard"},
      {"name": "mbMandateType", "type": "string", "required": true, "description": "Mandate type", "example": "DEBIT"},
      {"name": "username", "type": "string", "required": true, "description": "Username for registration", "example": "Monedo26"}
    ],
    headers: [
      {"name": "Content-Type", "value": "application/json", "required": true},
      {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ],
    responses: [
      {"status": 200, "description": "Success - Mandate registered successfully", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"0\",\"ResponseMessage\":\"Success\",\"MandateReference\":\"MND123456789\"}}"},
      {"status": 400, "description": "Bad Request - Invalid mandate parameters", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"400\",\"ResponseMessage\":\"Bad Request\"}}"},
      {"status": 401, "description": "Unauthorized - Invalid authentication credentials", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"401\",\"ResponseMessage\":\"Unauthorized\"}}"}
    ],
    requestExample: JSON.stringify({
      "requestId": "175741972981981910",
      "channel": "Monedo",
      "referenceCode": "175741972981981910",
      "mbSponserBankCode": "AUBL0000001",
      "mbSvcProviderCode": "NACH00000000013151",
      "mbSvcProviderName": "MONEDO FINANCIAL SERVICES PVT LTD",
      "mbAmount": "33942",
      "mbCustFonCellNum": "9740971030",
      "mbCustMailId": "customer@example.com",
      "mbCustName": "CUSTOMER NAME",
      "mbDateFrom": "09/09/2025",
      "mbDateTo": "12/05/2030",
      "mbDRAccountNumber": "16430100068478",
      "mbDRAccountType": "SB",
      "mbDRBankCode": "FDRL",
      "mbFrequencyCode": "MNTH",
      "mbFrequencyType": "RCUR",
      "mbMandateCategory": "L001",
      "mbPaymentType": "DebitCard",
      "mbMandateType": "DEBIT",
      "username": "Monedo26"
    }),
    responseExample: JSON.stringify({
      "TransactionStatus": {
        "ResponseCode": "0",
        "ResponseMessage": "Success",
        "MandateReference": "MND123456789"
      }
    }),
    tags: ['Common', 'Emandate', 'Registration'],
    requiresAuth: true,
    authType: 'bearer',
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1',
    rateLimits: {sandbox: 50, production: 500},
    timeout: 45000,
    documentation: 'Emandate user registration service without user confirmation'
  },
  {
    id: 'common-emandate-register-with-confirmation-004',
    categoryId: COMMON_SERVICES_CATEGORY_ID,
    category: 'Common Services',
    name: 'Emandate User Registration (With Confirmation)',
    path: '/EmandateUserRegistrationRestService/userconfirmation',
    method: 'POST',
    description: 'Register user mandate with user confirmation for secure mandate creation requiring customer approval.',
    summary: 'Register emandate with user confirmation',
    parameters: [
      {"name": "requestId", "type": "string", "required": true, "description": "Unique Reference number (32 characters max)", "example": "175741972981981911"},
      {"name": "channel", "type": "string", "required": true, "description": "Channel name (10 characters max)", "example": "Monedo"},
      {"name": "referenceCode", "type": "string", "required": true, "description": "Reference code for tracking", "example": "175741972981981911"},
      {"name": "mbSponserBankCode", "type": "string", "required": true, "description": "Sponsor bank code", "example": "AUBL0000001"},
      {"name": "mbSvcProviderCode", "type": "string", "required": true, "description": "Service provider code", "example": "NACH00000000013151"}
    ],
    headers: [
      {"name": "Content-Type", "value": "application/json", "required": true},
      {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ],
    responses: [
      {"status": 200, "description": "Success - Mandate registered with confirmation", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"0\",\"ResponseMessage\":\"Success\",\"ConfirmationReference\":\"CONF123456789\"}}"},
      {"status": 400, "description": "Bad Request - Invalid mandate parameters", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"400\",\"ResponseMessage\":\"Bad Request\"}}"},
      {"status": 401, "description": "Unauthorized - Invalid authentication credentials", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"401\",\"ResponseMessage\":\"Unauthorized\"}}"}
    ],
    requestExample: JSON.stringify({
      "requestId": "175741972981981911",
      "channel": "Monedo",
      "referenceCode": "175741972981981911",
      "mbSponserBankCode": "AUBL0000001",
      "mbSvcProviderCode": "NACH00000000013151"
    }),
    responseExample: JSON.stringify({
      "TransactionStatus": {
        "ResponseCode": "0",
        "ResponseMessage": "Success",
        "ConfirmationReference": "CONF123456789"
      }
    }),
    tags: ['Common', 'Emandate', 'Registration', 'Confirmation'],
    requiresAuth: true,
    authType: 'bearer',
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1',
    rateLimits: {sandbox: 50, production: 500},
    timeout: 45000,
    documentation: 'Emandate user registration service with user confirmation'
  },

  // Karix OTP Engine APIs
  {
    id: 'common-otp-generate-005',
    categoryId: COMMON_SERVICES_CATEGORY_ID,
    category: 'Common Services',
    name: 'Generate OTP',
    path: '/OTPEngineRestService/generateOTP',
    method: 'POST',
    description: 'Generate one-time password (OTP) for customer verification with configurable length, timeout, and delivery via SMS and email.',
    summary: 'Generate OTP for customer verification',
    parameters: [
      {"name": "requestId", "type": "string", "required": true, "description": "Unique Reference number (32 characters max)", "example": "4543656546"},
      {"name": "channel", "type": "string", "required": true, "description": "Channel name (10 characters max)", "example": "FABL"},
      {"name": "otptype", "type": "string", "required": true, "description": "OTP type indicator", "example": "1"},
      {"name": "msgContent", "type": "string", "required": true, "description": "SMS message content with OTP placeholder (100 characters max)", "example": "The Otp is {0} generated sucessfully - AU Bank"},
      {"name": "emailContent", "type": "string", "required": true, "description": "Email content with OTP placeholder (100 characters max)", "example": "The Otp is {0} generated sucessfully - AU Bank"},
      {"name": "emailfromaddress", "type": "string", "required": true, "description": "From email address (10 characters max)", "example": "noreply@aubank.in"},
      {"name": "mobile", "type": "string", "required": true, "description": "Customer mobile number (32 characters max)", "example": "7989443652"},
      {"name": "custRef", "type": "string", "required": true, "description": "Customer reference number (20 characters max)", "example": "3012011"},
      {"name": "emailId", "type": "string", "required": true, "description": "Customer email ID (20 characters max)", "example": "customer@example.com"},
      {"name": "otptimeout", "type": "string", "required": true, "description": "OTP timeout in seconds (10 characters max)", "example": "180"},
      {"name": "otplength", "type": "string", "required": true, "description": "OTP length (6 characters max)", "example": "6"},
      {"name": "emailSubject", "type": "string", "required": true, "description": "Email subject line (50 characters max)", "example": "Your One Time Password"}
    ],
    headers: [
      {"name": "Content-Type", "value": "application/json", "required": true},
      {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ],
    responses: [
      {"status": 200, "description": "Success - OTP generated successfully", "example": "{\"StatusDesc\":\"The Otp is generated successfully\",\"CustRef\":\"3012011\",\"StatusCode\":100,\"RequestStatus\":\"Success\"}"},
      {"status": 400, "description": "Bad Request - Invalid OTP parameters", "example": "{\"StatusDesc\":\"Invalid parameters\",\"StatusCode\":400,\"RequestStatus\":\"Failed\"}"},
      {"status": 401, "description": "Unauthorized - Invalid authentication credentials", "example": "{\"StatusDesc\":\"Unauthorized\",\"StatusCode\":401,\"RequestStatus\":\"Failed\"}"}
    ],
    requestExample: JSON.stringify({
      "otptype": "1",
      "msgContent": "The Otp is {0} generated sucessfully - AU Bank",
      "requestId": "4543656546",
      "channel": "FABL",
      "emailContent": "The Otp is {0} generated sucessfully - AU Bank",
      "emailfromaddress": "noreply@aubank.in",
      "mobile": "7989443652",
      "custRef": "3012011",
      "emailId": "customer@example.com",
      "otptimeout": "180",
      "otplength": "6",
      "emailSubject": "Your One Time Password"
    }),
    responseExample: JSON.stringify({
      "StatusDesc": "The Otp is generated successfully",
      "CustRef": "3012011",
      "StatusCode": 100,
      "RequestStatus": "Success"
    }),
    tags: ['Common', 'OTP', 'Security', 'Authentication'],
    requiresAuth: true,
    authType: 'bearer',
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1',
    rateLimits: {sandbox: 20, production: 200},
    timeout: 30000,
    documentation: 'OTP generation service for secure customer verification'
  },
  {
    id: 'common-otp-validate-006',
    categoryId: COMMON_SERVICES_CATEGORY_ID,
    category: 'Common Services',
    name: 'Validate OTP',
    path: '/OTPEngineRestService/validateOTP',
    method: 'POST',
    description: 'Validate customer-provided OTP against previously generated OTP for secure transaction verification.',
    summary: 'Validate customer OTP',
    parameters: [
      {"name": "requestId", "type": "string", "required": true, "description": "Unique Reference number (32 characters max)", "example": "65465656"},
      {"name": "channel", "type": "string", "required": true, "description": "Channel name (10 characters max)", "example": "FABL"},
      {"name": "mobile", "type": "string", "required": true, "description": "Customer mobile number (12 characters max)", "example": "7989443652"},
      {"name": "custRef", "type": "string", "required": true, "description": "Customer reference from generate OTP (20 characters max)", "example": "8606661204"},
      {"name": "emailId", "type": "string", "required": true, "description": "Customer email ID (20 characters max)", "example": "customer@example.com"},
      {"name": "otp", "type": "string", "required": true, "description": "OTP in encrypted format (30 characters max)", "example": "kf4kgcTRxSAQd4J+u62RVw=="}
    ],
    headers: [
      {"name": "Content-Type", "value": "application/json", "required": true},
      {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ],
    responses: [
      {"status": 200, "description": "Success - OTP validated successfully", "example": "{\"StatusDesc\":\"OTP Verified successfully\",\"CustRef\":\"8606661204\",\"StatusCode\":100,\"RequestStatus\":\"Success\"}"},
      {"status": 400, "description": "Bad Request - Invalid OTP or parameters", "example": "{\"StatusDesc\":\"Invalid OTP\",\"StatusCode\":400,\"RequestStatus\":\"Failed\"}"},
      {"status": 401, "description": "Unauthorized - Invalid authentication credentials", "example": "{\"StatusDesc\":\"Unauthorized\",\"StatusCode\":401,\"RequestStatus\":\"Failed\"}"}
    ],
    requestExample: JSON.stringify({
      "channel": "FABL",
      "requestId": "65465656",
      "mobile": "7989443652",
      "emailId": "customer@example.com",
      "otp": "kf4kgcTRxSAQd4J+u62RVw==",
      "custRef": "8606661204"
    }),
    responseExample: JSON.stringify({
      "StatusDesc": "OTP Verified successfully",
      "CustRef": "8606661204",
      "StatusCode": 100,
      "RequestStatus": "Success"
    }),
    tags: ['Common', 'OTP', 'Security', 'Validation'],
    requiresAuth: true,
    authType: 'bearer',
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1',
    rateLimits: {sandbox: 50, production: 500},
    timeout: 15000,
    documentation: 'OTP validation service for secure customer verification'
  },
  {
    id: 'common-otp-resend-007',
    categoryId: COMMON_SERVICES_CATEGORY_ID,
    category: 'Common Services',
    name: 'Resend OTP',
    path: '/OTPEngineRestService/resendOTP',
    method: 'POST',
    description: 'Resend OTP to customer when the original OTP was not received or has expired.',
    summary: 'Resend OTP to customer',
    parameters: [
      {"name": "requestId", "type": "string", "required": true, "description": "Unique Reference number (32 characters max)", "example": "SFDCPROD_7b5b0b518dce4e8916f7010b3"},
      {"name": "channel", "type": "string", "required": true, "description": "Channel name (10 characters max)", "example": "SFDC"},
      {"name": "otptype", "type": "string", "required": true, "description": "OTP type indicator", "example": "0"},
      {"name": "msgContent", "type": "string", "required": true, "description": "SMS message content (100 characters max)", "example": "Dear Customer,Confirmation code for vehicle loan application. - AU Bank"},
      {"name": "mobile", "type": "string", "required": true, "description": "Customer mobile number (32 characters max)", "example": "7498520699"},
      {"name": "custRef", "type": "string", "required": true, "description": "Customer reference (20 characters max)", "example": "SFDCPROD7b5b0b518dce4e8916f7010b3"},
      {"name": "otptimeout", "type": "string", "required": true, "description": "OTP timeout in seconds (10 characters max)", "example": "300"},
      {"name": "otplength", "type": "string", "required": true, "description": "OTP length (20 characters max)", "example": "6"}
    ],
    headers: [
      {"name": "Content-Type", "value": "application/json", "required": true},
      {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ],
    responses: [
      {"status": 200, "description": "Success - OTP resent successfully", "example": "{\"StatusDesc\":\"The Otp has been sent Successfully\",\"CustRef\":\"SFDCPROD24df0055fdf1a142a044c3f9d\",\"StatusCode\":100,\"RequestStatus\":\"Success\"}"},
      {"status": 400, "description": "Bad Request - Invalid resend parameters", "example": "{\"StatusDesc\":\"Invalid parameters\",\"StatusCode\":400,\"RequestStatus\":\"Failed\"}"},
      {"status": 401, "description": "Unauthorized - Invalid authentication credentials", "example": "{\"StatusDesc\":\"Unauthorized\",\"StatusCode\":401,\"RequestStatus\":\"Failed\"}"}
    ],
    requestExample: JSON.stringify({
      "otptype": "0",
      "msgContent": "Dear Customer,Confirmation code for vehicle loan application. - AU Bank",
      "requestId": "SFDCPROD_7b5b0b518dce4e8916f7010b3",
      "mobile": "7498520699",
      "channel": "SFDC",
      "otp": "",
      "custRef": "SFDCPROD7b5b0b518dce4e8916f7010b3",
      "otptimeout": "300",
      "otplength": "6"
    }),
    responseExample: JSON.stringify({
      "StatusDesc": "The Otp has been sent Successfully",
      "CustRef": "SFDCPROD24df0055fdf1a142a044c3f9d",
      "StatusCode": 100,
      "RequestStatus": "Success"
    }),
    tags: ['Common', 'OTP', 'Security', 'Resend'],
    requiresAuth: true,
    authType: 'bearer',
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1',
    rateLimits: {sandbox: 10, production: 100},
    timeout: 30000,
    documentation: 'OTP resend service for customer convenience'
  },

  // Nvest Create Policy APIs
  {
    id: 'common-nvest-fetch-quote-premium-008',
    categoryId: COMMON_SERVICES_CATEGORY_ID,
    category: 'Common Services',
    name: 'Nvest Fetch Quote Premium',
    path: '/NvestCreatePolicyService/AUFetchQuotePremium',
    method: 'POST',
    description: 'Fetch insurance quote premium for policy creation with comprehensive customer and loan details.',
    summary: 'Fetch insurance quote premium',
    parameters: [
      {"name": "RequestId", "type": "string", "required": true, "description": "Unique Reference number (32 characters max)", "example": "11q1"},
      {"name": "Channel", "type": "string", "required": true, "description": "Application name (10 characters max)", "example": "Protean"},
      {"name": "AuthToken", "type": "string", "required": true, "description": "Authentication token (16 characters max)", "example": "WIR9JRAZ6H5I6J6DRKJ4UZADDD2J9"},
      {"name": "QuotePremiumRequest.CVID", "type": "string", "required": true, "description": "Customer Verification ID", "example": "105645634"},
      {"name": "QuotePremiumRequest.FullName", "type": "string", "required": true, "description": "Customer full name", "example": "CUSTOMER FULL NAME"},
      {"name": "QuotePremiumRequest.EmailID", "type": "string", "required": true, "description": "Customer email ID", "example": "customer@example.com"},
      {"name": "QuotePremiumRequest.PANNo", "type": "string", "required": true, "description": "Customer PAN number", "example": "ABCDE1234F"},
      {"name": "QuotePremiumRequest.DOB", "type": "string", "required": true, "description": "Customer date of birth (YYYY-MM-DD)", "example": "1998-10-02"},
      {"name": "QuotePremiumRequest.Gender", "type": "string", "required": true, "description": "Customer gender (M/F)", "example": "M"},
      {"name": "QuotePremiumRequest.MobileNo", "type": "string", "required": true, "description": "Customer mobile number", "example": "9898934333"},
      {"name": "QuotePremiumRequest.LoanAccNo", "type": "string", "required": true, "description": "Loan account number", "example": "56452541234523"},
      {"name": "QuotePremiumRequest.LoanAmount", "type": "string", "required": true, "description": "Loan amount", "example": "1000000"},
      {"name": "QuotePremiumRequest.LoanTenure", "type": "string", "required": true, "description": "Loan tenure in months", "example": "60"}
    ],
    headers: [
      {"name": "Content-Type", "value": "application/json", "required": true},
      {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ],
    responses: [
      {"status": 200, "description": "Success - Quote premium fetched successfully", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"0\",\"ResponseMessage\":\"Success\"},\"QuoteDetails\":{\"PremiumAmount\":\"12500.00\",\"QuoteId\":\"QT123456789\"}}"},
      {"status": 400, "description": "Bad Request - Invalid quote parameters", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"400\",\"ResponseMessage\":\"Bad Request\"}}"},
      {"status": 401, "description": "Unauthorized - Invalid authentication credentials", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"401\",\"ResponseMessage\":\"Unauthorized\"}}"}
    ],
    requestExample: JSON.stringify({
      "RequestId": "11q1",
      "Channel": "Protean",
      "AuthToken": "WIR9JRAZ6H5I6J6DRKJ4UZADDD2J9",
      "QuotePremiumRequest": {
        "CVID": "105645634",
        "FullName": "CUSTOMER FULL NAME",
        "EmailID": "customer@example.com",
        "PANNo": "ABCDE1234F",
        "DOB": "1998-10-02",
        "Gender": "M",
        "MobileNo": "9898934333",
        "LoanAccNo": "56452541234523",
        "LoanAmount": "1000000",
        "LoanTenure": "60"
      }
    }),
    responseExample: JSON.stringify({
      "TransactionStatus": {
        "ResponseCode": "0",
        "ResponseMessage": "Success"
      },
      "QuoteDetails": {
        "PremiumAmount": "12500.00",
        "QuoteId": "QT123456789"
      }
    }),
    tags: ['Common', 'Nvest', 'Insurance', 'Quote'],
    requiresAuth: true,
    authType: 'bearer',
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1',
    rateLimits: {sandbox: 50, production: 500},
    timeout: 45000,
    documentation: 'Nvest service for fetching insurance quote premiums'
  },
  {
    id: 'common-nvest-create-policy-009',
    categoryId: COMMON_SERVICES_CATEGORY_ID,
    category: 'Common Services',
    name: 'Nvest Create Policy',
    path: '/NvestCreatePolicyService/createPolicy',
    method: 'POST',
    description: 'Create insurance policy with comprehensive customer details and policy configuration.',
    summary: 'Create insurance policy',
    parameters: [
      {"name": "RequestId", "type": "string", "required": true, "description": "Unique Reference number (32 characters max)", "example": "POL123456"},
      {"name": "Channel", "type": "string", "required": true, "description": "Application name (10 characters max)", "example": "Protean"},
      {"name": "AuthToken", "type": "string", "required": true, "description": "Authentication token (16 characters max)", "example": "WIR9JRAZ6H5I6J6DRKJ4UZADDD2J9"},
      {"name": "PolicyData.CustomerName", "type": "string", "required": true, "description": "Customer full name", "example": "CUSTOMER FULL NAME"},
      {"name": "PolicyData.PolicyAmount", "type": "string", "required": true, "description": "Policy coverage amount", "example": "1000000"},
      {"name": "PolicyData.PremiumAmount", "type": "string", "required": true, "description": "Premium amount", "example": "12500"}
    ],
    headers: [
      {"name": "Content-Type", "value": "application/json", "required": true},
      {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ],
    responses: [
      {"status": 200, "description": "Success - Policy created successfully", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"0\",\"ResponseMessage\":\"Success\"},\"PolicyDetails\":{\"PolicyNumber\":\"POL987654321\",\"Status\":\"Active\"}}"},
      {"status": 400, "description": "Bad Request - Invalid policy parameters", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"400\",\"ResponseMessage\":\"Bad Request\"}}"},
      {"status": 401, "description": "Unauthorized - Invalid authentication credentials", "example": "{\"TransactionStatus\":{\"ResponseCode\":\"401\",\"ResponseMessage\":\"Unauthorized\"}}"}
    ],
    requestExample: JSON.stringify({
      "RequestId": "POL123456",
      "Channel": "Protean",
      "AuthToken": "WIR9JRAZ6H5I6J6DRKJ4UZADDD2J9",
      "PolicyData": {
        "CustomerName": "CUSTOMER FULL NAME",
        "PolicyAmount": "1000000",
        "PremiumAmount": "12500"
      }
    }),
    responseExample: JSON.stringify({
      "TransactionStatus": {
        "ResponseCode": "0",
        "ResponseMessage": "Success"
      },
      "PolicyDetails": {
        "PolicyNumber": "POL987654321",
        "Status": "Active"
      }
    }),
    tags: ['Common', 'Nvest', 'Insurance', 'Policy'],
    requiresAuth: true,
    authType: 'bearer',
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1',
    rateLimits: {sandbox: 30, production: 300},
    timeout: 60000,
    documentation: 'Nvest service for creating insurance policies'
  },

  // Value First WhatsApp Integration API
  {
    id: 'common-whatsapp-send-message-010',
    categoryId: COMMON_SERVICES_CATEGORY_ID,
    category: 'Common Services',
    name: 'WhatsApp Send Message',
    path: '/ValueFirstWhatsappIntegration/Message',
    method: 'POST',
    description: 'Send WhatsApp messages to customers with support for various message types including text, images, and templates.',
    summary: 'Send WhatsApp messages to customers',
    parameters: [
      {"name": "DLR.URL", "type": "string", "required": false, "description": "Delivery receipt URL", "example": ""},
      {"name": "SMS[0].TYPE", "type": "string", "required": true, "description": "Message type (text/image)", "example": "image"},
      {"name": "SMS[0].TEMPLATENAME", "type": "string", "required": true, "description": "WhatsApp template name", "example": "raf_amazon~Customer"},
      {"name": "SMS[0].LANGUAGE", "type": "string", "required": true, "description": "Message language", "example": "english"},
      {"name": "SMS[0].CONTENTTYPE", "type": "string", "required": true, "description": "Content MIME type", "example": "image/jpeg"},
      {"name": "SMS[0].MSGTYPE", "type": "string", "required": true, "description": "Message type code", "example": "3"},
      {"name": "SMS[0].MEDIADATA", "type": "string", "required": false, "description": "Media URL for images/files", "example": "https://example.com/image.jpg"},
      {"name": "SMS[0].ADDRESS[0].FROM", "type": "string", "required": true, "description": "Sender WhatsApp number", "example": "919116002622"},
      {"name": "SMS[0].ADDRESS[0].TO", "type": "string", "required": true, "description": "Recipient WhatsApp number", "example": "911552741000"},
      {"name": "SMS[0].ADDRESS[0].SEQ", "type": "string", "required": true, "description": "Sequence number", "example": "1"},
      {"name": "SMS[0].ADDRESS[0].TAG", "type": "string", "required": true, "description": "Message tag identifier", "example": "65099088~1447482036"}
    ],
    headers: [
      {"name": "Content-Type", "value": "application/json", "required": true},
      {"name": "Authorization", "value": "Bearer <access_token>", "required": true}
    ],
    responses: [
      {"status": 200, "description": "Success - WhatsApp message sent successfully", "example": "{\"MESSAGEACK\":{\"GUID\":[{\"GUID\":\"kp99l0153580k4f440e00sa726AUBANKWAXM\",\"SUBMITDATE\":\"2025-09-09 21:01:53\",\"ID\":\"1\",\"ERROR\":{\"SEQ\":\"1\",\"CODE\":\"28673\"}}]}}"},
      {"status": 400, "description": "Bad Request - Invalid message parameters", "example": "{\"error\":\"Bad Request\",\"code\":400}"},
      {"status": 401, "description": "Unauthorized - Invalid authentication credentials", "example": "{\"error\":\"Unauthorized\",\"code\":401}"}
    ],
    requestExample: JSON.stringify({
      "DLR": {
        "URL": ""
      },
      "SMS": [
        {
          "TYPE": "image",
          "TEMPLATENAME": "raf_amazon~Customer",
          "LANGUAGE": "english",
          "CONTENTTYPE": "image/jpeg",
          "BTN_PAYLOADS": [],
          "MSGTYPE": "3",
          "MEDIADATA": "https://example.com/image.jpg",
          "ADDRESS": [
            {
              "FROM": "919116002622",
              "TO": "911552741000",
              "SEQ": "1",
              "TAG": "65099088~1447482036"
            }
          ]
        }
      ]
    }),
    responseExample: JSON.stringify({
      "MESSAGEACK": {
        "GUID": [
          {
            "GUID": "kp99l0153580k4f440e00sa726AUBANKWAXM",
            "SUBMITDATE": "2025-09-09 21:01:53",
            "ID": "1",
            "ERROR": {
              "SEQ": "1",
              "CODE": "28673"
            }
          }
        ]
      }
    }),
    tags: ['Common', 'WhatsApp', 'Messaging', 'Communication'],
    requiresAuth: true,
    authType: 'bearer',
    isActive: true,
    isInternal: true,
    status: 'active',
    version: 'v1',
    rateLimits: {sandbox: 50, production: 1000},
    timeout: 30000,
    documentation: 'WhatsApp integration service for customer messaging'
  }
];

async function seedCommonServices() {
  try {
    console.log('Starting Common Services API seeding...');
    
    let insertedCount = 0;
    
    for (const api of commonServicesApis) {
      const existing = await db.get(
        'SELECT id FROM api_endpoints WHERE id = ?',
        [api.id]
      );
      
      if (!existing) {
        await db.run(`
          INSERT INTO api_endpoints (
            id, category_id, category, name, path, method, description, summary,
            parameters, headers, responses, request_example, response_example,
            tags, requires_auth, auth_type, is_active, is_internal, status, version,
            rate_limits, timeout, documentation
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          api.id,
          api.categoryId,
          api.category,
          api.name,
          api.path,
          api.method,
          api.description,
          api.summary,
          JSON.stringify(api.parameters),
          JSON.stringify(api.headers),
          JSON.stringify(api.responses),
          api.requestExample,
          api.responseExample,
          JSON.stringify(api.tags),
          api.requiresAuth,
          api.authType,
          api.isActive,
          api.isInternal,
          api.status,
          api.version,
          JSON.stringify(api.rateLimits),
          api.timeout,
          api.documentation
        ]);
        insertedCount++;
        console.log(`✓ Inserted: ${api.name}`);
      } else {
        console.log(`- Skipped (exists): ${api.name}`);
      }
    }
    
    console.log(`\n✅ Common Services seeding completed!`);
    console.log(`📊 Summary: ${insertedCount} new APIs inserted`);
    console.log(`📋 Total Common Services APIs: ${commonServicesApis.length}`);
    
    // Get final count
    const result = await db.get('SELECT COUNT(*) as count FROM api_endpoints WHERE category = ?', ['Common Services']);
    console.log(`🎯 Common Services APIs in database: ${result.count}`);
    
  } catch (error) {
    console.error('❌ Error seeding Common Services APIs:', error);
    throw error;
  }
}

// Export for use in other scripts
export { seedCommonServices };

// Run if called directly
if (require.main === module) {
  seedCommonServices()
    .then(() => {
      console.log('🎉 Common Services seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Common Services seeding failed:', error);
      process.exit(1);
    });
}