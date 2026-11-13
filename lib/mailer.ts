import nodemailer from "nodemailer";

export interface ContactEmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface EmailDispatchResult {
  sent: boolean;
  status: "sent" | "not_configured" | "failed";
  messageId?: string;
  error?: string;
}

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  receiverEmail: string;
  rejectUnauthorized: boolean;
}

const DEFAULT_RECEIVER_EMAIL = "bagusadrianus@gmail.com";
const DEFAULT_SMTP_HOST = "smtp.gmail.com";

function stripHeaderCRLF(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getSmtpConfig(): SmtpConfig | null {
  const user = (process.env.SMTP_USER || process.env.GMAIL_USER)?.trim();
  const rawPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  if (!user || !rawPass) {
    return null;
  }

  const host = process.env.SMTP_HOST?.trim() || DEFAULT_SMTP_HOST;
  // Google displays 16-char App Passwords in 4-char space-separated groups; strip spaces for Gmail SMTP
  const pass = host.endsWith(".gmail.com") ? rawPass.replace(/\s+/g, "") : rawPass;
  const parsedPort = Number(process.env.SMTP_PORT || 465);
  const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 465;
  const secureEnv = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure = secureEnv ? secureEnv === "true" : port === 465;
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL?.trim() || DEFAULT_RECEIVER_EMAIL;
  const from = process.env.SMTP_FROM?.trim() || `Portfolio Contact <${user}>`;
  const rejectUnauthorized =
    process.env.SMTP_TLS_REJECT_UNAUTHORIZED?.trim().toLowerCase() !== "false";

  return {
    host,
    port,
    secure,
    user,
    pass,
    from,
    receiverEmail,
    rejectUnauthorized,
  };
}

export function isSmtpConfigured(): boolean {
  return getSmtpConfig() !== null;
}

function buildNotificationEmailHtml(
  payload: ContactEmailPayload,
  receivedAtWib: string
): string {
  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeSubject = escapeHtml(payload.subject);
  const safeMessage = escapeHtml(payload.message);

  return `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:24px;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <tr>
        <td style="background-color:#06090e;padding:24px 28px;border-bottom:3px solid #10b981;">
          <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#10b981;font-weight:700;margin-bottom:6px;">
            Portfolio Direct Message
          </div>
          <h1 style="margin:0;font-size:20px;line-height:1.3;color:#ffffff;font-weight:700;">
            ${safeSubject}
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 28px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
            <tr>
              <td style="padding:14px 16px;font-size:13px;line-height:1.6;">
                <div><strong style="color:#374151;">Full Name:</strong> ${safeName}</div>
                <div><strong style="color:#374151;">Work Email:</strong> <a href="mailto:${safeEmail}" style="color:#059669;text-decoration:none;">${safeEmail}</a></div>
                <div><strong style="color:#374151;">Inquiry Focus:</strong> ${safeSubject}</div>
                <div><strong style="color:#374151;">Received:</strong> ${escapeHtml(receivedAtWib)}</div>
              </td>
            </tr>
          </table>

          <div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#6b7280;font-weight:700;margin-bottom:8px;">
            Project Details &amp; Scope
          </div>
          <div style="padding:16px;background-color:#f9fafb;border-left:3px solid #10b981;border-radius:6px;font-size:14px;line-height:1.65;color:#1f2937;white-space:pre-wrap;">${safeMessage}</div>

          <p style="margin:20px 0 0;font-size:12px;color:#6b7280;">
            Reply directly to this email to respond to <strong>${safeName}</strong> (${safeEmail}).
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

function formatSafeSmtpError(error: unknown): string {
  if (!error || typeof error !== "object") return "Unknown SMTP error";
  const err = error as { code?: string; responseCode?: number; message?: string };
  if (err.responseCode === 535 || err.code === "EAUTH") {
    return "SMTP authentication failed (check SMTP_USER and SMTP_PASS)";
  }
  if (err.code) {
    return `SMTP error (${err.code})`;
  }
  return err.message ? err.message.slice(0, 140) : "Unknown SMTP error";
}

/**
 * Forward a submitted portfolio contact message to the owner's Gmail inbox via configured SMTP (defaults to Gmail SMTP).
 */
export async function sendContactNotificationEmail(
  payload: ContactEmailPayload
): Promise<EmailDispatchResult> {
  const config = getSmtpConfig();
  if (!config) {
    return {
      sent: false,
      status: "not_configured",
      error: "SMTP_USER or SMTP_PASS is not configured",
    };
  }

  const cleanName = stripHeaderCRLF(payload.name);
  const cleanEmail = stripHeaderCRLF(payload.email);
  const cleanSubject = stripHeaderCRLF(payload.subject || "Inquiry");
  const receivedAtWib = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date()) + " WIB";

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    tls: {
      rejectUnauthorized: config.rejectUnauthorized,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: config.from,
      to: config.receiverEmail,
      replyTo: { name: cleanName, address: cleanEmail },
      subject: `[Portfolio Inquiry] ${cleanSubject} — ${cleanName}`,
      text: [
        "New message received from Portfolio Contact Form",
        "=================================================",
        `Inquiry Focus : ${cleanSubject}`,
        `Full Name     : ${cleanName}`,
        `Work Email    : ${cleanEmail}`,
        `Received      : ${receivedAtWib}`,
        "",
        "Message:",
        payload.message,
      ].join("\n"),
      html: buildNotificationEmailHtml(
        {
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject,
          message: payload.message,
        },
        receivedAtWib
      ),
    });

    return {
      sent: true,
      status: "sent",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Failed to send contact email via SMTP:", error);
    return {
      sent: false,
      status: "failed",
      error: formatSafeSmtpError(error),
    };
  } finally {
    transporter.close();
  }
}
