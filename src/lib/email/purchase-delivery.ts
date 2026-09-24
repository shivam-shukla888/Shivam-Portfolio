if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

import { resend } from "./resend";
import {
  renderPurchaseDeliveryHtml,
  renderPurchaseDeliveryText,
  PurchaseDeliveryPayload,
} from "./templates";

export interface SendDeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Transmits purchase confirmation and secure digital access email to customer via Resend.
 * Strictly non-blocking: never crashes the caller, returns controlled status.
 */
export async function sendPurchaseDeliveryEmail(
  payload: PurchaseDeliveryPayload
): Promise<SendDeliveryResult> {
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
  const formattedFrom = `ShivSastra Studio <${fromEmail}>`;
  const subject = `Your ShivSastra purchase is ready — ${payload.productTitle}`;

  try {
    const resendClient = resend;
    const { data, error } = await resendClient.emails.send({
      from: formattedFrom,
      to: [payload.customerEmail],
      subject,
      html: renderPurchaseDeliveryHtml(payload),
      text: renderPurchaseDeliveryText(payload),
    });

    if (error || !data) {
      console.error(
        "[PURCHASE DELIVERY EMAIL ERROR]",
        error ? `${error.name}: ${error.message}` : "No response data returned"
      );
      return {
        success: false,
        error: error ? error.message : "Email transmission failed",
      };
    }

    return {
      success: true,
      messageId: data.id,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal transmission failure";
    console.error("[PURCHASE DELIVERY EMAIL EXCEPTION]", message);
    return {
      success: false,
      error: message,
    };
  }
}
