export interface DashboardStats {
  totalWorks: number;
  totalRoyalties: string;
  activeLicenses: number;
  pendingApprovals: number;
}

export interface ActivityItem {
  id: string;
  description: string;
  timestamp: string;
  type: "success" | "info" | "warning" | "error";
}

export interface FeeCalculation {
  fee: number;
}

export interface WorkWithContributors {
  id: string;
  title: string;
  iswc?: string;
  isrc?: string;
  duration?: string;
  status: "pending" | "approved" | "rejected";
  contributors: Array<{
    id: string;
    role: "composer" | "author" | "vocalist";
    percentage: number;
    user: {
      id: string;
      firstName?: string;
      lastName?: string;
      email: string;
    };
  }>;
}
