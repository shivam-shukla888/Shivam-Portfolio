if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { checkReviewEligibility } from "@/lib/orders";

export interface SubmitReviewInput {
  productId: string;
  rating: number;
  reviewTitle?: string;
  reviewBody: string;
  reviewerName: string;
  customerEmail: string;
}

export interface SubmitReviewResult {
  success: boolean;
  isVerifiedPurchase: boolean;
  reviewId?: string;
  error?: string;
}

/**
 * Submits a customer review with strict verified-buyer verification.
 * Only purchasers with a confirmed PAID order for this product obtain 'is_verified_purchase = true'.
 * All incoming reviews default to 'is_published = false' until editorial moderation.
 */
export async function submitProductReview(
  input: SubmitReviewInput
): Promise<SubmitReviewResult> {
  const client = getSupabaseServerClient();
  if (!client) {
    return {
      success: false,
      isVerifiedPurchase: false,
      error: "Database service unavailable",
    };
  }

  // 1. Validate rating range
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    return {
      success: false,
      isVerifiedPurchase: false,
      error: "Rating must be an integer between 1 and 5",
    };
  }

  // 2. Validate content
  if (!input.reviewBody || input.reviewBody.trim().length < 10) {
    return {
      success: false,
      isVerifiedPurchase: false,
      error: "Review body must be at least 10 characters long",
    };
  }

  if (!input.reviewerName || input.reviewerName.trim().length === 0) {
    return {
      success: false,
      isVerifiedPurchase: false,
      error: "Reviewer name is required",
    };
  }

  // 3. Cryptographically / relationally verify purchaser eligibility
  const isVerified = await checkReviewEligibility(
    input.productId,
    input.customerEmail
  );

  // 4. Insert into product_reviews table using service role client
  const { data, error } = await client
    .from("product_reviews")
    .insert({
      product_id: input.productId,
      rating: input.rating,
      review_title: input.reviewTitle?.trim() || null,
      review_body: input.reviewBody.trim(),
      reviewer_name: input.reviewerName.trim(),
      is_verified_purchase: isVerified,
      is_published: false, // Never auto-publish unmoderated reviews
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[REVIEWS] Submission failed:", error?.message);
    return {
      success: false,
      isVerifiedPurchase: isVerified,
      error: "Failed to store review submission",
    };
  }

  return {
    success: true,
    isVerifiedPurchase: isVerified,
    reviewId: data.id,
  };
}
