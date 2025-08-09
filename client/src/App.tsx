import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { canAccessArtistFeatures, canAccessBusinessFeatures, isAdmin } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Works from "@/pages/works";
import RegisterWork from "@/pages/register-work";
import BusinessLicenses from "@/pages/business-licenses";
import UsageReports from "@/pages/usage-reports";
import Royalties from "@/pages/royalties";
import Approvals from "@/pages/admin/approvals";
import UserManagement from "@/pages/admin/user-management";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Sidebar from "@/components/layout/sidebar";

function AuthenticatedRouter() {
  const { user } = useAuth();
  
  if (!user) {
    return <PublicRouter />;
  }

  const userRole = user.role;
  const canAccessArtist = canAccessArtistFeatures(userRole);
  const canAccessBusiness = canAccessBusinessFeatures(userRole);
  const isAdminUser = isAdmin(userRole);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Switch>
          <Route path="/" component={Dashboard} />
          
          {/* Artist routes */}
          {canAccessArtist && (
            <>
              <Route path="/works" component={Works} />
              <Route path="/register-work" component={RegisterWork} />
              <Route path="/royalties" component={Royalties} />
            </>
          )}
          
          {/* Business routes */}
          {canAccessBusiness && (
            <>
              <Route path="/business-licenses" component={BusinessLicenses} />
              <Route path="/usage-reports" component={UsageReports} />
            </>
          )}
          
          {/* Admin routes */}
          {isAdminUser && (
            <>
              <Route path="/admin/approvals" component={Approvals} />
              <Route path="/admin/users" component={UserManagement} />
            </>
          )}
          
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function PublicRouter() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route>
        {() => <Login />}
      </Route>
    </Switch>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <AuthenticatedRouter /> : <PublicRouter />;
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
