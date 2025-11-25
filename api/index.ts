import type { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import fs from "fs";
import express from "express";
import { registerRoutes } from "../../server/routes";

const app = express();
let initialized = false;

async function initApp() {
  if (initialized) return;
  initialized = true;

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Register API routes
  await registerRoutes(app);

  // Serve static files
  const publicPath = path.join(process.cwd(), ".vercel", "output", "static");
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(publicPath, "index.html"));
    });
  }
}

export default async (req: VercelRequest, res: VercelResponse) => {
  await initApp();
  app(req, res);
};
