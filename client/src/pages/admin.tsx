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
  BarChart3, Activity, Globe, Lock, Check, X, ChevronDown, ChevronRight, PlayCircle
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const [editingApi, setEditingApi] = useState<APIEndpoint | null>(null);
  const [editingCategory, setEditingCategory] = useState<APICategory | null>(null);
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [apiConfigTab, setApiConfigTab] = useState("basic");
  // Navigation state for drill-down
  const [selectedCategory, setSelectedCategory] = useState<APICategory | null>(null);
  const [selectedApi, setSelectedApi] = useState<APIEndpoint | null>(null);
  
  const { toast } = useToast();

  // Backend admin authentication
  const handleAdminLogin = async () => {
    try {
      console.log('Admin login attempt:', { email: adminCredentials.username, password: '***' });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: adminCredentials.username,
          password: adminCredentials.password
        }),
      });

      const data = await response.json();
      console.log('Login response:', response.status, data);

      if (response.ok && data.user && data.user.role === 'admin') {
        setIsAuthenticated(true);
        toast({
          title: "Admin Access Granted",
          description: `Welcome ${data.user.firstName} ${data.user.lastName}`
        });
      } else if (response.ok && data.user.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "Admin privileges required to access this panel",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Authentication Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
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
    // Load centralized comprehensive data
    console.log('🔧 ADMIN - Loading comprehensive data from centralized store');
    
    const { API_CATEGORIES, getTotalApiCount, getTotalCategoryCount } = await import('@shared/data');
    
    // Transform comprehensive data for admin panel
    const adminCategories: APICategory[] = API_CATEGORIES.map((cat) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      color: cat.color,
      endpoints: cat.apis.map(api => api.id)
    }));
    
    setCategories(adminCategories);
    
    // Extract all APIs with full documentation and sandbox details
    const allApis: APIEndpoint[] = [];
    API_CATEGORIES.forEach((cat) => {
      cat.apis.forEach((api) => {
        allApis.push({
          id: api.id,
          name: api.name,
          method: api.method,
          path: api.path,
          category: api.category,
          description: api.description,
          summary: api.summary,
          requiresAuth: api.requiresAuth,
          authType: api.authType,
          queryParameters: [],
          pathParameters: [],
          bodyParameters: api.parameters,
          headers: api.headers,
          responses: api.responses,
          requestExample: api.requestExample,
          responseExample: api.responseExample,
          status: api.status === 'beta' ? 'draft' : api.status,
          tags: api.tags,
          rateLimit: api.rateLimits.sandbox,
          timeout: api.timeout
        });
      });
    });
    
    setApis(allApis);
    
    // Categories now use drill-down navigation instead of expansion
    
    const totalApis = getTotalApiCount();
    const totalCategories = getTotalCategoryCount();
    
    console.log(`🔧 ADMIN - Loaded ${totalCategories} categories with ${totalApis} APIs from centralized data store`);
    
    // Debug API category matching
    console.log('🔍 ADMIN - Debug API Category Matching:');
    API_CATEGORIES.forEach((cat) => {
      const matchingApis = allApis.filter(api => api.category === cat.name);
      console.log(`🔍 Category "${cat.name}" should have ${cat.apis.length} APIs, filtered ${matchingApis.length} APIs:`, 
        matchingApis.map(api => api.name));
    });
    
    toast({
      title: "Comprehensive Data Loaded",
      description: `Loaded ${totalCategories} categories with ${totalApis} APIs from centralized store`
    });
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

  // Category Management Functions
  const handleSaveCategory = (categoryData: Partial<APICategory>) => {
    if (editingCategory) {
      setCategories(categories.map(cat => cat.id === editingCategory.id ? { ...cat, ...categoryData } : cat));
      toast({ title: "Category Updated", description: "Category has been successfully updated" });
    } else {
      const newCategory: APICategory = {
        ...categoryData as APICategory,
        id: Date.now().toString(),
        endpoints: []
      };
      setCategories([...categories, newCategory]);
      toast({ title: "Category Created", description: "New category has been created" });
    }
    setEditingCategory(null);
    setShowCategoryDialog(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast({ title: "Category Deleted", description: "Category has been removed" });
  };

  // User Management Functions
  const handleSaveUser = (userData: Partial<AdminUser>) => {
    // Implementation for user management
  };

  const handleDeleteUser = (userId: string) => {
    // Implementation for user deletion
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Card className="w-full max-w-md mx-auto shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-[var(--au-primary)]">Admin Login</CardTitle>
            <CardDescription>Sign in to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onLogin={handleAdminLogin} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--au-primary)] to-purple-700 flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--au-primary)]">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">AU Bank Developer Portal Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Super Admin
              </Badge>
              <Link href="/" className="flex items-center space-x-2 text-muted-foreground hover:text-[var(--au-primary)] transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Categories
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


          {/* Categories Management Tab - Drill-Down Navigation */}
          <TabsContent value="categories" className="space-y-6">
            {/* Breadcrumb Navigation */}
            {(selectedCategory || selectedApi) && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <button 
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedApi(null);
                  }}
                  className="hover:text-[var(--au-primary)] transition-colors"
                >
                  Categories
                </button>
                {selectedCategory && (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    <button 
                      onClick={() => setSelectedApi(null)}
                      className="hover:text-[var(--au-primary)] transition-colors"
                    >
                      {selectedCategory.name}
                    </button>
                  </>
                )}
                {selectedApi && (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-[var(--au-primary)] font-medium">{selectedApi.name}</span>
                  </>
                )}
              </div>
            )}

            {/* View 1: Categories Grid */}
            {!selectedCategory && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--au-primary)]">API Categories</h2>
                    <p className="text-muted-foreground">Browse all API categories</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setEditingCategory(null);
                      setShowCategoryDialog(true);
                    }}
                    className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => {
                    const categoryApis = apis.filter(api => api.category === category.name);
                    return (
                      <Card 
                        key={category.id} 
                        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setSelectedCategory(category)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm"
                              style={{ backgroundColor: category.color }}
                            >
                              <Shield className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-[var(--au-primary)]">{category.name}</CardTitle>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <CardDescription className="text-sm text-muted-foreground mt-1">
                                {category.description}
                              </CardDescription>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="bg-[var(--au-primary)]/10 text-[var(--au-primary)]">
                                  {categoryApis.length} APIs
                                </Badge>
                                <Badge variant="outline">{categoryApis.filter(api => api.status === 'active').length} Active</Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}

            {/* View 2: APIs within Selected Category */}
            {selectedCategory && !selectedApi && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: selectedCategory.color }}
                    >
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--au-primary)]">{selectedCategory.name}</h2>
                      <p className="text-muted-foreground">{selectedCategory.description}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => {
                      setEditingApi(null);
                      setShowApiDialog(true);
                    }}
                    className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add API
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {apis.filter(api => api.category === selectedCategory.name).map((api) => (
                    <Card 
                      key={api.id} 
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedApi(api)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant={api.method === 'GET' ? 'secondary' : 'default'}>
                              {api.method}
                            </Badge>
                            <div className="flex-1">
                              <CardTitle className="text-lg">{api.name}</CardTitle>
                              <CardDescription className="font-mono text-sm">{api.path}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={api.status === 'active' ? 'default' : 'secondary'}>
                              {api.status}
                            </Badge>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{api.description}</p>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* View 3: API Details (Documentation & Sandbox) */}
            {selectedApi && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant={selectedApi.method === 'GET' ? 'secondary' : 'default'}>
                      {selectedApi.method}
                    </Badge>
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--au-primary)]">{selectedApi.name}</h2>
                      <p className="font-mono text-muted-foreground">{selectedApi.path}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={selectedApi.status === 'active' ? 'default' : 'secondary'}>
                      {selectedApi.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingApi(selectedApi);
                        setShowApiDialog(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Documentation Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Documentation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-[var(--au-primary)] mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">{selectedApi.description}</p>
                      </div>
                      
                      {selectedApi.bodyParameters && selectedApi.bodyParameters.length > 0 && (
                        <div>
                          <h4 className="font-medium text-[var(--au-primary)] mb-2">Parameters</h4>
                          <div className="space-y-2">
                            {selectedApi.bodyParameters.map((param, idx) => (
                              <div key={idx} className="bg-muted p-3 rounded text-sm">
                                <div className="font-mono">
                                  <span className="font-semibold">{param.name}</span>
                                  <span className="text-muted-foreground"> ({param.type})</span>
                                  {param.required && <span className="text-red-500 ml-1">*</span>}
                                </div>
                                <p className="text-muted-foreground mt-1">{param.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {selectedApi.responses && selectedApi.responses.length > 0 && (
                        <div>
                          <h4 className="font-medium text-[var(--au-primary)] mb-2">Response Schema</h4>
                          <div className="bg-muted p-3 rounded">
                            <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                              {selectedApi.responses[0]?.schema 
                                ? (typeof selectedApi.responses[0].schema === 'string' 
                                   ? selectedApi.responses[0].schema 
                                   : JSON.stringify(selectedApi.responses[0].schema, null, 2))
                                : 'No schema defined'}
                            </pre>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Sandbox Configuration Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PlayCircle className="w-5 h-5" />
                        Sandbox Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-medium text-[var(--au-primary)] mb-1">Rate Limit</h5>
                          <p className="text-muted-foreground">{selectedApi.rateLimit}/min</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-[var(--au-primary)] mb-1">Timeout</h5>
                          <p className="text-muted-foreground">{selectedApi.timeout}ms</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-[var(--au-primary)] mb-1">Authentication</h5>
                          <p className="text-muted-foreground">{selectedApi.requiresAuth ? 'Required' : 'Not Required'}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-[var(--au-primary)] mb-1">Auth Type</h5>
                          <p className="text-muted-foreground">{selectedApi.authType || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-medium text-[var(--au-primary)] mb-3">Test Configuration</h4>
                        <div className="space-y-3">
                          <Button className="w-full" variant="outline">
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Open in Sandbox
                          </Button>
                          <Button className="w-full" variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            View OpenAPI Spec
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {/* Dialogs */}
            <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
              <CategoryEditDialog 
                category={editingCategory}
                onSave={handleSaveCategory}
                onClose={() => setShowCategoryDialog(false)}
              />
            </Dialog>
            <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
              <ApiEditDialog 
                api={editingApi}
                categories={categories}
                onSave={handleSaveApi}
                onClose={() => setShowApiDialog(false)}
              />
            </Dialog>
          </TabsContent>



          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--au-primary)]">User Management</h2>
                <p className="text-muted-foreground">Manage admin users and permissions</p>
              </div>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">User management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Login Form Component
const LoginForm = ({ onLogin }: { onLogin: (username: string, password: string) => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submit:', { username, password: '***' });
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="username">Email</Label>
        <Input
          id="username"
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter email address"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />
      </div>
      <Button type="submit" className="w-full bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90">
        Sign In
      </Button>
    </form>
  );
};

// Category Edit Dialog Component
const CategoryEditDialog = ({ category, onSave, onClose }: any) => {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    color: category?.color || "#603078",
    isActive: category?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{category ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <DialogDescription>
          {category ? 'Update category information' : 'Create a new API category'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="categoryName">Category Name</Label>
          <Input
            id="categoryName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter category name"
            required
          />
        </div>
        <div>
          <Label htmlFor="categoryDescription">Description</Label>
          <Textarea
            id="categoryDescription"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter category description"
            required
          />
        </div>
        <div>
          <Label htmlFor="categoryColor">Color</Label>
          <Input
            id="categoryColor"
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90">
            {category ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

// API Edit Dialog Component
const ApiEditDialog = ({ api, categories, onSave, onClose }: any) => {
  const [formData, setFormData] = useState({
    id: api?.id || "",
    name: api?.name || "",
    method: api?.method || "GET",
    path: api?.path || "",
    category: api?.category || "",
    description: api?.description || "",
    summary: api?.summary || "",
    requiresAuth: api?.requiresAuth ?? true,
    authType: api?.authType || "bearer",
    status: api?.status || "active",
    timeout: api?.timeout || 30000,
    documentation: api?.documentation || "",
    requestExample: api?.requestExample || "",
    responseExample: api?.responseExample || "",
    responseSchema: JSON.stringify(api?.responseSchema || {}, null, 2),
    tags: (api?.tags || []).join(", "),
    parameters: api?.parameters || [{ name: "", type: "string", required: false, description: "", example: "" }],
    headers: api?.headers || [{ name: "", required: false, description: "", example: "" }],
    responses: api?.responses || [{ statusCode: 200, description: "", schema: {}, example: "" }],
    rateLimits: {
      sandbox: api?.rateLimits?.sandbox || 100,
      production: api?.rateLimits?.production || 1000
    },
    sandbox: {
      enabled: api?.sandbox?.enabled ?? true,
      testData: JSON.stringify(api?.sandbox?.testData || [], null, 2),
      mockResponse: JSON.stringify(api?.sandbox?.mockResponse || {}, null, 2)
    }
  });

  const [activeTab, setActiveTab] = useState("basic");

  const addParameter = () => {
    setFormData({
      ...formData,
      parameters: [...formData.parameters, { name: "", type: "string", required: false, description: "", example: "" }]
    });
  };

  const removeParameter = (index: number) => {
    setFormData({
      ...formData,
      parameters: formData.parameters.filter((_, i) => i !== index)
    });
  };

  const updateParameter = (index: number, field: string, value: any) => {
    const updated = formData.parameters.map((param, i) => 
      i === index ? { ...param, [field]: value } : param
    );
    setFormData({ ...formData, parameters: updated });
  };

  const addHeader = () => {
    setFormData({
      ...formData,
      headers: [...formData.headers, { name: "", required: false, description: "", example: "" }]
    });
  };

  const removeHeader = (index: number) => {
    setFormData({
      ...formData,
      headers: formData.headers.filter((_, i) => i !== index)
    });
  };

  const updateHeader = (index: number, field: string, value: any) => {
    const updated = formData.headers.map((header, i) => 
      i === index ? { ...header, [field]: value } : header
    );
    setFormData({ ...formData, headers: updated });
  };

  const addResponse = () => {
    setFormData({
      ...formData,
      responses: [...formData.responses, { statusCode: 200, description: "", schema: {}, example: "" }]
    });
  };

  const removeResponse = (index: number) => {
    setFormData({
      ...formData,
      responses: formData.responses.filter((_, i) => i !== index)
    });
  };

  const updateResponse = (index: number, field: string, value: any) => {
    const updated = formData.responses.map((response, i) => 
      i === index ? { ...response, [field]: value } : response
    );
    setFormData({ ...formData, responses: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const processedData = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        responseSchema: JSON.parse(formData.responseSchema),
        sandbox: {
          ...formData.sandbox,
          testData: JSON.parse(formData.sandbox.testData),
          mockResponse: JSON.parse(formData.sandbox.mockResponse),
          rateLimits: formData.rateLimits
        }
      };
      
      onSave(processedData);
    } catch (error) {
      alert("Please check JSON formatting in schema and sandbox fields");
    }
  };

  return (
    <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{api ? 'Edit API' : 'Add New API'}</DialogTitle>
        <DialogDescription>
          {api ? 'Update comprehensive API endpoint configuration' : 'Create a new API endpoint with full configuration'}
        </DialogDescription>
      </DialogHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="apiName">API Name *</Label>
                <Input
                  id="apiName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter API name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="apiMethod">Method *</Label>
                <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
                  <SelectTrigger>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="apiPath">API Path *</Label>
                <Input
                  id="apiPath"
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  placeholder="/api/endpoint"
                  required
                />
              </div>
              <div>
                <Label htmlFor="apiCategory">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="apiDescription">Description *</Label>
              <Textarea
                id="apiDescription"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter detailed API description"
                required
              />
            </div>

            <div>
              <Label htmlFor="apiSummary">Summary</Label>
              <Input
                id="apiSummary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Brief API summary"
              />
            </div>

            <div>
              <Label htmlFor="documentation">Documentation</Label>
              <Textarea
                id="documentation"
                value={formData.documentation}
                onChange={(e) => setFormData({ ...formData, documentation: e.target.value })}
                placeholder="Detailed API documentation"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="customer, profile, banking"
              />
            </div>
          </TabsContent>

          <TabsContent value="parameters" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Parameters</h3>
              <Button type="button" onClick={addParameter} size="sm">
                Add Parameter
              </Button>
            </div>
            {formData.parameters.map((param, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Parameter Name *</Label>
                    <Input
                      value={param.name}
                      onChange={(e) => updateParameter(index, "name", e.target.value)}
                      placeholder="parameterName"
                      required
                    />
                  </div>
                  <div>
                    <Label>Type *</Label>
                    <Select value={param.type} onValueChange={(value) => updateParameter(index, "type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
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
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={param.description}
                      onChange={(e) => updateParameter(index, "description", e.target.value)}
                      placeholder="Parameter description"
                    />
                  </div>
                  <div>
                    <Label>Example</Label>
                    <Input
                      value={param.example}
                      onChange={(e) => updateParameter(index, "example", e.target.value)}
                      placeholder="Example value"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={param.required}
                      onChange={(e) => updateParameter(index, "required", e.target.checked)}
                    />
                    <Label>Required</Label>
                  </div>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeParameter(index)}>
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="headers" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Headers</h3>
              <Button type="button" onClick={addHeader} size="sm">
                Add Header
              </Button>
            </div>
            {formData.headers.map((header, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Header Name *</Label>
                    <Input
                      value={header.name}
                      onChange={(e) => updateHeader(index, "name", e.target.value)}
                      placeholder="Authorization"
                      required
                    />
                  </div>
                  <div>
                    <Label>Example</Label>
                    <Input
                      value={header.example}
                      onChange={(e) => updateHeader(index, "example", e.target.value)}
                      placeholder="Bearer token123"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={header.description}
                    onChange={(e) => updateHeader(index, "description", e.target.value)}
                    placeholder="Header description"
                  />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={header.required}
                      onChange={(e) => updateHeader(index, "required", e.target.checked)}
                    />
                    <Label>Required</Label>
                  </div>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeHeader(index)}>
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="responses" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Responses</h3>
              <Button type="button" onClick={addResponse} size="sm">
                Add Response
              </Button>
            </div>
            {formData.responses.map((response, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Status Code *</Label>
                    <Input
                      type="number"
                      value={response.statusCode}
                      onChange={(e) => updateResponse(index, "statusCode", parseInt(e.target.value))}
                      placeholder="200"
                      required
                    />
                  </div>
                  <div>
                    <Label>Description *</Label>
                    <Input
                      value={response.description}
                      onChange={(e) => updateResponse(index, "description", e.target.value)}
                      placeholder="Success response"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>Example Response</Label>
                  <Textarea
                    value={response.example}
                    onChange={(e) => updateResponse(index, "example", e.target.value)}
                    placeholder='{"status": "success", "data": {}}'
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeResponse(index)}>
                    Remove Response
                  </Button>
                </div>
              </Card>
            ))}

            <div className="space-y-4">
              <div>
                <Label htmlFor="requestExample">Request Example</Label>
                <Textarea
                  id="requestExample"
                  value={formData.requestExample}
                  onChange={(e) => setFormData({ ...formData, requestExample: e.target.value })}
                  placeholder='{"param": "value"}'
                />
              </div>
              <div>
                <Label htmlFor="responseExample">Response Example</Label>
                <Textarea
                  id="responseExample"
                  value={formData.responseExample}
                  onChange={(e) => setFormData({ ...formData, responseExample: e.target.value })}
                  placeholder='{"result": "success"}'
                />
              </div>
              <div>
                <Label htmlFor="responseSchema">Response Schema (JSON)</Label>
                <Textarea
                  id="responseSchema"
                  value={formData.responseSchema}
                  onChange={(e) => setFormData({ ...formData, responseSchema: e.target.value })}
                  placeholder='{"property": "type"}'
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authType">Authentication Type</Label>
                <Select value={formData.authType} onValueChange={(value) => setFormData({ ...formData, authType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select auth type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="apiKey">API Key</SelectItem>
                    <SelectItem value="oauth2">OAuth2</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="apiStatus">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="deprecated">Deprecated</SelectItem>
                    <SelectItem value="beta">Beta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sandboxRateLimit">Sandbox Rate Limit</Label>
                <Input
                  id="sandboxRateLimit"
                  type="number"
                  value={formData.rateLimits.sandbox}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    rateLimits: { ...formData.rateLimits, sandbox: parseInt(e.target.value) }
                  })}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="productionRateLimit">Production Rate Limit</Label>
                <Input
                  id="productionRateLimit"
                  type="number"
                  value={formData.rateLimits.production}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    rateLimits: { ...formData.rateLimits, production: parseInt(e.target.value) }
                  })}
                  min="1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="timeout">Timeout (ms)</Label>
              <Input
                id="timeout"
                type="number"
                value={formData.timeout}
                onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) })}
                min="1000"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.requiresAuth}
                  onChange={(e) => setFormData({ ...formData, requiresAuth: e.target.checked })}
                />
                <Label>Requires Authentication</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.sandbox.enabled}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    sandbox: { ...formData.sandbox, enabled: e.target.checked }
                  })}
                />
                <Label>Sandbox Enabled</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="sandboxTestData">Sandbox Test Data (JSON)</Label>
              <Textarea
                id="sandboxTestData"
                value={formData.sandbox.testData}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  sandbox: { ...formData.sandbox, testData: e.target.value }
                })}
                placeholder='[{"param": "value"}]'
              />
            </div>

            <div>
              <Label htmlFor="sandboxMockResponse">Sandbox Mock Response (JSON)</Label>
              <Textarea
                id="sandboxMockResponse"
                value={formData.sandbox.mockResponse}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  sandbox: { ...formData.sandbox, mockResponse: e.target.value }
                })}
                placeholder='{"result": "mock data"}'
              />
            </div>
          </TabsContent>

          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90">
              {api ? 'Update API' : 'Create API'}
            </Button>
          </div>
        </form>
      </Tabs>
    </DialogContent>
  );
};
