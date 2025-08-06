import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";
import { useLocation } from "wouter";

interface HeaderProps {
  title: string;
  description: string;
  showRegisterButton?: boolean;
}

export default function Header({ title, description, showRegisterButton = false }: HeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200" data-testid="header">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
              {title}
            </h2>
            <p className="text-sm text-gray-600" data-testid="text-page-description">
              {description}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative" data-testid="button-notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </Button>
            {showRegisterButton && (
              <Button
                onClick={() => setLocation("/register-work")}
                data-testid="button-register-new-work"
              >
                <Plus className="w-4 h-4 mr-2" />
                Register New Work
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
