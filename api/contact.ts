import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  eventType: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = contactFormSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Invalid form data",
        details: result.error.flatten().fieldErrors,
      });
    }

    const submission = {
      ...result.data,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
    };

    console.log("New contact submission:", JSON.stringify(submission, null, 2));

    if (resend) {
      const { name, email, phone, eventType, message } = result.data;
      const toEmail = process.env.CONTACT_TO_EMAIL || "enquiries@voiceoverguy.co.uk";
      const fromEmail = process.env.CONTACT_FROM_EMAIL || "noreply@voiceoverguy.co.uk";
      const timestamp = new Date().toISOString();
      const xff = req.headers["x-forwarded-for"];
      const ip = (Array.isArray(xff) ? xff[0] : (xff || "")).toString().split(",")[0].trim() || req.socket?.remoteAddress || "";

      try {
        await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          subject: `Voice of God enquiry${eventType ? `: ${eventType}` : ""}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Event Type:</strong> ${eventType || "Not specified"}</p>
            <p><strong>Message:</strong><br/>${message}</p>
            <hr />
            <p><small><strong>Submitted:</strong> ${timestamp}</small></p>
            <p><small><strong>IP:</strong> ${ip || "Unknown"}</small></p>
          `,
          replyTo: email,
        });
      } catch (emailError) {
        console.warn("Resend email failed (submission saved):", emailError);
      }
    } else {
      console.warn("RESEND_API_KEY not set — email not sent.");
    }

    return res.status(200).json({ success: true, id: submission.id });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({ error: "Failed to process your message" });
  }
}
