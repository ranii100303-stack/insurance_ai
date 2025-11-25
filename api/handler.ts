import fs from "fs";
import path from "path";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Dynamically import express and routes at runtime
const express = await import("express").then((m) => m.default);
const { registerRoutes } = await import("../server/routes");
const runApp = await import("../server/app").then((m) => m.default);

const app = express();

// Flag to ensure we only initialize once
let initialized = false;
let initPromise: Promise<void> | null = null;

async function initializeApp() {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
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

    initialized = true;
  })();

  return initPromise;
}

export default async (req: VercelRequest, res: VercelResponse) => {
  await initializeApp();
  app(req, res);
};
