import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkSchema, insertContributorSchema, insertBusinessLicenseSchema, insertUsageReportSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats endpoint
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      // For now, using a mock user ID - in production this would come from auth
      const userId = "mock-user-id";
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Works endpoints
  app.get("/api/works", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const works = await storage.getWorks(userId);
      res.json(works);
    } catch (error) {
      console.error("Error fetching works:", error);
      res.status(500).json({ message: "Failed to fetch works" });
    }
  });

  app.get("/api/works/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const works = await storage.getRecentWorks(limit);
      res.json(works);
    } catch (error) {
      console.error("Error fetching recent works:", error);
      res.status(500).json({ message: "Failed to fetch recent works" });
    }
  });

  app.get("/api/works/:id", async (req, res) => {
    try {
      const work = await storage.getWork(req.params.id);
      if (!work) {
        return res.status(404).json({ message: "Work not found" });
      }
      res.json(work);
    } catch (error) {
      console.error("Error fetching work:", error);
      res.status(500).json({ message: "Failed to fetch work" });
    }
  });

  const createWorkSchema = insertWorkSchema.extend({
    contributors: z.array(insertContributorSchema.omit({ workId: true })),
  });

  app.post("/api/works", async (req, res) => {
    try {
      const validatedData = createWorkSchema.parse(req.body);
      const { contributors, ...workData } = validatedData;
      
      // Create the work
      const work = await storage.createWork(workData);
      
      // Create contributors
      for (const contributor of contributors) {
        await storage.createContributor({
          ...contributor,
          workId: work.id,
        });
      }
      
      res.status(201).json(work);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating work:", error);
      res.status(500).json({ message: "Failed to create work" });
    }
  });

  app.patch("/api/works/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      await storage.updateWorkStatus(req.params.id, status);
      res.json({ message: "Work status updated successfully" });
    } catch (error) {
      console.error("Error updating work status:", error);
      res.status(500).json({ message: "Failed to update work status" });
    }
  });

  // Contributors endpoints
  app.get("/api/works/:workId/contributors", async (req, res) => {
    try {
      const contributors = await storage.getContributors(req.params.workId);
      res.json(contributors);
    } catch (error) {
      console.error("Error fetching contributors:", error);
      res.status(500).json({ message: "Failed to fetch contributors" });
    }
  });

  app.post("/api/contributors", async (req, res) => {
    try {
      const validatedData = insertContributorSchema.parse(req.body);
      const contributor = await storage.createContributor(validatedData);
      res.status(201).json(contributor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating contributor:", error);
      res.status(500).json({ message: "Failed to create contributor" });
    }
  });

  app.delete("/api/contributors/:id", async (req, res) => {
    try {
      await storage.deleteContributor(req.params.id);
      res.json({ message: "Contributor deleted successfully" });
    } catch (error) {
      console.error("Error deleting contributor:", error);
      res.status(500).json({ message: "Failed to delete contributor" });
    }
  });

  // Business licenses endpoints
  app.get("/api/business-licenses", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const licenses = await storage.getBusinessLicenses(userId);
      res.json(licenses);
    } catch (error) {
      console.error("Error fetching business licenses:", error);
      res.status(500).json({ message: "Failed to fetch business licenses" });
    }
  });

  app.get("/api/business-licenses/:id", async (req, res) => {
    try {
      const license = await storage.getBusinessLicense(req.params.id);
      if (!license) {
        return res.status(404).json({ message: "License not found" });
      }
      res.json(license);
    } catch (error) {
      console.error("Error fetching business license:", error);
      res.status(500).json({ message: "Failed to fetch business license" });
    }
  });

  app.post("/api/business-licenses", async (req, res) => {
    try {
      const validatedData = insertBusinessLicenseSchema.parse(req.body);
      const license = await storage.createBusinessLicense(validatedData);
      res.status(201).json(license);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating business license:", error);
      res.status(500).json({ message: "Failed to create business license" });
    }
  });

  app.patch("/api/business-licenses/:id/status", async (req, res) => {
    try {
      const { status, approvedBy } = req.body;
      if (!["pending", "active", "expired", "revoked"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      await storage.updateLicenseStatus(req.params.id, status, approvedBy);
      res.json({ message: "License status updated successfully" });
    } catch (error) {
      console.error("Error updating license status:", error);
      res.status(500).json({ message: "Failed to update license status" });
    }
  });

  // Fee calculation endpoint
  app.get("/api/business-licenses/fee/:businessType", async (req, res) => {
    try {
      const { businessType } = req.params;
      
      const feeMap: Record<string, number> = {
        bar: 1200,
        restaurant: 800,
        venue: 2500,
        radio: 5000,
        tv: 10000,
        gym: 600,
        mall: 3000,
      };
      
      const fee = feeMap[businessType] || 0;
      res.json({ fee });
    } catch (error) {
      console.error("Error calculating fee:", error);
      res.status(500).json({ message: "Failed to calculate fee" });
    }
  });

  // Usage reports endpoints
  app.get("/api/usage-reports", async (req, res) => {
    try {
      const licenseId = req.query.licenseId as string;
      const reports = await storage.getUsageReports(licenseId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching usage reports:", error);
      res.status(500).json({ message: "Failed to fetch usage reports" });
    }
  });

  app.post("/api/usage-reports", async (req, res) => {
    try {
      const validatedData = insertUsageReportSchema.parse(req.body);
      const report = await storage.createUsageReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating usage report:", error);
      res.status(500).json({ message: "Failed to create usage report" });
    }
  });

  // Royalties endpoints
  app.get("/api/royalties", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const distributions = await storage.getRoyaltyDistributions(userId);
      res.json(distributions);
    } catch (error) {
      console.error("Error fetching royalty distributions:", error);
      res.status(500).json({ message: "Failed to fetch royalty distributions" });
    }
  });

  // User search endpoint
  app.get("/api/users/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.json([]);
      }
      
      const users = await storage.searchUsers(query);
      res.json(users);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ message: "Failed to search users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
