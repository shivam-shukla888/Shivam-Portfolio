import { NextRequest, NextResponse } from "next/server";
import {
  assistantRequestSchema,
  assistantResponseSchema,
  MAX_MESSAGE_LENGTH,
} from "@/lib/validations/assistant";
import {
  extractClientIp,
  hashClientIdentifier,
  checkAiRateLimit,
} from "@/lib/rate-limit";
import {
  generateChatCompletion,
  isGroqConfigured,
  ChatMessage,
} from "@/lib/ai/groq";
import {
  SHIVSASTRA_SYSTEM_INSTRUCTION,
  getPublicKnowledgeContext,
  validateAndSanitizeAssistantOutput,
} from "@/lib/ai/knowledge";
import { getPublishedDynamicRoutes } from "@/lib/ai/navigation";
import { classifySafetyIntent } from "@/lib/ai/safety";

// Maximum request body size limit (64 KB) to guard against resource exhaustion
const MAX_REQUEST_BODY_BYTES = 64 * 1024;

/**
 * Explicit GET rejection for crawler & public surface audit (Phase 23)
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    {
      status: 405,
      headers: {
        Allow: "POST",
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 1. Content-Length & Body Size Guard (Resource Exhaustion Defense)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_BODY_BYTES) {
      return NextResponse.json(
        { error: "Payload exceeds allowable size limit." },
        { status: 413 }
      );
    }

    // 2. Parse JSON safely
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    // 3. Strict Zod Input Validation & Normalization
    const parseResult = assistantRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const flattened = parseResult.error.flatten();
      const firstErrorMessage =
        flattened.fieldErrors.message?.[0] ||
        flattened.fieldErrors.conversation?.[0] ||
        flattened.formErrors?.[0] ||
        "Invalid request parameters.";

      return NextResponse.json(
        { error: firstErrorMessage },
        { status: 400 }
      );
    }

    const { message, conversation } = parseResult.data;

    // 4. Client IP Extraction and Distributed Rate Limiting (Phase 11)
    const rawIp = extractClientIp(req.headers);
    const hashedIp = hashClientIdentifier(rawIp);
    const rateLimit = await checkAiRateLimit(hashedIp);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error:
            "Transmission limit reached. Please wait a few moments before continuing your query.",
        },
        { status: 429 }
      );
    }

    // 4.5. Deterministic Master AI Safety Guard Classification
    const safetyCheck = classifySafetyIntent(message);
    if (!safetyCheck.isSafe && safetyCheck.response) {
      console.info(
        `[AI SAFETY GUARD INTERCEPT] Category: ${safetyCheck.category}, Reason: ${safetyCheck.reason}`
      );
      return NextResponse.json(
        { answer: safetyCheck.response },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "X-Content-Type-Options": "nosniff",
          },
        }
      );
    }

    // 5. Verify Groq Service Readiness (Phase 13)
    if (!isGroqConfigured()) {
      console.error("[AI SERVICE ERROR] GROQ_API_KEY is not configured.");
      return NextResponse.json(
        {
          error:
            "The ShivSastra AI Assistant is currently unavailable. Please check back shortly.",
        },
        { status: 503 }
      );
    }

    // 6. Assemble Public Knowledge Context with Structural Delimiters (Phase 6 & 7)
    const publicContext = await getPublicKnowledgeContext();
    const systemContent = `${SHIVSASTRA_SYSTEM_INSTRUCTION}\n\n${publicContext}`;

    // 7. Assemble Controlled Message Sequence (Phase 10)
    // Server policy is strictly the first and only system message.
    const messages: ChatMessage[] = [
      { role: "system", content: systemContent },
    ];

    // Append prior validated conversation turns
    if (conversation && conversation.length > 0) {
      for (const turn of conversation) {
        // Enforce role allowlist & length boundary
        messages.push({
          role: turn.role,
          content: turn.content.slice(0, MAX_MESSAGE_LENGTH),
        });
      }
    }

    // Append latest normalized user message wrapped in explicit delimiter
    messages.push({
      role: "user",
      content: `<visitor_query>\n${message}\n</visitor_query>`,
    });

    // 8. Generate Completion via Server-Only Groq Client with Graceful Fallback
    let rawAnswer: string;
    try {
      rawAnswer = await generateChatCompletion(messages);
    } catch (groqErr) {
      console.error(
        "[AI INFERENCE FALLBACK]",
        groqErr instanceof Error ? groqErr.message : "Inference provider error"
      );
      return NextResponse.json(
        {
          answer:
            "I can only assist with publicly published information on ShivSastra. Please explore our studio work at [Projects](/projects), services at [Services](/services), or reach out directly via [Contact](/contact).",
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "X-Content-Type-Options": "nosniff",
          },
        }
      );
    }

    // 9. Output Validation & Sanitization with Dynamic Route Allowlisting
    const dynamicRoutes = await getPublishedDynamicRoutes();
    const sanitizedAnswer = validateAndSanitizeAssistantOutput(rawAnswer, dynamicRoutes);

    // Validate outgoing shape with Zod
    const outputParse = assistantResponseSchema.safeParse({
      answer: sanitizedAnswer,
    });

    if (!outputParse.success) {
      return NextResponse.json(
        {
          answer:
            "I don't have that information published on ShivSastra yet. Please explore the projects at /projects or services at /services.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(outputParse.data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error(`[AI ENDPOINT EXCEPTION] ${errorMsg}`);

    // Controlled, safe client response (never expose stack traces, keys, or provider bodies)
    return NextResponse.json(
      {
        error:
          "The assistant encountered an unexpected error while processing your inquiry. Please try again.",
      },
      { status: 500 }
    );
  }
}
