import type { Express } from "express";
import { createServer, type Server } from "http";
import { Resend } from "resend";
import { contactFormSchema } from "@shared/schema";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resend = resendApiKey ? new Resend(resendApiKey) : null;

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

      if (resend) {
        const toEmail = process.env.CONTACT_TO_EMAIL || "guy@voiceoverguy.co.uk";
        const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
        const { name, email, phone, eventType, message } = result.data;

        await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          subject: `New VOG enquiry from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Event Type:</strong> ${eventType || "Not specified"}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
          replyTo: email,
        });
      } else {
        console.warn("RESEND_API_KEY not set — email not sent, submission saved to database only.");
      }

      res.json({ success: true, id: submission.id });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to process your message" });
    }
  });

  return httpServer;
}