import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Play, Copy, Settings, Database, CreditCard, Shield, Clock, CheckCircle, XCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
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
    id: "payment-enquiry",
    name: "Payment Enquiry",
    method: "GET",
    path: "https://aubank.tech/uat/payment/{payment_id}",
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
  }
];

const categoryIcons = {
  Authentication: Shield,
  Payments: CreditCard,
  Accounts: Database,
  KYC: Settings
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
  const { toast } = useToast();

  useEffect(() => {
    handleEndpointChange(selectedEndpoint.id);
  }, [selectedEndpoint]);

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
      
      // Add to test history
      const historyEntry: TestHistory = {
        id: Date.now().toString(),
        endpoint: selectedEndpoint,
        request: {
          url: finalUrl,
          method: selectedEndpoint.method,
          headers,
          body: options.body || null
        },
        response: apiResponse,
        timestamp: new Date().toISOString()
      };
      
      setTestHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10 tests
      setActiveTab("response");
      
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
            access_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.EkN-DOsnsuRjRO6BxXemmJDm3HbxrbRzXglbN2S4sOkopdU4IsDxTI8jO19W_A4K8ZPJijNLis4EZsHeY559a4DFOd50_OqgHs_n2nZ2NrMnYtfGxbJBxdRv6oaKhL5PB2cNx2llxLg1f4h-vC5N-qE-mTK3n9n8i-N1jw5mI1L",
            token_type: "Bearer",
            expires_in: 3600,
            scope: "payment_read payment_write"
          }
        };
      
      case "cnb-payment":
        const paymentData = body ? JSON.parse(body) : {};
        return {
          status: 201,
          statusText: "Created",
          headers: { "Content-Type": "application/json" },
          data: {
            payment_id: "pay_" + Date.now(),
            status: "PENDING",
            unique_request_id: paymentData.uniqueRequestId,
            amount: paymentData.amount,
            currency: paymentData.payableCurrency || "INR",
            beneficiary_name: paymentData.beneName,
            created_at: new Date().toISOString(),
            estimated_completion: new Date(Date.now() + 2 * 60 * 1000).toISOString()
          }
        };
        
      case "payment-enquiry":
        return {
          status: 200,
          statusText: "OK", 
          headers: { "Content-Type": "application/json" },
          data: {
            payment_id: "pay_1a2b3c4d5e6f",
            status: "COMPLETED",
            amount: "1000.00",
            currency: "INR",
            beneficiary_name: "Test Beneficiary",
            created_at: "2024-12-01T10:30:00Z",
            completed_at: "2024-12-01T10:31:45Z",
            settlement_date: "2024-12-01",
            timeline: [
              { status: "PENDING", timestamp: "2024-12-01T10:30:00Z", description: "Payment initiated" },
              { status: "PROCESSING", timestamp: "2024-12-01T10:30:30Z", description: "Payment processing" },
              { status: "COMPLETED", timestamp: "2024-12-01T10:31:45Z", description: "Payment completed" }
            ]
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
            last_updated: new Date().toISOString()
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
              },
              {
                transaction_id: "txn_002",
                type: "DEBIT",
                amount: 150.00,
                description: "ATM Withdrawal",
                date: "2024-11-30",
                balance_after: 20750.50
              }
            ],
            pagination: {
              page: 1,
              total_pages: 5,
              total_transactions: 47
            }
          }
        };
        
      default:
        return {
          status: 404,
          statusText: "Not Found",
          headers: { "Content-Type": "application/json" },
          data: { error: "Endpoint not found in sandbox" }
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

  const generateCurl = () => {
    try {
      const headers = JSON.parse(requestHeaders);
      const pathParamsObj = JSON.parse(pathParams);
      
      let finalUrl = selectedEndpoint.path;
      Object.entries(pathParamsObj).forEach(([key, value]) => {
        finalUrl = finalUrl.replace(`{${key}}`, value as string);
      });
      
      if (queryParams.trim()) {
        finalUrl += `?${queryParams}`;
      }
      
      let curl = `curl -X ${selectedEndpoint.method} "${finalUrl}"`;
      
      Object.entries(headers).forEach(([key, value]) => {
        curl += ` \\\n  -H "${key}: ${value}"`;
      });
      
      if (selectedEndpoint.method !== 'GET' && requestBody.trim()) {
        curl += ` \\\n  -d '${requestBody}'`;
      }
      
      return curl;
    } catch {
      return "Invalid configuration";
    }
  };

  return (
    <div className="min-h-screen au-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="button-back-home" className="hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                API Testing Playground
              </h1>
              <p className="text-gray-600">
                Test and explore AU Bank APIs in a safe sandbox environment
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm bg-purple-100 text-purple-800">
            Sandbox Environment
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - API Selection & Configuration */}
          <div className="lg:col-span-1 space-y-6">
            {/* Endpoint Selection */}
            <Card data-testid="card-endpoint-selection">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Select API Endpoint
                </CardTitle>
                <CardDescription>
                  Choose an API endpoint to test
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedEndpoint.id} onValueChange={handleEndpointChange}>
                  <SelectTrigger data-testid="select-endpoint">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {apiEndpoints.map((endpoint) => (
                      <SelectItem key={endpoint.id} value={endpoint.id}>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(endpoint.category)}
                          <span>{endpoint.name}</span>
                          <Badge 
                            variant={endpoint.method === 'GET' ? 'secondary' : 'default'} 
                            className="text-xs"
                          >
                            {endpoint.method}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedEndpoint && (
                  <div className="mt-4 p-3 bg-neutrals-50 dark:bg-neutrals-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(selectedEndpoint.category)}
                      <span className="font-medium text-sm">{selectedEndpoint.category}</span>
                    </div>
                    <p className="text-xs text-neutrals-600 dark:text-neutrals-400">
                      {selectedEndpoint.description}
                    </p>
                    <code className="text-xs font-mono text-primary block mt-2 break-all">
                      {selectedEndpoint.path}
                    </code>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Authentication */}
            <Card data-testid="card-authentication">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Authentication
                </CardTitle>
                <CardDescription>
                  Configure API authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-token">API Token</Label>
                  <div className="relative">
                    <Input
                      id="api-token"
                      type={showApiToken ? "text" : "password"}
                      placeholder="Enter your API token"
                      value={apiToken}
                      onChange={(e) => setApiToken(e.target.value)}
                      className="pr-10"
                      data-testid="input-api-token"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiToken(!showApiToken)}
                      className="absolute right-0 top-0 h-full px-3"
                      data-testid="button-toggle-token-visibility"
                    >
                      {showApiToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="auth-required"
                    checked={selectedEndpoint.requiresAuth}
                    disabled
                  />
                  <Label htmlFor="auth-required" className="text-sm">
                    Authentication Required
                  </Label>
                </div>
                
                {!apiToken && selectedEndpoint.requiresAuth && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      This endpoint requires authentication. Please provide an API token.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Test History */}
            {testHistory.length > 0 && (
              <Card data-testid="card-test-history">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Test History
                  </CardTitle>
                  <CardDescription>
                    Recent API test results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {testHistory.map((test) => (
                      <div 
                        key={test.id} 
                        className="flex items-center justify-between p-2 bg-neutrals-50 dark:bg-neutrals-800 rounded cursor-pointer hover:bg-neutrals-100 dark:hover:bg-neutrals-700"
                        onClick={() => {
                          setSelectedEndpoint(test.endpoint);
                          setResponse(test.response);
                          setActiveTab("response");
                        }}
                        data-testid={`test-history-${test.id}`}
                      >
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.response.status)}
                          <span className="text-xs font-mono">{test.endpoint.method}</span>
                          <span className="text-xs truncate">{test.endpoint.name}</span>
                        </div>
                        <span className={`text-xs font-mono ${getStatusColor(test.response.status)}`}>
                          {test.response.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Request/Response */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Configuration */}
            <Card data-testid="card-request-config">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    API Test Configuration
                  </div>
                  <button
                    onClick={handleTestRequest}
                    disabled={loading || (selectedEndpoint.requiresAuth && !apiToken)}
                    className="au-button disabled:opacity-50 disabled:cursor-not-allowed"
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
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="request">Request</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    <TabsTrigger value="params">Parameters</TabsTrigger>
                    <TabsTrigger value="response">Response</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                  </TabsList>

                  <TabsContent value="request" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="request-body">Request Body</Label>
                      <Textarea
                        id="request-body"
                        placeholder="Enter request body (JSON format)"
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        className="font-mono text-sm min-h-[200px]"
                        data-testid="textarea-request-body"
                      />
                    </div>
                    {selectedEndpoint.method === 'GET' && (
                      <p className="text-sm text-neutrals-500">
                        GET requests don't require a request body
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="headers" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="request-headers">Request Headers</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(requestHeaders, "Headers")}
                          data-testid="button-copy-headers"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <Textarea
                        id="request-headers"
                        placeholder="Enter headers (JSON format)"
                        value={requestHeaders}
                        onChange={(e) => setRequestHeaders(e.target.value)}
                        className="font-mono text-sm min-h-[150px]"
                        data-testid="textarea-headers"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="params" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="path-params">Path Parameters</Label>
                        <Textarea
                          id="path-params"
                          placeholder="Enter path parameters (JSON format)"
                          value={pathParams}
                          onChange={(e) => setPathParams(e.target.value)}
                          className="font-mono text-sm min-h-[100px]"
                          data-testid="textarea-path-params"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="query-params">Query Parameters</Label>
                        <Input
                          id="query-params"
                          placeholder="e.g., page=1&limit=10"
                          value={queryParams}
                          onChange={(e) => setQueryParams(e.target.value)}
                          className="font-mono text-sm"
                          data-testid="input-query-params"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="response" className="space-y-4">
                    {response ? (
                      <div className="space-y-4">
                        {/* Response Status */}
                        <div className="flex items-center justify-between p-4 bg-neutrals-50 dark:bg-neutrals-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(response.status)}
                            <span className={`font-mono font-bold ${getStatusColor(response.status)}`}>
                              {response.status} {response.statusText}
                            </span>
                          </div>
                          <div className="text-right text-sm text-neutrals-600 dark:text-neutrals-400">
                            <div>Response Time: {response.responseTime}ms</div>
                            <div>{new Date(response.timestamp).toLocaleTimeString()}</div>
                          </div>
                        </div>

                        {/* Response Headers */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>Response Headers</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(formatJson(response.headers), "Response headers")}
                              data-testid="button-copy-response-headers"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <pre className="text-xs bg-neutrals-100 dark:bg-neutrals-900 p-3 rounded overflow-x-auto">
                            <code>{formatJson(response.headers)}</code>
                          </pre>
                        </div>

                        {/* Response Body */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>Response Body</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(formatJson(response.data), "Response body")}
                              data-testid="button-copy-response-body"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <pre className="text-xs bg-neutrals-100 dark:bg-neutrals-900 p-3 rounded overflow-x-auto min-h-[200px]">
                            <code>{formatJson(response.data)}</code>
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-neutrals-500">
                        <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Click "Test API" to see the response</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="curl" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>cURL Command</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generateCurl(), "cURL command")}
                          data-testid="button-copy-curl"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <pre className="text-xs bg-neutrals-100 dark:bg-neutrals-900 p-4 rounded overflow-x-auto min-h-[200px]">
                        <code>{generateCurl()}</code>
                      </pre>
                    </div>
                    <p className="text-xs text-neutrals-500">
                      Copy this cURL command to test the API from your terminal or command line
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Start Guide */}
        <Card className="mt-8" data-testid="card-quick-start">
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>
              Get started with testing AU Bank APIs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <h4 className="font-medium">Get OAuth Token</h4>
                </div>
                <p className="text-sm text-neutrals-600 dark:text-neutrals-400 ml-8">
                  First, generate an OAuth token using the "Generate OAuth Token" endpoint
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <h4 className="font-medium">Configure Request</h4>
                </div>
                <p className="text-sm text-neutrals-600 dark:text-neutrals-400 ml-8">
                  Select an endpoint, add your token, and configure the request parameters
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <h4 className="font-medium">Test & Iterate</h4>
                </div>
                <p className="text-sm text-neutrals-600 dark:text-neutrals-400 ml-8">
                  Click "Test API" to execute and review the response data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}