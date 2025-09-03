import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Key, Settings, Trash2, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertApplicationSchema, insertDeveloperSchema, Developer, Application } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string>("");
  const { toast } = useToast();

  const { data: developers = [], isLoading: developersLoading } = useQuery<Developer[]>({
    queryKey: ["/api/developers"],
  });

  const { data: applications = [], isLoading: appsLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications", selectedDeveloperId],
    enabled: !!selectedDeveloperId,
  });

  const createDeveloperMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/developers", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/developers"] });
      toast({ title: "Developer created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create developer", variant: "destructive" });
    },
  });

  const createApplicationMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/applications", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications", selectedDeveloperId] });
      toast({ title: "Application created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create application", variant: "destructive" });
    },
  });

  const developerForm = useForm({
    resolver: zodResolver(insertDeveloperSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
    },
  });

  const applicationForm = useForm({
    resolver: zodResolver(insertApplicationSchema.extend({
      developerId: z.string().min(1, "Developer is required"),
    })),
    defaultValues: {
      name: "",
      description: "",
      environment: "sandbox",
      status: "active",
      developerId: "",
    },
  });

  const onCreateDeveloper = (data: any) => {
    createDeveloperMutation.mutate(data);
    developerForm.reset();
  };

  const onCreateApplication = (data: any) => {
    createApplicationMutation.mutate(data);
    applicationForm.reset();
  };

  if (developersLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  const selectedDeveloper = developers.find((dev: Developer) => dev.id === selectedDeveloperId);

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
            Developer Dashboard
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" data-testid="button-new-developer">
                <Plus className="w-4 h-4 mr-2" />
                New Developer
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-new-developer">
              <DialogHeader>
                <DialogTitle>Create Developer Account</DialogTitle>
                <DialogDescription>
                  Register a new developer to get API access
                </DialogDescription>
              </DialogHeader>
              <Form {...developerForm}>
                <form onSubmit={developerForm.handleSubmit(onCreateDeveloper)} className="space-y-4">
                  <FormField
                    control={developerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-developer-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={developerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" data-testid="input-developer-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={developerForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-developer-company" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={createDeveloperMutation.isPending}
                    className="w-full"
                    data-testid="button-submit-developer"
                  >
                    {createDeveloperMutation.isPending ? "Creating..." : "Create Developer"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-24 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Developers List */}
          <div className="space-y-4">
            <Card data-testid="developers-panel">
              <CardHeader>
                <CardTitle>Developers</CardTitle>
                <CardDescription>Select a developer to view their applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {developers.map((developer: Developer) => (
                  <button
                    key={developer.id}
                    onClick={() => setSelectedDeveloperId(developer.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedDeveloperId === developer.id
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                    data-testid={`developer-${developer.id}`}
                  >
                    <div className="font-medium text-gray-900">{developer.name}</div>
                    <div className="text-sm text-gray-600">{developer.email}</div>
                    {developer.company && (
                      <div className="text-xs text-gray-500">{developer.company}</div>
                    )}
                  </button>
                ))}
                
                {developers.length === 0 && (
                  <div className="text-center text-gray-500 py-8" data-testid="no-developers">
                    <p>No developers yet</p>
                    <p className="text-sm">Create your first developer account to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Developer Details & API Key */}
          <div className="space-y-6">
            {selectedDeveloper && (
              <>
                <Card data-testid="api-key-panel">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Key className="w-5 h-5" />
                      <span>API Key</span>
                    </CardTitle>
                    <CardDescription>
                      Use this key to authenticate your API requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Input
                        value={showApiKey ? selectedDeveloper.apiKey : "••••••••••••••••"}
                        readOnly
                        className="font-mono"
                        data-testid="input-api-key-display"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowApiKey(!showApiKey)}
                        data-testid="button-toggle-api-key-visibility"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedDeveloper.apiKey);
                        toast({ title: "API key copied to clipboard!" });
                      }}
                      className="w-full"
                      data-testid="button-copy-api-key"
                    >
                      Copy API Key
                    </Button>
                  </CardContent>
                </Card>

                <Card data-testid="developer-info-panel">
                  <CardHeader>
                    <CardTitle>Developer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <p className="text-gray-900" data-testid="developer-name">{selectedDeveloper.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900" data-testid="developer-email">{selectedDeveloper.email}</p>
                    </div>
                    {selectedDeveloper.company && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Company</label>
                        <p className="text-gray-900" data-testid="developer-company">{selectedDeveloper.company}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Member Since</label>
                      <p className="text-gray-900" data-testid="developer-created-at">
                        {new Date(selectedDeveloper.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Applications */}
          <div className="space-y-4">
            <Card data-testid="applications-panel">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Applications</span>
                  {selectedDeveloper && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" data-testid="button-new-application">
                          <Plus className="w-4 h-4 mr-2" />
                          New App
                        </Button>
                      </DialogTrigger>
                      <DialogContent data-testid="dialog-new-application">
                        <DialogHeader>
                          <DialogTitle>Create Application</DialogTitle>
                          <DialogDescription>
                            Create a new application to track API usage
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...applicationForm}>
                          <form onSubmit={applicationForm.handleSubmit(onCreateApplication)} className="space-y-4">
                            <FormField
                              control={applicationForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Application Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} data-testid="input-app-name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={applicationForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description (optional)</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} data-testid="textarea-app-description" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={applicationForm.control}
                              name="environment"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Environment</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-app-environment">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="sandbox">Sandbox</SelectItem>
                                      <SelectItem value="production">Production</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <input type="hidden" {...applicationForm.register("developerId")} value={selectedDeveloperId} />
                            
                            <Button 
                              type="submit" 
                              disabled={createApplicationMutation.isPending}
                              className="w-full"
                              data-testid="button-submit-application"
                            >
                              {createApplicationMutation.isPending ? "Creating..." : "Create Application"}
                            </Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedDeveloper ? "Manage your applications" : "Select a developer to view applications"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDeveloper ? (
                  <div className="space-y-4">
                    {applications.map((app: Application) => (
                      <div 
                        key={app.id} 
                        className="border border-gray-200 rounded-lg p-4 bg-white"
                        data-testid={`application-${app.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900" data-testid={`app-name-${app.id}`}>
                              {app.name}
                            </h4>
                            {app.description && (
                              <p className="text-sm text-gray-600" data-testid={`app-description-${app.id}`}>
                                {app.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={app.environment === "production" ? "default" : "secondary"}
                                data-testid={`app-environment-${app.id}`}
                              >
                                {app.environment}
                              </Badge>
                              <Badge 
                                variant={app.status === "active" ? "default" : "destructive"}
                                data-testid={`app-status-${app.id}`}
                              >
                                {app.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500" data-testid={`app-created-${app.id}`}>
                              Created {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" data-testid={`button-app-settings-${app.id}`}>
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" data-testid={`button-app-delete-${app.id}`}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {applications.length === 0 && (
                      <div className="text-center text-gray-500 py-8" data-testid="no-applications">
                        <p>No applications yet</p>
                        <p className="text-sm">Create your first application to start using the APIs</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8" data-testid="no-developer-selected">
                    <p>Select a developer to view their applications</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}