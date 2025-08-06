import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LicenseApplicationForm from "@/components/business/license-application-form";
import { Building, Plus } from "lucide-react";
import type { BusinessLicense } from "@shared/schema";

export default function BusinessLicenses() {
  const [showForm, setShowForm] = useState(false);

  const { data: licenses, isLoading } = useQuery<BusinessLicense[]>({
    queryKey: ["/api/business-licenses"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "revoked":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Header
        title="Business Licenses"
        description="Manage venue licenses and applications"
      />
      <div className="p-6">
        {showForm ? (
          <LicenseApplicationForm onCancel={() => setShowForm(false)} />
        ) : (
          <>
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Active Licenses</h2>
              <Button onClick={() => setShowForm(true)} data-testid="button-apply-license">
                <Plus className="w-4 h-4 mr-2" />
                Apply for License
              </Button>
            </div>

            {/* Licenses List */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="w-12 h-12 rounded-lg" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : licenses && licenses.length > 0 ? (
              <div className="space-y-4">
                {licenses.map((license) => (
                  <Card key={license.id} data-testid={`card-license-${license.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900" data-testid={`text-license-name-${license.id}`}>
                              {license.businessName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span data-testid={`text-license-type-${license.id}`}>
                                Type: {license.businessType.charAt(0).toUpperCase() + license.businessType.slice(1)}
                              </span>
                              <span data-testid={`text-license-fee-${license.id}`}>
                                Annual Fee: ${Number(license.annualFee).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(license.status)} data-testid={`badge-license-status-${license.id}`}>
                            {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
                          </Badge>
                          <Button variant="outline" size="sm" data-testid={`button-view-license-${license.id}`}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No licenses found</h3>
                  <p className="text-gray-500 mb-4">
                    Apply for your first business license to start playing licensed music
                  </p>
                  <Button onClick={() => setShowForm(true)} data-testid="button-apply-first-license">
                    Apply for License
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </>
  );
}
