import {
  users,
  works,
  contributors,
  businessLicenses,
  usageReports,
  royaltyDistributions,
  sessions,
  type User,
  type InsertUser,
  type Work,
  type InsertWork,
  type Contributor,
  type InsertContributor,
  type BusinessLicense,
  type InsertBusinessLicense,
  type UsageReport,
  type InsertUsageReport,
  type RoyaltyDistribution,
  type InsertRoyaltyDistribution,
  type Session,
  type InsertSession,
  type SignupData,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sum } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  registerUser(userData: SignupData): Promise<User>;
  
  // Session operations
  createSession(session: InsertSession): Promise<Session>;
  getSessionByToken(token: string): Promise<Session | undefined>;
  deleteSession(token: string): Promise<void>;
  deleteUserSessions(userId: string): Promise<void>;
  
  // Work operations
  getWorks(userId?: string): Promise<Work[]>;
  getWork(id: string): Promise<Work | undefined>;
  createWork(work: InsertWork): Promise<Work>;
  updateWorkStatus(id: string, status: "pending" | "approved" | "rejected"): Promise<void>;
  getRecentWorks(limit?: number): Promise<(Work & { registeredByUser: User })[]>;
  
  // Contributor operations
  getContributors(workId: string): Promise<(Contributor & { user: User })[]>;
  createContributor(contributor: InsertContributor): Promise<Contributor>;
  deleteContributor(id: string): Promise<void>;
  
  // Business license operations
  getBusinessLicenses(userId?: string): Promise<BusinessLicense[]>;
  getBusinessLicense(id: string): Promise<BusinessLicense | undefined>;
  createBusinessLicense(license: InsertBusinessLicense): Promise<BusinessLicense>;
  updateLicenseStatus(id: string, status: "pending" | "active" | "expired" | "revoked", approvedBy?: string): Promise<void>;
  
  // Usage report operations
  getUsageReports(licenseId?: string): Promise<UsageReport[]>;
  createUsageReport(report: InsertUsageReport): Promise<UsageReport>;
  
  // Royalty operations
  getRoyaltyDistributions(userId?: string): Promise<RoyaltyDistribution[]>;
  createRoyaltyDistribution(distribution: InsertRoyaltyDistribution): Promise<RoyaltyDistribution>;
  
  // Dashboard statistics
  getDashboardStats(userId: string): Promise<{
    totalWorks: number;
    totalRoyalties: string;
    activeLicenses: number;
    pendingApprovals: number;
  }>;
  
  // Search users for work registration
  searchUsers(query: string): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async registerUser(userData: SignupData): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        email: userData.email,
        password: userData.password, // This will be hashed in the route handler
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      })
      .returning();
    return user;
  }

  // Session operations
  async createSession(session: InsertSession): Promise<Session> {
    const [newSession] = await db
      .insert(sessions)
      .values(session)
      .returning();
    return newSession;
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.token, token));
    return session;
  }

  async deleteSession(token: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.token, token));
  }

  async deleteUserSessions(userId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.userId, userId));
  }

  async getWorks(userId?: string): Promise<Work[]> {
    if (userId) {
      return await db.select().from(works).where(eq(works.registeredBy, userId)).orderBy(desc(works.createdAt));
    }
    return await db.select().from(works).orderBy(desc(works.createdAt));
  }

  async getWork(id: string): Promise<Work | undefined> {
    const [work] = await db.select().from(works).where(eq(works.id, id));
    return work;
  }

  async createWork(work: InsertWork): Promise<Work> {
    const [newWork] = await db
      .insert(works)
      .values(work)
      .returning();
    return newWork;
  }

  async updateWorkStatus(id: string, status: "pending" | "approved" | "rejected"): Promise<void> {
    await db.update(works).set({ status }).where(eq(works.id, id));
  }

  async getRecentWorks(limit = 10): Promise<(Work & { registeredByUser: User })[]> {
    const result = await db
      .select({
        id: works.id,
        title: works.title,
        iswc: works.iswc,
        isrc: works.isrc,
        duration: works.duration,
        status: works.status,
        registeredBy: works.registeredBy,
        createdAt: works.createdAt,
        updatedAt: works.updatedAt,
        registeredByUser: users,
      })
      .from(works)
      .innerJoin(users, eq(works.registeredBy, users.id))
      .orderBy(desc(works.createdAt))
      .limit(limit);
    
    return result;
  }

  async getContributors(workId: string): Promise<(Contributor & { user: User })[]> {
    const result = await db
      .select({
        id: contributors.id,
        workId: contributors.workId,
        userId: contributors.userId,
        role: contributors.role,
        percentage: contributors.percentage,
        createdAt: contributors.createdAt,
        user: users,
      })
      .from(contributors)
      .innerJoin(users, eq(contributors.userId, users.id))
      .where(eq(contributors.workId, workId));
    
    return result;
  }

  async createContributor(contributor: InsertContributor): Promise<Contributor> {
    const [newContributor] = await db
      .insert(contributors)
      .values(contributor)
      .returning();
    return newContributor;
  }

  async deleteContributor(id: string): Promise<void> {
    await db.delete(contributors).where(eq(contributors.id, id));
  }

  async getBusinessLicenses(userId?: string): Promise<BusinessLicense[]> {
    if (userId) {
      return await db.select().from(businessLicenses).where(eq(businessLicenses.appliedBy, userId)).orderBy(desc(businessLicenses.createdAt));
    }
    return await db.select().from(businessLicenses).orderBy(desc(businessLicenses.createdAt));
  }

  async getBusinessLicense(id: string): Promise<BusinessLicense | undefined> {
    const [license] = await db.select().from(businessLicenses).where(eq(businessLicenses.id, id));
    return license;
  }

  async createBusinessLicense(license: InsertBusinessLicense): Promise<BusinessLicense> {
    const [newLicense] = await db
      .insert(businessLicenses)
      .values(license)
      .returning();
    return newLicense;
  }

  async updateLicenseStatus(id: string, status: "pending" | "active" | "expired" | "revoked", approvedBy?: string): Promise<void> {
    const updateData: any = { status };
    if (approvedBy) {
      updateData.approvedBy = approvedBy;
    }
    if (status === "active") {
      updateData.validFrom = new Date();
      updateData.validTo = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
    }
    await db.update(businessLicenses).set(updateData).where(eq(businessLicenses.id, id));
  }

  async getUsageReports(licenseId?: string): Promise<UsageReport[]> {
    if (licenseId) {
      return await db.select().from(usageReports).where(eq(usageReports.licenseId, licenseId)).orderBy(desc(usageReports.createdAt));
    }
    return await db.select().from(usageReports).orderBy(desc(usageReports.createdAt));
  }

  async createUsageReport(report: InsertUsageReport): Promise<UsageReport> {
    const [newReport] = await db
      .insert(usageReports)
      .values(report)
      .returning();
    return newReport;
  }

  async getRoyaltyDistributions(userId?: string): Promise<RoyaltyDistribution[]> {
    if (userId) {
      const result = await db
        .select({
          id: royaltyDistributions.id,
          usageReportId: royaltyDistributions.usageReportId,
          contributorId: royaltyDistributions.contributorId,
          amount: royaltyDistributions.amount,
          paymentStatus: royaltyDistributions.paymentStatus,
          paidAt: royaltyDistributions.paidAt,
          createdAt: royaltyDistributions.createdAt,
        })
        .from(royaltyDistributions)
        .innerJoin(contributors, eq(royaltyDistributions.contributorId, contributors.id))
        .where(eq(contributors.userId, userId))
        .orderBy(desc(royaltyDistributions.createdAt));
      
      return result;
    }
    return await db.select().from(royaltyDistributions).orderBy(desc(royaltyDistributions.createdAt));
  }

  async createRoyaltyDistribution(distribution: InsertRoyaltyDistribution): Promise<RoyaltyDistribution> {
    const [newDistribution] = await db
      .insert(royaltyDistributions)
      .values(distribution)
      .returning();
    return newDistribution;
  }

  async getDashboardStats(userId: string): Promise<{
    totalWorks: number;
    totalRoyalties: string;
    activeLicenses: number;
    pendingApprovals: number;
  }> {
    // Get total works for user
    const [worksCount] = await db
      .select({ count: count() })
      .from(works)
      .where(eq(works.registeredBy, userId));

    // Get total royalties for user
    const [royaltiesSum] = await db
      .select({ total: sum(royaltyDistributions.amount) })
      .from(royaltyDistributions)
      .innerJoin(contributors, eq(royaltyDistributions.contributorId, contributors.id))
      .where(and(
        eq(contributors.userId, userId),
        eq(royaltyDistributions.paymentStatus, "paid")
      ));

    // Get active licenses count
    const [licensesCount] = await db
      .select({ count: count() })
      .from(businessLicenses)
      .where(eq(businessLicenses.status, "active"));

    // Get pending approvals count (for admin users)
    const [approvalsCount] = await db
      .select({ count: count() })
      .from(works)
      .where(eq(works.status, "pending"));

    return {
      totalWorks: worksCount.count,
      totalRoyalties: royaltiesSum.total ? `$${Number(royaltiesSum.total).toFixed(2)}` : "$0.00",
      activeLicenses: licensesCount.count,
      pendingApprovals: approvalsCount.count,
    };
  }

  async searchUsers(query: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(
        and(
          // Search by name or email, exclude business users
          eq(users.role, "composer") || eq(users.role, "author") || eq(users.role, "vocalist")
        )
      )
      .limit(10);
  }
}

export const storage = new DatabaseStorage();
