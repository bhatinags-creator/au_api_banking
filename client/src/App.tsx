import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import ApiExplorer from "@/pages/api-explorer";
import APIDocs from "@/pages/api-docs";
import Sandbox from "@/pages/sandbox";
import Dashboard from "@/pages/dashboard";
import Analytics from "@/pages/analytics";
import CorporateRegistration from "@/pages/corporate-registration";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/apis" component={ApiExplorer} />
      <Route path="/docs" component={APIDocs} />
      <Route path="/sandbox" component={Sandbox} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/register" component={CorporateRegistration} />
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
