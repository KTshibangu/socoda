import { Card, CardContent } from "@/components/ui/card";

interface ActivityItem {
  id: string;
  description: string;
  timestamp: string;
  type: "success" | "info" | "warning";
}

export default function RecentActivity() {
  // Mock data - in production this would come from an API
  const activities: ActivityItem[] = [
    {
      id: "1",
      description: 'Work "Summer Vibes" was approved',
      timestamp: "2 hours ago",
      type: "success",
    },
    {
      id: "2",
      description: "New usage report from Venue ABC",
      timestamp: "4 hours ago",
      type: "info",
    },
    {
      id: "3",
      description: "Royalty payment of $245.50 processed",
      timestamp: "1 day ago",
      type: "success",
    },
    {
      id: "4",
      description: "License application pending review",
      timestamp: "2 days ago",
      type: "warning",
    },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "info":
        return "bg-blue-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="border border-gray-200" data-testid="card-recent-activity">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3" data-testid={`activity-item-${activity.id}`}>
              <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)}`} />
              <div className="flex-1">
                <p className="text-sm text-gray-900" data-testid={`text-activity-description-${activity.id}`}>
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500" data-testid={`text-activity-timestamp-${activity.id}`}>
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
