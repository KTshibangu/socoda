import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { canAccessArtistFeatures, canAccessBusinessFeatures, isAdmin, getUserDisplayName, getUserInitials } from "@/lib/auth";
import {
  Music,
  FileAudio,
  Plus,
  Building,
  BarChart3,
  DollarSign,
  CheckCircle,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const logoutMutation = useLogout();

  if (!user) {
    return null;
  }

  const userRole = user.role;
  const canAccessArtist = canAccessArtistFeatures(userRole);
  const canAccessBusiness = canAccessBusinessFeatures(userRole);
  const isAdminUser = isAdmin(userRole);
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);

  // Build navigation items based on user role
  const navigationItems = [
    { name: "Dashboard", href: "/", icon: BarChart3, show: true },
  ];

  // Add artist navigation items
  if (canAccessArtist) {
    navigationItems.push(
      { name: "My Works", href: "/works", icon: FileAudio, show: true },
      { name: "Register Work", href: "/register-work", icon: Plus, show: true },
      { name: "Royalties", href: "/royalties", icon: DollarSign, show: true }
    );
  }

  // Add business navigation items
  if (canAccessBusiness) {
    navigationItems.push(
      { name: "Business Licenses", href: "/business-licenses", icon: Building, show: true },
      { name: "Usage Reports", href: "/usage-reports", icon: BarChart3, show: true }
    );
  }

  // Admin navigation items
  const adminItems = isAdminUser ? [
    { name: "Approvals", href: "/admin/approvals", icon: CheckCircle, badge: "3", show: true },
    { name: "User Management", href: "/admin/users", icon: Users, show: true },
  ] : [];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 fixed h-full flex flex-col" data-testid="sidebar">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Music className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900" data-testid="text-app-title">PRO System</h1>
            <p className="text-sm text-gray-500">Rights Management</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="px-4 flex-1">
        <div className="space-y-1">
          {navigationItems.filter(item => item.show).map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Admin Section */}
        {isAdminUser && adminItems.length > 0 && (
          <div className="mt-8">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Administration
              </h3>
            </div>
            <div className="space-y-1">
              {adminItems.filter(item => item.show).map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    data-testid={`nav-admin-${item.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.profileImageUrl || ""} alt={displayName} />
            <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate" data-testid="text-user-name">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 capitalize" data-testid="text-user-role">
              {userRole}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          data-testid="button-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {logoutMutation.isPending ? "Logging out..." : "Log out"}
        </Button>
      </div>
    </aside>
  );
}