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
  BarChart3, Activity, Globe, Lock, Check, X, ChevronDown, ChevronRight
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
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedApis, setExpandedApis] = useState<string[]>([]);
  
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
          status: api.status,
          tags: api.tags,
          rateLimit: api.rateLimits.sandbox,
          timeout: api.timeout
        });
      });
    });
    
    setApis(allApis);
    
    const totalApis = getTotalApiCount();
    const totalCategories = getTotalCategoryCount();
    
    console.log(`🔧 ADMIN - Loaded ${totalCategories} categories with ${totalApis} APIs from centralized data store`);
    
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
            <LoginForm onLogin={handleLogin} />
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

          {/* Categories Management Tab - Hierarchical View */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--au-primary)]">Hierarchical API Management</h2>
                <p className="text-muted-foreground">Categories → APIs → Documentation & Sandbox Configuration</p>
              </div>
              <div className="flex gap-2">
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
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <CategoryEditDialog 
                    category={editingCategory}
                    onSave={handleSaveCategory}
                    onClose={() => setShowCategoryDialog(false)}
                  />
                </Dialog>
                <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setEditingApi(null);
                        setShowApiDialog(true);
                      }}
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add API
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
            </div>

            {/* Hierarchical Tree View */}
            <div className="space-y-4">
              {categories.map((category) => {
                const categoryApis = apis.filter(api => api.category === category.name);
                return (
                  <Card key={category.id} className="overflow-hidden">
                    <CardHeader className="cursor-pointer" 
                      onClick={() => {
                        const expandedCats = new Set(expandedCategories);
                        if (expandedCats.has(category.id)) {
                          expandedCats.delete(category.id);
                        } else {
                          expandedCats.add(category.id);
                        }
                        setExpandedCategories(Array.from(expandedCats));
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: category.color }}
                          >
                            <Shield className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{category.name}</CardTitle>
                              <Badge variant="secondary">{categoryApis.length} APIs</Badge>
                              {expandedCategories.includes(category.id) ? 
                                <ChevronDown className="w-4 h-4" /> : 
                                <ChevronRight className="w-4 h-4" />
                              }
                            </div>
                            <CardDescription className="text-sm text-muted-foreground">
                              {category.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
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
                    
                    {/* Expandable APIs Section */}
                    {expandedCategories.includes(category.id) && (
                      <CardContent className="pt-0">
                        <div className="border-t pt-4">
                          <div className="space-y-3">
                            {categoryApis.length === 0 ? (
                              <p className="text-sm text-muted-foreground italic">No APIs in this category</p>
                            ) : (
                              categoryApis.map((api) => (
                                <Card key={api.id} className="ml-6 border-l-4" style={{ borderLeftColor: category.color }}>
                                  <CardHeader 
                                    className="cursor-pointer py-3"
                                    onClick={() => {
                                      const expandedApis = new Set(expandedApis);
                                      if (expandedApis.has(api.id)) {
                                        expandedApis.delete(api.id);
                                      } else {
                                        expandedApis.add(api.id);
                                      }
                                      setExpandedApis(Array.from(expandedApis));
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <Badge variant={api.method === 'GET' ? 'secondary' : 'default'}>
                                          {api.method}
                                        </Badge>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <CardTitle className="text-base">{api.name}</CardTitle>
                                            <Badge variant="outline">{api.status}</Badge>
                                            {expandedApis.includes(api.id) ? 
                                              <ChevronDown className="w-3 h-3" /> : 
                                              <ChevronRight className="w-3 h-3" />
                                            }
                                          </div>
                                          <CardDescription className="font-mono text-xs">{api.path}</CardDescription>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setEditingApi(api);
                                            setShowApiDialog(true);
                                          }}
                                        >
                                          <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleDeleteApi(api.id)}
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  
                                  {/* Expandable API Details - Documentation & Sandbox */}
                                  {expandedApis.includes(api.id) && (
                                    <CardContent className="pt-0">
                                      <div className="ml-4 space-y-4 text-sm">
                                        <div>
                                          <h4 className="font-medium text-[var(--au-primary)] mb-2">📋 Documentation</h4>
                                          <p className="text-muted-foreground">{api.description}</p>
                                        </div>
                                        
                                        <div>
                                          <h4 className="font-medium text-[var(--au-primary)] mb-2">🧪 Sandbox Configuration</h4>
                                          <div className="bg-muted p-3 rounded">
                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                              <div>
                                                <strong>Rate Limit:</strong> {api.rateLimit}/min
                                              </div>
                                              <div>
                                                <strong>Timeout:</strong> {api.timeout}ms
                                              </div>
                                              <div>
                                                <strong>Auth Required:</strong> {api.requiresAuth ? 'Yes' : 'No'}
                                              </div>
                                              <div>
                                                <strong>Auth Type:</strong> {api.authType || 'N/A'}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        {api.bodyParameters && api.bodyParameters.length > 0 && (
                                          <div>
                                            <h4 className="font-medium text-[var(--au-primary)] mb-2">📥 Parameters</h4>
                                            <div className="space-y-2">
                                              {api.bodyParameters.map((param, idx) => (
                                                <div key={idx} className="bg-muted p-2 rounded text-xs">
                                                  <div className="font-medium">{param.name} 
                                                    <Badge variant="outline" className="ml-2 text-xs">{param.type}</Badge>
                                                    {param.required && <Badge variant="destructive" className="ml-1 text-xs">Required</Badge>}
                                                  </div>
                                                  <div className="text-muted-foreground mt-1">{param.description}</div>
                                                  {param.example && <div className="text-muted-foreground mt-1">Example: {param.example}</div>}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        
                                        {api.responses && api.responses.length > 0 && (
                                          <div>
                                            <h4 className="font-medium text-[var(--au-primary)] mb-2">📤 Response Schema</h4>
                                            <div className="bg-muted p-3 rounded">
                                              <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                                                {api.responses[0]?.schema || 'No schema defined'}
                                              </pre>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  )}
                                </Card>
                              ))
                            )}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--au-primary)]">Documentation Management</h2>
                <p className="text-muted-foreground">Manage API documentation and guides</p>
              </div>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Documentation management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sandbox Tab */}
          <TabsContent value="sandbox" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--au-primary)]">Sandbox Configuration</h2>
                <p className="text-muted-foreground">Configure sandbox settings and test environments</p>
              </div>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Sandbox configuration features coming soon...</p>
              </CardContent>
            </Card>
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

// Placeholder components (will be implemented later)
const LoginForm = ({ onLogin }: { onLogin: (username: string, password: string) => void }) => <div>Login Form</div>;
const CategoryEditDialog = ({ category, onSave, onClose }: any) => <div>Category Edit Dialog</div>;
const ApiEditDialog = ({ api, categories, onSave, onClose }: any) => <div>API Edit Dialog</div>;
