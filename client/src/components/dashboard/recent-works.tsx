import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import type { Work, User } from "@shared/schema";

type WorkWithUser = Work & { registeredByUser: User };

export default function RecentWorks() {
  const { data: works, isLoading } = useQuery<WorkWithUser[]>({
    queryKey: ["/api/works/recent"],
    select: (data) => data?.slice(0, 5), // Limit to 5 most recent
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="border border-gray-200" data-testid="card-recent-works">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Works</h3>
          <Link href="/works">
            <a className="text-primary-600 hover:text-primary-700 text-sm font-medium" data-testid="link-view-all-works">
              View all
            </a>
          </Link>
        </div>
      </div>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : works && works.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ISWC
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {works.map((work) => (
                  <tr key={work.id} className="hover:bg-gray-50" data-testid={`row-recent-work-${work.id}`}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900" data-testid={`text-recent-work-title-${work.id}`}>
                        {work.title}
                      </div>
                      <div className="text-sm text-gray-500" data-testid={`text-recent-work-artist-${work.id}`}>
                        by {work.registeredByUser.firstName} {work.registeredByUser.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500" data-testid={`text-recent-work-iswc-${work.id}`}>
                      {work.iswc || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(work.status)} data-testid={`badge-recent-work-status-${work.id}`}>
                        {work.status.charAt(0).toUpperCase() + work.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500" data-testid={`text-recent-work-date-${work.id}`}>
                      {work.createdAt ? formatDate(work.createdAt) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500">No recent works found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
