if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

export interface ContactEmailPayload {
  name: string;
  email: string;
  brief: string;
  submissionId: string;
  submittedAt: string;
}

/**
 * Escapes user-controlled text to prevent HTML injection.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Formats a plain string into safely escaped multiline HTML.
 */
function formatMultilineText(text: string): string {
  return escapeHtml(text).replace(/\r\n|\r|\n/g, "<br />");
}

/**
 * Renders the HTML notification email for the site owner.
 * Adheres strictly to ShivSastra editorial identity (warm ivory, black ink, terracotta accent).
 */
export function renderOwnerNotificationHtml(payload: ContactEmailPayload): string {
  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeBrief = formatMultilineText(payload.brief);
  const safeSubmissionId = escapeHtml(payload.submissionId);
  const safeDate = escapeHtml(payload.submittedAt);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New ShivSastra Contact Request</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111112; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9F6; width: 100%; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E6E3DC; text-align: left;">
          
          <!-- Editorial Header -->
          <tr>
            <td style="padding: 32px 36px 20px 36px; border-bottom: 2px solid #D45A2A;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-family: 'JetBrains Mono', Monaco, 'Courier New', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #D45A2A; font-weight: 600;">
                      SHIVSASTRA // DISPATCH ARCHIVE
                    </span>
                    <h1 style="margin: 10px 0 4px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 400; color: #111112; line-height: 1.3;">
                      New Contact Request
                    </h1>
                    <p style="margin: 0; font-size: 13px; color: #6E6D68;">
                      Inquiry received via production contact interface
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dispatch Meta Information -->
          <tr>
            <td style="padding: 24px 36px; background-color: #F4F2EC; border-bottom: 1px solid #E6E3DC;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; line-height: 1.6;">
                <tr>
                  <td width="120" style="color: #6E6D68; font-family: 'JetBrains Mono', Monaco, monospace; font-size: 11px; text-transform: uppercase; vertical-align: top; padding: 4px 0;">
                    Sender:
                  </td>
                  <td style="color: #111112; font-weight: 600; padding: 4px 0;">
                    ${safeName}
                  </td>
                </tr>
                <tr>
                  <td width="120" style="color: #6E6D68; font-family: 'JetBrains Mono', Monaco, monospace; font-size: 11px; text-transform: uppercase; vertical-align: top; padding: 4px 0;">
                    Email:
                  </td>
                  <td style="color: #111112; padding: 4px 0;">
                    <a href="mailto:${safeEmail}" style="color: #D45A2A; text-decoration: none;">${safeEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td width="120" style="color: #6E6D68; font-family: 'JetBrains Mono', Monaco, monospace; font-size: 11px; text-transform: uppercase; vertical-align: top; padding: 4px 0;">
                    Submitted:
                  </td>
                  <td style="color: #111112; padding: 4px 0;">
                    ${safeDate}
                  </td>
                </tr>
                <tr>
                  <td width="120" style="color: #6E6D68; font-family: 'JetBrains Mono', Monaco, monospace; font-size: 11px; text-transform: uppercase; vertical-align: top; padding: 4px 0;">
                    Reference:
                  </td>
                  <td style="color: #6E6D68; font-family: 'JetBrains Mono', Monaco, monospace; font-size: 11px; padding: 4px 0;">
                    ${safeSubmissionId}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Inquiry Body -->
          <tr>
            <td style="padding: 32px 36px;">
              <div style="font-family: 'JetBrains Mono', Monaco, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6E6D68; margin-bottom: 12px;">
                Project Brief &amp; Intent:
              </div>
              <div style="font-size: 14px; line-height: 1.7; color: #111112; background-color: #FAF9F6; border: 1px solid #E6E3DC; padding: 20px; white-space: normal;">
                ${safeBrief}
              </div>

              <!-- Quick Reply Instruction -->
              <div style="margin-top: 32px; padding: 18px 20px; border-left: 3px solid #D45A2A; background-color: #F4F2EC;">
                <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #111112;">
                  Direct Reply Configured:
                </p>
                <p style="margin: 0; font-size: 12px; color: #6E6D68; line-height: 1.5;">
                  The <code style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #111112;">Reply-To</code> header is set to <strong style="color: #111112;">${safeEmail}</strong>. You can reply directly to this email in your email client to reach the visitor.
                </p>
              </div>
            </td>
          </tr>

          <!-- Editorial Footer -->
          <tr>
            <td style="padding: 20px 36px 28px 36px; border-top: 1px solid #E6E3DC; background-color: #FAF9F6; text-align: center;">
              <p style="margin: 0; font-family: 'JetBrains Mono', Monaco, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #9E9D98;">
                SHIVSASTRA — SHIVAM SHUKLA STUDIO &bull; AUTOMATED CONTACT ENGINE
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Plain-text fallback for owner notification.
 */
export function renderOwnerNotificationText(payload: ContactEmailPayload): string {
  return `SHIVSASTRA // NEW CONTACT REQUEST
========================================

Sender:    ${payload.name}
Email:     ${payload.email}
Submitted: ${payload.submittedAt}
Reference: ${payload.submissionId}

PROJECT BRIEF & INTENT:
----------------------------------------
${payload.brief}

----------------------------------------
REPLY INSTRUCTION:
Reply directly to this email to contact ${payload.name} at ${payload.email}.
Reply-To has been configured with the sender's address.

ShivSastra Studio — Automated Contact Pipeline
`;
}

/**
 * Renders the HTML confirmation auto-reply for the visitor.
 */
export function renderVisitorAutoReplyHtml(payload: ContactEmailPayload): string {
  const safeName = escapeHtml(payload.name);
  const safeBrief = formatMultilineText(payload.brief);
  const safeDate = escapeHtml(payload.submittedAt);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thanks for contacting ShivSastra</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111112; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9F6; width: 100%; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E6E3DC; text-align: left;">
          
          <tr>
            <td style="padding: 32px 36px 20px 36px; border-bottom: 2px solid #D45A2A;">
              <span style="font-family: 'JetBrains Mono', Monaco, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #D45A2A; font-weight: 600;">
                SHIVSASTRA
              </span>
              <h1 style="margin: 10px 0 4px 0; font-family: Georgia, serif; font-size: 24px; font-weight: 400; color: #111112; line-height: 1.3;">
                Inquiry Received
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 36px; font-size: 14px; line-height: 1.7; color: #111112;">
              <p style="margin: 0 0 16px 0;">
                Dear ${safeName},
              </p>
              <p style="margin: 0 0 16px 0;">
                Thank you for contacting ShivSastra. Your inquiry has been successfully received and logged into our direct editorial pipeline.
              </p>
              <p style="margin: 0 0 24px 0;">
                If your project aligns with current focus and studio availability, Shivam will be in touch directly.
              </p>

              <div style="font-family: 'JetBrains Mono', Monaco, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6E6D68; margin-bottom: 8px;">
                Summary of your transmission (${safeDate}):
              </div>
              <div style="background-color: #FAF9F6; border: 1px solid #E6E3DC; padding: 16px; font-size: 13px; line-height: 1.6; color: #444446;">
                ${safeBrief}
              </div>

              <p style="margin: 24px 0 0 0; color: #6E6D68; font-size: 13px;">
                Warm regards,<br />
                <strong style="color: #111112;">Shivam Shukla</strong><br />
                ShivSastra Studio
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 36px; border-top: 1px solid #E6E3DC; background-color: #FAF9F6; text-align: center;">
              <p style="margin: 0; font-family: 'JetBrains Mono', Monaco, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #9E9D98;">
                https://shivsastra.vercel.app
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Plain-text fallback for visitor auto-reply.
 */
export function renderVisitorAutoReplyText(payload: ContactEmailPayload): string {
  return `SHIVSASTRA // INQUIRY RECEIVED
========================================

Dear ${payload.name},

Thank you for contacting ShivSastra. Your inquiry has been received and logged into our direct editorial pipeline.

If your project aligns with current focus and studio availability, Shivam will be in touch directly.

Summary of your transmission:
----------------------------------------
${payload.brief}

Warm regards,
Shivam Shukla
ShivSastra Studio
https://shivsastra.vercel.app
`;
}

export interface PurchaseDeliveryPayload {
  customerEmail: string;
  orderId: string;
  productTitle: string;
  productType: string;
  amountFormatted: string;
  paidAt: string;
  downloadUrl?: string | null;
  supportEmail?: string;
}

/**
 * Editorial HTML email for verified customer purchase and digital delivery.
 * Adheres strictly to ShivSastra editorial design system.
 */
export function renderPurchaseDeliveryHtml(payload: PurchaseDeliveryPayload): string {
  const safeTitle = escapeHtml(payload.productTitle);
  const safeOrderId = escapeHtml(payload.orderId);
  const safeType = escapeHtml(payload.productType.replace(/_/g, " ").toUpperCase());
  const safeAmount = escapeHtml(payload.amountFormatted);
  const safeDate = escapeHtml(payload.paidAt);
  const supportEmail = escapeHtml(payload.supportEmail || "contact@shivsastra.com");

  const downloadBlock = payload.downloadUrl
    ? `
      <div style="margin: 28px 0; text-align: center;">
        <a href="${escapeHtml(payload.downloadUrl)}" style="display: inline-block; background-color: #D45A2A; color: #FFFFFF; font-family: 'JetBrains Mono', Monaco, monospace; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; padding: 14px 28px; border-radius: 0;">
          Access Digital Assets ↓
        </a>
        <p style="margin: 10px 0 0 0; font-size: 11px; font-family: 'JetBrains Mono', Monaco, monospace; color: #6E6D68;">
          Temporary delivery access link. Download your files and archive locally.
        </p>
      </div>`
    : `
      <div style="background-color: #FAF9F6; border: 1px solid #E6E3DC; padding: 16px; margin: 24px 0; font-size: 13px; line-height: 1.6; color: #444446;">
        Your acquisition order is confirmed. Studio dispatch notes or direct access keys will be transmitted to this email address.
      </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ShivSastra purchase is ready — ${safeTitle}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111112; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9F6; width: 100%; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E6E3DC; text-align: left;">
          
          <!-- Editorial Header -->
          <tr>
            <td style="padding: 32px 36px 20px 36px; border-bottom: 2px solid #D45A2A;">
              <span style="font-family: 'JetBrains Mono', Monaco, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #D45A2A; font-weight: 600;">
                SHIVSASTRA // VERIFIED DISPATCH
              </span>
              <h1 style="margin: 10px 0 4px 0; font-family: Georgia, serif; font-size: 24px; font-weight: 400; color: #111112; line-height: 1.3;">
                Acquisition Confirmed
              </h1>
              <p style="margin: 0; font-size: 13px; color: #6E6D68;">
                Order reference: ${safeOrderId}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 36px; font-size: 14px; line-height: 1.7; color: #111112;">
              <p style="margin: 0 0 16px 0;">
                Thank you for your acquisition. Your order has been verified and processed by the ShivSastra Studio dispatch system.
              </p>

              <!-- Order Summary Block -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 20px 0; background-color: #FAF9F6; border: 1px solid #E6E3DC;">
                <tr>
                  <td style="padding: 16px; border-bottom: 1px solid #E6E3DC;">
                    <span style="font-family: 'JetBrains Mono', Monaco, monospace; font-size: 11px; text-transform: uppercase; color: #6E6D68; letter-spacing: 0.08em; display: block;">Edition Title</span>
                    <strong style="font-size: 15px; color: #111112;">${safeTitle}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #E6E3DC;">
                    <span style="font-family: 'JetBrains Mono', Monaco, monospace; font-size: 11px; text-transform: uppercase; color: #6E6D68; letter-spacing: 0.08em; display: block;">Product Format</span>
                    <span style="font-family: 'JetBrains Mono', Monaco, monospace; font-size: 12px; color: #111112;">${safeType}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #E6E3DC;">
                    <span style="font-family: 'JetBrains Mono', Monaco, monospace; font-size: 11px; text-transform: uppercase; color: #6E6D68; letter-spacing: 0.08em; display: block;">Settled Amount</span>
                    <strong style="font-family: 'JetBrains Mono', Monaco, monospace; font-size: 14px; color: #D45A2A;">${safeAmount}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px;">
                    <span style="font-family: 'JetBrains Mono', Monaco, monospace; font-size: 11px; text-transform: uppercase; color: #6E6D68; letter-spacing: 0.08em; display: block;">Timestamp</span>
                    <span style="font-family: 'JetBrains Mono', Monaco, monospace; font-size: 11px; color: #6E6D68;">${safeDate}</span>
                  </td>
                </tr>
              </table>

              ${downloadBlock}

              <p style="margin: 24px 0 8px 0; font-size: 13px; color: #444446;">
                If you have questions, inquiries regarding commercial rights, or need assistance, reach out directly to <a href="mailto:${supportEmail}" style="color: #D45A2A; text-decoration: underline;">${supportEmail}</a>.
              </p>

              <p style="margin: 20px 0 0 0; color: #6E6D68; font-size: 13px;">
                Warm regards,<br />
                <strong style="color: #111112;">Shivam Shukla</strong><br />
                ShivSastra Studio
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 36px; border-top: 1px solid #E6E3DC; background-color: #FAF9F6; text-align: center;">
              <p style="margin: 0; font-family: 'JetBrains Mono', Monaco, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #9E9D98;">
                ShivSastra // https://shivsastra.vercel.app
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Plain text fallback for purchase delivery email.
 */
export function renderPurchaseDeliveryText(payload: PurchaseDeliveryPayload): string {
  const downloadSection = payload.downloadUrl
    ? `DIGITAL ASSET ACCESS:
${payload.downloadUrl}
(Temporary delivery link. Please download and archive locally.)`
    : `Your order is confirmed. Studio dispatch notes or direct access keys will be transmitted to this email address.`;

  return `SHIVSASTRA // VERIFIED DISPATCH
========================================

Thank you for your acquisition.

Order Reference: ${payload.orderId}
Product: ${payload.productTitle}
Format: ${payload.productType}
Amount: ${payload.amountFormatted}
Date: ${payload.paidAt}

${downloadSection}

Support & Inquiries: ${payload.supportEmail || "contact@shivsastra.com"}

Warm regards,
Shivam Shukla
ShivSastra Studio
https://shivsastra.vercel.app
`;
}
