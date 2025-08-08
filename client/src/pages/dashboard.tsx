import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import StatsCards from "@/components/dashboard/stats-cards";
import RecentWorks from "@/components/dashboard/recent-works";
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
        <div className="mt-8">
          <RecentWorks />
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
        <div className="mt-8">
          <RecentWorks />
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
