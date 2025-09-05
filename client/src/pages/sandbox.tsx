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

const apiEndpoints: APIEndpoint[] = [
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
    sampleRequest: null
  },
  {
    id: "bbps-biller-list",
    name: "BBPS Biller List",
    method: "GET",
    path: "https://aubank.tech/uat/bbps/billers",
    category: "Bill Payments",
    description: "Retrieve list of available billers for BBPS payments",
    requiresAuth: true,
    sampleRequest: null
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
    sampleRequest: null
  },
  {
    id: "account-balance", 
    name: "Account Balance",
    method: "GET",
    path: "https://aubank.tech/uat/accounts/{account_id}/balance",
    category: "Accounts",
    description: "Get current account balance and details",
    requiresAuth: true,
    sampleRequest: null
  },
  {
    id: "account-transactions",
    name: "Account Transactions", 
    method: "GET",
    path: "https://aubank.tech/uat/accounts/{account_id}/transactions",
    category: "Accounts",
    description: "Retrieve account transaction history",
    requiresAuth: true,
    sampleRequest: null
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
    sampleRequest: null
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
    sampleRequest: null
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
    sampleRequest: null
  },
  {
    id: "card-transactions",
    name: "Card Transactions",
    method: "GET",
    path: "https://aubank.tech/uat/cards/{card_id}/transactions",
    category: "Cards",
    description: "Get card transaction history",
    requiresAuth: true,
    sampleRequest: null
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
    sampleRequest: null
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
  {
    id: "loan-status",
    name: "Loan Status",
    method: "GET",
    path: "https://aubank.tech/uat/loans/{loan_id}/status",
    category: "Loans",
    description: "Check loan application status",
    requiresAuth: true,
    sampleRequest: null
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

export default function Sandbox() {
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
  
  const { toast } = useToast();

  useEffect(() => {
    handleEndpointChange(selectedEndpoint.id);
  }, [selectedEndpoint]);

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
    setPathParams(JSON.stringify(pathParamsObj, null, 2));
    
    setResponse(null);
  };

  const handleTestRequest = async () => {
    if (!selectedEndpoint) return;
    
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
      
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers,
      };
      
      if (selectedEndpoint.method !== 'GET' && requestBody.trim()) {
        options.body = requestBody;
      }
      
      // Simulate API call (since we don't have real AU Bank access in sandbox)
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

  const simulateAPICall = async (endpoint: APIEndpoint, body: any): Promise<any> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    switch (endpoint.id) {
      case "oauth-token":
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: {
            access_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
            token_type: "Bearer",
            expires_in: 3600,
            scope: "payment_read payment_write"
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
              payment_id: "pay_" + Date.now(),
              status: "INITIATED",
              unique_request_id: paymentData.uniqueRequestId || "REQ" + Date.now(),
              amount: paymentData.amount || "1000.00",
              currency: paymentData.payableCurrency || "INR",
              beneficiary_name: paymentData.beneName || "Test Beneficiary",
              beneficiary_account: paymentData.beneAccNo || "9876543210987",
              ifsc_code: paymentData.ifscCode || "AUBL0002086",
              payment_mode: paymentData.paymentMethodName || "NEFT",
              corporate_code: paymentData.corporateCode || "CORP001",
              remitter_account: paymentData.remitterAccountNo || "1234567890123",
              transaction_ref: "TXN" + Date.now(),
              utr_number: "UTR" + Date.now(),
              created_at: new Date().toISOString(),
              estimated_completion: new Date(Date.now() + 2 * 60 * 1000).toISOString()
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
        
      default:
        return {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/json" },
          data: { message: "Simulated response for " + endpoint.name }
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

        {/* Header for other views - Only show badge */}
        {currentView !== "groups" && (
          <div className="flex justify-end mb-8">
            <Badge 
              className="text-sm bg-[var(--au-primary)]/10 text-[var(--au-primary)] border-[var(--au-primary)]/20"
            >
              Sandbox Environment
            </Badge>
          </div>
        )}

        {/* Conditional Rendering Based on Current View */}
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
                return (
                  <Card 
                    key={group.name}
                    className="cursor-pointer hover:shadow-xl hover:shadow-[var(--au-primary)]/20 transition-all duration-300 hover:scale-105 border-2 hover:border-[var(--au-primary)]/30 bg-gradient-to-br from-white to-purple-50/30 dark:from-neutrals-800 dark:to-purple-950/10"
                    onClick={() => handleGroupSelect(group.name)}
                    data-testid={`card-group-${group.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[var(--au-primary)]/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <IconComponent className="w-10 h-10 text-[var(--au-primary)]" />
                      </div>
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
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                onClick={handleBackToGroups}
                className="hover:bg-[var(--au-primary)]/10 hover:text-[var(--au-primary)]"
                data-testid="button-back-to-groups"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--au-primary)] to-purple-600 bg-clip-text text-transparent">
                  {selectedGroup} APIs
                </h2>
                <p className="text-lg text-purple-600/70 font-medium">
                  {getFilteredEndpoints(selectedGroup).length} endpoints available
                </p>
              </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - API Configuration */}
            <div className="lg:col-span-1 space-y-6">
              {/* Selected API Info */}
              <Card data-testid="card-selected-api">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getCategoryIcon(selectedEndpoint.category)}
                      Selected API
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleBackToApis}
                      data-testid="button-back-to-apis"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium">{selectedEndpoint.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedEndpoint.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={selectedEndpoint.method === 'GET' ? 'secondary' : 'default'}>
                        {selectedEndpoint.method}
                      </Badge>
                      <Badge variant="outline">{selectedEndpoint.category}</Badge>
                    </div>
                    <div className="text-xs font-mono bg-muted/50 p-2 rounded">
                      {selectedEndpoint.path}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* API Configuration */}
              {selectedEndpoint.requiresAuth && (
                <Card data-testid="card-auth-token">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
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
              <Card data-testid="card-api-test">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>API Test Configuration</CardTitle>
                    <Button
                      onClick={handleTestRequest}
                      disabled={loading}
                      className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90"
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
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="request" data-testid="tab-request">Request</TabsTrigger>
                      <TabsTrigger value="headers" data-testid="tab-headers">Headers</TabsTrigger>
                      <TabsTrigger value="parameters" data-testid="tab-parameters">Parameters</TabsTrigger>
                      <TabsTrigger value="response" data-testid="tab-response">Response</TabsTrigger>
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
                          className="font-mono text-sm"
                          data-testid="textarea-request-body"
                        />
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
                              <Badge variant="outline" className="text-xs">
                                {response.responseTime}ms
                              </Badge>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
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
                              className="font-mono text-sm"
                              data-testid="textarea-response-body"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Clock className="w-8 h-8 mx-auto mb-2" />
                          <p>No response yet. Click "Test API" to see results.</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}