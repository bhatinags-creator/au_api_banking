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

interface APIEndpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  category: string;
  description: string;
  requiresAuth: boolean;
  sampleRequest?: any;
  documentation?: string;
  validationSchema?: any;
  status: 'active' | 'deprecated' | 'draft';
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
    // Mock data - in production, this would come from the backend
    setApis([
      {
        id: "oauth-token",
        name: "Generate OAuth Token",
        method: "POST",
        path: "/api/oauth/token",
        category: "Authentication",
        description: "Generate OAuth access token for API authentication",
        requiresAuth: false,
        status: "active",
        documentation: "This endpoint generates OAuth tokens for API access..."
      },
      {
        id: "cnb-payment",
        name: "CNB Payment Creation",
        method: "POST",
        path: "/api/cnb/payment",
        category: "Payments",
        description: "Create a new CNB payment transaction",
        requiresAuth: true,
        status: "active",
        documentation: "Create payment transactions using CNB gateway..."
      }
    ]);

    setCategories([
      {
        id: "auth",
        name: "Authentication",
        description: "API authentication and authorization endpoints",
        icon: "Shield",
        color: "#603078",
        endpoints: ["oauth-token"]
      },
      {
        id: "payments",
        name: "Payments",
        description: "Payment processing and transaction management",
        icon: "CreditCard", 
        color: "#603078",
        endpoints: ["cnb-payment"]
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

  // Category Management Functions
  const handleSaveCategory = (categoryData: Partial<APICategory>) => {
    if (editingCategory) {
      setCategories(categories.map(cat => cat.id === editingCategory.id ? { ...cat, ...categoryData } : cat));
      toast({ title: "Category Updated", description: "API category has been updated" });
    } else {
      const newCategory: APICategory = {
        ...categoryData as APICategory,
        id: Date.now().toString(),
        endpoints: []
      };
      setCategories([...categories, newCategory]);
      toast({ title: "Category Created", description: "New API category has been created" });
    }
    setEditingCategory(null);
    setShowCategoryDialog(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast({ title: "Category Deleted", description: "API category has been removed" });
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
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Documentation management interface coming soon...
                </p>
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
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Sandbox configuration interface coming soon...
                </p>
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
  const [formData, setFormData] = useState<Partial<APIEndpoint>>({
    name: api?.name || "",
    method: api?.method || "GET",
    path: api?.path || "",
    category: api?.category || "",
    description: api?.description || "",
    requiresAuth: api?.requiresAuth || false,
    status: api?.status || "active",
    documentation: api?.documentation || ""
  });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{api ? 'Edit API' : 'Create New API'}</DialogTitle>
        <DialogDescription>
          {api ? 'Update the API endpoint configuration' : 'Add a new API endpoint to the developer portal'}
        </DialogDescription>
      </DialogHeader>
      
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
          <Label htmlFor="api-description">Description</Label>
          <Textarea
            id="api-description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Brief description of what this API does..."
          />
        </div>
        
        <div className="col-span-2">
          <Label htmlFor="api-documentation">Documentation</Label>
          <Textarea
            id="api-documentation"
            rows={4}
            value={formData.documentation}
            onChange={(e) => setFormData({...formData, documentation: e.target.value})}
            placeholder="Detailed documentation for this API endpoint..."
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4">
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
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90">
            <Save className="w-4 h-4 mr-2" />
            {api ? 'Update' : 'Create'}
          </Button>
        </div>
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