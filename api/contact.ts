import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  eventType: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

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

    return res.status(200).json({ success: true, id: submission.id });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({ error: "Failed to process your message" });
  }
}
