if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

import { getResendClient } from "./resend";
import {
  ContactEmailPayload,
  renderOwnerNotificationHtml,
  renderOwnerNotificationText,
  renderVisitorAutoReplyHtml,
  renderVisitorAutoReplyText,
} from "./templates";

export interface SendContactNotificationOptions {
  submissionId: string;
  name: string;
  email: string;
  brief: string;
  submittedAt?: string;
  resendClient?: unknown; // Optional test injection
}

export interface SendContactNotificationResult {
  success: boolean;
  messageId?: string;
  autoReplyId?: string;
  error?: string;
}

/**
 * Dispatches owner notification email and optional visitor confirmation email.
 * 
 * SECURITY SPECIFICATIONS:
 * - Server-only execution.
 * - Idempotency guaranteed via deterministic Supabase submissionId.
 * - Reply-To strictly mapped to visitor's validated email.
 * - From address strictly bound to configured server environment variable.
 * - Safe operational logging: zero personal PII (email, name, body) logged.
 */
export async function sendContactNotification(
  options: SendContactNotificationOptions
): Promise<SendContactNotificationResult> {
  const { submissionId, name, email, brief } = options;
  const submittedAt = options.submittedAt || new Date().toUTCString();

  const toEmail = process.env.CONTACT_NOTIFICATION_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
  const autoReplyEnabled = process.env.CONTACT_AUTO_REPLY_ENABLED === "true";

  if (!toEmail || toEmail.trim().length === 0) {
    console.warn(
      `[EMAIL] CONTACT_NOTIFICATION_EMAIL is unconfigured. Notification email skipped for submission: ${submissionId}`
    );
    return {
      success: false,
      error: "MISSING_DESTINATION_EMAIL",
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let client: any = options.resendClient;
  if (!client) {
    try {
      client = getResendClient();
    } catch {
      console.warn(
        `[EMAIL] RESEND_API_KEY is unconfigured. Notification email skipped for submission: ${submissionId}`
      );
      return {
        success: false,
        error: "MISSING_RESEND_API_KEY",
      };
    }
  }

  const payload: ContactEmailPayload = {
    submissionId,
    name,
    email,
    brief,
    submittedAt,
  };

  const subject = `New ShivSastra Contact Request — ${name.trim()}`;
  const html = renderOwnerNotificationHtml(payload);
  const text = renderOwnerNotificationText(payload);

  let ownerMessageId: string | undefined;

  try {
    const sendResponse = await client.emails.send(
      {
        from: fromEmail,
        to: [toEmail.trim()],
        replyTo: email.trim(),
        subject,
        html,
        text,
      },
      {
        idempotencyKey: `contact-submission/${submissionId}`,
      }
    );

    if (sendResponse.error) {
      const errName = sendResponse.error.name || "PROVIDER_ERROR";
      console.error(
        `[EMAIL ERROR] Resend notification failed for submission ${submissionId}: ${errName}`
      );
      return {
        success: false,
        error: errName,
      };
    }

    ownerMessageId = sendResponse.data?.id;
    console.info(
      `[EMAIL] Owner notification dispatched successfully for submission: ${submissionId} (messageId: ${ownerMessageId || "ok"})`
    );
  } catch (err: unknown) {
    const errorCategory = err instanceof Error ? err.name : "NETWORK_EXCEPTION";
    console.error(
      `[EMAIL ERROR] Provider communication exception for submission ${submissionId}: ${errorCategory}`
    );
    return {
      success: false,
      error: errorCategory,
    };
  }

  // Optional Visitor Auto-Reply
  let autoReplyId: string | undefined;
  if (autoReplyEnabled) {
    try {
      const autoReplyHtml = renderVisitorAutoReplyHtml(payload);
      const autoReplyText = renderVisitorAutoReplyText(payload);

      const autoReplyRes = await client.emails.send(
        {
          from: fromEmail,
          to: [email.trim()],
          subject: "Thanks for contacting ShivSastra",
          html: autoReplyHtml,
          text: autoReplyText,
        },
        {
          idempotencyKey: `contact-submission-autoreply/${submissionId}`,
        }
      );

      if (autoReplyRes.error) {
        console.warn(
          `[EMAIL WARNING] Visitor auto-reply degraded for submission: ${submissionId}`
        );
      } else {
        autoReplyId = autoReplyRes.data?.id;
        console.info(
          `[EMAIL] Visitor auto-reply dispatched successfully for submission: ${submissionId}`
        );
      }
    } catch {
      // Auto-reply failure is non-fatal to primary notification
      console.warn(
        `[EMAIL WARNING] Visitor auto-reply network exception for submission: ${submissionId}`
      );
    }
  }

  return {
    success: true,
    messageId: ownerMessageId,
    autoReplyId,
  };
}
