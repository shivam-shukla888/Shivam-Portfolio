if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

import { Resend } from "resend";

let resendInstance: Resend | null = null;

/**
 * Returns an authenticated Resend client instance.
 * Fails closed if RESEND_API_KEY is missing or empty.
 */
export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  if (!resendInstance) {
    resendInstance = new Resend(apiKey.trim());
  }

  return resendInstance;
}

/**
 * Lazy proxy export for convenient resend.emails.send() usage
 * while preventing build-time failure when RESEND_API_KEY is absent.
 */
export const resend = {
  get emails() {
    return getResendClient().emails;
  },
};

/**
 * Test isolation helper to reset the cached client instance.
 */
export function resetResendClient(): void {
  resendInstance = null;
}
