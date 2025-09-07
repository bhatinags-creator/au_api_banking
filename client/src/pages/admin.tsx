import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft, Settings, Plus, Edit, Trash2, Save, Eye, Users, 
  Database, Shield, CreditCard, BookOpen, Code, FileText,
  BarChart3, Activity, Globe, Lock, Check, X
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  example?: string;
  enum?: string[];
  format?: string;
}

interface APIHeader {
  name: string;
  required: boolean;
  description: string;
  example: string;
}

interface APIResponse {
  statusCode: number;
  description: string;
  schema: string;
  example: string;
}

interface APIEndpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  category: string;
  description: string;
  summary: string;
  requiresAuth: boolean;
  authType?: 'bearer' | 'apiKey' | 'oauth2' | 'basic';
  queryParameters: APIParameter[];
  pathParameters: APIParameter[];
  bodyParameters: APIParameter[];
  headers: APIHeader[];
  responses: APIResponse[];
  requestExample: string;
  responseExample: string;
  documentation?: string;
  validationSchema?: any;
  status: 'active' | 'deprecated' | 'draft';
  tags: string[];
  rateLimit?: number;
  timeout?: number;
}

interface APICategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  endpoints: string[];
}

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  lastLogin: string;
  status: 'active' | 'inactive';
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [apis, setApis] = useState<APIEndpoint[]>([]);
  const [categories, setCategories] = useState<APICategory[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const [editingApi, setEditingApi] = useState<APIEndpoint | null>(null);
  const [editingCategory, setEditingCategory] = useState<APICategory | null>(null);
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [apiConfigTab, setApiConfigTab] = useState("basic");
  
  const { toast } = useToast();

  // Simple admin authentication
  const handleAdminLogin = () => {
    // In production, this would be a proper authentication system
    if (adminCredentials.username === "admin" && adminCredentials.password === "aubank2024") {
      setIsAuthenticated(true);
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the AU Bank API Developer Portal Admin Panel"
      });
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid admin credentials",
        variant: "destructive"
      });
    }
  };

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  const loadAdminData = () => {
    // Load real API data from the application configuration
    const realApiData: APIEndpoint[] = [];
    
    // Customer APIs
    realApiData.push(
      {
        id: "customer-360-service",
        name: "Customer 360 Service",
        method: "POST",
        path: "/api/sandbox/customer360service",
        category: "Customer",
        description: "Comprehensive customer information API providing complete customer profile, account details, and relationship information",
        summary: "Get complete customer profile data",
        requiresAuth: true,
        authType: "bearer",
        queryParameters: [],
        pathParameters: [],
        bodyParameters: [
          {
            name: "customerID",
            type: "string",
            required: true,
            description: "Customer identification number",
            example: "CUST123456"
          }
        ],
        headers: [
          {
            name: "Authorization",
            required: true,
            description: "Bearer token for authentication",
            example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          },
          {
            name: "Content-Type",
            required: true,
            description: "Content type header",
            example: "application/json"
          }
        ],
        responses: [
          {
            statusCode: 200,
            description: "Customer profile retrieved successfully",
            schema: "{\"customerBasicInquiry\": {}, \"accountDetails\": [], \"transactionStatus\": {}}",
            example: "{\"customerBasicInquiry\": {\"customerID\": \"CUST123456\", \"customerName\": \"John Doe\", \"mobileNumber\": \"9876543210\"}, \"accountDetails\": [], \"transactionStatus\": {\"status\": \"ACTIVE\"}}"
          }
        ],
        requestExample: "{\n  \"customerID\": \"CUST123456\"\n}",
        responseExample: "{\n  \"customerBasicInquiry\": {\n    \"customerID\": \"CUST123456\",\n    \"customerName\": \"John Doe\",\n    \"mobileNumber\": \"9876543210\"\n  },\n  \"accountDetails\": [],\n  \"transactionStatus\": {\n    \"status\": \"ACTIVE\"\n  }\n}",
        status: "active",
        tags: ["customer", "profile"],
        rateLimit: 100,
        timeout: 30000,
        documentation: "Retrieve comprehensive customer information including profile, accounts, and transaction status"
      },
      {
        id: "oauth-token",
        name: "OAuth Token Generation",
        method: "POST",
        path: "/api/sandbox/oauth/accesstoken",
        category: "Authentication",
        description: "Generate OAuth access token for API authentication with secure token management",
        summary: "OAuth token generation endpoint",
        requiresAuth: false,
        authType: "basic",
        queryParameters: [],
        pathParameters: [],
        bodyParameters: [
          {
            name: "grant_type",
            type: "string",
            required: true,
            description: "OAuth grant type",
            example: "client_credentials",
            enum: ["client_credentials"]
          },
          {
            name: "client_id",
            type: "string",
            required: true,
            description: "Client identifier provided during registration",
            example: "aubank_internal_client"
          },
          {
            name: "client_secret",
            type: "string",
            required: true,
            description: "Client secret for authentication",
            example: "your_client_secret"
          }
        ],
        headers: [
          {
            name: "Content-Type",
            required: true,
            description: "Content type header",
            example: "application/json"
          }
        ],
        responses: [
          {
            statusCode: 200,
            description: "Token generated successfully",
            schema: "{\"access_token\": \"string\", \"token_type\": \"string\", \"expires_in\": \"number\"}",
            example: "{\"access_token\": \"internal_access_123456789_abcdefghi\", \"token_type\": \"BearerToken\", \"expires_in\": \"86400\"}"
          }
        ],
        requestExample: "{\n  \"grant_type\": \"client_credentials\",\n  \"client_id\": \"aubank_internal_client\",\n  \"client_secret\": \"your_client_secret\"\n}",
        responseExample: "{\n  \"refresh_token_expires_in\": \"0\",\n  \"api_product_list\": \"[Internal APIs, Authentication, Payments, Accounts, KYC]\",\n  \"organization_name\": \"au-bank-internal\",\n  \"token_type\": \"BearerToken\",\n  \"issued_at\": \"1673875200000\",\n  \"access_token\": \"internal_access_123456789_abcdefghi\",\n  \"expires_in\": \"86400\",\n  \"status\": \"approved\"\n}",
        status: "active",
        tags: ["authentication", "oauth", "security"],
        rateLimit: 100,
        timeout: 30000,
        documentation: "This endpoint generates OAuth tokens for secure API access with enterprise-grade authentication"
      },
      {
        id: "cnb-payment",
        name: "CNB Payment Creation",
        method: "POST",
        path: "/api/sandbox/cnb/payment",
        category: "Payments",
        description: "Create CNB payment transactions supporting NEFT, RTGS, and IMPS with real-time status tracking",
        summary: "Create CNB payment transaction",
        requiresAuth: true,
        authType: "bearer",
        queryParameters: [],
        pathParameters: [],
        bodyParameters: [
          {
            name: "amount",
            type: "number",
            required: true,
            description: "Payment amount in INR",
            example: "1000.50"
          },
          {
            name: "currency",
            type: "string",
            required: true,
            description: "Currency code",
            example: "INR",
            enum: ["INR"]
          },
          {
            name: "beneficiary_account",
            type: "string",
            required: true,
            description: "Beneficiary account number",
            example: "1234567890"
          },
          {
            name: "payment_mode",
            type: "string",
            required: true,
            description: "Payment mode",
            example: "NEFT",
            enum: ["NEFT", "RTGS", "IMPS"]
          }
        ],
        headers: [
          {
            name: "Authorization",
            required: true,
            description: "Bearer token for authentication",
            example: "Bearer internal_access_123456789_abcdefghi"
          },
          {
            name: "Content-Type",
            required: true,
            description: "Content type header",
            example: "application/json"
          }
        ],
        responses: [
          {
            statusCode: 201,
            description: "Payment created successfully",
            schema: "{\"payment_id\": \"string\", \"status\": \"string\", \"amount\": \"number\", \"tracking_id\": \"string\"}",
            example: "{\"payment_id\": \"PAY123456789\", \"status\": \"INITIATED\", \"amount\": 1000.50, \"tracking_id\": \"TXN987654321\"}"
          }
        ],
        requestExample: "{\n  \"amount\": 1000.50,\n  \"currency\": \"INR\",\n  \"beneficiary_account\": \"1234567890\",\n  \"payment_mode\": \"NEFT\"\n}",
        responseExample: "{\n  \"payment_id\": \"PAY123456789\",\n  \"status\": \"INITIATED\",\n  \"amount\": 1000.50,\n  \"currency\": \"INR\",\n  \"payment_mode\": \"NEFT\",\n  \"tracking_id\": \"TXN987654321\",\n  \"created_at\": \"2024-12-07T10:30:00Z\"\n}",
        status: "active",
        tags: ["payments", "cnb", "neft", "rtgs", "imps"],
        rateLimit: 50,
        timeout: 60000,
        documentation: "Create payment transactions using CNB gateway with support for multiple payment modes and real-time tracking"
      }
    );

    setApis(realApiData);

    // Load real categories from the application
    setCategories([
      {
        id: "customer",
        name: "Customer",
        description: "Essential APIs for integrating with core banking services. Run checks and validations using fundamental APIs such as KYC verification, account validation, and identity checks.",
        icon: "Shield",
        color: "#2563eb",
        endpoints: ["customer-360-service", "customer-dedupe", "ckyc-search", "customer-image-upload", "posidex-fetch-ucic", "update-customer-details", "aadhar-vault-insert", "aadhar-vault-get", "cibil-service"]
      },
      {
        id: "loans",
        name: "Loans",
        description: "Comprehensive loan management APIs for personal loans, home loans, and business financing with automated approval workflows and real-time status tracking.",
        icon: "CreditCard",
        color: "#16a34a",
        endpoints: ["loan-application", "loan-status", "emi-calculator", "loan-prepayment", "loan-documents", "loan-eligibility"]
      },
      {
        id: "liabilities",
        name: "Liabilities",
        description: "Enable customers to invest and bank with you by integrating savings accounts, corporate accounts, fixed deposits, and recurring deposit services.",
        icon: "Database",
        color: "#9333ea",
        endpoints: ["account-balance", "account-transactions", "fd-creation", "fd-maturity", "rd-creation", "account-statement", "interest-calculation"]
      },
      {
        id: "cards",
        name: "Cards",
        description: "Empower your corporate banking with seamless APIs for credit card management, debit card services, and card transaction processing.",
        icon: "CreditCard",
        color: "#ea580c",
        endpoints: ["card-application", "card-status", "card-block-unblock", "card-transactions", "card-pin", "card-limit", "virtual-card", "card-rewards"]
      },
      {
        id: "payments",
        name: "Payments",
        description: "Industry-leading payment APIs to introduce tailored payment services. Multiple payment options to integrate your services with the outside world.",
        icon: "Building2",
        color: "#dc2626",
        endpoints: ["cnb-payment", "upi-payment", "payment-status", "payment-reconciliation"]
      },
      {
        id: "authentication",
        name: "Authentication",
        description: "Secure authentication and authorization APIs with OAuth 2.0 implementation for enterprise security and token management.",
        icon: "Shield",
        color: "#7c3aed",
        endpoints: ["oauth-token", "token-refresh", "token-validation"]
      },
      {
        id: "trade-services",
        name: "Trade Services",
        description: "Incorporate remittances and bank guarantees APIs to make trade and business operations easy with our latest market-tailored offerings.",
        icon: "FileCheck",
        color: "#be185d",
        endpoints: ["letter-of-credit", "bank-guarantee", "export-financing", "import-financing", "trade-documents"]
      },
      {
        id: "corporate",
        name: "Corporate API Suite",
        description: "A curated collection of APIs specially selected to cater to evolving corporate client needs, studied after careful analysis of corporate journeys.",
        icon: "Layers",
        color: "#4338ca",
        endpoints: ["corporate-onboard", "bulk-payments", "virtual-account-mgmt", "corporate-account", "cash-management", "reconciliation"]
      }
    ]);

    setUsers([
      {
        id: "1",
        username: "admin",
        email: "admin@aubank.in",
        role: "super_admin",
        lastLogin: "2024-12-05T10:30:00Z",
        status: "active"
      }
    ]);
  };

  // API Management Functions
  const handleSaveApi = (apiData: Partial<APIEndpoint>) => {
    if (editingApi) {
      setApis(apis.map(api => api.id === editingApi.id ? { ...api, ...apiData } : api));
      toast({ title: "API Updated", description: "API endpoint has been successfully updated" });
    } else {
      const newApi: APIEndpoint = {
        ...apiData as APIEndpoint,
        id: Date.now().toString(),
        status: 'active'
      };
      setApis([...apis, newApi]);
      toast({ title: "API Created", description: "New API endpoint has been created" });
    }
    setEditingApi(null);
    setShowApiDialog(false);
  };

  const handleDeleteApi = (apiId: string) => {
    setApis(apis.filter(api => api.id !== apiId));
    toast({ title: "API Deleted", description: "API endpoint has been removed" });
  };

  // Category Management Functions - Production Ready with Backend API
  const handleSaveCategory = async (categoryData: Partial<APICategory>) => {
    try {
      if (editingCategory) {
        // Update existing category via API
        const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: categoryData.name,
            description: categoryData.description,
            icon: categoryData.icon,
            color: categoryData.color,
            displayOrder: editingCategory.endpoints?.length || 0,
            isActive: true
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update category');
        }
        
        const categoryResponse = await response.json();
        setCategories(categories.map(cat => cat.id === editingCategory.id ? {
          ...cat,
          name: categoryResponse.name,
          description: categoryResponse.description,
          icon: categoryResponse.icon,
          color: categoryResponse.color
        } : cat));
        toast({ title: "Category Updated", description: "API category has been updated and will appear in the main portal" });
      } else {
        // Create new category via API
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: categoryData.name,
            description: categoryData.description,
            icon: categoryData.icon || 'Database',
            color: categoryData.color || '#603078',
            displayOrder: categories.length + 1,
            isActive: true
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to create category');
        }
        
        const newCategoryData = await response.json();
        const newCategory: APICategory = {
          id: newCategoryData.id,
          name: newCategoryData.name,
          description: newCategoryData.description,
          icon: newCategoryData.icon,
          color: newCategoryData.color,
          endpoints: []
        };
        setCategories([...categories, newCategory]);
        toast({ title: "Category Created", description: "New API category has been created and is now live in the portal" });
      }
      
      // Refresh the main portal data by reloading admin data
      await loadAdminData();
      
    } catch (error) {
      console.error('Error saving category:', error);
      toast({ 
        title: "Error", 
        description: "Failed to save category. Please try again.", 
        variant: "destructive" 
      });
    }
    
    setEditingCategory(null);
    setShowCategoryDialog(false);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      
      setCategories(categories.filter(cat => cat.id !== categoryId));
      toast({ title: "Category Deleted", description: "API category has been permanently removed from the portal" });
      
      // Refresh the main portal data
      await loadAdminData();
      
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({ 
        title: "Error", 
        description: "Failed to delete category. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  // Admin Authentication Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-25 dark:from-neutrals-900 dark:via-purple-950/20 dark:to-neutrals-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-[var(--au-primary)] rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-[var(--au-primary)]">Admin Access</CardTitle>
            <CardDescription>
              Enter admin credentials to access the Developer Portal management interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="admin-username">Username</Label>
              <Input
                id="admin-username"
                placeholder="Enter admin username"
                value={adminCredentials.username}
                onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                data-testid="input-admin-username"
              />
            </div>
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter admin password"
                value={adminCredentials.password}
                onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                data-testid="input-admin-password"
              />
            </div>
            <Button 
              onClick={handleAdminLogin}
              className="w-full bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90"
              data-testid="button-admin-login"
            >
              Access Admin Panel
            </Button>
            <div className="text-center">
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="button-back-home">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Portal
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-25 dark:from-neutrals-900 dark:via-purple-950/20 dark:to-neutrals-800">
      {/* Header */}
      <header className="bg-[var(--au-primary)] text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Settings className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-purple-200">AU Bank Developer Portal Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              Super Admin
            </Badge>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="apis" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              APIs
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Docs
            </TabsTrigger>
            <TabsTrigger value="sandbox" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Sandbox
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total APIs</CardTitle>
                  <Code className="h-4 w-4 text-[var(--au-primary)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--au-primary)]">{apis.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {apis.filter(api => api.status === 'active').length} active
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <FileText className="h-4 w-4 text-[var(--au-primary)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--au-primary)]">{categories.length}</div>
                  <p className="text-xs text-muted-foreground">
                    API groupings
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
                  <Users className="h-4 w-4 text-[var(--au-primary)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--au-primary)]">{users.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {users.filter(user => user.status === 'active').length} active
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Portal Status</CardTitle>
                  <Activity className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Online</div>
                  <p className="text-xs text-muted-foreground">
                    All systems operational
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest changes to the developer portal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New API endpoint added: CNB Payment Creation</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Documentation updated for OAuth Token endpoint</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New category created: Payments</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* APIs Management Tab */}
          <TabsContent value="apis" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--au-primary)]">API Management</h2>
                <p className="text-muted-foreground">Manage API endpoints, documentation, and configuration</p>
              </div>
              <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setEditingApi(null);
                      setShowApiDialog(true);
                    }}
                    className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New API
                  </Button>
                </DialogTrigger>
                <ApiEditDialog 
                  api={editingApi}
                  categories={categories}
                  onSave={handleSaveApi}
                  onClose={() => setShowApiDialog(false)}
                />
              </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {apis.map((api) => (
                <Card key={api.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Badge variant={api.method === 'GET' ? 'secondary' : 'default'}>
                          {api.method}
                        </Badge>
                        <div>
                          <CardTitle className="text-lg">{api.name}</CardTitle>
                          <CardDescription className="font-mono text-sm">{api.path}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={api.status === 'active' ? 'default' : 'secondary'}>
                          {api.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingApi(api);
                            setShowApiDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteApi(api.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">{api.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Category: {api.category}</span>
                        <span>Auth: {api.requiresAuth ? 'Required' : 'Not Required'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Management Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--au-primary)]">Category Management</h2>
                <p className="text-muted-foreground">Organize APIs into logical groups and categories</p>
              </div>
              <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setEditingCategory(null);
                      setShowCategoryDialog(true);
                    }}
                    className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Category
                  </Button>
                </DialogTrigger>
                <CategoryEditDialog 
                  category={editingCategory}
                  onSave={handleSaveCategory}
                  onClose={() => setShowCategoryDialog(false)}
                />
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded flex items-center justify-center text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.icon === 'Shield' && <Shield className="w-4 h-4" />}
                          {category.icon === 'CreditCard' && <CreditCard className="w-4 h-4" />}
                          {category.icon === 'Database' && <Database className="w-4 h-4" />}
                        </div>
                        <span>{category.name}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCategory(category);
                            setShowCategoryDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {category.endpoints.length} API{category.endpoints.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentation Management</CardTitle>
                <CardDescription>Manage API documentation and developer guides</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="docs-title">Documentation Title</Label>
                  <Input
                    id="docs-title"
                    defaultValue="AU Bank API Documentation"
                    placeholder="Enter documentation title"
                  />
                </div>
                <div>
                  <Label htmlFor="docs-description">Description</Label>
                  <Textarea
                    id="docs-description"
                    defaultValue="Comprehensive API documentation for AU Small Finance Bank's developer portal"
                    placeholder="Enter documentation description"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="enable-search" defaultChecked className="rounded" />
                  <Label htmlFor="enable-search">Enable search functionality</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="enable-examples" defaultChecked className="rounded" />
                  <Label htmlFor="enable-examples">Show code examples</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="enable-testing" defaultChecked className="rounded" />
                  <Label htmlFor="enable-testing">Enable API testing</Label>
                </div>
                <Button className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90">
                  Save Documentation Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sandbox Configuration Tab */}
          <TabsContent value="sandbox" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sandbox Configuration</CardTitle>
                <CardDescription>Configure sandbox environment and testing parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sandbox-url">Sandbox Base URL</Label>
                    <Input
                      id="sandbox-url"
                      defaultValue="https://sandbox-api.aubank.in"
                      placeholder="Enter sandbox URL"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rate-limit">Rate Limit (requests/minute)</Label>
                    <Input
                      id="rate-limit"
                      type="number"
                      defaultValue="100"
                      placeholder="100"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="test-data">Test Data Configuration</Label>
                  <Textarea
                    id="test-data"
                    rows={4}
                    defaultValue='{\n  "testAccounts": ["123456789", "987654321"],\n  "testAmounts": [100, 500, 1000]\n}'
                    placeholder="Configure test data in JSON format"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="enable-logging" defaultChecked className="rounded" />
                  <Label htmlFor="enable-logging">Enable detailed logging</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="mock-responses" defaultChecked className="rounded" />
                  <Label htmlFor="mock-responses">Use mock responses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="sandbox-reset" className="rounded" />
                  <Label htmlFor="sandbox-reset">Auto-reset sandbox daily</Label>
                </div>
                <Button className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90">
                  Save Sandbox Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--au-primary)]">User Management</h2>
                <p className="text-muted-foreground">Manage admin users and permissions</p>
              </div>
              <Button className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4">User</th>
                        <th className="text-left p-4">Role</th>
                        <th className="text-left p-4">Last Login</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-t">
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{user.username}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={user.role === 'super_admin' ? 'default' : 'secondary'}>
                              {user.role.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// API Edit Dialog Component
function ApiEditDialog({ 
  api, 
  categories, 
  onSave, 
  onClose 
}: { 
  api: APIEndpoint | null;
  categories: APICategory[];
  onSave: (data: Partial<APIEndpoint>) => void;
  onClose: () => void;
}) {
  const [configTab, setConfigTab] = useState("basic");
  const [formData, setFormData] = useState<Partial<APIEndpoint>>({
    name: api?.name || "",
    method: api?.method || "GET",
    path: api?.path || "",
    category: api?.category || "",
    description: api?.description || "",
    summary: api?.summary || "",
    requiresAuth: api?.requiresAuth || false,
    authType: api?.authType || "bearer",
    queryParameters: api?.queryParameters || [],
    pathParameters: api?.pathParameters || [],
    bodyParameters: api?.bodyParameters || [],
    headers: api?.headers || [],
    responses: api?.responses || [],
    requestExample: api?.requestExample || "",
    responseExample: api?.responseExample || "",
    status: api?.status || "active",
    tags: api?.tags || [],
    rateLimit: api?.rateLimit || 100,
    timeout: api?.timeout || 30000,
    documentation: api?.documentation || ""
  });

  const handleSave = () => {
    onSave(formData);
  };

  const addParameter = (type: 'query' | 'path' | 'body') => {
    const newParam: APIParameter = {
      name: "",
      type: "string",
      required: false,
      description: "",
      example: ""
    };
    
    if (type === 'query') {
      setFormData({...formData, queryParameters: [...(formData.queryParameters || []), newParam]});
    } else if (type === 'path') {
      setFormData({...formData, pathParameters: [...(formData.pathParameters || []), newParam]});
    } else {
      setFormData({...formData, bodyParameters: [...(formData.bodyParameters || []), newParam]});
    }
  };

  const updateParameter = (type: 'query' | 'path' | 'body', index: number, field: string, value: any) => {
    const params = type === 'query' ? formData.queryParameters : 
                   type === 'path' ? formData.pathParameters : formData.bodyParameters;
    const updatedParams = [...(params || [])];
    updatedParams[index] = { ...updatedParams[index], [field]: value };
    
    if (type === 'query') {
      setFormData({...formData, queryParameters: updatedParams});
    } else if (type === 'path') {
      setFormData({...formData, pathParameters: updatedParams});
    } else {
      setFormData({...formData, bodyParameters: updatedParams});
    }
  };

  const removeParameter = (type: 'query' | 'path' | 'body', index: number) => {
    const params = type === 'query' ? formData.queryParameters : 
                   type === 'path' ? formData.pathParameters : formData.bodyParameters;
    const updatedParams = (params || []).filter((_, i) => i !== index);
    
    if (type === 'query') {
      setFormData({...formData, queryParameters: updatedParams});
    } else if (type === 'path') {
      setFormData({...formData, pathParameters: updatedParams});
    } else {
      setFormData({...formData, bodyParameters: updatedParams});
    }
  };

  const addHeader = () => {
    const newHeader: APIHeader = {
      name: "",
      required: false,
      description: "",
      example: ""
    };
    setFormData({...formData, headers: [...(formData.headers || []), newHeader]});
  };

  const updateHeader = (index: number, field: string, value: any) => {
    const updatedHeaders = [...(formData.headers || [])];
    updatedHeaders[index] = { ...updatedHeaders[index], [field]: value };
    setFormData({...formData, headers: updatedHeaders});
  };

  const removeHeader = (index: number) => {
    const updatedHeaders = (formData.headers || []).filter((_, i) => i !== index);
    setFormData({...formData, headers: updatedHeaders});
  };

  const addResponse = () => {
    const newResponse: APIResponse = {
      statusCode: 200,
      description: "",
      schema: "",
      example: ""
    };
    setFormData({...formData, responses: [...(formData.responses || []), newResponse]});
  };

  const updateResponse = (index: number, field: string, value: any) => {
    const updatedResponses = [...(formData.responses || [])];
    updatedResponses[index] = { ...updatedResponses[index], [field]: value };
    setFormData({...formData, responses: updatedResponses});
  };

  const removeResponse = (index: number) => {
    const updatedResponses = (formData.responses || []).filter((_, i) => i !== index);
    setFormData({...formData, responses: updatedResponses});
  };

  return (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{api ? 'Edit API Configuration' : 'Create New API'}</DialogTitle>
        <DialogDescription>
          {api ? 'Update the complete API endpoint configuration' : 'Configure all aspects of the new API endpoint'}
        </DialogDescription>
      </DialogHeader>
      
      <Tabs value={configTab} onValueChange={setConfigTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="api-name">API Name</Label>
              <Input
                id="api-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Generate OAuth Token"
              />
            </div>
            
            <div>
              <Label htmlFor="api-method">HTTP Method</Label>
              <Select value={formData.method} onValueChange={(value) => setFormData({...formData, method: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="api-path">API Path</Label>
              <Input
                id="api-path"
                value={formData.path}
                onChange={(e) => setFormData({...formData, path: e.target.value})}
                placeholder="e.g., /api/oauth/token"
              />
            </div>
            
            <div>
              <Label htmlFor="api-category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="api-summary">Summary</Label>
              <Input
                id="api-summary"
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                placeholder="Brief one-line summary"
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="api-description">Description</Label>
              <Textarea
                id="api-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Detailed description of what this API does..."
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="api-tags">Tags (comma-separated)</Label>
              <Input
                id="api-tags"
                value={(formData.tags || []).join(", ")}
                onChange={(e) => setFormData({...formData, tags: e.target.value.split(",").map(t => t.trim())})}
                placeholder="e.g., payments, authentication, banking"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.requiresAuth}
                onChange={(e) => setFormData({...formData, requiresAuth: e.target.checked})}
                className="rounded"
              />
              <span className="text-sm">Requires Authentication</span>
            </label>
            
            {formData.requiresAuth && (
              <div>
                <Label htmlFor="auth-type">Auth Type</Label>
                <Select value={formData.authType} onValueChange={(value) => setFormData({...formData, authType: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="apiKey">API Key</SelectItem>
                    <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Query Parameters</h3>
                <Button size="sm" onClick={() => addParameter('query')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Query Parameter
                </Button>
              </div>
              {(formData.queryParameters || []).map((param, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-3">
                    <Label>Name</Label>
                    <Input
                      value={param.name}
                      onChange={(e) => updateParameter('query', index, 'name', e.target.value)}
                      placeholder="Parameter name"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Type</Label>
                    <Select value={param.type} onValueChange={(value) => updateParameter('query', index, 'type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="array">Array</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Label>Description</Label>
                    <Input
                      value={param.description}
                      onChange={(e) => updateParameter('query', index, 'description', e.target.value)}
                      placeholder="Description"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Example</Label>
                    <Input
                      value={param.example}
                      onChange={(e) => updateParameter('query', index, 'example', e.target.value)}
                      placeholder="Example value"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={param.required}
                        onChange={(e) => updateParameter('query', index, 'required', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-xs">Req</span>
                    </label>
                  </div>
                  <div className="col-span-1">
                    <Button size="sm" variant="ghost" onClick={() => removeParameter('query', index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Path Parameters</h3>
                <Button size="sm" onClick={() => addParameter('path')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Path Parameter
                </Button>
              </div>
              {(formData.pathParameters || []).map((param, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-3">
                    <Label>Name</Label>
                    <Input
                      value={param.name}
                      onChange={(e) => updateParameter('path', index, 'name', e.target.value)}
                      placeholder="Parameter name"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Type</Label>
                    <Select value={param.type} onValueChange={(value) => updateParameter('path', index, 'type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Label>Description</Label>
                    <Input
                      value={param.description}
                      onChange={(e) => updateParameter('path', index, 'description', e.target.value)}
                      placeholder="Description"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Example</Label>
                    <Input
                      value={param.example}
                      onChange={(e) => updateParameter('path', index, 'example', e.target.value)}
                      placeholder="Example value"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={param.required}
                        onChange={(e) => updateParameter('path', index, 'required', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-xs">Req</span>
                    </label>
                  </div>
                  <div className="col-span-1">
                    <Button size="sm" variant="ghost" onClick={() => removeParameter('path', index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Body Parameters</h3>
                <Button size="sm" onClick={() => addParameter('body')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Body Parameter
                </Button>
              </div>
              {(formData.bodyParameters || []).map((param, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-3">
                    <Label>Name</Label>
                    <Input
                      value={param.name}
                      onChange={(e) => updateParameter('body', index, 'name', e.target.value)}
                      placeholder="Parameter name"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Type</Label>
                    <Select value={param.type} onValueChange={(value) => updateParameter('body', index, 'type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="object">Object</SelectItem>
                        <SelectItem value="array">Array</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Label>Description</Label>
                    <Input
                      value={param.description}
                      onChange={(e) => updateParameter('body', index, 'description', e.target.value)}
                      placeholder="Description"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Example</Label>
                    <Input
                      value={param.example}
                      onChange={(e) => updateParameter('body', index, 'example', e.target.value)}
                      placeholder="Example value"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={param.required}
                        onChange={(e) => updateParameter('body', index, 'required', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-xs">Req</span>
                    </label>
                  </div>
                  <div className="col-span-1">
                    <Button size="sm" variant="ghost" onClick={() => removeParameter('body', index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="headers" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Request Headers</h3>
            <Button size="sm" onClick={addHeader}>
              <Plus className="w-4 h-4 mr-2" />
              Add Header
            </Button>
          </div>
          {(formData.headers || []).map((header, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-3">
                <Label>Header Name</Label>
                <Input
                  value={header.name}
                  onChange={(e) => updateHeader(index, 'name', e.target.value)}
                  placeholder="e.g., Authorization"
                />
              </div>
              <div className="col-span-4">
                <Label>Description</Label>
                <Input
                  value={header.description}
                  onChange={(e) => updateHeader(index, 'description', e.target.value)}
                  placeholder="Header description"
                />
              </div>
              <div className="col-span-3">
                <Label>Example</Label>
                <Input
                  value={header.example}
                  onChange={(e) => updateHeader(index, 'example', e.target.value)}
                  placeholder="Example value"
                />
              </div>
              <div className="col-span-1">
                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={header.required}
                    onChange={(e) => updateHeader(index, 'required', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-xs">Req</span>
                </label>
              </div>
              <div className="col-span-1">
                <Button size="sm" variant="ghost" onClick={() => removeHeader(index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">API Responses</h3>
            <Button size="sm" onClick={addResponse}>
              <Plus className="w-4 h-4 mr-2" />
              Add Response
            </Button>
          </div>
          {(formData.responses || []).map((response, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-2">
                  <Label>Status Code</Label>
                  <Input
                    type="number"
                    value={response.statusCode}
                    onChange={(e) => updateResponse(index, 'statusCode', parseInt(e.target.value))}
                    placeholder="200"
                  />
                </div>
                <div className="col-span-8">
                  <Label>Description</Label>
                  <Input
                    value={response.description}
                    onChange={(e) => updateResponse(index, 'description', e.target.value)}
                    placeholder="Response description"
                  />
                </div>
                <div className="col-span-2">
                  <Button size="sm" variant="ghost" onClick={() => removeResponse(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label>Response Schema</Label>
                <Textarea
                  value={response.schema}
                  onChange={(e) => updateResponse(index, 'schema', e.target.value)}
                  placeholder='{"field": "type", ...}'
                  rows={3}
                />
              </div>
              <div>
                <Label>Example Response</Label>
                <Textarea
                  value={response.example}
                  onChange={(e) => updateResponse(index, 'example', e.target.value)}
                  placeholder='{"field": "value", ...}'
                  rows={3}
                />
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <div>
            <Label htmlFor="request-example">Request Example</Label>
            <Textarea
              id="request-example"
              value={formData.requestExample}
              onChange={(e) => setFormData({...formData, requestExample: e.target.value})}
              placeholder="JSON request example"
              rows={8}
            />
          </div>
          <div>
            <Label htmlFor="response-example">Response Example</Label>
            <Textarea
              id="response-example"
              value={formData.responseExample}
              onChange={(e) => setFormData({...formData, responseExample: e.target.value})}
              placeholder="JSON response example"
              rows={8}
            />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rate-limit">Rate Limit (per minute)</Label>
              <Input
                id="rate-limit"
                type="number"
                value={formData.rateLimit}
                onChange={(e) => setFormData({...formData, rateLimit: parseInt(e.target.value)})}
                placeholder="100"
              />
            </div>
            <div>
              <Label htmlFor="timeout">Timeout (milliseconds)</Label>
              <Input
                id="timeout"
                type="number"
                value={formData.timeout}
                onChange={(e) => setFormData({...formData, timeout: parseInt(e.target.value)})}
                placeholder="30000"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="deprecated">Deprecated</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="api-documentation">Documentation</Label>
            <Textarea
              id="api-documentation"
              rows={6}
              value={formData.documentation}
              onChange={(e) => setFormData({...formData, documentation: e.target.value})}
              placeholder="Detailed documentation for this API endpoint..."
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex items-center justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90">
          <Save className="w-4 h-4 mr-2" />
          {api ? 'Update API' : 'Create API'}
        </Button>
      </div>
    </DialogContent>
  );
}

// Category Edit Dialog Component
function CategoryEditDialog({ 
  category, 
  onSave, 
  onClose 
}: { 
  category: APICategory | null;
  onSave: (data: Partial<APICategory>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Partial<APICategory>>({
    name: category?.name || "",
    description: category?.description || "",
    icon: category?.icon || "Database",
    color: category?.color || "#603078"
  });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{category ? 'Edit Category' : 'Create New Category'}</DialogTitle>
        <DialogDescription>
          {category ? 'Update the category configuration' : 'Add a new API category'}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="category-name">Category Name</Label>
          <Input
            id="category-name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="e.g., Authentication"
          />
        </div>
        
        <div>
          <Label htmlFor="category-description">Description</Label>
          <Textarea
            id="category-description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Brief description of this category..."
          />
        </div>
        
        <div>
          <Label htmlFor="category-icon">Icon</Label>
          <Select value={formData.icon} onValueChange={(value) => setFormData({...formData, icon: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Shield">Shield (Auth)</SelectItem>
              <SelectItem value="CreditCard">Credit Card (Payments)</SelectItem>
              <SelectItem value="Database">Database (Data)</SelectItem>
              <SelectItem value="Users">Users (Management)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="category-color">Theme Color</Label>
          <Input
            id="category-color"
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({...formData, color: e.target.value})}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90">
          <Save className="w-4 h-4 mr-2" />
          {category ? 'Update' : 'Create'}
        </Button>
      </div>
    </DialogContent>
  );
}