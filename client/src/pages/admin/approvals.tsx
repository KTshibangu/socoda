import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Music, Clock } from "lucide-react";
import type { Work, User } from "@shared/schema";

type WorkWithUser = Work & { registeredByUser: User };

export default function Approvals() {
  const { toast } = useToast();

  const { data: pendingWorks, isLoading } = useQuery<WorkWithUser[]>({
    queryKey: ["/api/works/recent"],
  });

  const approveWorkMutation = useMutation({
    mutationFn: async ({ workId, status }: { workId: string; status: "approved" | "rejected" }) => {
      await apiRequest("PATCH", `/api/works/${workId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/works"] });
      toast({
        title: "Success",
        description: "Work status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredPendingWorks = pendingWorks?.filter(work => work.status === "pending");

  return (
    <>
      <Header
        title="Work Approvals"
        description="Review and approve pending work registrations"
      />
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="text-yellow-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-pending-count">
                    {filteredPendingWorks?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Works */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Pending Work Registrations</h3>
            
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Skeleton className="h-8 w-20 inline-block" />
                      <Skeleton className="h-8 w-20 inline-block" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPendingWorks && filteredPendingWorks.length > 0 ? (
              <div className="space-y-4">
                {filteredPendingWorks.map((work) => (
                  <div
                    key={work.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    data-testid={`card-pending-work-${work.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900" data-testid={`text-pending-work-title-${work.id}`}>
                          {work.title}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span data-testid={`text-pending-work-artist-${work.id}`}>
                            by {work.registeredByUser.firstName} {work.registeredByUser.lastName}
                          </span>
                          {work.iswc && (
                            <span data-testid={`text-pending-work-iswc-${work.id}`}>ISWC: {work.iswc}</span>
                          )}
                          <span data-testid={`text-pending-work-date-${work.id}`}>
                            Submitted: {new Date(work.createdAt!).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => approveWorkMutation.mutate({ workId: work.id, status: "approved" })}
                        disabled={approveWorkMutation.isPending}
                        data-testid={`button-approve-work-${work.id}`}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => approveWorkMutation.mutate({ workId: work.id, status: "rejected" })}
                        disabled={approveWorkMutation.isPending}
                        data-testid={`button-reject-work-${work.id}`}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending approvals</h3>
                <p className="text-gray-500">
                  All work registrations have been reviewed
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
