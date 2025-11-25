import fs from "node:fs";
import path from "node:path";
import { type Server } from "node:http";

import express, { type Express } from "express";
import runApp from "./app";

export async function serveStatic(app: Express, _server: Server) {
  // Look for public folder in multiple possible locations
  const possiblePaths = [
    path.join(process.cwd(), "public"),
    path.join(process.cwd(), "dist", "public"),
    "/var/task/public", // Vercel serverless
  ];

  let distPath: string | null = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      distPath = p;
      console.log(`Found public folder at: ${p}`);
      break;
    }
  }

  if (!distPath) {
    console.warn(
      `Warning: Could not find public directory. Tried: ${possiblePaths.join(", ")}`
    );
  } else {
    app.use(express.static(distPath));

    // fall through to index.html if the file doesn't exist
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(distPath!, "index.html"));
    });
  }
}

(async () => {
  await runApp(serveStatic);
})();
