import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { z } from "zod";

// Inlined schema — no cross-package import needed
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  eventType: z.string().optional(),
  message: z.string().min(1, "Message is required").refine(
    (val) => val.trim().split(/\s+/).filter(Boolean).length >= 10,
    { message: "Please write at least 10 words so we can understand your enquiry" }
  ),
});

// Inlined email builder — no cross-package import needed
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Europe/London",
    });
  } catch {
    return iso;
  }
}

function buildEnquiryEmail(data: {
  name: string; email: string; phone?: string;
  eventType?: string; message: string; timestamp: string; ip: string;
}): string {
  const { name, email, phone, eventType, message, timestamp, ip } = data;
  const safeMsg = esc(message).replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Voice of God Enquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;background:#ffffff;border-radius:10px;border:1px solid #e0e0e0;overflow:hidden;">
      <tr>
        <td style="background-color:#9C060B;padding:36px 40px 32px;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:bold;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.7);">VoiceoverGuy Website Enquiry</p>
          <h1 style="margin:0 0 10px;font-size:26px;font-weight:bold;color:#ffffff;line-height:1.2;">&#127897; New Voice of God Enquiry</h1>
          <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.8);line-height:1.5;">A new contact form submission has arrived from your website.</p>
        </td>
      </tr>
      <tr><td style="height:4px;background:linear-gradient(to right,#9C060B,#c0392b,#9C060B);font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr>
        <td style="padding:36px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;border:1px solid #eeeeee;border-radius:6px;overflow:hidden;">
            <tr><td style="padding:14px 18px;background:#fafafa;border-bottom:1px solid #eeeeee;"><p style="margin:0;font-size:10px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;color:#9C060B;">Name</p></td></tr>
            <tr><td style="padding:14px 18px;"><p style="margin:0;font-size:16px;color:#1a1a1a;font-weight:600;">${esc(name)}</p></td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;border:1px solid #eeeeee;border-radius:6px;overflow:hidden;">
            <tr><td style="padding:14px 18px;background:#fafafa;border-bottom:1px solid #eeeeee;"><p style="margin:0;font-size:10px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;color:#9C060B;">Email Address</p></td></tr>
            <tr><td style="padding:14px 18px;"><a href="mailto:${esc(email)}" style="font-size:16px;color:#9C060B;text-decoration:underline;font-weight:600;">${esc(email)}</a></td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;border:1px solid #eeeeee;border-radius:6px;overflow:hidden;">
            <tr><td style="padding:14px 18px;background:#fafafa;border-bottom:1px solid #eeeeee;"><p style="margin:0;font-size:10px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;color:#9C060B;">Phone</p></td></tr>
            <tr><td style="padding:14px 18px;">${phone ? `<a href="tel:${esc(phone)}" style="font-size:16px;color:#1a1a1a;font-weight:600;">${esc(phone)}</a>` : `<p style="margin:0;font-size:15px;color:#aaaaaa;font-style:italic;">Not provided</p>`}</td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;border:1px solid #eeeeee;border-radius:6px;overflow:hidden;">
            <tr><td style="padding:14px 18px;background:#fafafa;border-bottom:1px solid #eeeeee;"><p style="margin:0;font-size:10px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;color:#9C060B;">Event Type</p></td></tr>
            <tr><td style="padding:14px 18px;">${eventType ? `<p style="margin:0;font-size:16px;color:#1a1a1a;font-weight:600;">${esc(eventType)}</p>` : `<p style="margin:0;font-size:15px;color:#aaaaaa;font-style:italic;">Not specified</p>`}</td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
            <tr><td style="padding:0 0 10px;"><p style="margin:0;font-size:10px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;color:#9C060B;">Message</p></td></tr>
            <tr><td style="border-left:4px solid #9C060B;background:#f8f8f8;padding:20px 22px;border-radius:0 6px 6px 0;"><p style="margin:0;font-size:15px;color:#2a2a2a;line-height:1.7;">${safeMsg}</p></td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
            <tr><td align="center" style="padding-bottom:8px;"><a href="mailto:${esc(email)}" style="display:inline-block;padding:14px 32px;background:#9C060B;color:#ffffff;border:2px solid #9C060B;border-radius:6px;font-size:15px;font-weight:bold;text-decoration:none;">&#9993; Reply to Enquiry</a></td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="background:#f4f4f4;border-top:1px solid #e0e0e0;padding:20px 40px;">
          <p style="margin:0 0 4px;font-family:'Courier New',monospace;font-size:11px;color:#888888;"><strong style="color:#555555;">Submitted:</strong>&nbsp;${esc(formatTimestamp(timestamp))}</p>
          <p style="margin:0;font-family:'Courier New',monospace;font-size:11px;color:#888888;"><strong style="color:#555555;">IP Address:</strong>&nbsp;${esc(ip || "Unknown")}</p>
          <p style="margin:8px 0 0;font-family:'Courier New',monospace;font-size:11px;color:#bbbbbb;">Source: voiceofgod.co.uk contact form</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

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

    const { name, email, phone, eventType, message } = result.data;
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const xff = req.headers["x-forwarded-for"];
    const ip = (Array.isArray(xff) ? xff[0] : (xff || "")).toString().split(",")[0].trim() || "";

    console.log("New contact submission:", JSON.stringify({ id, name, email, eventType, timestamp }, null, 2));

    if (resend) {
      const toEmail = process.env.CONTACT_TO_EMAIL || "enquiries@voiceoverguy.co.uk";
      const fromEmail = process.env.CONTACT_FROM_EMAIL || "noreply@voiceoverguy.co.uk";
      try {
        await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          subject: `Voice of God enquiry${eventType ? `: ${eventType}` : ""}`,
          html: buildEnquiryEmail({ name, email, phone, eventType, message, timestamp, ip }),
          replyTo: email,
        });
      } catch (emailError) {
        console.warn("Resend email failed (submission logged):", emailError);
      }
    } else {
      console.warn("RESEND_API_KEY not set — email not sent.");
    }

    return res.status(200).json({ success: true, id });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({ error: "Failed to process your message. Please try again." });
  }
}
