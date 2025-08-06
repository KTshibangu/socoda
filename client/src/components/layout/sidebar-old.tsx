import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

const navigationItems = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "My Works", href: "/works", icon: FileAudio },
  { name: "Register Work", href: "/register-work", icon: Plus },
  { name: "Business Licenses", href: "/business-licenses", icon: Building },
  { name: "Usage Reports", href: "/usage-reports", icon: BarChart3 },
  { name: "Royalties", href: "/royalties", icon: DollarSign },
];

const adminItems = [
  { name: "Approvals", href: "/admin/approvals", icon: CheckCircle, badge: "3" },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "System Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  // Mock user data - in production this would come from auth context
  const currentUser = {
    id: "1",
    firstName: "John",
    lastName: "Composer",
    email: "john@example.com",
    role: "admin",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32",
  };

  const showAdminSection = currentUser.role === "admin";

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 fixed h-full" data-testid="sidebar">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Music className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900" data-testid="text-app-title">PRO System</h1>
            <p className="text-sm text-gray-500">Rights Management</p>
          </div>
        </div>
      </div>

      <nav className="px-4 pb-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                  data-testid={`link-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon
                    className={cn(
                      "mr-3 w-5 h-5",
                      isActive ? "text-primary-500" : "text-gray-400"
                    )}
                  />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </div>

        {showAdminSection && (
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Admin
            </h3>
            <div className="mt-2 space-y-1">
              {adminItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <a
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-primary-50 text-primary-700"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                      data-testid={`link-admin-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 w-5 h-5",
                          isActive ? "text-primary-500" : "text-gray-400"
                        )}
                      />
                      {item.name}
                      {item.badge && (
                        <Badge
                          className="ml-auto bg-red-100 text-red-800"
                          data-testid={`badge-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={currentUser.profileImageUrl} />
            <AvatarFallback data-testid="text-user-initials">
              {currentUser.firstName[0]}{currentUser.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900" data-testid="text-user-name">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p className="text-xs text-gray-500" data-testid="text-user-role">
              {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
            </p>
          </div>
          <Button variant="ghost" size="sm" data-testid="button-logout">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
