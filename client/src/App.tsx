import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import Home from "@/pages/home";
import ApiExplorer from "@/pages/api-explorer";
import APIDocs from "@/pages/api-docs";
import Sandbox from "@/pages/sandbox";
import Dashboard from "@/pages/dashboard";
import Analytics from "@/pages/analytics";
import CorporateRegistration from "@/pages/corporate-registration";
import SignUp from "@/pages/signup";
import SignIn from "@/pages/signin";
import AdminPanel from "@/pages/admin";
import NotFound from "@/pages/not-found";

// Protected Route component
function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/signin');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#603078] to-[#603078]/80 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">AU Bank Developer Portal</h2>
          <p className="text-gray-600">Initializing secure session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // useEffect will handle the redirect
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      {/* Public routes - no auth check needed */}
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/register" component={CorporateRegistration} />
      <Route path="/docs" component={APIDocs} />
      <Route path="/sandbox" component={Sandbox} />
      <Route path="/" component={Home} />
      
      {/* Protected routes - auth check only when accessed */}
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/apis">
        {() => <ProtectedRoute component={ApiExplorer} />}
      </Route>
      <Route path="/analytics">
        {() => <ProtectedRoute component={Analytics} />}
      </Route>
      <Route path="/admin">
        {() => <ProtectedRoute component={AdminPanel} />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
