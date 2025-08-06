import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Plus, FileText, Upload } from "lucide-react";

export default function QuickActions() {
  const [, setLocation] = useLocation();

  const actions = [
    {
      title: "Register New Work",
      description: "Add a new song or composition",
      icon: Plus,
      color: "text-primary-600",
      onClick: () => setLocation("/register-work"),
      testId: "button-quick-register-work",
    },
    {
      title: "Apply for License",
      description: "Business license application",
      icon: FileText,
      color: "text-green-600",
      onClick: () => setLocation("/business-licenses"),
      testId: "button-quick-apply-license",
    },
    {
      title: "Upload Usage Report",
      description: "Submit play count data",
      icon: Upload,
      color: "text-purple-600",
      onClick: () => setLocation("/usage-reports"),
      testId: "button-quick-upload-report",
    },
  ];

  return (
    <Card className="border border-gray-200" data-testid="card-quick-actions">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="w-full justify-start h-auto p-3 hover:bg-gray-50"
              onClick={action.onClick}
              data-testid={action.testId}
            >
              <action.icon className={`mr-3 w-5 h-5 ${action.color}`} />
              <div className="text-left">
                <p className="font-medium text-gray-900">{action.title}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
