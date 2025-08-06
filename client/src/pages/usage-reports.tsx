import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Upload, FileText } from "lucide-react";
import type { UsageReport } from "@shared/schema";

export default function UsageReports() {
  const [showUploadForm, setShowUploadForm] = useState(false);

  const { data: reports, isLoading } = useQuery<UsageReport[]>({
    queryKey: ["/api/usage-reports"],
  });

  return (
    <>
      <Header
        title="Usage Reports"
        description="Track and submit music usage data"
      />
      <div className="p-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
          <Button onClick={() => setShowUploadForm(true)} data-testid="button-upload-report">
            <Upload className="w-4 h-4 mr-2" />
            Upload Report
          </Button>
        </div>

        {/* Reports List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
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
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reports && reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} data-testid={`card-report-${report.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900" data-testid={`text-report-period-${report.id}`}>
                          {new Date(report.reportPeriodStart).toLocaleDateString()} - {new Date(report.reportPeriodEnd).toLocaleDateString()}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span data-testid={`text-report-plays-${report.id}`}>
                            Plays: {report.playCount.toLocaleString()}
                          </span>
                          <span data-testid={`text-report-submitted-${report.id}`}>
                            Submitted: {new Date(report.createdAt!).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" data-testid={`button-view-report-${report.id}`}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No usage reports found</h3>
              <p className="text-gray-500 mb-4">
                Upload your first usage report to track music plays and calculate royalties
              </p>
              <Button onClick={() => setShowUploadForm(true)} data-testid="button-upload-first-report">
                Upload Report
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
