import type { Express } from "express";
import { createServer, type Server } from "http";
import { Resend } from "resend";
import { contactFormSchema } from "@shared/schema";
import { buildEnquiryEmail } from "@shared/email-template";
import { storage } from "./storage";
import { getGoogleReviews } from "./google-reviews";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resend = resendApiKey ? new Resend(resendApiKey) : null;

  const OLD_WORDPRESS_PATHS = [
    "/guy-harris",
    "/guy-harris/",
    "/voice-of-god",
    "/voice-of-god/",
    "/about",
    "/about/",
    "/about-us",
    "/about-us/",
    "/contact",
    "/contact/",
    "/contact-us",
    "/contact-us/",
    "/services",
    "/services/",
    "/testimonials",
    "/testimonials/",
    "/portfolio",
    "/portfolio/",
    "/blog",
    "/blog/",
    "/demos",
    "/demos/",
    "/showreel",
    "/showreel/",
    "/voiceover",
    "/voiceover/",
    "/voice-over",
    "/voice-over/",
    "/voice-over-guy",
    "/voice-over-guy/",
    "/voiceover-production",
    "/voiceover-production/",
    "/wp-admin",
    "/wp-login.php",
    "/feed",
    "/feed/",
  ];

  app.get("/api/reviews", async (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    return res.json(await getGoogleReviews());
  });

  app.get("/", (req, res, next) => {
    if (req.query.page_id || req.query.p || req.query.cat) {
      return res.redirect(301, "/");
    }
    next();
  });

  OLD_WORDPRESS_PATHS.forEach((oldPath) => {
    app.get(oldPath, (_req, res) => {
      res.redirect(301, "/");
    });
  });

  app.get("/wp-content/{*path}", (_req, res) => {
    res.redirect(301, "/");
  });

  app.get("/wp-includes/{*path}", (_req, res) => {
    res.redirect(301, "/");
  });

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
        const toEmail = process.env.CONTACT_TO_EMAIL || "enquiries@voiceoverguy.co.uk";
        const fromEmail = process.env.CONTACT_FROM_EMAIL || "noreply@voiceoverguy.co.uk";
        const { name, email, phone, eventType, message } = result.data;
        const timestamp = new Date().toISOString();
        const forwardedFor = req.headers["x-forwarded-for"];
        const ip = (Array.isArray(forwardedFor) ? forwardedFor[0] : (forwardedFor?.split(",")[0]))?.trim() || req.ip;

        try {
          const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            subject: `Voice of God enquiry${eventType ? `: ${eventType}` : ""}`,
            html: buildEnquiryEmail({ name, email, phone, eventType, message, timestamp, ip: ip || "" }),
            replyTo: email,
          });
          // Acceptance by the provider is required; it does not prove inbox delivery.
          if (error || typeof data?.id !== "string" || !data.id.trim()) {
            console.warn("Resend did not confirm email acceptance.");
            return res.status(502).json({ error: "Unable to send your enquiry. Please try again." });
          }
        } catch (emailError) {
          console.warn("Resend email failed (submission retained in memory only):", emailError);
          return res.status(502).json({ error: "Unable to send your enquiry. Please try again." });
        }
      } else {
        console.warn("RESEND_API_KEY not set — email not sent, submission retained in memory only.");
        return res.status(503).json({ error: "Email sending is currently unavailable. Please try again later." });
      }

      res.json({ success: true, id: submission.id });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to process your message" });
    }
  });

  return httpServer;
}