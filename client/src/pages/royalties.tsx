import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, Clock } from "lucide-react";
import type { RoyaltyDistribution } from "@shared/schema";

export default function Royalties() {
  const { data: distributions, isLoading } = useQuery<RoyaltyDistribution[]>({
    queryKey: ["/api/royalties"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalEarnings = distributions?.reduce((sum, dist) => {
    return dist.paymentStatus === "paid" ? sum + Number(dist.amount) : sum;
  }, 0) || 0;

  const pendingEarnings = distributions?.reduce((sum, dist) => {
    return dist.paymentStatus === "pending" || dist.paymentStatus === "processing" ? sum + Number(dist.amount) : sum;
  }, 0) || 0;

  return (
    <>
      <Header
        title="Royalties"
        description="Track your earnings and payment status"
      />
      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="text-green-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-total-earnings">
                    ${totalEarnings.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="text-yellow-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-pending-earnings">
                    ${pendingEarnings.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="text-blue-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Distributions</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-total-distributions">
                    {distributions?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distributions List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Royalty Distributions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : distributions && distributions.length > 0 ? (
              <div className="space-y-4">
                {distributions.map((distribution) => (
                  <div
                    key={distribution.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    data-testid={`card-distribution-${distribution.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900" data-testid={`text-distribution-date-${distribution.id}`}>
                          {new Date(distribution.createdAt!).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500" data-testid={`text-distribution-id-${distribution.id}`}>
                          Distribution ID: {distribution.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900" data-testid={`text-distribution-amount-${distribution.id}`}>
                        ${Number(distribution.amount).toFixed(2)}
                      </p>
                      <Badge className={getStatusColor(distribution.paymentStatus)} data-testid={`badge-distribution-status-${distribution.id}`}>
                        {distribution.paymentStatus.charAt(0).toUpperCase() + distribution.paymentStatus.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No royalty distributions yet</h3>
                <p className="text-gray-500">
                  Royalty distributions will appear here once usage reports are processed
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
