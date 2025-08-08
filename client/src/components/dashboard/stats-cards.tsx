import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileAudio, DollarSign, Building, Clock, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface DashboardStats {
  totalWorks?: number;
  totalRoyalties?: string;
  activeLicenses?: number;
  pendingApprovals?: number;
  myLicenses?: number;
  myUsageReports?: number;
}

export default function StatsCards() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (!user) return null;

  let statItems = [];

  if (user.role === "business") {
    // Business-specific stats
    statItems = [
      {
        title: "My Licenses",
        value: stats?.myLicenses || 0,
        icon: Building,
        color: "bg-blue-100 text-blue-600",
        testId: "stat-my-licenses",
      },
      {
        title: "Usage Reports",
        value: stats?.myUsageReports || 0,
        icon: FileText,
        color: "bg-green-100 text-green-600",
        testId: "stat-usage-reports",
      },
    ];
  } else if (user.role === "admin") {
    // Admin stats
    statItems = [
      {
        title: "Total Works",
        value: stats?.totalWorks || 0,
        icon: FileAudio,
        color: "bg-blue-100 text-blue-600",
        testId: "stat-total-works",
      },
      {
        title: "Active Licenses",
        value: stats?.activeLicenses || 0,
        icon: Building,
        color: "bg-purple-100 text-purple-600",
        testId: "stat-active-licenses",
      },
      {
        title: "Pending Approvals",
        value: stats?.pendingApprovals || 0,
        icon: Clock,
        color: "bg-amber-100 text-amber-600",
        testId: "stat-pending-approvals",
      },
    ];
  } else {
    // Artist stats (composer, author, vocalist)
    statItems = [
      {
        title: "My Works",
        value: stats?.totalWorks || 0,
        icon: FileAudio,
        color: "bg-blue-100 text-blue-600",
        testId: "stat-total-works",
      },
      {
        title: "Total Royalties",
        value: stats?.totalRoyalties || "$0.00",
        icon: DollarSign,
        color: "bg-green-100 text-green-600",
        testId: "stat-total-royalties",
      },
    ];
  }

  return (
    <div className={`grid grid-cols-1 gap-6 ${statItems.length === 2 ? 'md:grid-cols-2' : statItems.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
      {statItems.map((stat) => (
        <Card key={stat.title} className="border border-gray-200" data-testid={`card-${stat.testId}`}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900" data-testid={`text-${stat.testId}`}>
                    {stat.value}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
