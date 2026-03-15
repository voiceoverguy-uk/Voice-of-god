interface EnquiryEmailData {
  name: string;
  email: string;
  phone?: string;
  eventType?: string;
  message: string;
  timestamp: string;
  ip: string;
}

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

export function buildEnquiryEmail(data: EnquiryEmailData): string {
  const { name, email, phone, eventType, message, timestamp, ip } = data;

  const safeMsg = esc(message).replace(/\n/g, "<br>");

  const callButton = phone
    ? `<a href="tel:${esc(phone)}"
         style="display:inline-block;padding:14px 28px;background:#ffffff;color:#9C060B;border:2px solid #9C060B;border-radius:6px;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;text-decoration:none;margin:8px 0;">
         📞 Call Sender
       </a>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Voice of God Enquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;padding:32px 16px;">
  <tr>
    <td align="center">

      <!-- Main card -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;background:#ffffff;border-radius:10px;border:1px solid #e0e0e0;overflow:hidden;">

        <!-- RED HEADER -->
        <tr>
          <td style="background-color:#9C060B;padding:36px 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.7);">VoiceoverGuy Website Enquiry</p>
                  <h1 style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:26px;font-weight:bold;color:#ffffff;line-height:1.2;">🎙 New Voice of God Enquiry</h1>
                  <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.8);line-height:1.5;">A new contact form submission has arrived from your website.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DIVIDER LINE -->
        <tr>
          <td style="height:4px;background:linear-gradient(to right,#9C060B,#c0392b,#9C060B);font-size:0;line-height:0;">&nbsp;</td>
        </tr>

        <!-- CONTENT AREA -->
        <tr>
          <td style="padding:36px 40px;">

            <!-- Name row -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;border:1px solid #eeeeee;border-radius:6px;overflow:hidden;">
              <tr>
                <td style="padding:14px 18px;background:#fafafa;border-bottom:1px solid #eeeeee;">
                  <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;color:#9C060B;">Name</p>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 18px;">
                  <p style="margin:0;font-family:Arial,sans-serif;font-size:16px;color:#1a1a1a;font-weight:600;">${esc(name)}</p>
                </td>
              </tr>
            </table>

            <!-- Email row -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;border:1px solid #eeeeee;border-radius:6px;overflow:hidden;">
              <tr>
                <td style="padding:14px 18px;background:#fafafa;border-bottom:1px solid #eeeeee;">
                  <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;color:#9C060B;">Email Address</p>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 18px;">
                  <a href="mailto:${esc(email)}" style="font-family:Arial,sans-serif;font-size:16px;color:#9C060B;text-decoration:underline;font-weight:600;">${esc(email)}</a>
                </td>
              </tr>
            </table>

            <!-- Phone row -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;border:1px solid #eeeeee;border-radius:6px;overflow:hidden;">
              <tr>
                <td style="padding:14px 18px;background:#fafafa;border-bottom:1px solid #eeeeee;">
                  <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;color:#9C060B;">Phone</p>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 18px;">
                  ${phone
                    ? `<a href="tel:${esc(phone)}" style="font-family:Arial,sans-serif;font-size:16px;color:#1a1a1a;text-decoration:none;font-weight:600;">${esc(phone)}</a>`
                    : `<p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:#aaaaaa;font-style:italic;">Not provided</p>`
                  }
                </td>
              </tr>
            </table>

            <!-- Event Type row -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;border:1px solid #eeeeee;border-radius:6px;overflow:hidden;">
              <tr>
                <td style="padding:14px 18px;background:#fafafa;border-bottom:1px solid #eeeeee;">
                  <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;color:#9C060B;">Event Type</p>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 18px;">
                  ${eventType
                    ? `<p style="margin:0;font-family:Arial,sans-serif;font-size:16px;color:#1a1a1a;font-weight:600;">${esc(eventType)}</p>`
                    : `<p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:#aaaaaa;font-style:italic;">Not specified</p>`
                  }
                </td>
              </tr>
            </table>

            <!-- MESSAGE PANEL -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
              <tr>
                <td style="padding:0 0 10px;">
                  <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;color:#9C060B;">Message</p>
                </td>
              </tr>
              <tr>
                <td style="border-left:4px solid #9C060B;background:#f8f8f8;padding:20px 22px;border-radius:0 6px 6px 0;">
                  <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:#2a2a2a;line-height:1.7;">${safeMsg}</p>
                </td>
              </tr>
            </table>

            <!-- CTA BUTTONS -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
              <tr>
                <td align="center" style="padding-bottom:8px;">
                  <a href="mailto:${esc(email)}"
                     style="display:inline-block;padding:14px 32px;background:#9C060B;color:#ffffff;border:2px solid #9C060B;border-radius:6px;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;text-decoration:none;margin:8px 0;">
                    ✉️ Reply to Enquiry
                  </a>
                </td>
              </tr>
              ${callButton ? `<tr><td align="center">${callButton}</td></tr>` : ""}
            </table>

          </td>
        </tr>

        <!-- FOOTER META -->
        <tr>
          <td style="background:#f4f4f4;border-top:1px solid #e0e0e0;padding:20px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <p style="margin:0 0 4px;font-family:'Courier New',Courier,monospace;font-size:11px;color:#888888;">
                    <strong style="color:#555555;">Submitted:</strong>&nbsp;${esc(formatTimestamp(timestamp))}
                  </p>
                  <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:11px;color:#888888;">
                    <strong style="color:#555555;">IP Address:</strong>&nbsp;${esc(ip || "Unknown")}
                  </p>
                  <p style="margin:8px 0 0;font-family:'Courier New',Courier,monospace;font-size:11px;color:#bbbbbb;">
                    Source: voiceofgod.co.uk contact form
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
      <!-- /Main card -->

    </td>
  </tr>
</table>

</body>
</html>`;
}
