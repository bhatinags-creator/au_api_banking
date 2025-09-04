import { useState } from "react";
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
        id: "cnb-payment",
        title: "CNB Payment",
        endpoints: [
          {
            id: "cnb-payment-creation",
            method: "POST",
            path: "/cnb/payment/create",
            title: "CNB Payment Creation",
            description: "Create a CNB (Corporate Net Banking) payment transaction",
            security: [{ type: "OAuth Token", description: "OAuth 2.0 access token required" }],
            parameters: [
              { name: "uniqueRequestId", type: "string", required: true, description: "Unique request identifier", example: "REQ123456789" },
              { name: "corporateCode", type: "string", required: true, description: "Corporate code", example: "CORP001" },
              { name: "remitterAccountNo", type: "string", required: true, description: "Remitter account number", example: "1234567890123" },
              { name: "amount", type: "string", required: true, description: "Payment amount", example: "1000.00" },
              { name: "beneAccNo", type: "string", required: true, description: "Beneficiary account number", example: "9876543210987" },
              { name: "beneName", type: "string", required: true, description: "Beneficiary name", example: "Test Beneficiary" },
              { name: "ifscCode", type: "string", required: true, description: "IFSC code", example: "AUBL0002086" }
            ],
            responses: [
              { 
                status: 201, 
                description: "CNB payment created successfully",
                example: { 
                  payment_id: "pay_123456789", 
                  status: "initiated", 
                  amount: "1000.00", 
                  beneficiary: "Test Beneficiary",
                  transaction_ref: "TXN123456789"
                }
              }
            ],
            examples: [{
              title: "Create CNB Payment",
              request: {
                uniqueRequestId: "REQ123456789",
                corporateCode: "CORP001",
                remitterAccountNo: "1234567890123",
                amount: "1000.00",
                beneAccNo: "9876543210987",
                beneName: "Test Beneficiary",
                ifscCode: "AUBL0002086"
              },
              response: {
                payment_id: "pay_123456789",
                status: "initiated",
                amount: "1000.00",
                beneficiary: "Test Beneficiary",
                transaction_ref: "TXN123456789"
              },
              curl: `curl -X POST "https://api.aubank.in/cnb/payment/create" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "uniqueRequestId": "REQ123456789",
    "corporateCode": "CORP001",
    "remitterAccountNo": "1234567890123",
    "amount": "1000.00",
    "beneAccNo": "9876543210987",
    "beneName": "Test Beneficiary",
    "ifscCode": "AUBL0002086"
  }'`
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
    <div className="min-h-screen bg-neutrals-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
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
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-neutrals-900">AU Bank Developer Portal</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">Sign Up</Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">Sign In</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r h-screen overflow-y-auto sticky top-0">
          <div className="p-4">
            <div className="space-y-1">
              <div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "introduction" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                onClick={() => {
                  setSelectedCategory("introduction");
                  setSelectedEndpoint(null);
                }}
              >
                Introduction
              </div>
              
              <div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "security" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                onClick={() => {
                  setSelectedCategory("security");
                  setSelectedEndpoint(null);
                }}
              >
                Security
              </div>
              
              <div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "building-blocks" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                onClick={() => {
                  setSelectedCategory("building-blocks");
                  setSelectedEndpoint(null);
                }}
              >
                Building Blocks
              </div>
              
              <div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "loans-and-cards" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                onClick={() => {
                  setSelectedCategory("loans-and-cards");
                  setSelectedEndpoint(null);
                }}
              >
                Loans and Cards
              </div>
              
              <div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "payments" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                onClick={() => {
                  setSelectedCategory("payments");
                  setSelectedEndpoint(null);
                }}
              >
                Payments
              </div>
              
              <div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "accounts-deposits" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                onClick={() => {
                  setSelectedCategory("accounts-deposits");
                  setSelectedEndpoint(null);
                }}
              >
                Accounts and Deposits
              </div>
              
              <div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "business-banking" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                onClick={() => {
                  setSelectedCategory("business-banking");
                  setSelectedEndpoint(null);
                }}
              >
                Business Banking
              </div>
              
              <div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "trade-services" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                onClick={() => {
                  setSelectedCategory("trade-services");
                  setSelectedEndpoint(null);
                }}
              >
                Trade Services
              </div>
              
              <div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedCategory === "corporate-api-suite" 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-neutrals-50 text-neutrals-700'
                }`}
                onClick={() => {
                  setSelectedCategory("corporate-api-suite");
                  setSelectedEndpoint(null);
                }}
              >
                Corporate API Suite
              </div>
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
          {selectedCategory === "introduction" && !selectedEndpoint && (
            <div className="max-w-4xl">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h1 className="text-3xl font-bold text-neutrals-900 mb-4">
                  Welcome to AU Bank API Banking Portal!
                </h1>
                <p className="text-lg text-neutrals-600 mb-8 leading-relaxed">
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

                  <div className="max-w-2xl mt-8 space-y-4 text-sm text-neutrals-600">
                    <p><strong>Step 2:</strong> Complete the registration by entering your details and create an account.</p>
                    <p><strong>Step 3:</strong> When authorized, an email will be sent to your registered email-id with a link to activate your account by logging in. You now have access to your dashboard. From here you can create and configure your apps.</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-neutrals-600 mb-4">
                    If you already have an account, then sign in and jump to <strong>step 2</strong>. Else follow the steps to create an account.
                  </p>
                  <div className="bg-neutrals-50 p-4 rounded-lg mb-6">
                    <p className="text-sm"><strong>Step 1:</strong> Go to our sign up page.</p>
                    <p className="text-sm"><strong>a)</strong> Enter your Credentials.</p>
                  </div>

                  <div className="space-y-6">

                  </div>
                </div>

                {!showForm ? (
                  <Card className="max-w-md">
                    <CardHeader>
                      <CardTitle className="text-xl">Let's get you Onboard (New)</CardTitle>
                      <CardDescription>Start your API integration journey with AU Bank</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => setShowForm(true)}
                        className="w-full bg-pink-600 hover:bg-pink-700"
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="max-w-lg">
                    <CardHeader>
                      <CardTitle className="text-xl">Let's get you Onboard</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className={registrationStep >= 1 ? "text-pink-600 font-medium" : "text-neutrals-400"}>Basic Details</span>
                        <span className="text-neutrals-300">•</span>
                        <span className={registrationStep >= 2 ? "text-pink-600 font-medium" : "text-neutrals-400"}>Mobile Number</span>
                        <span className="text-neutrals-300">•</span>
                        <span className={registrationStep >= 3 ? "text-pink-600 font-medium" : "text-neutrals-400"}>Credentials</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleStepSubmit} className="space-y-4">
                        {registrationStep === 1 && (
                          <>
                            <div>
                              <Label htmlFor="fullName">Full Name</Label>
                              <Input
                                id="fullName"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="john@techfirm.com"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="companyName">Company Name</Label>
                              <Input
                                id="companyName"
                                placeholder="Tech Firm"
                                value={formData.companyName}
                                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                                required
                              />
                            </div>
                            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700">
                              Next
                            </Button>
                          </>
                        )}

                        {registrationStep === 2 && (
                          <>
                            {!otpSent ? (
                              <>
                                <div>
                                  <Label htmlFor="mobileNumber">Please enter the Phone Number</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      id="mobileNumber"
                                      placeholder="9999999999"
                                      value={formData.mobileNumber}
                                      onChange={(e) => setFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                                      required
                                      className="flex-1"
                                    />
                                    <Button 
                                      type="button" 
                                      onClick={handleSendOtp}
                                      variant="outline"
                                      className="border-pink-600 text-pink-600 hover:bg-pink-50"
                                    >
                                      SEND OTP
                                    </Button>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  <Label htmlFor="otp">Enter the OTP Received on your Phone Number</Label>
                                  <Input
                                    id="otp"
                                    placeholder="Enter 6-digit OTP"
                                    value={formData.otp}
                                    onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value }))}
                                    maxLength={6}
                                    required
                                  />
                                </div>
                                <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700">
                                  VERIFY
                                </Button>
                              </>
                            )}
                          </>
                        )}

                        {registrationStep === 3 && (
                          <>
                            <div>
                              <Label htmlFor="username">Username</Label>
                              <Input
                                id="username"
                                placeholder="johndoe"
                                value={formData.username}
                                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="password">Create Password</Label>
                                <Input
                                  id="password"
                                  type="password"
                                  placeholder="••••••••"
                                  value={formData.password}
                                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                  id="confirmPassword"
                                  type="password"
                                  placeholder="••••••••"
                                  value={formData.confirmPassword}
                                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                  required
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" required className="rounded border-gray-300" />
                              <label className="text-sm text-gray-600">I ACCEPT ALL TERMS & CONDITIONS</label>
                            </div>
                            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700">
                              SUBMIT
                            </Button>
                          </>
                        )}
                      </form>
                      
                      {registrationStep > 1 && (
                        <Button 
                          variant="ghost" 
                          className="w-full mt-2"
                          onClick={() => {
                            if (registrationStep === 3) {
                              setRegistrationStep(2);
                            } else if (registrationStep === 2) {
                              setRegistrationStep(1);
                              setOtpSent(false);
                            }
                          }}
                        >
                          ← Back
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {currentEndpoint && (
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
                        {currentEndpoint.examples.map((example, index) => (
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
                        ))}
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
          )}

          {selectedCategory !== "introduction" && !selectedEndpoint && (
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
          )}
        </div>
      </div>
    </div>
  );
}