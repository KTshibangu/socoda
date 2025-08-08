import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import StatsCards from "@/components/dashboard/stats-cards";
import RecentWorks from "@/components/dashboard/recent-works";
import QuickActions from "@/components/dashboard/quick-actions";
import RecentActivity from "@/components/dashboard/recent-activity";
import { canAccessArtistFeatures, canAccessBusinessFeatures, isAdmin } from "@/lib/auth";

function ArtistDashboard() {
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

function BusinessDashboard() {
  return (
    <>
      <Header
        title="Business Dashboard"
        description="Manage your licenses and usage reports"
        showRegisterButton={false}
      />
      <div className="p-6">
        <StatsCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="space-y-6">
            <QuickActions />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </>
  );
}

function AdminDashboard() {
  return (
    <>
      <Header
        title="Admin Dashboard"
        description="Manage users, approvals, and system overview"
        showRegisterButton={false}
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

export default function Dashboard() {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }

  const userRole = user.role;
  const canAccessArtist = canAccessArtistFeatures(userRole);
  const canAccessBusiness = canAccessBusinessFeatures(userRole);
  const isAdminUser = isAdmin(userRole);

  if (isAdminUser) {
    return <AdminDashboard />;
  } else if (canAccessBusiness && !canAccessArtist) {
    return <BusinessDashboard />;
  } else {
    return <ArtistDashboard />;
  }
}
