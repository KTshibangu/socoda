import Header from "@/components/layout/header";
import StatsCards from "@/components/dashboard/stats-cards";
import RecentWorks from "@/components/dashboard/recent-works";
import QuickActions from "@/components/dashboard/quick-actions";
import RecentActivity from "@/components/dashboard/recent-activity";

export default function Dashboard() {
  return (
    <>
      <Header
        title="Dashboard"
        description="Manage your works, royalties, and licensing"
        showRegisterButton={true}
      />
      <div className="p-6">
        <StatsCards />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <RecentWorks />
          </div>
          <div className="space-y-6">
            <QuickActions />
            <RecentActivity />
          </div>
        </div>
      </div>
    </>
  );
}
