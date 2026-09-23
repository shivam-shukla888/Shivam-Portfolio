"use server";

import { headers } from "next/headers";
import {
  contactInquirySchema,
  ContactActionState,
} from "@/lib/validations/contact";
import {
  hashClientIdentifier,
  checkRateLimit,
  extractClientIp,
} from "@/lib/rate-limit";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function submitContactInquiry(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      brief: formData.get("brief"),
      hp_website: formData.get("hp_website"),
    };

    // 1. Honeypot Verification: silent drop for spam bots
    if (typeof rawData.hp_website === "string" && rawData.hp_website.trim().length > 0) {
      console.warn("[SECURITY] Honeypot triggered; inquiry discarded silently.");
      return {
        status: "success",
        message: "Inquiry received. Thank you for your dispatch.",
      };
    }

    // 2. Anonymized Rate Limiting (SEC-01: Deployment-aware IP extraction)
    const headerList = await headers();
    const rawIp = extractClientIp(headerList);

    const hashedIp = hashClientIdentifier(rawIp);
    const rateLimit = await checkRateLimit(hashedIp);

    if (!rateLimit.success) {
      return {
        status: "rate_limited",
        message: "Transmission limit reached. Please allow a few minutes before submitting another inquiry.",
      };
    }

    // 3. Server-side Zod Validation
    const validationResult = contactInquirySchema.safeParse(rawData);

    if (!validationResult.success) {
      const flattened = validationResult.error.flatten();
      return {
        status: "validation_error",
        message: "Please correct the highlighted fields.",
        errors: {
          name: flattened.fieldErrors.name,
          email: flattened.fieldErrors.email,
          brief: flattened.fieldErrors.brief,
        },
      };
    }

    const { name, email, brief } = validationResult.data;

    // 4. Persistence via Supabase (with safe unconfigured fallback)
    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { error } = await supabase.from("contact_submissions").insert({
        name,
        email,
        brief,
        ip_hash: hashedIp,
      });

      if (error) {
        console.error(
          `[CONTACT ERROR] Database insertion failed: ${error.code || "UNKNOWN"}`
        );
        return {
          status: "server_error",
          message: "Unable to record inquiry due to a storage failure. Please try again shortly.",
        };
      }
    } else {
      // Safe offline/development fallback notice — zero personal PII logged
      console.info(
        "[CONTACT INFO] Supabase unconfigured. Validated submission accepted in development fallback mode."
      );
    }

    return {
      status: "success",
      message: "Inquiry received. Thank you for your dispatch.",
    };
  } catch (err) {
    // Unhandled error barrier — stack traces never exposed to client
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`[CONTACT UNHANDLED EXCEPTION] ${errorMessage}`);
    return {
      status: "server_error",
      message: "A server transmission error occurred. Please try again shortly.",
    };
  }
}
