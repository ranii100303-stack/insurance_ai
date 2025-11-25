import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClaimSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Claim endpoints
  app.get("/api/claims", async (_req, res) => {
    try {
      const claims = await storage.getAllClaims();
      console.log(`Retrieved ${claims.length} claims from storage`);
      res.json(claims);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch claims" });
    }
  });

  app.post("/api/claims", async (req, res) => {
    try {
      console.log("Creating claim with data:", req.body);
      const parsed = insertClaimSchema.parse(req.body);
      const claim = await storage.createClaim(parsed);
      console.log("Claim created successfully:", claim);
      res.status(201).json(claim);
    } catch (error) {
      console.error("Error creating claim:", error);
      res.status(400).json({ error: "Invalid claim data" });
    }
  });

  app.delete("/api/claims/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteClaim(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Claim not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete claim" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
