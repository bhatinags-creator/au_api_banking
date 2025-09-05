import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Copy, 
  ChevronDown, 
  ChevronRight, 
  Play, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Shield,
  Building2,
  CreditCard,
  Database,
  FileCheck,
  Users,
  Lock,
  Layers,
  BookOpen,
  Settings,
  Key,
  Banknote
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface APICategory {
  id: string;
  title: string;
  icon: any;
  description: string;
  endpoints: APIEndpoint[];
  subcategories?: APISubcategory[];
}

interface APISubcategory {
  id: string;
  title: string;
  endpoints: APIEndpoint[];
}

interface APIEndpoint {
  id: string;
  method: string;
  path: string;
  title: string;
  description: string;
  parameters?: Parameter[];
  requestBody?: any;
  responses: Response[];
  examples: Example[];
  security?: SecurityRequirement[];
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

interface Response {
  status: number;
  description: string;
  example?: any;
}

interface Example {
  title: string;
  request?: any;
  response?: any;
  curl?: string;
}

interface SecurityRequirement {
  type: string;
  description: string;
}

const apiCategories: APICategory[] = [
  {
    id: "introduction",
    title: "Introduction",
    icon: BookOpen,
    description: "Getting started with AU Bank APIs",
    endpoints: []
  },
  {
    id: "security",
    title: "Security",
    icon: Shield,
    description: "Authentication and security protocols",
    endpoints: [
      {
        id: "encryption",
        method: "POST",
        path: "/security/encrypt",
        title: "Encryption",
        description: "Encrypt sensitive data using AES-256 encryption",
        security: [{ type: "API Key", description: "API Key required in header" }],
        parameters: [
          { name: "data", type: "string", required: true, description: "Data to encrypt", example: "sensitive_information" },
          { name: "algorithm", type: "string", required: false, description: "Encryption algorithm", example: "AES-256" }
        ],
        responses: [
          { 
            status: 200, 
            description: "Successfully encrypted data",
            example: { encrypted_data: "3f4h5g6j7k8l9m0n", encryption_key: "abc123def456" }
          }
        ],
        examples: [{
          title: "Basic Encryption",
          request: { data: "sensitive_data", algorithm: "AES-256" },
          response: { encrypted_data: "3f4h5g6j7k8l9m0n", encryption_key: "abc123def456" },
          curl: `curl -X POST "https://api.aubank.in/security/encrypt" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"data": "sensitive_data", "algorithm": "AES-256"}'`
        }]
      },
      {
        id: "test-api",
        method: "GET",
        path: "/security/test",
        title: "Test API",
        description: "Test API connectivity and authentication",
        security: [{ type: "API Key", description: "API Key required in header" }],
        parameters: [],
        responses: [
          { 
            status: 200, 
            description: "API connection successful",
            example: { status: "success", message: "API is working", timestamp: "2024-12-01T10:30:00Z" }
          }
        ],
        examples: [{
          title: "Test Connection",
          response: { status: "success", message: "API is working", timestamp: "2024-12-01T10:30:00Z" },
          curl: `curl -X GET "https://api.aubank.in/security/test" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
        }]
      },
      {
        id: "decryption",
        method: "POST",
        path: "/security/decrypt",
        title: "Decryption",
        description: "Decrypt encrypted data using provided encryption key",
        security: [{ type: "API Key", description: "API Key required in header" }],
        parameters: [
          { name: "encrypted_data", type: "string", required: true, description: "Encrypted data to decrypt", example: "3f4h5g6j7k8l9m0n" },
          { name: "encryption_key", type: "string", required: true, description: "Encryption key", example: "abc123def456" }
        ],
        responses: [
          { 
            status: 200, 
            description: "Successfully decrypted data",
            example: { decrypted_data: "sensitive_information" }
          }
        ],
        examples: [{
          title: "Basic Decryption",
          request: { encrypted_data: "3f4h5g6j7k8l9m0n", encryption_key: "abc123def456" },
          response: { decrypted_data: "sensitive_information" },
          curl: `curl -X POST "https://api.aubank.in/security/decrypt" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"encrypted_data": "3f4h5g6j7k8l9m0n", "encryption_key": "abc123def456"}'`
        }]
      }
    ]
  },
  {
    id: "building-blocks",
    title: "Building Blocks",
    icon: Building2,
    description: "Essential APIs for core banking operations",
    endpoints: [],
    subcategories: [
      {
        id: "customer-auth",
        title: "Customer Authentication",
        endpoints: [
          {
            id: "otp-generation",
            method: "POST",
            path: "/auth/otp/generate",
            title: "OTP Generation",
            description: "Generate One-Time Password for customer authentication",
            security: [{ type: "API Key", description: "API Key required in header" }],
            parameters: [
              { name: "mobile_number", type: "string", required: true, description: "Customer mobile number", example: "+919876543210" },
              { name: "purpose", type: "string", required: true, description: "Purpose of OTP", example: "authentication" }
            ],
            responses: [
              { 
                status: 200, 
                description: "OTP generated successfully",
                example: { otp_id: "otp_123456", expires_in: 300, message: "OTP sent successfully" }
              }
            ],
            examples: [{
              title: "Generate OTP",
              request: { mobile_number: "+919876543210", purpose: "authentication" },
              response: { otp_id: "otp_123456", expires_in: 300, message: "OTP sent successfully" },
              curl: `curl -X POST "https://api.aubank.in/auth/otp/generate" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"mobile_number": "+919876543210", "purpose": "authentication"}'`
            }]
          },
          {
            id: "otp-verification",
            method: "POST",
            path: "/auth/otp/verify",
            title: "OTP Verification",
            description: "Verify One-Time Password for customer authentication",
            security: [{ type: "API Key", description: "API Key required in header" }],
            parameters: [
              { name: "otp_id", type: "string", required: true, description: "OTP ID from generation", example: "otp_123456" },
              { name: "otp_code", type: "string", required: true, description: "6-digit OTP code", example: "123456" }
            ],
            responses: [
              { 
                status: 200, 
                description: "OTP verified successfully",
                example: { verified: true, customer_id: "cust_789", access_token: "token_abc123" }
              }
            ],
            examples: [{
              title: "Verify OTP",
              request: { otp_id: "otp_123456", otp_code: "123456" },
              response: { verified: true, customer_id: "cust_789", access_token: "token_abc123" },
              curl: `curl -X POST "https://api.aubank.in/auth/otp/verify" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"otp_id": "otp_123456", "otp_code": "123456"}'`
            }]
          },
          {
            id: "fetch-pan-details",
            method: "POST",
            path: "/auth/pan/details",
            title: "Fetch PAN Details",
            description: "Fetch customer details using PAN number",
            security: [{ type: "API Key", description: "API Key required in header" }],
            parameters: [
              { name: "pan_number", type: "string", required: true, description: "PAN number", example: "ABCDE1234F" },
              { name: "consent", type: "boolean", required: true, description: "Customer consent", example: "true" }
            ],
            responses: [
              { 
                status: 200, 
                description: "PAN details fetched successfully",
                example: { name: "John Doe", pan_number: "ABCDE1234F", status: "valid", verified: true }
              }
            ],
            examples: [{
              title: "Fetch PAN Details",
              request: { pan_number: "ABCDE1234F", consent: true },
              response: { name: "John Doe", pan_number: "ABCDE1234F", status: "valid", verified: true },
              curl: `curl -X POST "https://api.aubank.in/auth/pan/details" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"pan_number": "ABCDE1234F", "consent": true}'`
            }]
          }
        ]
      },
      {
        id: "document-upload",
        title: "Document Upload",
        endpoints: [
          {
            id: "document-upload",
            method: "POST",
            path: "/documents/upload",
            title: "Document Upload",
            description: "Upload customer documents for verification",
            security: [{ type: "API Key", description: "API Key required in header" }],
            parameters: [
              { name: "document_type", type: "string", required: true, description: "Type of document", example: "aadhar" },
              { name: "file", type: "file", required: true, description: "Document file (PDF/JPG/PNG)", example: "document.pdf" },
              { name: "customer_id", type: "string", required: true, description: "Customer identifier", example: "cust_789" }
            ],
            responses: [
              { 
                status: 200, 
                description: "Document uploaded successfully",
                example: { document_id: "doc_456", status: "uploaded", verification_status: "pending" }
              }
            ],
            examples: [{
              title: "Upload Document",
              request: { document_type: "aadhar", customer_id: "cust_789" },
              response: { document_id: "doc_456", status: "uploaded", verification_status: "pending" },
              curl: `curl -X POST "https://api.aubank.in/documents/upload" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "document_type=aadhar" \\
  -F "customer_id=cust_789" \\
  -F "file=@document.pdf"`
            }]
          }
        ]
      }
    ]
  },
  {
    id: "payments",
    title: "Payments",
    icon: CreditCard,
    description: "Payment processing and transaction APIs",
    endpoints: [],
    subcategories: [
      {
        id: "upi",
        title: "UPI 2.0",
        endpoints: [
          {
            id: "validate-vpa",
            method: "POST",
            path: "/upi/validate-vpa",
            title: "Validate Virtual Address",
            description: "Validate UPI Virtual Payment Address (VPA)",
            security: [{ type: "OAuth Token", description: "OAuth 2.0 access token required" }],
            parameters: [
              { name: "vpa", type: "string", required: true, description: "Virtual Payment Address", example: "user@aubank" },
              { name: "merchant_id", type: "string", required: true, description: "Merchant identifier", example: "merchant_123" }
            ],
            responses: [
              { 
                status: 200, 
                description: "VPA validation successful",
                example: { valid: true, account_holder: "John Doe", bank: "AU Small Finance Bank" }
              }
            ],
            examples: [{
              title: "Validate VPA",
              request: { vpa: "user@aubank", merchant_id: "merchant_123" },
              response: { valid: true, account_holder: "John Doe", bank: "AU Small Finance Bank" },
              curl: `curl -X POST "https://api.aubank.in/upi/validate-vpa" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"vpa": "user@aubank", "merchant_id": "merchant_123"}'`
            }]
          },
          {
            id: "pay-to-vpa",
            method: "POST",
            path: "/upi/pay",
            title: "Pay To Virtual Address",
            description: "Initiate payment to a UPI Virtual Payment Address",
            security: [{ type: "OAuth Token", description: "OAuth 2.0 access token required" }],
            parameters: [
              { name: "payer_vpa", type: "string", required: true, description: "Payer VPA", example: "payer@aubank" },
              { name: "payee_vpa", type: "string", required: true, description: "Payee VPA", example: "payee@upi" },
              { name: "amount", type: "number", required: true, description: "Payment amount", example: "100.00" },
              { name: "note", type: "string", required: false, description: "Payment note", example: "Payment for services" }
            ],
            responses: [
              { 
                status: 200, 
                description: "Payment initiated successfully",
                example: { transaction_id: "txn_789", status: "initiated", amount: 100.00, timestamp: "2024-12-01T10:30:00Z" }
              }
            ],
            examples: [{
              title: "UPI Payment",
              request: { payer_vpa: "payer@aubank", payee_vpa: "payee@upi", amount: 100.00, note: "Payment for services" },
              response: { transaction_id: "txn_789", status: "initiated", amount: 100.00, timestamp: "2024-12-01T10:30:00Z" },
              curl: `curl -X POST "https://api.aubank.in/upi/pay" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"payer_vpa": "payer@aubank", "payee_vpa": "payee@upi", "amount": 100.00, "note": "Payment for services"}'`
            }]
          }
        ]
      },
      {
        id: "upi-payout",
        title: "UPI Payout",
        endpoints: [
          {
            id: "upi-payout-initiate",
            method: "POST",
            path: "/upi/payout/initiate",
            title: "Initiate UPI Payout",
            description: "Initiate merchant UPI payout to beneficiary Virtual Payment Address",
            security: [{ type: "OAuth Token", description: "OAuth 2.0 access token required" }],
            parameters: [
              { name: "merchant_id", type: "string", required: true, description: "Merchant identifier", example: "MERCH001" },
              { name: "payout_id", type: "string", required: true, description: "Unique payout identifier", example: "PAYOUT123456" },
              { name: "payee_vpa", type: "string", required: true, description: "Beneficiary VPA", example: "beneficiary@upi" },
              { name: "amount", type: "number", required: true, description: "Payout amount in INR", example: "500.00" },
              { name: "purpose", type: "string", required: true, description: "Payment purpose", example: "salary_disbursement" },
              { name: "remarks", type: "string", required: false, description: "Payment remarks", example: "Monthly salary" }
            ],
            responses: [
              { 
                status: 200, 
                description: "UPI payout initiated successfully",
                example: { 
                  payout_id: "PAYOUT123456", 
                  status: "initiated", 
                  amount: 500.00, 
                  payee_vpa: "beneficiary@upi",
                  transaction_ref: "AU123456789",
                  timestamp: "2024-12-01T10:30:00Z"
                }
              }
            ],
            examples: [{
              title: "Initiate UPI Payout",
              request: {
                merchant_id: "MERCH001",
                payout_id: "PAYOUT123456",
                payee_vpa: "beneficiary@upi",
                amount: 500.00,
                purpose: "salary_disbursement",
                remarks: "Monthly salary"
              },
              response: {
                payout_id: "PAYOUT123456",
                status: "initiated",
                amount: 500.00,
                payee_vpa: "beneficiary@upi",
                transaction_ref: "AU123456789",
                timestamp: "2024-12-01T10:30:00Z"
              },
              curl: `curl -X POST "https://api.aubank.in/upi/payout/initiate" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "merchant_id": "MERCH001",
    "payout_id": "PAYOUT123456",
    "payee_vpa": "beneficiary@upi",
    "amount": 500.00,
    "purpose": "salary_disbursement",
    "remarks": "Monthly salary"
  }'`
            }]
          },
          {
            id: "upi-payout-status",
            method: "GET",
            path: "/upi/payout/status/{payout_id}",
            title: "Check Payout Status",
            description: "Check the status of UPI payout transaction",
            security: [{ type: "OAuth Token", description: "OAuth 2.0 access token required" }],
            parameters: [
              { name: "payout_id", type: "string", required: true, description: "Payout identifier", example: "PAYOUT123456" },
              { name: "merchant_id", type: "string", required: true, description: "Merchant identifier", example: "MERCH001" }
            ],
            responses: [
              { 
                status: 200, 
                description: "Payout status retrieved successfully",
                example: { 
                  payout_id: "PAYOUT123456", 
                  status: "success", 
                  amount: 500.00, 
                  payee_vpa: "beneficiary@upi",
                  transaction_ref: "AU123456789",
                  completed_at: "2024-12-01T10:32:15Z"
                }
              }
            ],
            examples: [{
              title: "Check Payout Status",
              request: { payout_id: "PAYOUT123456", merchant_id: "MERCH001" },
              response: {
                payout_id: "PAYOUT123456",
                status: "success",
                amount: 500.00,
                payee_vpa: "beneficiary@upi",
                transaction_ref: "AU123456789",
                completed_at: "2024-12-01T10:32:15Z"
              },
              curl: `curl -X GET "https://api.aubank.in/upi/payout/status/PAYOUT123456?merchant_id=MERCH001" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN"`
            }]
          }
        ]
      },
      {
        id: "cnb-payment",
        title: "CNB Payout",
        endpoints: [
          {
            id: "cnb-payment-creation",
            method: "POST",
            path: "/cnb/payout/create",
            title: "Create CNB Payout",
            description: "Create a CNB (Corporate Net Banking) payout transaction",
            security: [{ type: "OAuth Token", description: "OAuth 2.0 access token required" }],
            parameters: [
              { name: "uniqueRequestId", type: "string", required: true, description: "Unique request identifier", example: "REQ123456789" },
              { name: "corporateCode", type: "string", required: true, description: "Corporate code", example: "CORP001" },
              { name: "remitterAccountNo", type: "string", required: true, description: "Remitter account number", example: "1234567890123" },
              { name: "amount", type: "string", required: true, description: "Payout amount", example: "1000.00" },
              { name: "beneAccNo", type: "string", required: true, description: "Beneficiary account number", example: "9876543210987" },
              { name: "beneName", type: "string", required: true, description: "Beneficiary name", example: "Test Beneficiary" },
              { name: "ifscCode", type: "string", required: true, description: "IFSC code", example: "AUBL0002086" },
              { name: "paymentMode", type: "string", required: true, description: "Payment mode", example: "NEFT" },
              { name: "purpose", type: "string", required: true, description: "Payment purpose", example: "vendor_payment" }
            ],
            responses: [
              { 
                status: 201, 
                description: "CNB payout created successfully",
                example: { 
                  payment_id: "pay_123456789", 
                  status: "initiated", 
                  amount: "1000.00", 
                  beneficiary: "Test Beneficiary",
                  transaction_ref: "TXN123456789",
                  utr_number: "UTR123456789"
                }
              }
            ],
            examples: [{
              title: "Create CNB Payout",
              request: {
                uniqueRequestId: "REQ123456789",
                corporateCode: "CORP001",
                remitterAccountNo: "1234567890123",
                amount: "1000.00",
                beneAccNo: "9876543210987",
                beneName: "Test Beneficiary",
                ifscCode: "AUBL0002086",
                paymentMode: "NEFT",
                purpose: "vendor_payment"
              },
              response: {
                payment_id: "pay_123456789",
                status: "initiated",
                amount: "1000.00",
                beneficiary: "Test Beneficiary",
                transaction_ref: "TXN123456789",
                utr_number: "UTR123456789"
              },
              curl: `curl -X POST "https://api.aubank.in/cnb/payout/create" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "uniqueRequestId": "REQ123456789",
    "corporateCode": "CORP001",
    "remitterAccountNo": "1234567890123",
    "amount": "1000.00",
    "beneAccNo": "9876543210987",
    "beneName": "Test Beneficiary",
    "ifscCode": "AUBL0002086",
    "paymentMode": "NEFT",
    "purpose": "vendor_payment"
  }'`
            }]
          },
          {
            id: "cnb-payout-status",
            method: "GET",
            path: "/cnb/payout/status/{payment_id}",
            title: "Check Payout Status",
            description: "Check the status of CNB payout transaction",
            security: [{ type: "OAuth Token", description: "OAuth 2.0 access token required" }],
            parameters: [
              { name: "payment_id", type: "string", required: true, description: "Payment identifier", example: "pay_123456789" },
              { name: "corporateCode", type: "string", required: true, description: "Corporate code", example: "CORP001" }
            ],
            responses: [
              { 
                status: 200, 
                description: "Payout status retrieved successfully",
                example: { 
                  payment_id: "pay_123456789", 
                  status: "success", 
                  amount: "1000.00", 
                  beneficiary: "Test Beneficiary",
                  transaction_ref: "TXN123456789",
                  utr_number: "UTR123456789",
                  completed_at: "2024-12-01T10:35:20Z"
                }
              }
            ],
            examples: [{
              title: "Check CNB Payout Status",
              request: { payment_id: "pay_123456789", corporateCode: "CORP001" },
              response: {
                payment_id: "pay_123456789",
                status: "success",
                amount: "1000.00",
                beneficiary: "Test Beneficiary",
                transaction_ref: "TXN123456789",
                utr_number: "UTR123456789",
                completed_at: "2024-12-01T10:35:20Z"
              },
              curl: `curl -X GET "https://api.aubank.in/cnb/payout/status/pay_123456789?corporateCode=CORP001" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN"`
            }]
          }
        ]
      },
      {
        id: "bbps",
        title: "BBPS (Bharat Bill Payment)",
        endpoints: [
          {
            id: "bbps-biller-list",
            method: "GET",
            path: "/bbps/billers",
            title: "Get Biller List",
            description: "Retrieve list of available billers for BBPS payments",
            security: [{ type: "OAuth Token", description: "OAuth 2.0 access token required" }],
            parameters: [
              { name: "category", type: "string", required: false, description: "Biller category", example: "electricity" },
              { name: "state", type: "string", required: false, description: "State code", example: "MH" },
              { name: "limit", type: "number", required: false, description: "Number of results", example: "50" }
            ],
            responses: [
              { 
                status: 200, 
                description: "Biller list retrieved successfully",
                example: { 
                  billers: [
                    {
                      biller_id: "MSEB0001",
                      biller_name: "Maharashtra State Electricity Board",
                      category: "electricity",
                      state: "MH",
                      validation_params: ["consumer_number"]
                    }
                  ],
                  total_count: 1
                }
              }
            ],
            examples: [{
              title: "Get BBPS Billers",
              request: { category: "electricity", state: "MH" },
              response: {
                billers: [
                  {
                    biller_id: "MSEB0001",
                    biller_name: "Maharashtra State Electricity Board",
                    category: "electricity",
                    state: "MH",
                    validation_params: ["consumer_number"]
                  }
                ],
                total_count: 1
              },
              curl: `curl -X GET "https://api.aubank.in/bbps/billers?category=electricity&state=MH" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN"`
            }]
          },
          {
            id: "bbps-bill-fetch",
            method: "POST",
            path: "/bbps/bill/fetch",
            title: "Fetch Bill Details",
            description: "Fetch bill details for a specific biller and consumer",
            security: [{ type: "OAuth Token", description: "OAuth 2.0 access token required" }],
            parameters: [
              { name: "biller_id", type: "string", required: true, description: "Biller identifier", example: "MSEB0001" },
              { name: "consumer_number", type: "string", required: true, description: "Consumer number", example: "123456789012" },
              { name: "reference_id", type: "string", required: true, description: "Reference identifier", example: "REF123456" }
            ],
            responses: [
              { 
                status: 200, 
                description: "Bill details fetched successfully",
                example: { 
                  bill_amount: 2500.50,
                  due_date: "2024-12-15",
                  consumer_name: "John Doe",
                  bill_period: "Nov 2024",
                  reference_id: "REF123456"
                }
              }
            ],
            examples: [{
              title: "Fetch Bill Details",
              request: {
                biller_id: "MSEB0001",
                consumer_number: "123456789012",
                reference_id: "REF123456"
              },
              response: {
                bill_amount: 2500.50,
                due_date: "2024-12-15",
                consumer_name: "John Doe",
                bill_period: "Nov 2024",
                reference_id: "REF123456"
              },
              curl: `curl -X POST "https://api.aubank.in/bbps/bill/fetch" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "biller_id": "MSEB0001",
    "consumer_number": "123456789012",
    "reference_id": "REF123456"
  }'`
            }]
          },
          {
            id: "bbps-bill-payment",
            method: "POST",
            path: "/bbps/bill/pay",
            title: "Pay Bill",
            description: "Make payment for fetched bill through BBPS",
            security: [{ type: "OAuth Token", description: "OAuth 2.0 access token required" }],
            parameters: [
              { name: "biller_id", type: "string", required: true, description: "Biller identifier", example: "MSEB0001" },
              { name: "consumer_number", type: "string", required: true, description: "Consumer number", example: "123456789012" },
              { name: "amount", type: "number", required: true, description: "Payment amount", example: "2500.50" },
              { name: "reference_id", type: "string", required: true, description: "Reference identifier", example: "REF123456" },
              { name: "account_number", type: "string", required: true, description: "Payer account number", example: "1234567890" }
            ],
            responses: [
              { 
                status: 200, 
                description: "Bill payment successful",
                example: { 
                  transaction_id: "TXN987654321",
                  status: "success",
                  amount: 2500.50,
                  biller_name: "Maharashtra State Electricity Board",
                  payment_date: "2024-12-01T10:30:00Z"
                }
              }
            ],
            examples: [{
              title: "Pay Bill via BBPS",
              request: {
                biller_id: "MSEB0001",
                consumer_number: "123456789012",
                amount: 2500.50,
                reference_id: "REF123456",
                account_number: "1234567890"
              },
              response: {
                transaction_id: "TXN987654321",
                status: "success",
                amount: 2500.50,
                biller_name: "Maharashtra State Electricity Board",
                payment_date: "2024-12-01T10:30:00Z"
              },
              curl: `curl -X POST "https://api.aubank.in/bbps/bill/pay" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "biller_id": "MSEB0001",
    "consumer_number": "123456789012",
    "amount": 2500.50,
    "reference_id": "REF123456",
    "account_number": "1234567890"
  }'`
            }]
          }
        ]
      },
      {
        id: "vam",
        title: "VAM (Virtual Account Management)",
        endpoints: [
          {
            id: "vam-create-account",
            method: "POST",
            path: "/vam/account/create",
            title: "Create Virtual Account",
            description: "Create a new virtual account for collection purposes",
            security: [{ type: "OAuth Token", description: "OAuth 2.0 access token required" }],
            parameters: [
              { name: "client_code", type: "string", required: true, description: "Client identifier", example: "CLIENT001" },
              { name: "virtual_account_name", type: "string", required: true, description: "Virtual account name", example: "Customer Collections" },
              { name: "customer_id", type: "string", required: true, description: "Customer identifier", example: "CUST123456" },
              { name: "pool_account", type: "string", required: true, description: "Pool account number", example: "1234567890123" },
              { name: "validity_days", type: "number", required: false, description: "Account validity in days", example: "365" }
            ],
            responses: [
              { 
                status: 201, 
                description: "Virtual account created successfully",
                example: { 
                  virtual_account_number: "VA123456789012",
                  virtual_account_name: "Customer Collections",
                  customer_id: "CUST123456",
                  status: "active",
                  created_date: "2024-12-01",
                  expiry_date: "2025-11-30"
                }
              }
            ],
            examples: [{
              title: "Create Virtual Account",
              request: {
                client_code: "CLIENT001",
                virtual_account_name: "Customer Collections",
                customer_id: "CUST123456",
                pool_account: "1234567890123",
                validity_days: 365
              },
              response: {
                virtual_account_number: "VA123456789012",
                virtual_account_name: "Customer Collections",
                customer_id: "CUST123456",
                status: "active",
                created_date: "2024-12-01",
                expiry_date: "2025-11-30"
              },
              curl: `curl -X POST "https://api.aubank.in/vam/account/create" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_code": "CLIENT001",
    "virtual_account_name": "Customer Collections",
    "customer_id": "CUST123456",
    "pool_account": "1234567890123",
    "validity_days": 365
  }'`
            }]
          },
          {
            id: "vam-get-transactions",
            method: "GET",
            path: "/vam/transactions/{virtual_account_number}",
            title: "Get Virtual Account Transactions",
            description: "Retrieve transactions for a specific virtual account",
            security: [{ type: "OAuth Token", description: "OAuth 2.0 access token required" }],
            parameters: [
              { name: "virtual_account_number", type: "string", required: true, description: "Virtual account number", example: "VA123456789012" },
              { name: "from_date", type: "string", required: false, description: "Start date (YYYY-MM-DD)", example: "2024-11-01" },
              { name: "to_date", type: "string", required: false, description: "End date (YYYY-MM-DD)", example: "2024-11-30" },
              { name: "limit", type: "number", required: false, description: "Number of transactions", example: "100" }
            ],
            responses: [
              { 
                status: 200, 
                description: "Transactions retrieved successfully",
                example: { 
                  transactions: [
                    {
                      transaction_id: "TXN789012345",
                      amount: 5000.00,
                      currency: "INR",
                      transaction_date: "2024-11-15T14:30:00Z",
                      remitter_name: "John Doe",
                      remitter_account: "9876543210987",
                      utr_number: "UTR123456789"
                    }
                  ],
                  total_amount: 5000.00,
                  transaction_count: 1
                }
              }
            ],
            examples: [{
              title: "Get VAM Transactions",
              request: {
                virtual_account_number: "VA123456789012",
                from_date: "2024-11-01",
                to_date: "2024-11-30"
              },
              response: {
                transactions: [
                  {
                    transaction_id: "TXN789012345",
                    amount: 5000.00,
                    currency: "INR",
                    transaction_date: "2024-11-15T14:30:00Z",
                    remitter_name: "John Doe",
                    remitter_account: "9876543210987",
                    utr_number: "UTR123456789"
                  }
                ],
                total_amount: 5000.00,
                transaction_count: 1
              },
              curl: `curl -X GET "https://api.aubank.in/vam/transactions/VA123456789012?from_date=2024-11-01&to_date=2024-11-30" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN"`
            }]
          }
        ]
      }
    ]
  },
  {
    id: "accounts-deposits",
    title: "Accounts and Deposits",
    icon: Database,
    description: "Account management and deposit services",
    endpoints: [
      {
        id: "account-balance",
        method: "GET",
        path: "/accounts/{account_id}/balance",
        title: "Get Account Balance",
        description: "Retrieve current account balance and details",
        security: [{ type: "OAuth Token", description: "OAuth 2.0 access token required" }],
        parameters: [
          { name: "account_id", type: "string", required: true, description: "Account identifier", example: "acc_123456789" }
        ],
        responses: [
          { 
            status: 200, 
            description: "Account balance retrieved successfully",
            example: {
              account_id: "acc_123456789",
              account_number: "****1234",
              balance: {
                available: 25750.50,
                ledger: 26000.00,
                currency: "INR"
              },
              last_updated: "2024-12-01T10:30:00Z"
            }
          }
        ],
        examples: [{
          title: "Get Balance",
          response: {
            account_id: "acc_123456789",
            account_number: "****1234",
            balance: {
              available: 25750.50,
              ledger: 26000.00,
              currency: "INR"
            },
            last_updated: "2024-12-01T10:30:00Z"
          },
          curl: `curl -X GET "https://api.aubank.in/accounts/acc_123456789/balance" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN"`
        }]
      },
      {
        id: "account-transactions",
        method: "GET",
        path: "/accounts/{account_id}/transactions",
        title: "Get Account Transactions",
        description: "Retrieve account transaction history",
        security: [{ type: "OAuth Token", description: "OAuth 2.0 access token required" }],
        parameters: [
          { name: "account_id", type: "string", required: true, description: "Account identifier", example: "acc_123456789" },
          { name: "from_date", type: "string", required: false, description: "Start date (YYYY-MM-DD)", example: "2024-11-01" },
          { name: "to_date", type: "string", required: false, description: "End date (YYYY-MM-DD)", example: "2024-12-01" },
          { name: "limit", type: "number", required: false, description: "Number of transactions", example: "50" }
        ],
        responses: [
          { 
            status: 200, 
            description: "Transaction history retrieved successfully",
            example: {
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
          }
        ],
        examples: [{
          title: "Get Transactions",
          response: {
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
          },
          curl: `curl -X GET "https://api.aubank.in/accounts/acc_123456789/transactions?limit=50" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN"`
        }]
      }
    ]
  },
  {
    id: "business-banking",
    title: "Business Banking",
    icon: Building2,
    description: "Corporate and business banking services",
    endpoints: [
      {
        id: "corporate-registration",
        method: "POST",
        path: "/business/corporate/register",
        title: "Corporate Registration",
        description: "Register a new corporate account with AU Bank",
        security: [{ type: "API Key", description: "API Key required in header" }],
        parameters: [
          { name: "company_name", type: "string", required: true, description: "Company name", example: "Tech Solutions Pvt Ltd" },
          { name: "business_type", type: "string", required: true, description: "Type of business", example: "Private Limited" },
          { name: "registration_number", type: "string", required: true, description: "Company registration number", example: "CIN123456789" },
          { name: "contact_email", type: "string", required: true, description: "Primary contact email", example: "contact@techsolutions.com" },
          { name: "contact_phone", type: "string", required: true, description: "Primary contact phone", example: "+919876543210" }
        ],
        responses: [
          { 
            status: 201, 
            description: "Corporate registration initiated",
            example: {
              application_id: "app_corp_123",
              status: "under_review",
              company_name: "Tech Solutions Pvt Ltd",
              estimated_approval_time: "3-5 business days"
            }
          }
        ],
        examples: [{
          title: "Corporate Registration",
          request: {
            company_name: "Tech Solutions Pvt Ltd",
            business_type: "Private Limited",
            registration_number: "CIN123456789",
            contact_email: "contact@techsolutions.com",
            contact_phone: "+919876543210"
          },
          response: {
            application_id: "app_corp_123",
            status: "under_review",
            company_name: "Tech Solutions Pvt Ltd",
            estimated_approval_time: "3-5 business days"
          },
          curl: `curl -X POST "https://api.aubank.in/business/corporate/register" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "company_name": "Tech Solutions Pvt Ltd",
    "business_type": "Private Limited",
    "registration_number": "CIN123456789",
    "contact_email": "contact@techsolutions.com",
    "contact_phone": "+919876543210"
  }'`
        }]
      }
    ]
  }
];

export default function APIDocs() {
  const [selectedCategory, setSelectedCategory] = useState("introduction");
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<string[]>(["introduction", "security"]);
  const [showForm, setShowForm] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    mobileNumber: "",
    otp: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();

  // Animation variants
  const sidebarItemVariants = {
    initial: { scale: 1, opacity: 0.8 },
    hover: { 
      scale: shouldReduceMotion ? 1 : 1.02, 
      transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { 
      scale: shouldReduceMotion ? 1 : 0.98, 
      transition: { duration: 0.1 }
    },
    selected: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const subcategoryVariants = {
    hidden: { 
      opacity: 0, 
      height: 0, 
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    visible: { 
      opacity: 1, 
      height: "auto", 
      transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.05 }
    }
  };

  const endpointVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  const getCurrentEndpoint = () => {
    if (!selectedEndpoint) return null;
    for (const category of apiCategories) {
      const endpoint = category.endpoints?.find(e => e.id === selectedEndpoint);
      if (endpoint) return endpoint;
      
      if (category.subcategories) {
        for (const sub of category.subcategories) {
          const subEndpoint = sub.endpoints.find(e => e.id === selectedEndpoint);
          if (subEndpoint) return subEndpoint;
        }
      }
    }
    return null;
  };

  const handleStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registrationStep === 1) {
      // Basic Details
      if (!formData.fullName || !formData.email || !formData.companyName) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      setRegistrationStep(2);
    } else if (registrationStep === 2) {
      // Mobile Number & OTP
      if (!otpSent && !formData.mobileNumber) {
        toast({
          title: "Missing Mobile Number",
          description: "Please enter your mobile number",
          variant: "destructive"
        });
        return;
      }
      if (!otpSent) {
        // Send OTP
        setOtpSent(true);
        toast({
          title: "OTP Sent!",
          description: `Verification code sent to ${formData.mobileNumber}`,
        });
      } else {
        // Verify OTP
        if (!formData.otp || formData.otp.length !== 6) {
          toast({
            title: "Invalid OTP",
            description: "Please enter the 6-digit OTP",
            variant: "destructive"
          });
          return;
        }
        setRegistrationStep(3);
      }
    } else if (registrationStep === 3) {
      // Credentials
      if (!formData.username || !formData.password || !formData.confirmPassword) {
        toast({
          title: "Missing Credentials",
          description: "Please fill in all credential fields",
          variant: "destructive"
        });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match",
          variant: "destructive"
        });
        return;
      }
      
      // Complete registration
      toast({
        title: "Registration Successful!",
        description: "Your developer account has been created. You will receive an email with next steps.",
      });
      setShowForm(false);
      setRegistrationStep(1);
      setOtpSent(false);
      setFormData({
        fullName: "",
        email: "",
        companyName: "",
        mobileNumber: "",
        otp: "",
        username: "",
        password: "",
        confirmPassword: ""
      });
    }
  };

  const handleSendOtp = () => {
    if (!formData.mobileNumber) {
      toast({
        title: "Missing Mobile Number",
        description: "Please enter your mobile number first",
        variant: "destructive"
      });
      return;
    }
    setOtpSent(true);
    toast({
      title: "OTP Sent!",
      description: `Verification code sent to ${formData.mobileNumber}`,
    });
  };

  const currentEndpoint = getCurrentEndpoint();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--au-bg-soft-1)] via-white to-[var(--au-bg-soft-2)]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-[var(--au-primary)]/10 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-neutrals-200 mx-4"></div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[var(--au-primary)] to-[var(--au-primary-700)] rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-[var(--au-primary-700)]">AU Bank Developer Portal</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">Sign Up</Button>
              <Button size="sm" className="au-btn">Sign In</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white/95 backdrop-blur-sm border-r border-[var(--au-primary)]/10 h-screen overflow-y-auto sticky top-0 shadow-xl">
          <div className="p-4">
            <div className="space-y-1">
              <motion.div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "introduction" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                variants={sidebarItemVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate={selectedCategory === "introduction" ? "selected" : "initial"}
                onClick={() => {
                  setSelectedCategory("introduction");
                  setSelectedEndpoint(null);
                }}
              >
                Introduction
              </motion.div>
              
              <motion.div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "security" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                variants={sidebarItemVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate={selectedCategory === "security" ? "selected" : "initial"}
                onClick={() => {
                  setSelectedCategory("security");
                  setSelectedEndpoint(null);
                }}
              >
                Security
              </motion.div>
              
              <motion.div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "building-blocks" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                variants={sidebarItemVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate={selectedCategory === "building-blocks" ? "selected" : "initial"}
                onClick={() => {
                  setSelectedCategory("building-blocks");
                  setSelectedEndpoint(null);
                }}
              >
                Building Blocks
              </motion.div>
              
              <motion.div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "loans-and-cards" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                variants={sidebarItemVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate={selectedCategory === "loans-and-cards" ? "selected" : "initial"}
                onClick={() => {
                  setSelectedCategory("loans-and-cards");
                  setSelectedEndpoint(null);
                }}
              >
                Loans and Cards
              </motion.div>
              
              <motion.div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "payments" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                variants={sidebarItemVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate={selectedCategory === "payments" ? "selected" : "initial"}
                onClick={() => {
                  setSelectedCategory("payments");
                  setSelectedEndpoint(null);
                }}
              >
                Payments
              </motion.div>
              
              {/* Payment Subcategories */}
              <AnimatePresence>
                {selectedCategory === "payments" && (
                  <motion.div 
                    className="ml-4 border-l-2 border-[var(--au-primary)]/20 overflow-hidden"
                    variants={subcategoryVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {apiCategories.find(c => c.id === "payments")?.subcategories?.map((subcategory, subIndex) => (
                      <motion.div 
                        key={subcategory.id} 
                        className="ml-4"
                        variants={endpointVariants}
                        custom={subIndex}
                      >
                        <motion.div 
                          className="py-2 px-3 text-sm font-medium text-[var(--au-primary-600)] border-b border-neutrals-100"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: subIndex * 0.1, duration: 0.3 }}
                        >
                          {subcategory.title}
                        </motion.div>
                        <motion.div variants={subcategoryVariants} initial="hidden" animate="visible">
                          {subcategory.endpoints.map((endpoint, endIndex) => (
                            <motion.div
                              key={endpoint.id}
                              className={`p-2 pl-4 text-sm cursor-pointer transition-colors ${
                                selectedEndpoint === endpoint.id
                                  ? 'bg-[var(--au-primary)]/10 text-[var(--au-primary-700)] font-medium border-r-2 border-[var(--au-primary)]'
                                  : 'hover:bg-neutrals-50 text-neutrals-600 hover:text-[var(--au-primary-600)]'
                              }`}
                              variants={endpointVariants}
                              whileHover={{ 
                                scale: shouldReduceMotion ? 1 : 1.02, 
                                x: shouldReduceMotion ? 0 : 2,
                                transition: { duration: 0.2 }
                              }}
                              whileTap={{ 
                                scale: shouldReduceMotion ? 1 : 0.98,
                                transition: { duration: 0.1 }
                              }}
                              onClick={() => {
                                setSelectedEndpoint(endpoint.id);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <motion.span 
                                  className={`px-1.5 py-0.5 text-xs rounded font-mono ${
                                    endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                                    endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                                    endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}
                                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                                >
                                  {endpoint.method}
                                </motion.span>
                                <span className="truncate">{endpoint.title}</span>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "accounts-deposits" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                variants={sidebarItemVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate={selectedCategory === "accounts-deposits" ? "selected" : "initial"}
                onClick={() => {
                  setSelectedCategory("accounts-deposits");
                  setSelectedEndpoint(null);
                }}
              >
                Accounts and Deposits
              </motion.div>
              
              <motion.div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "business-banking" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                variants={sidebarItemVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate={selectedCategory === "business-banking" ? "selected" : "initial"}
                onClick={() => {
                  setSelectedCategory("business-banking");
                  setSelectedEndpoint(null);
                }}
              >
                Business Banking
              </motion.div>
              
              <motion.div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "trade-services" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                variants={sidebarItemVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate={selectedCategory === "trade-services" ? "selected" : "initial"}
                onClick={() => {
                  setSelectedCategory("trade-services");
                  setSelectedEndpoint(null);
                }}
              >
                Trade Services
              </motion.div>
              
              <motion.div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "corporate-api-suite" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                variants={sidebarItemVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate={selectedCategory === "corporate-api-suite" ? "selected" : "initial"}
                onClick={() => {
                  setSelectedCategory("corporate-api-suite");
                  setSelectedEndpoint(null);
                }}
              >
                Corporate API Suite
              </motion.div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-neutrals-200">
              <div className="flex items-center gap-2 p-3 text-neutrals-700 font-medium">
                <span className="text-lg">📚</span>
                VIEW ALL APIS
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            {selectedCategory === "introduction" && !selectedEndpoint && (
              <motion.div
                key="introduction"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
            <div className="max-w-4xl">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-[var(--au-primary)]/10">
                <h1 className="text-4xl font-bold text-[var(--au-primary-700)] mb-6">
                  Welcome to AU Bank API Banking Portal!
                </h1>
                <p className="text-lg text-neutrals-600 mb-8 leading-relaxed max-w-4xl">
                  Equipped with our services inventory and open API platform, we provide you the chance to reach, test and use our AU Bank's digital services. Using these, you now have the power of AU Bank supporting you to develop the next generation of applications. Let's see how you can do it.
                </p>

                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-6">Getting Started</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-pink-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">1. Sign Up</h3>
                      <p className="text-neutrals-600">Create your developer account</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Settings className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">2. Select API</h3>
                      <p className="text-neutrals-600">Choose the APIs for your needs</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">3. Test It Out</h3>
                      <p className="text-neutrals-600">Test in our sandbox environment</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-6">Registration Process</h2>
                  <p className="text-neutrals-600 mb-6">Follow these simple steps to get onboard with AU Bank's API Banking Portal</p>
                  
                  <div className="max-w-md">
                    <Card className="relative mb-6">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Let's get you Onboard</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <span className="text-pink-600 font-medium">Basic Details</span>
                          <span className="text-neutrals-300">•</span>
                          <span className="text-neutrals-400">Mobile Number</span>
                          <span className="text-neutrals-300">•</span>
                          <span className="text-neutrals-400">Credentials</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input id="fullName" placeholder="John Doe" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="john@techfirm.com" />
                        </div>
                        <div>
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input id="companyName" placeholder="Tech Firm" />
                        </div>
                        <Button className="w-full bg-pink-600 hover:bg-pink-700">
                          NEXT
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="relative mb-6">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Let's get you Onboard</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <span className="text-neutrals-400">Basic Details</span>
                          <span className="text-neutrals-300">•</span>
                          <span className="text-pink-600 font-medium">Mobile Number</span>
                          <span className="text-neutrals-300">•</span>
                          <span className="text-neutrals-400">Credentials</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="mobileNumber">Please enter the Phone Number</Label>
                          <div className="flex gap-2">
                            <Input id="mobileNumber" placeholder="9999999999" className="flex-1" />
                            <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                              SEND OTP
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="otp">Enter the OTP Received on your Phone Number</Label>
                          <Input id="otp" placeholder="747004" />
                        </div>
                        <Button className="w-full bg-pink-600 hover:bg-pink-700">
                          VERIFY
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="relative mb-6">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Let's get you Onboard</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <span className="text-neutrals-400">Basic Details</span>
                          <span className="text-neutrals-300">•</span>
                          <span className="text-neutrals-400">Mobile Number</span>
                          <span className="text-neutrals-300">•</span>
                          <span className="text-pink-600 font-medium">Credentials</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input id="username" placeholder="johndoe" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="password">Create Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" />
                          </div>
                          <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input id="confirmPassword" type="password" placeholder="••••••••" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <label className="text-sm text-gray-600">I ACCEPT ALL TERMS & CONDITIONS</label>
                        </div>
                        <Button className="w-full bg-pink-600 hover:bg-pink-700">
                          SUBMIT
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                </div>

                <div className="mb-8">

                  <div className="space-y-6">

                  </div>
                </div>

              </div>
            </div>
              </motion.div>
            )}

            {currentEndpoint && (
              <motion.div
                key={selectedEndpoint}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
            <div className="max-w-6xl">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-8 border-b">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant={currentEndpoint.method === 'GET' ? 'secondary' : 'default'}>
                      {currentEndpoint.method}
                    </Badge>
                    <code className="text-lg font-mono bg-neutrals-100 px-3 py-1 rounded">
                      {currentEndpoint.path}
                    </code>
                  </div>
                  <h1 className="text-3xl font-bold text-neutrals-900 mb-4">
                    {currentEndpoint.title}
                  </h1>
                  <p className="text-lg text-neutrals-600">
                    {currentEndpoint.description}
                  </p>
                </div>

                <div className="p-8">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="parameters">Parameters</TabsTrigger>
                      <TabsTrigger value="examples">Examples</TabsTrigger>
                      <TabsTrigger value="responses">Responses</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                      <div className="space-y-6">
                        {currentEndpoint.security && (
                          <div>
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                              <Shield className="w-5 h-5" />
                              Authentication
                            </h3>
                            <div className="space-y-2">
                              {currentEndpoint.security.map((sec, index) => (
                                <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Lock className="w-4 h-4 text-blue-600" />
                                    <span className="font-semibold text-blue-800">{sec.type}</span>
                                  </div>
                                  <p className="text-sm text-blue-700">{sec.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <h3 className="text-xl font-semibold mb-4">Request URL</h3>
                          <div className="bg-neutrals-900 text-white p-4 rounded-lg font-mono">
                            <span className="text-green-400">{currentEndpoint.method}</span>{" "}
                            <span className="text-blue-300">https://api.aubank.in{currentEndpoint.path}</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="parameters" className="mt-6">
                      <div className="space-y-6">
                        {currentEndpoint.parameters && currentEndpoint.parameters.length > 0 ? (
                          <div>
                            <h3 className="text-xl font-semibold mb-4">Parameters</h3>
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse border border-neutrals-200">
                                <thead>
                                  <tr className="bg-neutrals-50">
                                    <th className="border border-neutrals-200 p-3 text-left">Name</th>
                                    <th className="border border-neutrals-200 p-3 text-left">Type</th>
                                    <th className="border border-neutrals-200 p-3 text-left">Required</th>
                                    <th className="border border-neutrals-200 p-3 text-left">Description</th>
                                    <th className="border border-neutrals-200 p-3 text-left">Example</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {currentEndpoint.parameters.map((param, index) => (
                                    <tr key={index}>
                                      <td className="border border-neutrals-200 p-3 font-mono">{param.name}</td>
                                      <td className="border border-neutrals-200 p-3">
                                        <Badge variant="outline">{param.type}</Badge>
                                      </td>
                                      <td className="border border-neutrals-200 p-3">
                                        <Badge variant={param.required ? "destructive" : "secondary"}>
                                          {param.required ? "Required" : "Optional"}
                                        </Badge>
                                      </td>
                                      <td className="border border-neutrals-200 p-3">{param.description}</td>
                                      <td className="border border-neutrals-200 p-3 font-mono text-sm">
                                        {param.example}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-neutrals-500">
                            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No parameters required for this endpoint</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="examples" className="mt-6">
                      <div className="space-y-6">
                        {currentEndpoint.examples && currentEndpoint.examples.length > 0 ? (
                          currentEndpoint.examples.map((example, index) => (
                          <div key={index}>
                            <h3 className="text-xl font-semibold mb-4">{example.title}</h3>
                            
                            {example.request && (
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">Request Body</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(JSON.stringify(example.request, null, 2))}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                                <pre className="bg-neutrals-900 text-white p-4 rounded-lg overflow-x-auto">
                                  <code>{JSON.stringify(example.request, null, 2)}</code>
                                </pre>
                              </div>
                            )}

                            {example.response && (
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">Response</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(JSON.stringify(example.response, null, 2))}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                                <pre className="bg-neutrals-900 text-white p-4 rounded-lg overflow-x-auto">
                                  <code>{JSON.stringify(example.response, null, 2)}</code>
                                </pre>
                              </div>
                            )}

                            {example.curl && (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">cURL</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(example.curl || "")}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                                <pre className="bg-neutrals-900 text-white p-4 rounded-lg overflow-x-auto">
                                  <code>{example.curl}</code>
                                </pre>
                              </div>
                            )}
                          </div>
                        ))
                        ) : (
                          <div className="text-center py-8 text-neutrals-500">
                            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No examples available for this endpoint</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="responses" className="mt-6">
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold mb-4">Response Codes</h3>
                        <div className="space-y-4">
                          {currentEndpoint.responses.map((response, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <Badge 
                                  variant={
                                    response.status >= 200 && response.status < 300 ? "default" :
                                    response.status >= 400 && response.status < 500 ? "destructive" : "secondary"
                                  }
                                >
                                  {response.status}
                                </Badge>
                                <span className="font-semibold">{response.description}</span>
                              </div>
                              {response.example && (
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Example Response</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(JSON.stringify(response.example, null, 2))}
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <pre className="bg-neutrals-50 p-3 rounded text-sm overflow-x-auto">
                                    <code>{JSON.stringify(response.example, null, 2)}</code>
                                  </pre>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
              </motion.div>
            )}

            {selectedCategory !== "introduction" && !selectedEndpoint && (
              <motion.div
                key={selectedCategory}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="max-w-4xl">
                  <div className="bg-white rounded-lg p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                      {(() => {
                        const category = apiCategories.find(c => c.id === selectedCategory);
                        const IconComponent = category?.icon || BookOpen;
                        return <IconComponent className="w-8 h-8 text-primary" />;
                      })()}
                      <div>
                        <h1 className="text-3xl font-bold text-neutrals-900">
                          {apiCategories.find(c => c.id === selectedCategory)?.title}
                        </h1>
                        <p className="text-lg text-neutrals-600">
                          {apiCategories.find(c => c.id === selectedCategory)?.description}
                        </p>
                      </div>
                    </div>
                    <p className="text-neutrals-600">
                      Select an API endpoint from the sidebar to view detailed documentation, examples, and integration guides.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}