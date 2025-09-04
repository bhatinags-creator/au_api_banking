import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Copy, ChevronDown, ChevronRight, Play, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface APIEndpoint {
  id: string;
  method: string;
  path: string;
  title: string;
  description: string;
  parameters?: Parameter[];
  requestBody?: RequestBodySchema;
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
  constraints?: string;
}

interface RequestBodySchema {
  type: string;
  properties: { [key: string]: Property };
  required: string[];
}

interface Property {
  type: string;
  description: string;
  example?: any;
  maxLength?: number;
  minLength?: number;
  format?: string;
  enum?: string[];
}

interface Response {
  status: number;
  description: string;
  schema?: any;
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

const endpoints: APIEndpoint[] = [
  {
    id: "oauth-token",
    method: "POST",
    path: "/oauth/token",
    title: "OAuth Token Generation",
    description: "Generate OAuth access token for API authentication. This endpoint uses AES-256 encryption for secure token generation.",
    security: [
      { type: "Client Credentials", description: "Base64 encoded client_id:client_secret in Authorization header" }
    ],
    parameters: [
      { name: "Authorization", type: "string", required: true, description: "Base64 encoded credentials", example: "Basic Y2xpZW50X2lkOmNsaWVudF9zZWNyZXQ=" },
      { name: "Content-Type", type: "string", required: true, description: "Must be application/x-www-form-urlencoded", example: "application/x-www-form-urlencoded" }
    ],
    requestBody: {
      type: "application/x-www-form-urlencoded",
      properties: {
        grant_type: {
          type: "string",
          description: "OAuth grant type",
          example: "client_credentials",
          enum: ["client_credentials"]
        },
        scope: {
          type: "string", 
          description: "Requested scopes for the token",
          example: "payment_read payment_write"
        }
      },
      required: ["grant_type"]
    },
    responses: [
      {
        status: 200,
        description: "Token generated successfully",
        schema: {
          access_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
          token_type: "Bearer",
          expires_in: 3600,
          scope: "payment_read payment_write"
        }
      },
      {
        status: 400,
        description: "Invalid request",
        schema: {
          error: "invalid_request",
          error_description: "Missing or invalid grant_type"
        }
      },
      {
        status: 401,
        description: "Invalid client credentials",
        schema: {
          error: "invalid_client",
          error_description: "Client authentication failed"
        }
      }
    ],
    examples: [
      {
        title: "Generate Access Token",
        request: {
          grant_type: "client_credentials",
          scope: "payment_read payment_write"
        },
        response: {
          access_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.EkN-DOsnsuRjRO6BxXemmJDm3HbxrbRzXglbN2S4sOkopdU4IsDxTI8jO19W_A4K8ZPJijNLis4EZsHeY559a4DFOd50_OqgHs_n2nZ2NrMnYtfGxbJBxdRv6oaKhL5PB2cNx2llxLg1f4h-vC5N-qE-mTK3n9n8i-N1jw5mI1L",
          token_type: "Bearer",
          expires_in: 3600,
          scope: "payment_read payment_write"
        },
        curl: `curl -X POST "https://aubank.tech/uat/oauth/token" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -H "Authorization: Basic Y2xpZW50X2lkOmNsaWVudF9zZWNyZXQ=" \\
  -d "grant_type=client_credentials&scope=payment_read payment_write"`
      }
    ]
  },
  {
    id: "cnb-payment",
    method: "POST", 
    path: "/cnb/payment",
    title: "CNB Payment Creation",
    description: "Create a new CNB (Card Not Present) payment transaction. Supports both domestic and international transfers with real-time processing.",
    security: [
      { type: "Bearer Token", description: "OAuth access token in Authorization header" }
    ],
    parameters: [
      { name: "Authorization", type: "string", required: true, description: "Bearer token from OAuth", example: "Bearer eyJhbGciOiJSUzI1NiIs..." },
      { name: "Content-Type", type: "string", required: true, description: "Must be application/json", example: "application/json" },
      { name: "X-Request-ID", type: "string", required: true, description: "Unique request identifier", example: "req_123456789", constraints: "Max 50 characters" }
    ],
    requestBody: {
      type: "application/json",
      properties: {
        amount: {
          type: "number",
          description: "Payment amount in smallest currency unit",
          example: 100000,
          minLength: 1
        },
        currency: {
          type: "string",
          description: "ISO currency code",
          example: "INR",
          maxLength: 3,
          minLength: 3
        },
        reference: {
          type: "string", 
          description: "Merchant reference ID",
          example: "TXN_20241201_001",
          maxLength: 50
        },
        description: {
          type: "string",
          description: "Payment description",
          example: "Online purchase - Electronics",
          maxLength: 200
        },
        beneficiary: {
          type: "object",
          description: "Beneficiary details",
          example: {
            name: "John Doe",
            account_number: "1234567890123456",
            bank_code: "AUBL0002086",
            account_type: "SAVINGS"
          }
        },
        remitter: {
          type: "object",
          description: "Remitter details", 
          example: {
            name: "Jane Smith",
            account_number: "9876543210987654",
            mobile: "+911234567890"
          }
        }
      },
      required: ["amount", "currency", "reference", "beneficiary", "remitter"]
    },
    responses: [
      {
        status: 201,
        description: "Payment created successfully",
        schema: {
          payment_id: "pay_1a2b3c4d5e6f",
          status: "PENDING",
          amount: 100000,
          currency: "INR",
          reference: "TXN_20241201_001",
          created_at: "2024-12-01T10:30:00Z",
          estimated_completion: "2024-12-01T10:32:00Z"
        }
      },
      {
        status: 400,
        description: "Invalid request data",
        schema: {
          error: "VALIDATION_ERROR",
          message: "Invalid beneficiary account number",
          details: {
            field: "beneficiary.account_number",
            code: "INVALID_FORMAT"
          }
        }
      },
      {
        status: 401,
        description: "Authentication failed",
        schema: {
          error: "UNAUTHORIZED",
          message: "Invalid or expired access token"
        }
      },
      {
        status: 403,
        description: "Insufficient permissions",
        schema: {
          error: "FORBIDDEN", 
          message: "Payment creation not allowed for this client"
        }
      }
    ],
    examples: [
      {
        title: "Domestic Bank Transfer",
        request: {
          amount: 100000,
          currency: "INR", 
          reference: "TXN_20241201_001",
          description: "Online purchase - Electronics",
          beneficiary: {
            name: "John Doe",
            account_number: "1234567890123456",
            bank_code: "AUBL0002086",
            account_type: "SAVINGS"
          },
          remitter: {
            name: "Jane Smith", 
            account_number: "9876543210987654",
            mobile: "+911234567890"
          }
        },
        response: {
          payment_id: "pay_1a2b3c4d5e6f",
          status: "PENDING",
          amount: 100000,
          currency: "INR",
          reference: "TXN_20241201_001", 
          created_at: "2024-12-01T10:30:00Z",
          estimated_completion: "2024-12-01T10:32:00Z"
        },
        curl: `curl -X POST "https://aubank.tech/uat/cnb/payment" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..." \\
  -H "X-Request-ID: req_123456789" \\
  -d '{
    "amount": 100000,
    "currency": "INR",
    "reference": "TXN_20241201_001",
    "description": "Online purchase - Electronics",
    "beneficiary": {
      "name": "John Doe",
      "account_number": "1234567890123456",
      "bank_code": "AUBL0002086",
      "account_type": "SAVINGS"
    },
    "remitter": {
      "name": "Jane Smith",
      "account_number": "9876543210987654", 
      "mobile": "+911234567890"
    }
  }'`
      }
    ]
  },
  {
    id: "payment-enquiry",
    method: "GET",
    path: "/payment/{payment_id}",
    title: "Payment Enquiry",
    description: "Retrieve detailed information about a specific payment transaction including status, timeline, and settlement details.",
    security: [
      { type: "Bearer Token", description: "OAuth access token in Authorization header" }
    ],
    parameters: [
      { name: "payment_id", type: "string", required: true, description: "Unique payment identifier", example: "pay_1a2b3c4d5e6f", constraints: "Path parameter" },
      { name: "Authorization", type: "string", required: true, description: "Bearer token from OAuth", example: "Bearer eyJhbGciOiJSUzI1NiIs..." },
      { name: "X-Request-ID", type: "string", required: false, description: "Optional request tracking ID", example: "req_987654321" }
    ],
    responses: [
      {
        status: 200,
        description: "Payment details retrieved successfully",
        schema: {
          payment_id: "pay_1a2b3c4d5e6f",
          status: "COMPLETED",
          amount: 100000,
          currency: "INR",
          reference: "TXN_20241201_001",
          description: "Online purchase - Electronics",
          beneficiary: {
            name: "John Doe",
            account_number: "****7890123456",
            bank_code: "AUBL0002086"
          },
          remitter: {
            name: "Jane Smith",
            account_number: "****3210987654"
          },
          created_at: "2024-12-01T10:30:00Z",
          completed_at: "2024-12-01T10:31:45Z",
          settlement_date: "2024-12-01",
          timeline: [
            {
              status: "PENDING",
              timestamp: "2024-12-01T10:30:00Z",
              description: "Payment initiated"
            },
            {
              status: "PROCESSING", 
              timestamp: "2024-12-01T10:30:30Z",
              description: "Payment processing started"
            },
            {
              status: "COMPLETED",
              timestamp: "2024-12-01T10:31:45Z",
              description: "Payment completed successfully"
            }
          ]
        }
      },
      {
        status: 404,
        description: "Payment not found",
        schema: {
          error: "NOT_FOUND",
          message: "Payment with ID 'pay_1a2b3c4d5e6f' not found"
        }
      },
      {
        status: 401,
        description: "Authentication failed",
        schema: {
          error: "UNAUTHORIZED",
          message: "Invalid or expired access token"
        }
      }
    ],
    examples: [
      {
        title: "Get Payment Status",
        response: {
          payment_id: "pay_1a2b3c4d5e6f",
          status: "COMPLETED",
          amount: 100000,
          currency: "INR",
          reference: "TXN_20241201_001",
          description: "Online purchase - Electronics",
          beneficiary: {
            name: "John Doe",
            account_number: "****7890123456",
            bank_code: "AUBL0002086"
          },
          remitter: {
            name: "Jane Smith",
            account_number: "****3210987654"
          },
          created_at: "2024-12-01T10:30:00Z",
          completed_at: "2024-12-01T10:31:45Z",
          settlement_date: "2024-12-01",
          timeline: [
            {
              status: "PENDING",
              timestamp: "2024-12-01T10:30:00Z", 
              description: "Payment initiated"
            },
            {
              status: "PROCESSING",
              timestamp: "2024-12-01T10:30:30Z",
              description: "Payment processing started"
            },
            {
              status: "COMPLETED",
              timestamp: "2024-12-01T10:31:45Z",
              description: "Payment completed successfully"
            }
          ]
        },
        curl: `curl -X GET "https://aubank.tech/uat/payment/pay_1a2b3c4d5e6f" \\
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..." \\
  -H "X-Request-ID: req_987654321"`
      }
    ]
  }
];

export function APIDocs() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activeExample, setActiveExample] = useState<{ [key: string]: number }>({});
  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const formatJson = (obj: any) => JSON.stringify(obj, null, 2);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'POST': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'PUT': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600 dark:text-green-400';
    if (status >= 400 && status < 500) return 'text-yellow-600 dark:text-yellow-400';
    if (status >= 500) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-25 to-neutrals-50 dark:from-neutrals-900 dark:to-neutrals-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutrals-900 dark:text-neutrals-50 mb-4">
            AU Small Finance Bank API Documentation
          </h1>
          <p className="text-lg text-neutrals-600 dark:text-neutrals-300 max-w-3xl mx-auto">
            Comprehensive documentation for AU Bank's payment APIs including OAuth authentication, 
            CNB payments, and transaction enquiry services.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Badge variant="secondary" className="text-sm">
              Version 2.1.0
            </Badge>
            <Badge variant="outline" className="text-sm">
              UAT Environment
            </Badge>
          </div>
        </div>

        {/* Base URL Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Base URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-neutrals-100 dark:bg-neutrals-800 p-4 rounded-lg font-mono text-sm">
              <div className="flex items-center justify-between">
                <span className="text-primary">https://aubank.tech/uat</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard("https://aubank.tech/uat", "Base URL")}
                  data-testid="button-copy-base-url"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-neutrals-600 dark:text-neutrals-400 mt-2">
              All API requests should be made to this base URL with the appropriate endpoint path.
            </p>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <div className="space-y-6">
          {endpoints.map((endpoint) => (
            <Card key={endpoint.id} className="overflow-hidden" data-testid={`endpoint-${endpoint.id}`}>
              <Collapsible
                open={expandedSections.includes(endpoint.id)}
                onOpenChange={() => toggleSection(endpoint.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-neutrals-50 dark:hover:bg-neutrals-800 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </Badge>
                        <div>
                          <CardTitle className="text-lg">{endpoint.title}</CardTitle>
                          <code className="text-sm text-neutrals-600 dark:text-neutrals-400 font-mono">
                            {endpoint.path}
                          </code>
                        </div>
                      </div>
                      {expandedSections.includes(endpoint.id) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </div>
                    <CardDescription>{endpoint.description}</CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="request">Request</TabsTrigger>
                        <TabsTrigger value="response">Response</TabsTrigger>
                        <TabsTrigger value="examples">Examples</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-6">
                        {/* Security */}
                        {endpoint.security && (
                          <div>
                            <h4 className="font-semibold mb-3">Authentication</h4>
                            <div className="space-y-2">
                              {endpoint.security.map((security, index) => (
                                <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">{security.type}</Badge>
                                    <span className="text-sm text-neutrals-700 dark:text-neutrals-300">
                                      {security.description}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Path Parameters */}
                        {endpoint.parameters && endpoint.parameters.some(p => endpoint.path.includes(`{${p.name}}`)) && (
                          <div>
                            <h4 className="font-semibold mb-3">Path Parameters</h4>
                            <div className="space-y-3">
                              {endpoint.parameters
                                .filter(param => endpoint.path.includes(`{${param.name}}`))
                                .map((param, index) => (
                                <div key={index} className="p-4 border rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <code className="text-sm font-mono bg-neutrals-100 dark:bg-neutrals-800 px-2 py-1 rounded">
                                      {param.name}
                                    </code>
                                    <Badge variant={param.required ? "destructive" : "secondary"} className="text-xs">
                                      {param.required ? "required" : "optional"}
                                    </Badge>
                                    <span className="text-xs text-neutrals-500">({param.type})</span>
                                  </div>
                                  <p className="text-sm text-neutrals-600 dark:text-neutrals-400 mb-2">
                                    {param.description}
                                  </p>
                                  {param.example && (
                                    <div className="text-xs">
                                      <span className="text-neutrals-500">Example: </span>
                                      <code className="font-mono bg-neutrals-100 dark:bg-neutrals-800 px-1 py-0.5 rounded">
                                        {param.example}
                                      </code>
                                    </div>
                                  )}
                                  {param.constraints && (
                                    <div className="text-xs text-neutrals-500 mt-1">
                                      Constraints: {param.constraints}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="request" className="space-y-6">
                        {/* Headers */}
                        {endpoint.parameters && endpoint.parameters.some(p => !endpoint.path.includes(`{${p.name}}`)) && (
                          <div>
                            <h4 className="font-semibold mb-3">Headers</h4>
                            <div className="space-y-3">
                              {endpoint.parameters
                                .filter(param => !endpoint.path.includes(`{${param.name}}`))
                                .map((param, index) => (
                                <div key={index} className="p-4 border rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <code className="text-sm font-mono bg-neutrals-100 dark:bg-neutrals-800 px-2 py-1 rounded">
                                      {param.name}
                                    </code>
                                    <Badge variant={param.required ? "destructive" : "secondary"} className="text-xs">
                                      {param.required ? "required" : "optional"}
                                    </Badge>
                                    <span className="text-xs text-neutrals-500">({param.type})</span>
                                  </div>
                                  <p className="text-sm text-neutrals-600 dark:text-neutrals-400 mb-2">
                                    {param.description}
                                  </p>
                                  {param.example && (
                                    <div className="text-xs">
                                      <span className="text-neutrals-500">Example: </span>
                                      <div className="flex items-center gap-2 mt-1">
                                        <code className="font-mono bg-neutrals-100 dark:bg-neutrals-800 px-2 py-1 rounded text-xs flex-1">
                                          {showSecrets[`${endpoint.id}-${param.name}`] ? param.example : param.example.replace(/[A-Za-z0-9]/g, '*')}
                                        </code>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setShowSecrets(prev => ({
                                            ...prev,
                                            [`${endpoint.id}-${param.name}`]: !prev[`${endpoint.id}-${param.name}`]
                                          }))}
                                          className="h-8 w-8 p-0"
                                        >
                                          {showSecrets[`${endpoint.id}-${param.name}`] ? (
                                            <EyeOff className="w-3 h-3" />
                                          ) : (
                                            <Eye className="w-3 h-3" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Request Body */}
                        {endpoint.requestBody && (
                          <div>
                            <h4 className="font-semibold mb-3">Request Body</h4>
                            <div className="space-y-4">
                              <div className="p-3 bg-neutrals-50 dark:bg-neutrals-800 rounded-lg">
                                <span className="text-sm font-medium">Content-Type: </span>
                                <code className="text-sm font-mono">{endpoint.requestBody.type}</code>
                              </div>
                              
                              <div className="space-y-3">
                                {Object.entries(endpoint.requestBody.properties).map(([key, prop]) => (
                                  <div key={key} className="p-4 border rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <code className="text-sm font-mono bg-neutrals-100 dark:bg-neutrals-800 px-2 py-1 rounded">
                                        {key}
                                      </code>
                                      <Badge 
                                        variant={endpoint.requestBody?.required.includes(key) ? "destructive" : "secondary"} 
                                        className="text-xs"
                                      >
                                        {endpoint.requestBody?.required.includes(key) ? "required" : "optional"}
                                      </Badge>
                                      <span className="text-xs text-neutrals-500">({prop.type})</span>
                                    </div>
                                    <p className="text-sm text-neutrals-600 dark:text-neutrals-400 mb-2">
                                      {prop.description}
                                    </p>
                                    {prop.example && (
                                      <div className="text-xs">
                                        <span className="text-neutrals-500">Example: </span>
                                        <code className="font-mono bg-neutrals-100 dark:bg-neutrals-800 px-1 py-0.5 rounded">
                                          {typeof prop.example === 'object' ? JSON.stringify(prop.example) : prop.example}
                                        </code>
                                      </div>
                                    )}
                                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-neutrals-500">
                                      {prop.maxLength && <span>Max length: {prop.maxLength}</span>}
                                      {prop.minLength && <span>Min length: {prop.minLength}</span>}
                                      {prop.format && <span>Format: {prop.format}</span>}
                                      {prop.enum && <span>Allowed values: {prop.enum.join(', ')}</span>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="response" className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-3">Response Codes</h4>
                          <div className="space-y-4">
                            {endpoint.responses.map((response, index) => (
                              <div key={index} className="border rounded-lg overflow-hidden">
                                <div className="p-4 bg-neutrals-50 dark:bg-neutrals-800 border-b">
                                  <div className="flex items-center gap-3">
                                    <code className={`font-bold ${getStatusColor(response.status)}`}>
                                      {response.status}
                                    </code>
                                    <span className="text-sm">{response.description}</span>
                                  </div>
                                </div>
                                {response.schema && (
                                  <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium">Response Body:</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(formatJson(response.schema), "Response schema")}
                                        data-testid={`button-copy-response-${response.status}`}
                                      >
                                        <Copy className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    <pre className="text-xs bg-neutrals-100 dark:bg-neutrals-900 p-3 rounded overflow-x-auto">
                                      <code>{formatJson(response.schema)}</code>
                                    </pre>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="examples" className="space-y-6">
                        {endpoint.examples.map((example, index) => (
                          <div key={index} className="border rounded-lg overflow-hidden">
                            <div className="p-4 bg-neutrals-50 dark:bg-neutrals-800 border-b">
                              <h5 className="font-medium">{example.title}</h5>
                            </div>
                            <div className="p-4 space-y-4">
                              {example.curl && (
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">cURL Command:</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(example.curl!, "cURL command")}
                                      data-testid={`button-copy-curl-${index}`}
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <pre className="text-xs bg-neutrals-100 dark:bg-neutrals-900 p-3 rounded overflow-x-auto">
                                    <code>{example.curl}</code>
                                  </pre>
                                </div>
                              )}
                              
                              {example.request && (
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Request Body:</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(formatJson(example.request), "Request body")}
                                      data-testid={`button-copy-request-${index}`}
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <pre className="text-xs bg-neutrals-100 dark:bg-neutrals-900 p-3 rounded overflow-x-auto">
                                    <code>{formatJson(example.request)}</code>
                                  </pre>
                                </div>
                              )}
                              
                              {example.response && (
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Response:</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(formatJson(example.response), "Response body")}
                                      data-testid={`button-copy-response-example-${index}`}
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <pre className="text-xs bg-neutrals-100 dark:bg-neutrals-900 p-3 rounded overflow-x-auto">
                                    <code>{formatJson(example.response)}</code>
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}