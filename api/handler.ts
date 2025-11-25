import fs from "fs";
import path from "path";
import express from "express";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { registerRoutes } from "../../server/routes";
import runApp from "../../server/app";

const app = express();

// Flag to ensure we only initialize once
let initialized = false;

async function initializeApp() {
  if (initialized) return;
  initialized = true;

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Register API routes
  const server = await registerRoutes(app);

  // Serve static files from dist/public
  const publicPath = path.join(process.cwd(), "dist", "public");
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));

    // SPA fallback - serve index.html for all non-API routes
    app.get("*", (req, res) => {
      res.sendFile(path.join(publicPath, "index.html"));
    });
  }
}

export default async (req: VercelRequest, res: VercelResponse) => {
  await initializeApp();
  app(req, res);
};
