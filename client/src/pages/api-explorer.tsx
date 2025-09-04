import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, CreditCard, Shield, ArrowLeft, Play, Copy } from "lucide-react";
import { Link } from "wouter";
import { ApiEndpoint } from "@shared/schema";

const categoryIcons = {
  auth: Shield,
  accounts: Building2,
  payments: CreditCard,
  kyc: Shield,
};

const categoryColors = {
  auth: "bg-orange-100 text-orange-600",
  accounts: "bg-blue-100 text-blue-600",
  payments: "bg-green-100 text-green-600", 
  kyc: "bg-purple-100 text-purple-600",
};

export default function ApiExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>("accounts");
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [requestBody, setRequestBody] = useState("");
  const [apiKey, setApiKey] = useState("lEbnG39cJwC4lKUe5fliVA9HFcyR");
  const [response, setResponse] = useState<any>(null);

  const { data: endpoints = [], isLoading } = useQuery<ApiEndpoint[]>({
    queryKey: ["/api/endpoints"],
  });

  const categories = ["auth", "accounts", "payments", "kyc"];
  
  const filteredEndpoints = endpoints.filter((endpoint: ApiEndpoint) => 
    endpoint.category === selectedCategory
  );

  // Set sample request body when endpoint changes
  React.useEffect(() => {
    if (selectedEndpoint) {
      let sampleRequest = "";
      
      if (selectedEndpoint.category === "payments" && selectedEndpoint.name === "CNB Payment Creation") {
        sampleRequest = JSON.stringify({
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
        }, null, 2);
      } else if (selectedEndpoint.category === "payments" && selectedEndpoint.name === "Payment Enquiry") {
        sampleRequest = JSON.stringify({
          "transactionId": "TXN12345678901",
          "uniqueRequestId": "REQ123456789"
        }, null, 2);
      } else if (selectedEndpoint.category === "kyc" && selectedEndpoint.name === "Verify Identity") {
        sampleRequest = JSON.stringify({
          "documentType": "PAN",
          "documentNumber": "ABCDE1234F",
          "name": "John Doe",
          "dateOfBirth": "1990-01-15"
        }, null, 2);
      }
      
      setRequestBody(sampleRequest);
      setResponse(null);
    }
  }, [selectedEndpoint]);

  const handleTestEndpoint = async () => {
    if (!selectedEndpoint) return;
    
    try {
      const url = `/api/sandbox${selectedEndpoint.path.replace(/{id}/g, 'test123')}`;
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
      setResponse({ status: res.status, data });
    } catch (error) {
      setResponse({ error: "Failed to make request" });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

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
            API Explorer
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Input 
            placeholder="Enter your API key..." 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-64 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            data-testid="input-api-key"
          />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-24 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories Sidebar */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4" data-testid="categories-title">
                API Categories
              </h2>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = categoryIcons[category as keyof typeof categoryIcons];
                  return (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setSelectedEndpoint(null);
                        setResponse(null);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        selectedCategory === category
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                      }`}
                      data-testid={`button-category-${category}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium capitalize">{category}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Endpoints List */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4" data-testid="endpoints-title">
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Endpoints
              </h3>
              <div className="space-y-2">
                {filteredEndpoints.map((endpoint: ApiEndpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => setSelectedEndpoint(endpoint)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedEndpoint?.id === endpoint.id
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                    data-testid={`endpoint-${endpoint.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{endpoint.name}</span>
                      <Badge variant={endpoint.method === "GET" ? "secondary" : "default"}>
                        {endpoint.method}
                      </Badge>
                    </div>
                    <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {endpoint.path}
                    </code>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {selectedEndpoint ? (
              <Card className="w-full" data-testid="endpoint-details">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedEndpoint.name}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant={selectedEndpoint.method === "GET" ? "secondary" : "default"}>
                        {selectedEndpoint.method}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(selectedEndpoint.path)}
                        data-testid="button-copy-path"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {selectedEndpoint.path}
                    </code>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-6" data-testid="endpoint-description">
                    {selectedEndpoint.description}
                  </p>
                  
                  <Tabs defaultValue="test" className="w-full">
                    <TabsList>
                      <TabsTrigger value="test" data-testid="tab-test">Test</TabsTrigger>
                      <TabsTrigger value="docs" data-testid="tab-docs">Documentation</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="test" className="space-y-4">
                      {selectedEndpoint.method !== "GET" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Request Body (JSON)
                          </label>
                          <Textarea
                            placeholder="Enter JSON request body..."
                            value={requestBody}
                            onChange={(e) => setRequestBody(e.target.value)}
                            className="font-mono"
                            rows={6}
                            data-testid="textarea-request-body"
                          />
                        </div>
                      )}
                      
                      <Button 
                        onClick={handleTestEndpoint}
                        disabled={!apiKey}
                        className="w-full"
                        data-testid="button-test-endpoint"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Test Endpoint
                      </Button>
                      
                      {!apiKey && (
                        <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg" data-testid="warning-api-key">
                          Please enter your API key above to test this endpoint
                        </p>
                      )}
                      
                      {response && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Response</label>
                          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto" data-testid="response-output">
                            <pre>{JSON.stringify(response, null, 2)}</pre>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="docs" className="space-y-4">
                      <div className="prose prose-sm max-w-none">
                        <h4>Endpoint Details</h4>
                        <table className="w-full border border-gray-200">
                          <tbody>
                            <tr>
                              <td className="border-r border-gray-200 p-3 bg-gray-50 font-medium">Method</td>
                              <td className="p-3">{selectedEndpoint.method}</td>
                            </tr>
                            <tr>
                              <td className="border-r border-gray-200 p-3 bg-gray-50 font-medium">Path</td>
                              <td className="p-3"><code>{selectedEndpoint.path}</code></td>
                            </tr>
                            <tr>
                              <td className="border-r border-gray-200 p-3 bg-gray-50 font-medium">Category</td>
                              <td className="p-3 capitalize">{selectedEndpoint.category}</td>
                            </tr>
                            <tr>
                              <td className="border-r border-gray-200 p-3 bg-gray-50 font-medium">Status</td>
                              <td className="p-3">
                                <Badge variant={selectedEndpoint.isActive ? "default" : "destructive"}>
                                  {selectedEndpoint.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        {/* AU Bank specific documentation */}
                        {selectedEndpoint.category === "auth" && selectedEndpoint.name === "Generate Access Token" && (
                          <div>
                            <h4>AU Bank OAuth Authentication</h4>
                            <p><strong>UAT URL:</strong> https://api.aubankuat.in/oauth/accesstoken?grant_type=client_credentials</p>
                            <p><strong>Token Validity:</strong> 24 hours in UAT, 6 months in production</p>
                            <p><strong>Authentication:</strong> Client credentials (provided by AU Bank)</p>
                            
                            <h5>Sample Response:</h5>
                            <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
{`{
  "access_token": "lEbnG39cJwC4lKUe5fliVA9HFcyR",
  "token_type": "BearerToken",
  "expires_in": "86399",
  "client_id": "2I7UVNalTfFBxm3ZYxOtzYXwXX1PMIJCSSFf6AMipK0H0zR9",
  "status": "approved"
}`}
                            </pre>
                          </div>
                        )}

                        {selectedEndpoint.category === "payments" && selectedEndpoint.name === "CNB Payment Creation" && (
                          <div>
                            <h4>AU Bank Payment Creation</h4>
                            <p><strong>UAT URL:</strong> https://api.aubankuat.in/CNBPaymentService/paymentCreation</p>
                            <p><strong>Encryption:</strong> AES-256 encryption required</p>
                            <p><strong>Bulk Payments:</strong> Up to 50 transactions per batch</p>
                            
                            <h5>Sample Request:</h5>
                            <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
{`{
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
  "paymentInstruction": "NEFT Payment"
}`}
                            </pre>
                          </div>
                        )}

                        {selectedEndpoint.category === "payments" && selectedEndpoint.name === "Payment Enquiry" && (
                          <div>
                            <h4>AU Bank Payment Enquiry</h4>
                            <p><strong>Recommended Frequency:</strong> Every 15 minutes for NEFT transactions</p>
                            <p><strong>Processing Time:</strong> NEFT transactions may take 1-2 hours to reflect final status</p>
                            
                            <h5>Sample Request:</h5>
                            <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
{`{
  "transactionId": "TXN12345678901",
  "uniqueRequestId": "REQ123456789"
}`}
                            </pre>

                            <h5>Sample Response:</h5>
                            <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
{`{
  "responseCode": "00",
  "responseMessage": "Enquiry processed successfully",
  "transactionId": "TXN12345678901",
  "paymentStatus": "SUCCESS",
  "bankReference": "AU1234567890",
  "processedDate": "2024-01-15T10:30:00Z",
  "amount": "1000.00",
  "currency": "INR"
}`}
                            </pre>
                          </div>
                        )}
                        
                        <h4>Authentication</h4>
                        <p>This endpoint requires Bearer token authentication. Include your API key in the Authorization header:</p>
                        <code className="bg-gray-100 p-2 block rounded">
                          Authorization: Bearer YOUR_API_KEY
                        </code>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full h-96 flex items-center justify-center" data-testid="no-endpoint-selected">
                <CardContent className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select an API endpoint to explore
                  </h3>
                  <p className="text-gray-600">
                    Choose a category and endpoint from the sidebar to view documentation and test the API
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}