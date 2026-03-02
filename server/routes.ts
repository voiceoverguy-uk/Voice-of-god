import type { Express } from "express";
import { createServer, type Server } from "http";
import { contactFormSchema } from "@shared/schema";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const result = contactFormSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: "Invalid form data",
          details: result.error.flatten().fieldErrors,
        });
      }

      const submission = await storage.createContactSubmission(result.data);
      console.log("New contact submission:", JSON.stringify(submission, null, 2));

      res.json({ success: true, id: submission.id });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to process your message" });
    }
  });

  return httpServer;
}