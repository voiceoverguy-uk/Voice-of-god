import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // Real files (including the homepage) were handled above. Do not turn
  // missing pages, assets, or API routes into successful homepage responses.
  app.use("/{*path}", (_req, res) => {
    res.status(404).type("text/plain").send("Not Found");
  });
}
