import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Database, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  BarChart3,
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Eye,
  Activity,
  Clock,
  Globe,
  ChevronUp,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface APIParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
  paramType?: 'query' | 'path' | 'body';
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
  authType: string;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const [editingApi, setEditingApi] = useState<APIEndpoint | null>(null);
  const [editingCategory, setEditingCategory] = useState<APICategory | null>(null);
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedApi, setSelectedApi] = useState<APIEndpoint | null>(null);
  const [showApiDetailsDialog, setShowApiDetailsDialog] = useState(false);
  const [apiConfigTab, setApiConfigTab] = useState("basic");
  
  // Hierarchical navigation state
  const [currentView, setCurrentView] = useState<'categories' | 'apis' | 'api-details'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<APICategory | null>(null);
  
  const { toast } = useToast();

  // Admin authentication with API login
  const handleAdminLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: adminCredentials.username === "admin" ? "admin@aubank.com" : adminCredentials.username,
          password: adminCredentials.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the AU Bank API Developer Portal Admin Panel"
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Authentication Failed",
          description: errorData.message || "Invalid admin credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Authentication Failed",
        description: "Unable to connect to authentication server",
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

  const loadAdminData = async () => {
    try {
      console.log('🔧 ADMIN - Loading admin data from backend...');
      
      // Try to load from admin API first, fallback to hierarchical if that fails
      const apisResponse = await fetch('/api/admin/apis', { credentials: 'include' });
      
      if (apisResponse.ok) {
        const allApis = await apisResponse.json();
        console.log('🔧 ADMIN - Loaded', allApis.length, 'APIs from admin endpoint');
        
        // Transform database API data to component structure 
        const transformedApis: APIEndpoint[] = allApis.map((api: any) => ({
          id: api.id,
          name: api.name,
          method: api.method,
          path: api.path,
          category: api.category,
          description: api.description,
          summary: api.summary || api.description,
          requiresAuth: api.requiresAuth !== undefined ? api.requiresAuth : true,
          authType: api.authType || 'bearer',
          queryParameters: Array.isArray(api.parameters) ? api.parameters.filter((p: any) => p.paramType === 'query') : [],
          pathParameters: Array.isArray(api.parameters) ? api.parameters.filter((p: any) => p.paramType === 'path') : [],
          bodyParameters: Array.isArray(api.parameters) ? api.parameters.filter((p: any) => p.paramType === 'body') : [],
          headers: Array.isArray(api.headers) ? api.headers : [
            { name: "Authorization", required: true, description: "Bearer token", example: "Bearer eyJ..." }
          ],
          responses: Array.isArray(api.responses) ? api.responses : [{
            statusCode: 200,
            description: "Success response",
            schema: JSON.stringify({ status: "success" }, null, 2),
            example: JSON.stringify({ status: "success" }, null, 2)
          }],
          requestExample: api.requestExample || '{}',
          responseExample: api.responseExample || JSON.stringify({ status: "success" }, null, 2),
          status: api.status || 'active',
          tags: api.tags || [],
          rateLimit: api.rateLimit || 100,
          timeout: api.timeout || 30000,
          documentation: api.documentation || api.description || ""
        }));
        
        setApis(transformedApis);
        console.log('🔧 ADMIN - Processed', transformedApis.length, 'APIs for admin panel');
      } else {
        console.log('🔧 ADMIN - Admin API failed, using fallback data');
        setApis([]);
      }
      
      // Load hierarchical data for categories
      const categoriesResponse = await fetch('/api/categories');
      if (categoriesResponse.ok) {
        const hierarchicalData = await categoriesResponse.json();
        console.log('🔧 ADMIN - Loaded', hierarchicalData.length, 'categories from categories endpoint');
        console.log('🔧 ADMIN - Category data:', hierarchicalData);
        
        const adminCategories: APICategory[] = hierarchicalData.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          icon: cat.icon || 'Database',
          color: cat.color || '#603078',
          endpoints: cat.apis ? cat.apis.map((api: any) => api.id) : []
        }));
        setCategories(adminCategories);
        console.log('🔧 ADMIN - Processed', adminCategories.length, 'categories for admin panel');
      } else {
        console.log('🔧 ADMIN - Categories API failed');
        setCategories([]);
      }
      
      // Set default users
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
      
    } catch (error) {
      console.error('🔧 ADMIN - Error loading admin data:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load admin data. Please try again.",
        variant: "destructive"
      });
      
      // Fallback to empty state on error
      setCategories([]);
      setApis([]);
      setUsers([{
        id: "1",
        username: "admin",
        email: "admin@aubank.in",
        role: "super_admin",
        lastLogin: "2024-12-05T10:30:00Z",
        status: "active"
      }]);
    }
  };

  // API Management Functions
  const handleSaveApi = async (apiData: Partial<APIEndpoint>) => {
    try {
      if (editingApi) {
        // Update existing API
        const response = await fetch(`/api/admin/apis/${editingApi.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(apiData),
        });

        if (response.ok) {
          const updatedApi = await response.json();
          setApis(apis.map(api => api.id === editingApi.id ? updatedApi : api));
          toast({ title: "API Updated", description: "API endpoint has been successfully updated" });
        } else {
          const error = await response.json();
          toast({ 
            title: "Update Failed", 
            description: error.message || "Failed to update API endpoint",
            variant: "destructive"
          });
          return;
        }
      } else {
        // Create new API
        const response = await fetch('/api/admin/apis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            ...apiData,
            status: 'active'
          }),
        });

        if (response.ok) {
          const newApi = await response.json();
          setApis([...apis, newApi]);
          toast({ title: "API Created", description: "New API endpoint has been created and saved" });
        } else {
          const error = await response.json();
          toast({ 
            title: "Creation Failed", 
            description: error.message || "Failed to create API endpoint",
            variant: "destructive"
          });
          return;
        }
      }

      setEditingApi(null);
      setShowApiDialog(false);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleDeleteApi = async (apiId: string) => {
    try {
      const response = await fetch(`/api/admin/apis/${apiId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setApis(apis.filter(api => api.id !== apiId));
        toast({ title: "API Deleted", description: "API endpoint has been removed" });
      } else {
        const error = await response.json();
        toast({ 
          title: "Delete Failed", 
          description: error.message || "Failed to delete API endpoint",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  // Authentication Screen
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
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Panel Main Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-25 dark:from-neutrals-900 dark:via-purple-950/20 dark:to-neutrals-800">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--au-primary)]">AU Bank Admin Portal</h1>
              <p className="text-muted-foreground mt-2">Manage API endpoints, categories, and developer access</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Admin Authenticated
              </Badge>
              <Button 
                variant="outline" 
                onClick={() => setIsAuthenticated(false)}
                data-testid="button-admin-logout"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="apis" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              APIs ({apis.length})
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Categories ({categories.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users ({users.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total APIs</p>
                      <p className="text-3xl font-bold text-[var(--au-primary)]">{apis.length}</p>
                    </div>
                    <Database className="w-8 h-8 text-[var(--au-primary)]" />
                  </div>
                  <div className="mt-4 flex items-center text-sm text-muted-foreground">
                    <Activity className="w-4 h-4 mr-2" />
                    {apis.filter(api => api.status === 'active').length} active
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Categories</p>
                      <p className="text-3xl font-bold text-[var(--au-primary)]">{categories.length}</p>
                    </div>
                    <Globe className="w-8 h-8 text-[var(--au-primary)]" />
                  </div>
                  <div className="mt-4 flex items-center text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    All configured
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Admin Users</p>
                      <p className="text-3xl font-bold text-[var(--au-primary)]">{users.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-[var(--au-primary)]" />
                  </div>
                  <div className="mt-4 flex items-center text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 mr-2" />
                    {users.filter(user => user.status === 'active').length} active
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">System Status</p>
                      <p className="text-lg font-semibold text-green-600">Operational</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="mt-4 flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    Last update: Now
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest changes and updates to the developer portal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Admin panel accessed</p>
                      <p className="text-xs text-muted-foreground">Authentication successful - Just now</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">API data loaded</p>
                      <p className="text-xs text-muted-foreground">{apis.length} endpoints loaded from database - Just now</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Categories synchronized</p>
                      <p className="text-xs text-muted-foreground">{categories.length} categories available - Just now</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apis" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">API Management</h2>
                <p className="text-muted-foreground">Manage all API endpoints and their configurations</p>
              </div>
              <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90" data-testid="button-add-api">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New API
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingApi ? 'Edit API Endpoint' : 'Create New API Endpoint'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <Tabs value={apiConfigTab} onValueChange={setApiConfigTab}>
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="parameters">Parameters</TabsTrigger>
                        <TabsTrigger value="responses">Responses</TabsTrigger>
                        <TabsTrigger value="documentation">Documentation</TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="api-name">API Name</Label>
                            <Input 
                              id="api-name" 
                              placeholder="e.g., Customer Balance Inquiry" 
                              defaultValue={editingApi?.name || ""}
                              data-testid="input-api-name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="api-method">HTTP Method</Label>
                            <Select defaultValue={editingApi?.method || "GET"}>
                              <SelectTrigger data-testid="select-api-method">
                                <SelectValue placeholder="Select method" />
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
                        </div>

                        <div>
                          <Label htmlFor="api-path">API Path</Label>
                          <Input 
                            id="api-path" 
                            placeholder="e.g., /api/v1/customer/balance" 
                            defaultValue={editingApi?.path || ""}
                            data-testid="input-api-path"
                          />
                        </div>

                        <div>
                          <Label htmlFor="api-category">Category</Label>
                          <Select defaultValue={editingApi?.category || ""}>
                            <SelectTrigger data-testid="select-api-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category.id} value={category.name}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="api-description">Description</Label>
                          <Textarea 
                            id="api-description" 
                            placeholder="Brief description of what this API does"
                            defaultValue={editingApi?.description || ""}
                            data-testid="textarea-api-description"
                          />
                        </div>

                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowApiDialog(false)}>
                            Cancel
                          </Button>
                          <Button 
                            className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90"
                            onClick={() => handleSaveApi({
                              name: (document.getElementById('api-name') as HTMLInputElement)?.value,
                              path: (document.getElementById('api-path') as HTMLInputElement)?.value,
                              description: (document.getElementById('api-description') as HTMLTextAreaElement)?.value,
                            })}
                            data-testid="button-save-api"
                          >
                            {editingApi ? 'Update API' : 'Create API'}
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="parameters" className="space-y-4">
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Configure the parameters required for this API endpoint.
                          </AlertDescription>
                        </Alert>
                      </TabsContent>

                      <TabsContent value="responses" className="space-y-4">
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Define the possible responses this API can return.
                          </AlertDescription>
                        </Alert>
                      </TabsContent>

                      <TabsContent value="documentation" className="space-y-4">
                        <div>
                          <Label htmlFor="api-documentation">Documentation</Label>
                          <Textarea 
                            id="api-documentation" 
                            placeholder="Detailed documentation for this API endpoint"
                            defaultValue={editingApi?.documentation || ""}
                            className="min-h-[200px]"
                            data-testid="textarea-api-documentation"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="bg-muted/50">
                        <th className="text-left p-4 font-medium">Name</th>
                        <th className="text-left p-4 font-medium">Method</th>
                        <th className="text-left p-4 font-medium">Path</th>
                        <th className="text-left p-4 font-medium">Category</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apis.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            <div className="flex flex-col items-center space-y-2">
                              <Database className="w-8 h-8" />
                              <p>No APIs found. Data loading: {apis.length} APIs in state</p>
                              <Button 
                                variant="outline" 
                                onClick={loadAdminData}
                                className="mt-2"
                              >
                                Refresh Data
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        apis.map((api) => (
                        <tr key={api.id} className="border-b hover:bg-muted/25">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{api.name}</p>
                              <p className="text-sm text-muted-foreground">{api.summary}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={
                              api.method === 'GET' ? 'default' :
                              api.method === 'POST' ? 'destructive' :
                              api.method === 'PUT' ? 'secondary' : 'outline'
                            }>
                              {api.method}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <code className="text-sm bg-muted px-2 py-1 rounded">{api.path}</code>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{api.category}</Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant={api.status === 'active' ? 'default' : 'secondary'}>
                              {api.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setEditingApi(api);
                                  setShowApiDialog(true);
                                }}
                                data-testid={`button-edit-api-${api.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteApi(api.id)}
                                data-testid={`button-delete-api-${api.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Hierarchical API Management</h2>
                <p className="text-muted-foreground">Manage categories and their APIs with full documentation</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setShowApiDialog(true)}
                  data-testid="button-add-api"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add API
                </Button>
                <Button className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90" data-testid="button-add-category">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {categories.map((category) => {
                const categoryApis = apis.filter(api => (api as any).categoryId === category.id);
                return (
                  <Card key={category.id} className="overflow-hidden">
                    <div 
                      className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/25 transition-colors"
                      onClick={() => {
                        const newExpanded = new Set(expandedCategories);
                        if (newExpanded.has(category.id)) {
                          newExpanded.delete(category.id);
                        } else {
                          newExpanded.add(category.id);
                        }
                        setExpandedCategories(newExpanded);
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <Database className="w-6 h-6" style={{ color: category.color }} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[var(--au-primary)]">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm font-medium">{categoryApis.length} APIs</span>
                            <Badge 
                              variant={(category as any).is_active ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {(category as any).is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Edit category
                          }}
                          data-testid={`button-edit-category-${category.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Delete category
                          }}
                          data-testid={`button-delete-category-${category.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        {expandedCategories.has(category.id) ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    {expandedCategories.has(category.id) && (
                      <div className="border-t bg-muted/10">
                        {categoryApis.length === 0 ? (
                          <div className="p-6 text-center text-muted-foreground">
                            <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No APIs in this category</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => setShowApiDialog(true)}
                            >
                              Add First API
                            </Button>
                          </div>
                        ) : (
                          <div className="p-4 space-y-3">
                            {categoryApis.map((api) => (
                              <div 
                                key={api.id} 
                                className="flex items-center justify-between p-4 bg-background rounded-lg border cursor-pointer hover:bg-muted/25 transition-colors"
                                onClick={() => {
                                  setSelectedApi(api);
                                  setShowApiDetailsDialog(true);
                                }}
                              >
                                <div className="flex items-center space-x-4">
                                  <Badge variant={
                                    api.method === 'GET' ? 'default' :
                                    api.method === 'POST' ? 'destructive' :
                                    api.method === 'PUT' ? 'secondary' : 'outline'
                                  }>
                                    {api.method}
                                  </Badge>
                                  <div>
                                    <h4 className="font-medium text-[var(--au-primary)]">{api.name}</h4>
                                    <p className="text-sm text-muted-foreground">{api.summary}</p>
                                    <code className="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">{api.path}</code>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge 
                                    variant={api.status === 'active' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {api.status}
                                  </Badge>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingApi(api);
                                      setShowApiDialog(true);
                                    }}
                                    data-testid={`button-edit-api-${api.id}`}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteApi(api.id);
                                    }}
                                    data-testid={`button-delete-api-${api.id}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-muted-foreground">Manage admin users and their permissions</p>
              </div>
              <Button className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90" data-testid="button-add-user">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="bg-muted/50">
                        <th className="text-left p-4 font-medium">User</th>
                        <th className="text-left p-4 font-medium">Role</th>
                        <th className="text-left p-4 font-medium">Last Login</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-muted/25">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{user.username}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={user.role === 'super_admin' ? 'destructive' : 'default'}>
                              {user.role.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <p className="text-sm">
                              {new Date(user.lastLogin).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="p-4">
                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" data-testid={`button-edit-user-${user.id}`}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" data-testid={`button-delete-user-${user.id}`}>
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

      {/* API Details Dialog */}
      <Dialog open={showApiDetailsDialog} onOpenChange={setShowApiDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <Badge variant={
                selectedApi?.method === 'GET' ? 'default' :
                selectedApi?.method === 'POST' ? 'destructive' :
                selectedApi?.method === 'PUT' ? 'secondary' : 'outline'
              }>
                {selectedApi?.method}
              </Badge>
              <span className="text-[var(--au-primary)]">{selectedApi?.name}</span>
            </DialogTitle>
            <p className="text-muted-foreground">{selectedApi?.summary}</p>
          </DialogHeader>
          
          {selectedApi && (
            <Tabs defaultValue="documentation" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
                <TabsTrigger value="sandbox">Sandbox</TabsTrigger>
                <TabsTrigger value="configuration">Configuration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="documentation" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Endpoint</h4>
                    <code className="bg-muted px-3 py-2 rounded text-sm block">
                      {selectedApi.method} {selectedApi.path}
                    </code>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedApi.description}</p>
                  </div>
                  
                  {(selectedApi as any).parameters && Array.isArray((selectedApi as any).parameters) && (selectedApi as any).parameters.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Parameters</h4>
                      <div className="space-y-2">
                        {(selectedApi as any).parameters.map((param: any, index: number) => (
                          <div key={index} className="border rounded p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant="outline" className="text-xs">{param.type}</Badge>
                              <span className="font-medium text-sm">{param.name}</span>
                              {param.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground">{param.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {(selectedApi as any).response_schema && (
                    <div>
                      <h4 className="font-medium mb-2">Response Schema</h4>
                      <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify((selectedApi as any).response_schema, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="sandbox" className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/20">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Interactive API Testing
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Test this API endpoint with live data and see real responses.
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Request URL</Label>
                        <code className="bg-background border px-3 py-2 rounded text-sm block mt-1">
                          {window.location.origin}{selectedApi.path}
                        </code>
                      </div>
                      
                      {(selectedApi as any).parameters && Array.isArray((selectedApi as any).parameters) && (selectedApi as any).parameters.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium">Test Parameters</Label>
                          <div className="space-y-2 mt-2">
                            {(selectedApi as any).parameters.map((param: any, index: number) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Label className="text-xs w-24">{param.name}</Label>
                                <Input 
                                  placeholder={param.example || `Enter ${param.name}`}
                                  className="text-xs"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <Button className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90">
                        <Activity className="w-4 h-4 mr-2" />
                        Test API
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Response Preview</h4>
                    <div className="bg-muted p-3 rounded text-xs">
                      <span className="text-muted-foreground">Click "Test API" to see live response...</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="configuration" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">API Settings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Status</Label>
                        <Badge variant={(selectedApi as any).status === 'active' ? 'default' : 'secondary'} className="ml-2">
                          {(selectedApi as any).status || 'active'}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm">Version</Label>
                        <span className="ml-2 text-sm text-muted-foreground">{(selectedApi as any).version || 'v1.0'}</span>
                      </div>
                      <div>
                        <Label className="text-sm">Authentication</Label>
                        <Badge variant="outline" className="ml-2">
                          {(selectedApi as any).requires_auth ? 'Required' : 'Not Required'}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm">Rate Limit</Label>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {(selectedApi as any).rate_limits ? 
                            `${(selectedApi as any).rate_limits.requests_per_minute || 1000}/min` : 
                            '1000/min'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Access Control</h4>
                    <div className="space-y-2">
                      {(selectedApi as any).required_permissions && Array.isArray((selectedApi as any).required_permissions) ? (
                        (selectedApi as any).required_permissions.map((permission: string, index: number) => (
                          <Badge key={index} variant="outline" className="mr-2">
                            {permission}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No specific permissions required</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setEditingApi(selectedApi);
                        setShowApiDialog(true);
                        setShowApiDetailsDialog(false);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit API
                    </Button>
                    <Button variant="outline">
                      <Globe className="w-4 h-4 mr-2" />
                      View in Portal
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}