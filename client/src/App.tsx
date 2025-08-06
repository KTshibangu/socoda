import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Works from "@/pages/works";
import RegisterWork from "@/pages/register-work";
import BusinessLicenses from "@/pages/business-licenses";
import UsageReports from "@/pages/usage-reports";
import Royalties from "@/pages/royalties";
import Approvals from "@/pages/admin/approvals";
import UserManagement from "@/pages/admin/user-management";
import Sidebar from "@/components/layout/sidebar";

function Router() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/works" component={Works} />
          <Route path="/register-work" component={RegisterWork} />
          <Route path="/business-licenses" component={BusinessLicenses} />
          <Route path="/usage-reports" component={UsageReports} />
          <Route path="/royalties" component={Royalties} />
          <Route path="/admin/approvals" component={Approvals} />
          <Route path="/admin/users" component={UserManagement} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
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
