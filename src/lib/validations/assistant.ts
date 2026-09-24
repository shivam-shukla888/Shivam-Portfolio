import { z } from "zod";

export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_CONVERSATION_TURNS = 12;
export const MAX_TOTAL_CONVERSATION_CHARS = 10000;
export const MAX_ANSWER_LENGTH = 4000;

/**
 * Normalizes input text by removing zero-width characters, Trojan Source bidirectional
 * overrides, and non-printable control characters while preserving legitimate formatting.
 */
export function normalizeChatInput(input: string): string {
  if (typeof input !== "string") return "";

  return input
    // Remove zero-width & invisible formatting characters
    .replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u2028\u2029]/g, "")
    // Remove bidirectional text override markers (anti-spoofing)
    .replace(/[\u202A-\u202E\u2066-\u2069]/g, "")
    // Remove non-printable ASCII control characters except \n, \r, \t
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Normalize unicode to standard composed form (NFC)
    .normalize("NFC")
    .trim();
}

export const chatMessageRoleSchema = z.enum(["user", "assistant"], {
  message: "Only 'user' and 'assistant' roles are permitted in conversation history.",
});

export const conversationTurnSchema = z
  .object({
    role: chatMessageRoleSchema,
    content: z
      .string()
      .transform(normalizeChatInput)
      .pipe(
        z
          .string()
          .min(1, "Turn content cannot be empty.")
          .max(
            MAX_MESSAGE_LENGTH,
            `Turn content cannot exceed ${MAX_MESSAGE_LENGTH} characters.`
          )
      ),
  })
  .strict();

export const assistantRequestSchema = z
  .object({
    message: z
      .string()
      .transform(normalizeChatInput)
      .pipe(
        z
          .string()
          .min(1, "Message cannot be empty.")
          .max(
            MAX_MESSAGE_LENGTH,
            `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`
          )
      ),
    conversation: z
      .array(conversationTurnSchema)
      .max(
        MAX_CONVERSATION_TURNS,
        `Conversation history cannot exceed ${MAX_CONVERSATION_TURNS} turns.`
      )
      .optional()
      .default([]),
  })
  .strict()
  .refine(
    (data) => {
      const totalChars = data.conversation.reduce(
        (sum, turn) => sum + turn.content.length,
        0
      );
      return totalChars <= MAX_TOTAL_CONVERSATION_CHARS;
    },
    {
      message: `Cumulative conversation history exceeds ${MAX_TOTAL_CONVERSATION_CHARS} characters.`,
      path: ["conversation"],
    }
  );

export type AssistantRequestInput = z.infer<typeof assistantRequestSchema>;
export type ConversationTurn = z.infer<typeof conversationTurnSchema>;

export const assistantResponseSchema = z
  .object({
    answer: z
      .string()
      .trim()
      .min(1, "Answer cannot be empty.")
      .max(
        MAX_ANSWER_LENGTH,
        `Answer cannot exceed ${MAX_ANSWER_LENGTH} characters.`
      ),
  })
  .strict();

export type AssistantResponseOutput = z.infer<typeof assistantResponseSchema>;
