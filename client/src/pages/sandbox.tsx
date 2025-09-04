import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Play, Copy, Settings, Database, CreditCard, Shield } from "lucide-react";
import { Link } from "wouter";

const sandboxEndpoints = [
  // AU Bank OAuth
  { id: "1", name: "Generate Access Token", method: "GET", path: "/api/sandbox/oauth/accesstoken", category: "auth" },
  
  // AU Bank Payment APIs
  { id: "2", name: "CNB Payment Creation", method: "POST", path: "/api/sandbox/CNBPaymentService/paymentCreation", category: "payments" },
  { id: "3", name: "Payment Enquiry", method: "POST", path: "/api/sandbox/paymentEnquiry", category: "payments" },
  
  // Standard Banking APIs
  { id: "4", name: "Get Account Balance", method: "GET", path: "/api/sandbox/accounts/{id}/balance", category: "accounts" },
  { id: "5", name: "Get Account Transactions", method: "GET", path: "/api/sandbox/accounts/{id}/transactions", category: "accounts" },
  { id: "6", name: "Verify Identity", method: "POST", path: "/api/sandbox/kyc/verify", category: "kyc" },
];

const sampleRequests = {
  auth: {
    GET: ""
  },
  accounts: {
    GET: ""
  },
  payments: {
    POST: JSON.stringify({
      "uniqueRequestId": "REQ123456789",
      "corporateCode": "CORP001",
      "corporateProductCode": "PROD001",
      "paymentMethodName": "NEFT",
      "remitterAccountNo": "1234567890123",
      "amount": "1000.00",
      "ifscCode": "AUBL0002086",
      "payableCurrency": "INR",
      "beneAccNo": "9876543210987",
      "beneName": "Test Beneficiary",
      "valueDate": "20240115",
      "remarks": "Payment for services",
      "transactionRefNo": "TXN001",
      "paymentInstruction": "NEFT Payment",
      "email": "test@example.com",
      "phoneNo": "9876543210"
    }, null, 2),
  },
  kyc: {
    POST: JSON.stringify({
      "documentType": "PAN",
      "documentNumber": "ABCDE1234F",
      "name": "John Doe",
      "dateOfBirth": "1990-01-15"
    }, null, 2),
  },
};

export default function Sandbox() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(sandboxEndpoints[0]);
  const [requestBody, setRequestBody] = useState("");
  const [apiKey, setApiKey] = useState("lEbnG39cJwC4lKUe5fliVA9HFcyR");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleEndpointChange = (endpointId: string) => {
    const endpoint = sandboxEndpoints.find(e => e.id === endpointId);
    if (endpoint) {
      setSelectedEndpoint(endpoint);
      
      // Set specific sample requests based on endpoint
      if (endpoint.name === "Payment Enquiry") {
        setRequestBody(JSON.stringify({
          "transactionId": "TXN12345678901",
          "uniqueRequestId": "REQ123456789"
        }, null, 2));
      } else {
        const category = endpoint.category as keyof typeof sampleRequests;
        const method = endpoint.method as keyof typeof sampleRequests[typeof category];
        if (sampleRequests[category] && sampleRequests[category][method]) {
          setRequestBody(sampleRequests[category][method]);
        } else {
          setRequestBody("");
        }
      }
      setResponse(null);
    }
  };

  const handleTestRequest = async () => {
    if (!selectedEndpoint) return;
    
    setLoading(true);
    try {
      const url = selectedEndpoint.path.replace(/{id}/g, 'test123');
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      };
      
      if (selectedEndpoint.method !== 'GET' && requestBody) {
        options.body = requestBody;
      }
      
      const res = await fetch(url, options);
      const data = await res.json();
      setResponse({ 
        status: res.status, 
        statusText: res.statusText,
        headers: {
          'Content-Type': res.headers.get('Content-Type'),
          'Date': res.headers.get('Date'),
        },
        data 
      });
    } catch (error) {
      setResponse({ 
        status: 500,
        error: "Network error - please check your connection" 
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateCurlCommand = () => {
    const url = `${window.location.origin}${selectedEndpoint.path.replace(/{id}/g, 'test123')}`;
    let curl = `curl -X ${selectedEndpoint.method} "${url}"`;
    curl += ` \\\n  -H "Authorization: Bearer YOUR_API_KEY"`;
    curl += ` \\\n  -H "Content-Type: application/json"`;
    
    if (selectedEndpoint.method !== 'GET' && requestBody) {
      curl += ` \\\n  -d '${requestBody.replace(/\n/g, '').replace(/\s+/g, ' ')}'`;
    }
    
    return curl;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="header-bg w-full h-20 flex items-center justify-between px-6 lg:px-24">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-white text-2xl font-semibold" data-testid="page-title">
            API Sandbox
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800" data-testid="environment-badge">
            <Database className="w-3 h-3 mr-1" />
            Sandbox Environment
          </Badge>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-24 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request Panel */}
          <div className="space-y-6">
            <Card data-testid="request-panel">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Request Configuration</span>
                </CardTitle>
                <CardDescription>
                  Configure and test your API requests in a safe sandbox environment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Endpoint
                  </label>
                  <Select value={selectedEndpoint.id} onValueChange={handleEndpointChange}>
                    <SelectTrigger data-testid="select-endpoint">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sandboxEndpoints.map((endpoint) => {
                        const Icon = endpoint.category === 'accounts' ? Database : 
                                   endpoint.category === 'payments' ? CreditCard : Shield;
                        return (
                          <SelectItem key={endpoint.id} value={endpoint.id}>
                            <div className="flex items-center space-x-2">
                              <Icon className="w-4 h-4" />
                              <span>{endpoint.name}</span>
                              <Badge variant="outline" className="ml-auto">
                                {endpoint.method}
                              </Badge>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <Input
                    placeholder="Enter your sandbox API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    type="password"
                    data-testid="input-api-key"
                  />
                  {!apiKey && (
                    <p className="text-xs text-gray-500 mt-1">
                      Use any string as API key in sandbox mode
                    </p>
                  )}
                </div>

                {selectedEndpoint.method !== "GET" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Body
                    </label>
                    <Textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      className="font-mono text-sm"
                      rows={8}
                      data-testid="textarea-request-body"
                    />
                  </div>
                )}

                <Button 
                  onClick={handleTestRequest}
                  disabled={!apiKey || loading}
                  className="w-full btn-primary"
                  data-testid="button-send-request"
                >
                  {loading ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Send Request
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* cURL Command */}
            <Card data-testid="curl-command-panel">
              <CardHeader>
                <CardTitle>cURL Command</CardTitle>
                <CardDescription>
                  Copy this command to test the endpoint from your terminal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-auto">
                    <code data-testid="curl-command">{generateCurlCommand()}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(generateCurlCommand())}
                    data-testid="button-copy-curl"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Response Panel */}
          <div className="space-y-6">
            <Card data-testid="response-panel">
              <CardHeader>
                <CardTitle>Response</CardTitle>
                <CardDescription>
                  Live response from the API sandbox
                </CardDescription>
              </CardHeader>
              <CardContent>
                {response ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Badge 
                        variant={response.status < 300 ? "default" : "destructive"}
                        data-testid="response-status"
                      >
                        {response.status} {response.statusText || ""}
                      </Badge>
                      {response.headers && (
                        <span className="text-sm text-gray-500">
                          {response.headers['Content-Type']}
                        </span>
                      )}
                    </div>
                    
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
                      <pre data-testid="response-body">{JSON.stringify(response.data || response, null, 2)}</pre>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(response, null, 2))}
                      data-testid="button-copy-response"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Response
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12" data-testid="no-response">
                    <p>No response yet</p>
                    <p className="text-sm">Send a request to see the API response here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card data-testid="tips-panel">
              <CardHeader>
                <CardTitle>Sandbox Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Use any API key for testing - real authentication is disabled in sandbox</p>
                  <p>• All data is simulated and will reset when you refresh the page</p>
                  <p>• {`{id}`} parameters are automatically replaced with test values</p>
                  <p>• Responses include realistic banking data structures</p>
                  <p>• Use the cURL commands to test from your own applications</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}