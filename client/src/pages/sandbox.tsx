import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play, Copy, Settings, Database, CreditCard, Shield, Clock, CheckCircle, XCircle, AlertCircle, Eye, EyeOff, Search, Filter, Star, History } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

// Import category images
import accountsImage from "@assets/generated_images/Banking_accounts_interface_illustration_1018d030.png";
import paymentsImage from "@assets/generated_images/Digital_payment_processing_illustration_31b268b5.png";
import authImage from "@assets/generated_images/Authentication_security_illustration_a4d4ed72.png";
import kycImage from "@assets/generated_images/KYC_verification_illustration_dd95e58f.png";
import billPaymentsImage from "@assets/generated_images/Bill_payments_illustration_5074064f.png";
import cardsImage from "@assets/generated_images/Credit_cards_illustration_0309072a.png";
import loansImage from "@assets/generated_images/Loan_services_illustration_f6b3efc8.png";

interface APIEndpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  category: string;
  description: string;
  requiresAuth: boolean;
  sampleRequest?: any;
}

interface APIResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  responseTime: number;
  timestamp: string;
}

interface TestHistory {
  id: string;
  endpoint: APIEndpoint;
  request: any;
  response: APIResponse;
  timestamp: string;
}

// Validation schemas for API endpoints
interface FieldValidation {
  name: string;
  type: 'string' | 'number' | 'email' | 'phone' | 'date' | 'currency' | 'boolean' | 'account' | 'ifsc';
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  description: string;
  example?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface EndpointValidation {
  [key: string]: FieldValidation[];
}

// Comprehensive validation schemas based on API documentation
const validationSchemas: EndpointValidation = {
  "upi-payout": [
    { name: "upi_id", type: "string", required: true, maxLength: 50, description: "Valid UPI ID (e.g., user@bank)", example: "user@aubank", pattern: "^[\\w.-]+@[\\w.-]+$" },
    { name: "amount", type: "currency", required: true, maxLength: 10, description: "Amount in INR (e.g., 1000.00)", example: "1000.00", pattern: "^\\d+\\.\\d{2}$" },
    { name: "transaction_ref", type: "string", required: true, maxLength: 25, description: "Unique transaction reference", example: "TXN123456789" },
    { name: "customer_mobile", type: "phone", required: true, maxLength: 10, description: "Customer mobile number", example: "9876543210", pattern: "^[6-9]\\d{9}$" },
    { name: "remarks", type: "string", required: false, maxLength: 40, description: "Optional transaction remarks", example: "Payment for services" }
  ],
  "cnb-payment": [
    { name: "uniqueRequestId", type: "string", required: true, maxLength: 20, description: "Unique Request/Reference number", example: "REQ123456789" },
    { name: "corporateCode", type: "string", required: true, maxLength: 20, description: "Corporate code (CIF Number)", example: "CORP001" },
    { name: "corporateProductCode", type: "string", required: true, maxLength: 50, description: "Corporate product code", example: "PROD001" },
    { name: "paymentMethodName", type: "string", required: true, maxLength: 50, description: "Payment method: NEFT, RTGS, IMPS, Internal Fund Transfer", example: "NEFT" },
    { name: "remitterAccountNo", type: "account", required: true, maxLength: 35, description: "Remitter Account Number", example: "1234567890123" },
    { name: "amount", type: "currency", required: true, maxLength: 16, description: "Payable amount (format: 1000.00)", example: "1000.00", pattern: "^\\d{1,14}\\.\\d{2}$" },
    { name: "ifscCode", type: "ifsc", required: true, maxLength: 50, description: "Beneficiary IFSC Code", example: "AUBL0002086", pattern: "^[A-Z]{4}0[A-Z0-9]{6}$" },
    { name: "payableCurrency", type: "string", required: true, maxLength: 20, description: "Always 'INR' for Indian Rupees", example: "INR" },
    { name: "beneAccNo", type: "account", required: true, maxLength: 35, description: "Beneficiary Account Number", example: "9876543210987" },
    { name: "beneName", type: "string", required: true, maxLength: 200, description: "Beneficiary Name", example: "Test Beneficiary" },
    { name: "transactionRefNo", type: "string", required: true, maxLength: 25, description: "Unique reference number for transaction", example: "TXN001" },
    { name: "paymentInstruction", type: "string", required: true, maxLength: 314, description: "Payment narration", example: "NEFT Payment" },
    { name: "beneCode", type: "string", required: false, maxLength: 200, description: "Beneficiary code (Optional)", example: "BENE001" },
    { name: "valueDate", type: "date", required: false, maxLength: 8, description: "Value date (YYYYMMDD)", example: "20240115", pattern: "^\\d{8}$" },
    { name: "remarks", type: "string", required: false, maxLength: 40, description: "Additional remarks", example: "Payment for services" },
    { name: "email", type: "email", required: false, maxLength: 50, description: "Email for notifications", example: "test@example.com" },
    { name: "phoneNo", type: "phone", required: false, maxLength: 200, description: "Phone number for notifications", example: "9876543210" }
  ],
  "bbps-bill-fetch": [
    { name: "biller_id", type: "string", required: true, maxLength: 20, description: "BBPS Biller ID", example: "MSEDCL001" },
    { name: "customer_params", type: "string", required: true, description: "Customer identification parameters", example: "9876543210" },
    { name: "amount", type: "currency", required: true, description: "Bill amount", example: "500.00", pattern: "^\\d+\\.\\d{2}$" },
    { name: "reference_id", type: "string", required: true, maxLength: 25, description: "Unique reference ID", example: "FETCH123456789" }
  ],
  "kyc-upload": [
    { name: "document_type", type: "string", required: true, description: "Document type: PAN, AADHAAR, PASSPORT, VOTER_ID", example: "PAN" },
    { name: "document_number", type: "string", required: true, maxLength: 20, description: "Document number", example: "ABCDE1234F" },
    { name: "customer_name", type: "string", required: true, maxLength: 100, description: "Customer full name", example: "John Doe" },
    { name: "date_of_birth", type: "date", required: true, description: "Date of birth (YYYY-MM-DD)", example: "1990-01-15", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
    { name: "mobile_number", type: "phone", required: true, description: "Mobile number", example: "9876543210", pattern: "^[6-9]\\d{9}$" },
    { name: "email", type: "email", required: false, description: "Email address", example: "john.doe@example.com" }
  ]
};

// Validation functions
const validateField = (value: string, field: FieldValidation): ValidationError | null => {
  // Check if required field is empty
  if (field.required && (!value || value.trim() === "")) {
    return { field: field.name, message: `${field.name} is mandatory and cannot be empty` };
  }
  
  // Skip validation for empty optional fields
  if (!field.required && (!value || value.trim() === "")) {
    return null;
  }
  
  // Length validation
  if (field.maxLength && value.length > field.maxLength) {
    return { field: field.name, message: `${field.name} must not exceed ${field.maxLength} characters` };
  }
  
  if (field.minLength && value.length < field.minLength) {
    return { field: field.name, message: `${field.name} must be at least ${field.minLength} characters` };
  }
  
  // Type-specific validation
  switch (field.type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { field: field.name, message: `${field.name} must be a valid email address` };
      }
      break;
      
    case 'phone':
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(value)) {
        return { field: field.name, message: `${field.name} must be a valid 10-digit Indian mobile number` };
      }
      break;
      
    case 'currency':
      const currencyRegex = /^\d+\.\d{2}$/;
      if (!currencyRegex.test(value)) {
        return { field: field.name, message: `${field.name} must be in format: 1000.00` };
      }
      if (parseFloat(value) <= 0) {
        return { field: field.name, message: `${field.name} must be greater than 0` };
      }
      break;
      
    case 'ifsc':
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(value)) {
        return { field: field.name, message: `${field.name} must be a valid IFSC code (e.g., AUBL0002086)` };
      }
      break;
      
    case 'account':
      const accountRegex = /^\d{9,18}$/;
      if (!accountRegex.test(value)) {
        return { field: field.name, message: `${field.name} must be a valid account number (9-18 digits)` };
      }
      break;
      
    case 'date':
      if (field.pattern) {
        const regex = new RegExp(field.pattern);
        if (!regex.test(value)) {
          return { field: field.name, message: `${field.name} must be in valid date format (${field.example})` };
        }
      }
      break;
      
    case 'number':
      if (isNaN(Number(value))) {
        return { field: field.name, message: `${field.name} must be a valid number` };
      }
      break;
  }
  
  // Pattern validation
  if (field.pattern) {
    const regex = new RegExp(field.pattern);
    if (!regex.test(value)) {
      return { field: field.name, message: `${field.name} format is invalid. Expected format: ${field.example}` };
    }
  }
  
  return null;
};

const validateRequestBody = (requestBody: string, endpointId: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Get validation schema for endpoint
  const schema = validationSchemas[endpointId];
  if (!schema) {
    return errors; // No validation schema defined
  }
  
  try {
    const data = JSON.parse(requestBody);
    
    // Validate each field in the schema
    schema.forEach(field => {
      const value = data[field.name];
      const error = validateField(value || "", field);
      if (error) {
        errors.push(error);
      }
    });
    
    // Check for unknown fields
    Object.keys(data).forEach(key => {
      const isKnownField = schema.some(field => field.name === key);
      if (!isKnownField) {
        errors.push({ field: key, message: `${key} is not a recognized field for this endpoint` });
      }
    });
    
  } catch (e) {
    errors.push({ field: "JSON", message: "Invalid JSON format" });
  }
  
  return errors;
};

const staticApiEndpoints: APIEndpoint[] = [
  {
    id: "oauth-token",
    name: "Generate OAuth Token", 
    method: "POST",
    path: "https://aubank.tech/uat/oauth/token",
    category: "Authentication",
    description: "Generate access token for API authentication",
    requiresAuth: false,
    sampleRequest: {
      grant_type: "client_credentials",
      scope: "payment_read payment_write"
    }
  },
  {
    id: "cnb-payment",
    name: "CNB Payment Creation",
    method: "POST", 
    path: "https://aubank.tech/uat/cnb/payment",
    category: "Payments",
    description: "Create a new CNB payment transaction",
    requiresAuth: true,
    sampleRequest: {
      uniqueRequestId: "REQ" + Date.now(),
      corporateCode: "CORP001",
      corporateProductCode: "PROD001",
      paymentMethodName: "NEFT",
      remitterAccountNo: "1234567890123",
      amount: "1000.00",
      ifscCode: "AUBL0002086",
      payableCurrency: "INR",
      beneAccNo: "9876543210987",
      beneName: "Test Beneficiary",
      valueDate: new Date().toISOString().split('T')[0].replace(/-/g, ''),
      remarks: "Test payment via API playground",
      transactionRefNo: "TXN" + Date.now(),
      paymentInstruction: "NEFT Payment",
      email: "test@example.com",
      phoneNo: "9876543210"
    }
  },
  {
    id: "upi-payout-initiate",
    name: "UPI Payout Initiate",
    method: "POST",
    path: "https://aubank.tech/uat/upi/payout/initiate",
    category: "Payments",
    description: "Initiate merchant UPI payout to beneficiary Virtual Payment Address",
    requiresAuth: true,
    sampleRequest: {
      merchant_id: "MERCH001",
      payout_id: "PAYOUT" + Date.now(),
      payee_vpa: "beneficiary@upi",
      amount: 500.00,
      purpose: "salary_disbursement",
      remarks: "Monthly salary payout"
    }
  },
  {
    id: "upi-payout-status",
    name: "UPI Payout Status",
    method: "GET",
    path: "https://aubank.tech/uat/upi/payout/status/{payout_id}",
    category: "Payments",
    description: "Check the status of UPI payout transaction",
    requiresAuth: true,
    sampleRequest: {
      reference_id: "REF123456789",
      transaction_date: "2024-12-05"
    }
  },
  {
    id: "bbps-biller-list",
    name: "BBPS Biller List",
    method: "GET",
    path: "https://aubank.tech/uat/bbps/billers",
    category: "Bill Payments",
    description: "Retrieve list of available billers for BBPS payments",
    requiresAuth: true,
    sampleRequest: {
      category: "Electricity",
      state: "Maharashtra",
      limit: "50"
    }
  },
  {
    id: "bbps-bill-fetch",
    name: "BBPS Bill Fetch",
    method: "POST",
    path: "https://aubank.tech/uat/bbps/bill/fetch",
    category: "Bill Payments",
    description: "Fetch bill details for payment",
    requiresAuth: true,
    sampleRequest: {
      biller_id: "BILLER001",
      customer_params: ["9876543210"]
    }
  },
  {
    id: "payment-enquiry",
    name: "Payment Enquiry",
    method: "GET",
    path: "https://aubank.tech/uat/payments/{payment_id}/status",
    category: "Payments",
    description: "Query status and details of a payment transaction",
    requiresAuth: true,
    sampleRequest: {
      payment_id: "PAY123456789",
      reference_date: "2024-12-05"
    }
  },
  {
    id: "account-balance", 
    name: "Account Balance",
    method: "GET",
    path: "https://aubank.tech/uat/accounts/{account_id}/balance",
    category: "Accounts",
    description: "Get current account balance and details",
    requiresAuth: true,
    sampleRequest: {
      account_id: "ACC123456789",
      include_pending: "true"
    }
  },
  {
    id: "account-transactions",
    name: "Account Transactions", 
    method: "GET",
    path: "https://aubank.tech/uat/accounts/{account_id}/transactions",
    category: "Accounts",
    description: "Retrieve account transaction history",
    requiresAuth: true,
    sampleRequest: {
      account_id: "ACC123456789",
      from_date: "2024-11-01",
      to_date: "2024-12-05",
      limit: "100"
    }
  },
  // Additional KYC APIs
  {
    id: "kyc-document-upload",
    name: "KYC Document Upload",
    method: "POST",
    path: "https://aubank.tech/uat/kyc/documents/upload",
    category: "KYC",
    description: "Upload KYC documents for verification",
    requiresAuth: true,
    sampleRequest: {
      document_type: "aadhaar",
      customer_id: "CUST001"
    }
  },
  {
    id: "kyc-status-check",
    name: "KYC Status Check",
    method: "GET",
    path: "https://aubank.tech/uat/kyc/status/{customer_id}",
    category: "KYC",
    description: "Check KYC verification status",
    requiresAuth: true,
    sampleRequest: {
      customer_id: "CUST123456789",
      status_type: "detailed"
    }
  },
  {
    id: "kyc-video-verification",
    name: "KYC Video Verification",
    method: "POST",
    path: "https://aubank.tech/uat/kyc/video-verification",
    category: "KYC",
    description: "Initiate video KYC verification",
    requiresAuth: true,
    sampleRequest: {
      customer_id: "CUST001",
      scheduled_time: "2024-01-15T10:00:00Z"
    }
  },
  // Additional Bill Payment APIs
  {
    id: "bbps-bill-payment",
    name: "BBPS Bill Payment",
    method: "POST",
    path: "https://aubank.tech/uat/bbps/bill/payment",
    category: "Bill Payments",
    description: "Process BBPS bill payment",
    requiresAuth: true,
    sampleRequest: {
      biller_id: "BILLER001",
      customer_params: ["9876543210"],
      amount: 500.00
    }
  },
  {
    id: "bbps-payment-status",
    name: "BBPS Payment Status",
    method: "GET",
    path: "https://aubank.tech/uat/bbps/payment/status/{payment_id}",
    category: "Bill Payments",
    description: "Check BBPS payment status",
    requiresAuth: true,
    sampleRequest: {
      reference_id: "REF987654321",
      customer_mobile: "9876543210"
    }
  },
  // Additional Card APIs
  {
    id: "card-balance",
    name: "Card Balance",
    method: "GET",
    path: "https://aubank.tech/uat/cards/{card_id}/balance",
    category: "Cards",
    description: "Get credit/debit card balance",
    requiresAuth: true,
    sampleRequest: {
      card_id: "CARD123456789",
      include_limits: "true"
    }
  },
  {
    id: "card-transactions",
    name: "Card Transactions",
    method: "GET",
    path: "https://aubank.tech/uat/cards/{card_id}/transactions",
    category: "Cards",
    description: "Get card transaction history",
    requiresAuth: true,
    sampleRequest: {
      card_id: "CARD123456789",
      from_date: "2024-11-01",
      to_date: "2024-12-05",
      transaction_type: "all"
    }
  },
  {
    id: "card-block",
    name: "Block Card",
    method: "PUT",
    path: "https://aubank.tech/uat/cards/{card_id}/block",
    category: "Cards",
    description: "Block credit/debit card",
    requiresAuth: true,
    sampleRequest: {
      reason: "lost_stolen",
      remarks: "Card reported as lost"
    }
  },
  // Additional Account APIs
  {
    id: "account-statement",
    name: "Account Statement",
    method: "GET",
    path: "https://aubank.tech/uat/accounts/{account_id}/statement",
    category: "Accounts",
    description: "Generate account statement",
    requiresAuth: true,
    sampleRequest: {
      account_id: "ACC123456789",
      from_date: "2024-11-01",
      to_date: "2024-12-05",
      format: "pdf"
    }
  },
  {
    id: "fund-transfer",
    name: "Fund Transfer",
    method: "POST",
    path: "https://aubank.tech/uat/accounts/fund-transfer",
    category: "Accounts",
    description: "Transfer funds between accounts",
    requiresAuth: true,
    sampleRequest: {
      from_account: "1234567890",
      to_account: "0987654321",
      amount: 1000.00,
      purpose: "transfer"
    }
  },
  // Additional Loan APIs
  {
    id: "loan-eligibility",
    name: "Loan Eligibility",
    method: "POST",
    path: "https://aubank.tech/uat/loans/eligibility",
    category: "Loans",
    description: "Check loan eligibility",
    requiresAuth: true,
    sampleRequest: {
      customer_id: "CUST001",
      loan_type: "personal",
      requested_amount: 500000
    }
  },
  {
    id: "loan-application",
    name: "Loan Application",
    method: "POST",
    path: "https://aubank.tech/uat/loans/application",
    category: "Loans",
    description: "Submit loan application",
    requiresAuth: true,
    sampleRequest: {
      customer_id: "CUST001",
      loan_type: "personal",
      amount: 300000,
      tenure: 24
    }
  },
  // Customer APIs
  {
    id: "aadhar-insert-token",
    name: "Aadhar Vault - Insert Token",
    method: "POST",
    path: "https://osbuat.aubankuat.in/AadharVaultServiceNewV1/AadharVault/insertToken",
    category: "Customer",
    description: "Store Aadhar details securely and get token",
    requiresAuth: true,
    sampleRequest: {
      Guid: "UPI891728937123",
      Source: "UPI",
      Token: "252007727794",
      Format: "0"
    }
  },
  {
    id: "aadhar-get-value",
    name: "Aadhar Vault - Get Value",
    method: "GET",
    path: "https://osbuat.aubankuat.in/AadharVaultServiceNewV1/AadharVault/getValue",
    category: "Customer",
    description: "Retrieve Aadhar value using token",
    requiresAuth: true,
    sampleRequest: {
      Guid: "UPI891728937123",
      Source: "UPI",
      Token: "252007727794",
      Format: "0"
    }
  },
  {
    id: "aadhar-get-token",
    name: "Aadhar Vault - Get Token",
    method: "POST",
    path: "https://osbuat.aubankuat.in/AadharVaultServiceNewV1/AadharVault/getToken",
    category: "Customer",
    description: "Get token for Aadhar value",
    requiresAuth: true,
    sampleRequest: {
      naeUser: "uat_testing",
      naePassword: "6b33c0dfd*********",
      dbUser: "ADV_ADMIN",
      dbPassword: "7f0faf1975*******",
      value: "6556****",
      tableName: "UAT_VAULT1"
    }
  },
  {
    id: "cibil-service",
    name: "CIBIL Service",
    method: "POST",
    path: "https://osbuat.aubankuat.in/AadharVaultServiceNewV1/AadharVault/insertToken",
    category: "Customer",
    description: "Perform CIBIL score inquiry for customer",
    requiresAuth: true,
    sampleRequest: {
      RequestId: "REQ123456789",
      OriginatingChannel: "API",
      SolutionSetId: "CIBIL001",
      ExecutionMode: "ONLINE",
      ApplicantFirstName: "John",
      ApplicantLastName: "Doe",
      DateOfBirth: "19900115",
      Gender: "2",
      IdNumber: "ABCDE1234F",
      IdType: "01",
      TelephoneNumber: "9876543210",
      AddressLine3: "123 Main Street, City"
    }
  },
  {
    id: "cif-creation",
    name: "CIF Creation Service",
    method: "POST",
    path: "https://api.aubankuat.in/crm/CRMCustomerAccountCreationRestService/Create",
    category: "Customer",
    description: "Create new customer in CBS system",
    requiresAuth: true,
    sampleRequest: {
      RequestId: "REQ123456789",
      OriginatingChannel: "DECI",
      ReferenceNumber: "2011",
      TransactionBranch: "REQ123456789",
      FirstName: "John",
      LastName: "Doe",
      ShortName: "John D",
      MobileNumber: "9876543210",
      EmailId: "john.doe@example.com",
      Line1: "123 Main Street",
      City: "Mumbai",
      State: "MAHARASHTRA",
      Country: "IN",
      Zip: "400001"
    }
  },
  {
    id: "ckyc-search",
    name: "CKYC Search",
    method: "POST",
    path: "https://api.aubankuat.in/CKYCSearch",
    category: "Customer",
    description: "Search customer in CKYC records",
    requiresAuth: true,
    sampleRequest: {
      RequestId: "REQ123456789",
      Channel: "API",
      SearchCategory: "C",
      Searchinput: "ABCDE1234F"
    }
  },
  {
    id: "customer-360",
    name: "Customer 360 Service",
    method: "POST",
    path: "https://api.aubankuat.in/CBSCustomerService/customer360service",
    category: "Customer",
    description: "Fetch existing customer details by customer ID",
    requiresAuth: true,
    sampleRequest: {
      RequestId: "REQ123456789",
      Channel: "DEC",
      ReferenceNumber: "REF123456789",
      CustomerId: "21970181",
      TransactionBranch: "2011"
    }
  },
  {
    id: "customer-dedupe",
    name: "Customer Dedupe Service",
    method: "POST",
    path: "https://api.aubankuat.in/customerdedupe",
    category: "Customer",
    description: "Find existing customers by mobile, PAN, or Aadhaar",
    requiresAuth: true,
    sampleRequest: {
      RequestId: "REQ123456789",
      Channel: "DEC",
      ReferenceNumber: "REF123456789",
      MobileNumber: "9876543210",
      AadhaarNumber: "",
      PanNumber: "",
      TransactionBranch: "2011"
    }
  },
  {
    id: "customer-image-upload",
    name: "Customer Image Upload Service",
    method: "POST",
    path: "https://api.aubankuat.in/CustomerImageMnt",
    category: "Customer",
    description: "Upload or modify customer image/signature",
    requiresAuth: true,
    sampleRequest: {
      FlgTxnType: "A",
      RequestId: "REQ123456789",
      OriginatingChannel: "CRM",
      ReferenceNumber: "REF123456789",
      TransactionBranch: "9000",
      CustomerId: "27972517",
      CustomerImage: "base64_image_data_here"
    }
  },
  {
    id: "posidex-fetch-ucic",
    name: "POSIDEX - Fetch UCIC",
    method: "POST",
    path: "https://osbuat.aubankuat.in/PosidexFetchService/fetchUcic",
    category: "Customer",
    description: "Fetch customer details from UCIC API",
    requiresAuth: true,
    sampleRequest: {
      Metadata: {
        Request_Id: "FETCH01035328",
        Customer_Id: "",
        SourceSystem: "",
        ApplicantType: "",
        UCIC: "998876543"
      }
    }
  },
  {
    id: "update-customer-details",
    name: "Update Customer Details Service",
    method: "POST",
    path: "https://api.aubankuat.in/cardrestservice/UpdateCustomerDetails",
    category: "Customer",
    description: "Update customer card and personal details",
    requiresAuth: true,
    sampleRequest: {
      RequestId: "REQ123456789",
      Channel: "CRM",
      CardNumber: "6080880152053638",
      Function: "Mobile",
      CIFkey: "123456",
      MobileDetail: {
        HomePhone: "9963731084",
        BusinessPhone: "9963731084",
        AlternatePhone1: "9963731084",
        AlternatePhone2: "9963731084"
      }
    }
  },
  {
    id: "loan-status",
    name: "Loan Status",
    method: "GET",
    path: "https://aubank.tech/uat/loans/{loan_id}/status",
    category: "Loans",
    description: "Check loan application status",
    requiresAuth: true,
    sampleRequest: {
      loan_id: "LOAN123456789",
      include_details: "true"
    }
  }
];

const categoryIcons = {
  Authentication: Shield,
  Payments: CreditCard,
  Accounts: Database,
  KYC: Settings,
  "Bill Payments": CreditCard,
  Cards: CreditCard,
  Loans: Database
};

const categoryImages = {
  Authentication: authImage,
  Payments: paymentsImage,
  Accounts: accountsImage,
  KYC: kycImage,
  "Bill Payments": billPaymentsImage,
  Cards: cardsImage,
  Loans: loansImage
};

export default function Sandbox() {
  // Load API endpoints from backend
  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>(staticApiEndpoints);
  
  useEffect(() => {
    const loadApiEndpoints = async () => {
      try {
        const response = await fetch('/api/apis');
        if (response.ok) {
          const backendApis = await response.json();
          if (backendApis.length > 0) {
            // Transform backend APIs to sandbox format
            const transformedApis = backendApis.map((api: any) => ({
              id: api.id,
              name: api.name,
              method: api.method,
              path: api.path.startsWith('http') ? api.path : `https://aubank.tech/uat${api.path}`,
              category: api.category,
              description: api.description,
              requiresAuth: api.requiresAuth,
              sampleRequest: api.requestExample ? JSON.parse(api.requestExample) : {}
            }));
            
            // Combine with static endpoints
            setApiEndpoints([...transformedApis, ...staticApiEndpoints]);
          }
        }
      } catch (error) {
        console.error('Failed to load API endpoints:', error);
        // Fallback to static endpoints
      }
    };
    
    loadApiEndpoints();
  }, []);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint>(apiEndpoints[0]);
  const [requestBody, setRequestBody] = useState("");
  const [requestHeaders, setRequestHeaders] = useState("{\n  \"Content-Type\": \"application/json\",\n  \"Authorization\": \"Bearer your_token_here\"\n}");
  const [pathParams, setPathParams] = useState("{}");
  const [queryParams, setQueryParams] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [response, setResponse] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [testHistory, setTestHistory] = useState<TestHistory[]>([]);
  const [showApiToken, setShowApiToken] = useState(false);
  const [activeTab, setActiveTab] = useState("request");
  
  // Hierarchical navigation state
  const [currentView, setCurrentView] = useState<"groups" | "apis" | "test">("groups");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    handleEndpointChange(selectedEndpoint.id);
  }, [selectedEndpoint]);
  
  // Real-time validation effect
  useEffect(() => {
    if (requestBody.trim() && selectedEndpoint.method !== 'GET') {
      const errors = validateRequestBody(requestBody, selectedEndpoint.id);
      setValidationErrors(errors);
      setShowValidation(errors.length > 0);
    } else {
      setValidationErrors([]);
      setShowValidation(false);
    }
  }, [requestBody, selectedEndpoint]);

  // Navigation helpers
  const getApiGroups = () => {
    const groups = Array.from(new Set(apiEndpoints.map(endpoint => endpoint.category)));
    return groups.sort().map(category => ({
      name: category,
      endpoints: apiEndpoints.filter(endpoint => endpoint.category === category),
      icon: categoryIcons[category as keyof typeof categoryIcons] || Settings
    }));
  };

  const getFilteredEndpoints = (category?: string) => {
    let filtered = apiEndpoints;
    
    if (category) {
      filtered = filtered.filter(endpoint => endpoint.category === category);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(endpoint => 
        endpoint.name.toLowerCase().includes(query) ||
        endpoint.description.toLowerCase().includes(query) ||
        endpoint.path.toLowerCase().includes(query) ||
        endpoint.method.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const addToRecentlyUsed = (endpointId: string) => {
    setRecentlyUsed(prev => {
      const filtered = prev.filter(id => id !== endpointId);
      return [endpointId, ...filtered].slice(0, 5);
    });
  };

  const toggleFavorite = (endpointId: string) => {
    setFavorites(prev => 
      prev.includes(endpointId) 
        ? prev.filter(id => id !== endpointId)
        : [...prev, endpointId]
    );
  };

  const handleGroupSelect = (groupName: string) => {
    setSelectedGroup(groupName);
    setCurrentView("apis");
    setSearchQuery("");
  };

  const handleBackToGroups = () => {
    setCurrentView("groups");
    setSelectedGroup(null);
    setSearchQuery("");
  };

  const handleApiSelect = (endpoint: APIEndpoint) => {
    setSelectedEndpoint(endpoint);
    addToRecentlyUsed(endpoint.id);
    setCurrentView("test");
    handleEndpointChange(endpoint.id);
  };

  const handleBackToApis = () => {
    setCurrentView("apis");
  };

  const handleEndpointChange = (endpointId: string) => {
    const endpoint = apiEndpoints.find(e => e.id === endpointId);
    if (!endpoint) return;
    
    setSelectedEndpoint(endpoint);
    
    // Update request body with sample data
    if (endpoint.sampleRequest) {
      setRequestBody(JSON.stringify(endpoint.sampleRequest, null, 2));
    } else {
      setRequestBody("");
    }

    // Update headers based on endpoint requirements
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    
    if (endpoint.requiresAuth) {
      headers["Authorization"] = `Bearer ${apiToken || "your_token_here"}`;
    }
    
    // Add specific headers for AU Bank APIs
    if (endpoint.category === "Payments") {
      headers["X-Request-ID"] = `req_${Date.now()}`;
    }
    
    setRequestHeaders(JSON.stringify(headers, null, 2));
    
    // Reset path parameters for endpoints that need them
    const pathParamsObj: Record<string, string> = {};
    if (endpoint.path.includes('{payment_id}')) {
      pathParamsObj.payment_id = "pay_1a2b3c4d5e6f";
    }
    if (endpoint.path.includes('{account_id}')) {
      pathParamsObj.account_id = "acc_123456789";
    }
    if (endpoint.path.includes('{transaction_id}')) {
      pathParamsObj.transaction_id = "TXN123456789";
    }
    if (endpoint.path.includes('{payout_id}')) {
      pathParamsObj.payout_id = "PAYOUT987654321";
    }
    setPathParams(JSON.stringify(pathParamsObj, null, 2));
    
    // Set query parameters for GET endpoints with sample data
    if (endpoint.method === "GET" && endpoint.sampleRequest) {
      const queryParamsString = Object.entries(endpoint.sampleRequest)
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join('&');
      setQueryParams(queryParamsString);
    } else {
      setQueryParams("");
    }
    
    setResponse(null);
  };

  const handleTestRequest = async () => {
    if (!selectedEndpoint) return;
    
    // Validate request body before sending
    if (selectedEndpoint.method !== 'GET' && requestBody.trim()) {
      const errors = validateRequestBody(requestBody, selectedEndpoint.id);
      if (errors.length > 0) {
        setValidationErrors(errors);
        setShowValidation(true);
        toast({
          title: "Validation Failed",
          description: `${errors.length} validation error(s) found. Please fix them before testing.`,
          variant: "destructive"
        });
        return;
      }
    }
    
    setLoading(true);
    const startTime = Date.now();
    
    try {
      // Parse path parameters and replace in URL
      let finalUrl = selectedEndpoint.path;
      try {
        const pathParamsObj = JSON.parse(pathParams);
        Object.entries(pathParamsObj).forEach(([key, value]) => {
          finalUrl = finalUrl.replace(`{${key}}`, value as string);
        });
      } catch {
        // Invalid JSON, ignore path params
      }
      
      // Add query parameters
      if (queryParams.trim()) {
        const separator = finalUrl.includes('?') ? '&' : '?';
        finalUrl += separator + queryParams;
      }
      
      // Parse headers
      let headers: Record<string, string> = {};
      try {
        headers = JSON.parse(requestHeaders);
      } catch {
        headers = { "Content-Type": "application/json" };
      }
      
      // Update authorization token if provided
      if (apiToken && selectedEndpoint.requiresAuth) {
        headers["Authorization"] = `Bearer ${apiToken}`;
      }
      
      // Add API key for sandbox authentication
      if (apiToken) {
        headers["X-API-Key"] = apiToken;
      } else {
        // Use a default sandbox API key for testing
        headers["X-API-Key"] = "demo_api_key";
      }
      
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers,
      };
      
      if (selectedEndpoint.method !== 'GET' && requestBody.trim()) {
        options.body = requestBody;
      }
      
      // Simulate API call with mock responses for testing
      const simulatedResponse = await simulateAPICall(selectedEndpoint, options.body);
      const responseTime = Date.now() - startTime;
      
      const apiResponse: APIResponse = {
        status: simulatedResponse.status,
        statusText: simulatedResponse.statusText,
        headers: simulatedResponse.headers,
        data: simulatedResponse.data,
        responseTime,
        timestamp: new Date().toISOString()
      };
      
      setResponse(apiResponse);
      setActiveTab("response");
      
      // Add to test history
      const historyEntry: TestHistory = {
        id: Date.now().toString(),
        endpoint: selectedEndpoint,
        request: {
          headers: headers,
          body: requestBody || null,
          params: pathParams,
          query: queryParams
        },
        response: apiResponse,
        timestamp: new Date().toISOString()
      };
      
      setTestHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
      
      toast({
        title: "API Request Completed",
        description: `${selectedEndpoint.method} ${selectedEndpoint.name} - ${apiResponse.status} (${responseTime}ms)`,
      });
      
    } catch (error) {
      const apiResponse: APIResponse = {
        status: 0,
        statusText: "Network Error",
        headers: {},
        data: { error: "Failed to connect to API endpoint" },
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
      setResponse(apiResponse);
      setActiveTab("response");
      
      toast({
        title: "Request Failed", 
        description: "Unable to connect to API endpoint",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Simulate API responses for all endpoints
  const simulateAPICall = async (endpoint: APIEndpoint, body: any): Promise<any> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
    
    switch (endpoint.id) {
      case "oauth-token":
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: {
            access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdWJhbmtfZGV2ZWxvcGVyIiwiaWF0IjoxNjc4ODg2NDAwLCJleHAiOjE2Nzg4OTAwMDB9.simulated_signature",
            token_type: "Bearer",
            expires_in: 3600,
            client_id: "au_bank_client",
            organization_name: "au-bank-internal"
          }
        };
      
      case "cnb-payment":
        try {
          const paymentData = body ? JSON.parse(body) : {};
          return {
            status: 201,
            statusText: "Created",
            headers: { "Content-Type": "application/json" },
            data: {
              payment_id: "pay_123456789",
              status: "initiated",
              amount: paymentData.amount || "1000.00",
              beneficiary: paymentData.beneName || "Test Beneficiary",
              transaction_ref: "TXN123456789",
              utr_number: "UTR123456789"
            }
          };
        } catch (error) {
          return {
            status: 400,
            statusText: "Bad Request",
            headers: { "Content-Type": "application/json" },
            data: {
              error: "Invalid JSON format in request body",
              message: "Please check your request format and try again"
            }
          };
        }

      case "payment-enquiry":
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: {
            payment_id: "pay_123456789",
            status: "success",
            amount: "1000.00",
            beneficiary: "Test Beneficiary",
            transaction_ref: "TXN123456789",
            utr_number: "UTR123456789",
            completed_at: "2024-12-01T10:35:20Z"
          }
        };

      case "customer-dedupe":
        const existingCustomer = Math.random() > 0.7;
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: existingCustomer ? {
            MatchFound: [{
              CustomerResponse: {
                CustomerBasicInquiry: {
                  CustomerFullName: "Pradeep Singh",
                  CustomerId: 23689739,
                  MobileNumber: "8223072358"
                }
              }
            }]
          } : {
            MatchFound: []
          }
        };

      case "account-balance":
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: {
            account_id: "acc_123456789",
            account_number: "****1234",
            balance: {
              available: 25750.50,
              ledger: 26000.00,
              currency: "INR"
            },
            last_updated: new Date().toISOString(),
            status: "ACTIVE"
          }
        };

      case "account-transactions":
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: {
            account_id: "acc_123456789",
            transactions: [
              {
                transaction_id: "txn_001",
                type: "CREDIT",
                amount: 5000.00,
                description: "Salary Credit",
                date: "2024-12-01",
                balance_after: 25750.50
              }
            ],
            pagination: {
              page: 1,
              total_pages: 5,
              total_transactions: 47
            }
          }
        };

      case "corporate-registration":
        return {
          status: 201,
          statusText: "Created",
          headers: { "Content-Type": "application/json" },
          data: {
            application_id: "app_corp_123456789",
            status: "under_review",
            company_name: "Tech Solutions Pvt Ltd",
            business_type: "Private Limited",
            registration_number: "CIN123456789",
            contact_email: "contact@techsolutions.com",
            contact_phone: "+919876543210",
            estimated_approval_time: "3-5 business days",
            submitted_at: new Date().toISOString(),
            reference_id: "REFABC123DEF"
          }
        };

      case "fund-transfer":
        return {
          status: 201,
          statusText: "Created",
          headers: { "Content-Type": "application/json" },
          data: {
            transfer_id: `FT${Date.now()}`,
            status: "INITIATED",
            amount: "5000.00",
            currency: "INR",
            reference_number: `REF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            estimated_completion: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            timestamp: new Date().toISOString(),
            message: "Fund transfer initiated successfully (simulated)"
          }
        };

      case "bulk-payment":
        return {
          status: 201,
          statusText: "Created",
          headers: { "Content-Type": "application/json" },
          data: {
            batch_id: `BATCH${Date.now()}`,
            total_payments: 10,
            successful_payments: 9,
            failed_payments: 1,
            status: "PROCESSING",
            created_at: new Date().toISOString(),
            message: "Bulk payment batch created successfully (simulated)"
          }
        };

      case "payment-status":
        const statuses = ["INITIATED", "PROCESSING", "COMPLETED", "FAILED"];
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: {
            payment_id: "pay_123456789",
            status: statuses[Math.floor(Math.random() * statuses.length)],
            amount: "1000.00",
            currency: "INR",
            created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            completed_at: new Date().toISOString(),
            message: "Simulated payment status response"
          }
        };

      case "vam-create":
        return {
          status: 201,
          statusText: "Created",
          headers: { "Content-Type": "application/json" },
          data: {
            vam_id: "VAM123456789012",
            virtual_account_number: "VA123456789012",
            customer_id: "cust_789",
            purpose: "collection",
            status: "ACTIVE",
            valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString()
          }
        };

      case "vam-transactions":
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: {
            vam_id: "VAM123456789012",
            transactions: [{
              transaction_id: "TXN789012345",
              amount: 5000.00,
              currency: "INR",
              transaction_date: new Date().toISOString(),
              remitter_name: "John Doe",
              remitter_account: "9876543210987",
              utr_number: "UTR123456789"
            }],
            total_amount: 5000.00,
            transaction_count: 1,
            from_date: "2024-11-01",
            to_date: "2024-11-30"
          }
        };

      case "loan-application":
        return {
          status: 201,
          statusText: "Created",
          headers: { "Content-Type": "application/json" },
          data: {
            application_id: `LOAN${Date.now()}`,
            status: "SUBMITTED",
            loan_type: "PERSONAL",
            amount: "500000.00",
            interest_rate: "9.5%",
            estimated_approval_time: "7-10 business days",
            submitted_at: new Date().toISOString(),
            message: "Loan application submitted successfully (simulated)"
          }
        };

      case "loan-status":
        const loanStatuses = ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED"];
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: {
            application_id: "LOAN123456789",
            status: loanStatuses[Math.floor(Math.random() * loanStatuses.length)],
            loan_amount: "500000.00",
            approved_amount: "450000.00",
            interest_rate: "9.5%",
            tenure: "60 months",
            last_updated: new Date().toISOString(),
            message: "Simulated loan status response"
          }
        };

      case "card-application":
        return {
          status: 201,
          statusText: "Created",
          headers: { "Content-Type": "application/json" },
          data: {
            application_id: `CARD${Date.now()}`,
            status: "SUBMITTED",
            card_type: "PREMIUM_CREDIT",
            estimated_approval_time: "5-7 business days",
            submitted_at: new Date().toISOString(),
            reference_number: `CREF${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
            message: "Card application submitted successfully (simulated)"
          }
        };

      case "card-status":
        const cardStatuses = ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "CARD_DISPATCHED"];
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: {
            application_id: "CARD123456789",
            status: cardStatuses[Math.floor(Math.random() * cardStatuses.length)],
            card_type: "PREMIUM_CREDIT",
            credit_limit: "200000.00",
            card_number: "****-****-****-1234",
            dispatch_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            last_updated: new Date().toISOString(),
            message: "Simulated card status response"
          }
        };

      // Customer API endpoints
      case "customer-360":
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: {
            TransactionStatus: {
              ResponseCode: "0",
              ResponseMessage: "Success",
              ExtendedErrorDetails: {
                messages: [
                  { code: "0" }
                ]
              }
            },
            isSpecifiedCustomer: "N",
            CustomerResponse: {
              CustomerBasicInquiry: {
                CustomerFullName: "KIRTI DOSHI",
                IsSignatureAvailable: "false",
                Sex: "M",
                IsImageAvailable: "false",
                AadhaarDetail: {
                  AadhaarLinkAccount: "1712232110048131",
                  AadhaarNumber: "475711812435"
                },
                CustomerId: "22100033",
                CategoryType: "INDIVIDUAL - FULL KYC",
                CustomerType: "100",
                EmailAddress: "roshanchaudhari239@gmail.com",
                IcTypeDesc: "Lead Number",
                OfficerID: "First teller",
                AgeOfCustRel: "2017-05-04",
                MobileNumber: "7507396305",
                AadharUpdateDate: "2025-07-10",
                NationalIdentificationCode: "22100033",
                BankShortName: "Mandsaur",
                IcType: "L",
                FlgInoperativePan: "N",
                CustomerName: {
                  MidName: "DOSHI",
                  FirstName: "KIRTI",
                  FullName: "KIRTI DOSHI",
                  FormattedFullName: "KIRTI#DOSHI#",
                  ShortName: "KIRTI DOSHI",
                  Prefix: "MR."
                },
                HomeBranch: "2321",
                PAN: "BJHPF5346G",
                CombWithdrawBal: "829761.69",
                CustomerAddress: {
                  Zip: "458001",
                  State: "MADHYA PRADESH",
                  Country: "India",
                  City: "MANDSAUR",
                  Line1: "22100033",
                  Line2: "22100033",
                  Line3: "22100033"
                },
                BirthDateText: "1984-01-19"
              }
            },
            AccountDetails: {
              IsCustomerSchemeAvailable: "false",
              CustomerAccount: [
                {
                  SafeDepositBoxId: "0",
                  AccountId: "1712232110048131",
                  ProductName: "20122-AU Employee Salary Account-Maximum",
                  DateRelation: "2017-05-04",
                  BalCombinedAcy: "804761.69",
                  OtherArrear: "0",
                  ExternalAccountId: "0",
                  CurrencyCode: "1",
                  ODLimitSactioned: "0",
                  AvailableBalance: "804761.69",
                  BalUncollectedInt: "0.00",
                  IsTDLinkage: "N ",
                  TotalAcyAmount: "924269.69",
                  Classification: "NORMAL",
                  TotalLcyAmount: "924269.69",
                  BranchName: "Mandsaur",
                  MonthsSinceActive: "100",
                  BalUncollectedPrinc: "0.00",
                  OperationMode: "SINGLYnull",
                  TotalBalUncollecPrinc: "0.00",
                  BalPrincipal: "0",
                  CurrencyShortName: "INR",
                  AmtGoal: "0",
                  ProductCode: "20122",
                  DateAccountOpen: "2017-05-04",
                  InstallmentAmount: "0",
                  IntRate: "0",
                  CustomerRelationship: "SOW",
                  LienAmount: "0",
                  BranchCode: "2321",
                  BalanceBook: "804761.69",
                  TotalBalBook: "924269.69",
                  UnclearFunds: "0.00",
                  AcyAmount: "804761.69",
                  Reason: "UNBLOCKED ",
                  OriginalBalance: "0.00",
                  Tenure: "0 Months 0 Days 0 Years ",
                  ODLimitUtilized: "0",
                  SmallClearingAccountNo: "000004",
                  CurrentStatusDescription: "ACCOUNT OPEN REGULAR",
                  CASAAccountName: "KIRTI DOSHI .",
                  DateValue: "2017-05-04",
                  FutureDatedAmount: "0.00",
                  NomineeName: "RAJSHRI DOSHI",
                  BalCombinedLcy: "804761.69",
                  BillAmount: "0.00",
                  CurrentStatus: "8",
                  LcyAmount: "804761.69",
                  CASARelationshipDetails: [
                    {
                      JointHolderName: "KIRTI DOSHI",
                      MobileNo: "7507396305",
                      Emailid: "roshanchaudhari239@gmail.com",
                      Relationship: "SOW",
                      CustomerId: "22100033"
                    }
                  ],
                  ModuleCode: "C",
                  HoldAmount: "0",
                  TotalBalUncollecInt: "0.00"
                }
              ]
            }
          }
        };
        
      case "customer-image-upload":
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: { TransactionStatus: { ResponseCode: "0", ResponseMessage: "Success" } }
        };
        
      case "posidex-fetch-ucic":
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: {
            Results: { 
              Customer: [{ 
                Demographics: { 
                  UCIC: "998876543", 
                  Gender: "M", 
                  Name: "John Doe" 
                } 
              }] 
            }
          }
        };
        
      case "update-customer-details":
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: { TransactionStatus: { ResponseCode: "0", ResponseMessage: "Success" } }
        };
        
      case "ckyc-search":
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: { 
            message: "Success", 
            error_cd: "000", 
            ckyc_data: [{ 
              ckyc_number: "123456789", 
              full_name: "John Doe", 
              father_name: "Richard Doe" 
            }] 
          }
        };
        
      case "aadhar-insert-token":
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: { token: "664587294422" }
        };
        
      case "aadhar-get-value":
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: { value: "655645354422" }
        };
        
      case "aadhar-get-token":
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: { token: "generated_token_value" }
        };
        
      case "cibil-service":
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: { 
            score: 750, 
            report: "detailed_cibil_report", 
            status: "success" 
          }
        };
        
      case "cif-creation":
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: { 
            ResponseCode: "0", 
            ResponseMessage: "Success", 
            AccountKey: "22658666" 
          }
        };
      
      default:
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: { 
            status: "success",
            message: `Response for ${endpoint.name}`,
            endpoint_id: endpoint.id,
            timestamp: new Date().toISOString()
          }
        };
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const formatJson = (obj: any) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return obj?.toString() || "";
    }
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status >= 400 && status < 500) return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    if (status >= 500) return <XCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-gray-500" />;
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-600 dark:text-green-400";
    if (status >= 400 && status < 500) return "text-yellow-600 dark:text-yellow-400";
    if (status >= 500) return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Settings;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-25 dark:from-neutrals-900 dark:via-purple-950/20 dark:to-neutrals-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header - Only show Back to Home on main groups view */}
        {currentView === "groups" && (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-[var(--au-primary)]/10 hover:text-[var(--au-primary)]"
                  data-testid="button-back-home"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <Badge 
              className="text-sm bg-[var(--au-primary)]/10 text-[var(--au-primary)] border-[var(--au-primary)]/20"
            >
              Sandbox Environment
            </Badge>
          </div>
        )}

        {/* Main Content */}
        {currentView === "groups" && (
          <div className="space-y-6">
            {/* API Groups Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--au-primary)] to-purple-600 bg-clip-text text-transparent mb-4">
                Choose API Category
              </h2>
              <p className="text-lg text-neutrals-600 dark:text-neutrals-400">
                Select a category to explore {apiEndpoints.length} available API endpoints
              </p>
            </div>

            {/* API Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getApiGroups().map(group => {
                const IconComponent = group.icon;
                const groupImage = categoryImages[group.name as keyof typeof categoryImages];
                return (
                  <Card 
                    key={group.name}
                    className="cursor-pointer hover:shadow-xl hover:shadow-[var(--au-primary)]/20 transition-all duration-300 hover:scale-105 border-2 hover:border-[var(--au-primary)]/30 bg-gradient-to-br from-white to-purple-50/30 dark:from-neutrals-800 dark:to-purple-950/10 overflow-hidden"
                    onClick={() => handleGroupSelect(group.name)}
                    data-testid={`card-group-${group.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {/* Category Image */}
                    <div className="relative h-32 w-full overflow-hidden">
                      <img 
                        src={groupImage} 
                        alt={`${group.name} illustration`}
                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
                      <div className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center shadow-md">
                        <IconComponent className="w-5 h-5 text-[var(--au-primary)]" />
                      </div>
                    </div>
                    
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl text-[var(--au-primary)] font-bold">{group.name}</CardTitle>
                      <CardDescription className="text-purple-600/70 font-medium">
                        {group.endpoints.length} API{group.endpoints.length !== 1 ? 's' : ''} available
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {group.endpoints.slice(0, 3).map(endpoint => (
                          <div key={endpoint.id} className="flex items-center gap-2 text-sm">
                            <Badge 
                              variant="outline" 
                              className="text-xs px-1 border-[var(--au-primary)]/30 text-[var(--au-primary)]"
                            >
                              {endpoint.method}
                            </Badge>
                            <span className="truncate text-purple-700 dark:text-purple-300">{endpoint.name}</span>
                          </div>
                        ))}
                        {group.endpoints.length > 3 && (
                          <div className="text-xs text-purple-500 font-medium">
                            +{group.endpoints.length - 3} more...
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {currentView === "apis" && selectedGroup && (
          <div className="space-y-6">
            {/* APIs Header with Back Button */}
            <div className="flex items-center justify-between mb-8">
              <Button 
                variant="ghost" 
                onClick={handleBackToGroups}
                className="hover:bg-[var(--au-primary)]/10 hover:text-[var(--au-primary)]"
                data-testid="button-back-to-groups"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
              <Badge 
                className="text-sm bg-[var(--au-primary)]/10 text-[var(--au-primary)] border-[var(--au-primary)]/20"
              >
                Sandbox Environment
              </Badge>
            </div>

            {/* Page Title */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--au-primary)] to-purple-600 bg-clip-text text-transparent">
                {selectedGroup} APIs
              </h2>
              <p className="text-lg text-purple-600/70 font-medium">
                {getFilteredEndpoints(selectedGroup).length} endpoints available
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md">
              <Input
                placeholder="Search APIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-[var(--au-primary)]/20 focus:border-[var(--au-primary)] focus:ring-[var(--au-primary)]/20"
                data-testid="input-search-apis"
              />
            </div>

            {/* API Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getFilteredEndpoints(selectedGroup).map(endpoint => (
                <Card 
                  key={endpoint.id}
                  className="cursor-pointer hover:shadow-xl hover:shadow-[var(--au-primary)]/15 transition-all duration-300 hover:scale-[1.02] border hover:border-[var(--au-primary)]/30 bg-gradient-to-br from-white to-purple-50/20 dark:from-neutrals-800 dark:to-purple-950/5"
                  onClick={() => handleApiSelect(endpoint)}
                  data-testid={`card-api-${endpoint.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getCategoryIcon(endpoint.category)}
                          {endpoint.name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {endpoint.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={endpoint.method === 'GET' ? 'secondary' : 'default'}
                          className="text-xs"
                        >
                          {endpoint.method}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(endpoint.id);
                          }}
                          className="h-6 w-6 p-0"
                          data-testid={`button-favorite-${endpoint.id}`}
                        >
                          <Star 
                            className={`w-4 h-4 ${
                              favorites.includes(endpoint.id) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground font-mono bg-muted/50 p-2 rounded">
                        {endpoint.path}
                      </div>
                      {endpoint.requiresAuth && (
                        <Badge variant="outline" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Auth Required
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentView === "test" && (
          <div className="space-y-6">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={handleBackToApis}
                className="hover:bg-[var(--au-primary)]/10 hover:text-[var(--au-primary)]"
                data-testid="button-back-to-apis"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {selectedGroup} APIs
              </Button>
              <Badge 
                className="text-sm bg-[var(--au-primary)]/10 text-[var(--au-primary)] border-[var(--au-primary)]/20"
              >
                API Testing Environment
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Panel - API Configuration */}
              <div className="lg:col-span-1 space-y-6">
                {/* Selected API Info */}
                <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-lg" data-testid="card-selected-api">
                  <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100 border-b border-purple-200">
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <div className="p-1 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                        {getCategoryIcon(selectedEndpoint.category)}
                      </div>
                      Selected API
                    </CardTitle>
                  </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium text-purple-900">{selectedEndpoint.name}</h3>
                      <p className="text-sm text-purple-600">
                        {selectedEndpoint.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${
                        selectedEndpoint.method === 'GET' ? 'bg-blue-600 text-white' :
                        selectedEndpoint.method === 'POST' ? 'bg-green-600 text-white' :
                        selectedEndpoint.method === 'PUT' ? 'bg-orange-600 text-white' :
                        'bg-red-600 text-white'
                      }`}>
                        {selectedEndpoint.method}
                      </Badge>
                      <Badge variant="outline" className="border-purple-300 text-purple-700">{selectedEndpoint.category}</Badge>
                    </div>
                    <div className="text-xs font-mono bg-purple-100 text-purple-800 p-2 rounded border border-purple-200">
                      {selectedEndpoint.path}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* API Configuration */}
              {selectedEndpoint.requiresAuth && (
                <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-lg" data-testid="card-auth-token">
                  <CardHeader className="bg-gradient-to-r from-amber-100 to-yellow-100 border-b border-amber-200">
                    <CardTitle className="flex items-center gap-2 text-amber-800">
                      <div className="p-1 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      Authentication
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Label htmlFor="api-token">API Token</Label>
                      <div className="flex gap-2">
                        <Input
                          id="api-token"
                          type={showApiToken ? "text" : "password"}
                          placeholder="Enter your API token"
                          value={apiToken}
                          onChange={(e) => setApiToken(e.target.value)}
                          data-testid="input-api-token"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowApiToken(!showApiToken)}
                          data-testid="button-toggle-token-visibility"
                        >
                          {showApiToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Panel - Request/Response */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-xl" data-testid="card-api-test">
                <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100 border-b border-purple-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-purple-800">API Test Configuration</CardTitle>
                    <Button
                      onClick={handleTestRequest}
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      data-testid="button-test-api"
                    >
                      {loading ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Test API
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="tabs-api-test">
                    <TabsList className="grid w-full grid-cols-4 bg-purple-100 border border-purple-200">
                      <TabsTrigger value="request" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-purple-700" data-testid="tab-request">Request</TabsTrigger>
                      <TabsTrigger value="headers" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-purple-700" data-testid="tab-headers">Headers</TabsTrigger>
                      <TabsTrigger value="parameters" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-purple-700" data-testid="tab-parameters">Parameters</TabsTrigger>
                      <TabsTrigger value="response" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-purple-700" data-testid="tab-response">Response</TabsTrigger>
                    </TabsList>

                    <TabsContent value="request" className="space-y-4">
                      <div>
                        <Label htmlFor="request-body">Request Body</Label>
                        <Textarea
                          id="request-body"
                          placeholder="Enter JSON request body..."
                          value={requestBody}
                          onChange={(e) => setRequestBody(e.target.value)}
                          rows={12}
                          className={`font-mono text-sm ${showValidation && validationErrors.length > 0 ? 'border-[var(--au-primary)]' : ''}`}
                          data-testid="textarea-request-body"
                        />
                        
                        {/* Validation Errors Display */}
                        {showValidation && validationErrors.length > 0 && (
                          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                            <div className="flex items-center mb-2">
                              <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                              <span className="text-sm font-medium text-red-800">
                                Validation Errors ({validationErrors.length})
                              </span>
                            </div>
                            <ul className="space-y-1">
                              {validationErrors.map((error, index) => (
                                <li key={index} className="text-sm text-red-700 flex items-start">
                                  <span className="font-mono text-[var(--au-primary)] mr-2">{error.field}:</span>
                                  <span>{error.message}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Field Documentation Helper */}
                        {validationSchemas[selectedEndpoint.id] && (
                          <div className="mt-4 p-3 bg-[var(--au-bg-soft-1)] border border-[var(--au-primary-200)] rounded-md">
                            <div className="flex items-center mb-2">
                              <AlertCircle className="w-4 h-4 text-[var(--au-primary)] mr-2" />
                              <span className="text-sm font-medium text-[var(--au-primary-700)]">
                                Field Requirements
                              </span>
                            </div>
                            <div className="grid grid-cols-1 gap-2 text-xs">
                              {validationSchemas[selectedEndpoint.id].map((field, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-[var(--au-primary-100)]">
                                  <div className="flex items-center">
                                    <span className={`font-mono mr-2 ${field.required ? 'text-[var(--au-primary)]' : 'text-[var(--au-primary-500)]'}`}>
                                      {field.name}
                                    </span>
                                    <Badge 
                                      variant={field.required ? "default" : "secondary"} 
                                      className={`text-xs ${field.required ? 'bg-[var(--au-primary)] text-white' : 'bg-[var(--au-bg-soft-2)] text-[var(--au-primary-600)]'}`}
                                    >
                                      {field.required ? "Required" : "Optional"}
                                    </Badge>
                                  </div>
                                  <span className="text-[var(--au-primary-600)]">{field.type}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="headers" className="space-y-4">
                      <div>
                        <Label htmlFor="request-headers">Request Headers</Label>
                        <Textarea
                          id="request-headers"
                          placeholder="Enter headers as JSON..."
                          value={requestHeaders}
                          onChange={(e) => setRequestHeaders(e.target.value)}
                          rows={8}
                          className="font-mono text-sm"
                          data-testid="textarea-request-headers"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="parameters" className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="path-params">Path Parameters</Label>
                          <Textarea
                            id="path-params"
                            placeholder='{"param1": "value1"}'
                            value={pathParams}
                            onChange={(e) => setPathParams(e.target.value)}
                            rows={4}
                            className="font-mono text-sm"
                            data-testid="textarea-path-params"
                          />
                        </div>
                        <div>
                          <Label htmlFor="query-params">Query Parameters</Label>
                          <Input
                            id="query-params"
                            placeholder="param1=value1&param2=value2"
                            value={queryParams}
                            onChange={(e) => setQueryParams(e.target.value)}
                            data-testid="input-query-params"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="response" className="space-y-4">
                      {response ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(response.status)}
                              <span className={`font-mono text-sm ${getStatusColor(response.status)}`}>
                                {response.status} {response.statusText}
                              </span>
                              <Badge className="text-xs bg-green-100 text-green-700 border-green-300">
                                {response.responseTime}ms
                              </Badge>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-purple-300 text-purple-700 hover:bg-purple-100"
                              onClick={() => copyToClipboard(formatJson(response.data), "Response")}
                              data-testid="button-copy-response"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </Button>
                          </div>
                          <div>
                            <Label>Response Body</Label>
                            <Textarea
                              value={formatJson(response.data)}
                              readOnly
                              rows={12}
                              className="font-mono text-sm bg-gradient-to-br from-gray-50 to-purple-50 border-purple-200"
                              data-testid="textarea-response-body"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-purple-500">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                            <Clock className="w-8 h-8 text-purple-600" />
                          </div>
                          <p className="text-purple-700 font-medium">No response yet. Click "Test API" to see results.</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}