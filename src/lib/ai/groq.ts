if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

import Groq from "groq-sdk";

export const DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b";
export const DEFAULT_GROQ_TIMEOUT_MS = 15000;
export const MAX_OUTPUT_TOKENS = 1024;
export const AI_TEMPERATURE = 0.2; // Low temperature for factual precision & reduced hallucination

let singletonGroqClient: Groq | null = null;

/**
 * Checks whether GROQ_API_KEY is configured in the environment.
 */
export function isGroqConfigured(): boolean {
  const key = process.env.GROQ_API_KEY;
  return Boolean(key && key.trim().length > 0);
}

/**
 * Resolves the currently configured Groq model.
 * Fails clearly if configured model is empty or invalid.
 */
export function getGroqModel(): string {
  const modelEnv = process.env.GROQ_MODEL;
  if (modelEnv !== undefined && modelEnv.trim().length === 0) {
    throw new Error("Configured GROQ_MODEL is empty. Provide a valid production model name.");
  }
  return modelEnv?.trim() || DEFAULT_GROQ_MODEL;
}

/**
 * Returns a server-only singleton instance of the Groq client.
 * Strictly throws if GROQ_API_KEY is not configured.
 */
export function getGroqClient(): Groq {
  if (!isGroqConfigured()) {
    throw new Error("GROQ_API_KEY environment variable is not configured or is empty.");
  }

  if (!singletonGroqClient) {
    singletonGroqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY!.trim(),
      timeout: DEFAULT_GROQ_TIMEOUT_MS,
    });
  }

  return singletonGroqClient;
}

/**
 * Resets the Groq client singleton for test isolation.
 */
export function resetGroqClient(): void {
  singletonGroqClient = null;
}

/**
 * Injects a custom or mock Groq client for automated testing.
 */
export function setCustomGroqClient(client: Groq | null): void {
  singletonGroqClient = client;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GenerateChatOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
  customClient?: Groq;
}

/**
 * Executes a controlled server-side chat completion via Groq.
 * 
 * Resource and Security Controls:
 * - Server-only execution.
 * - Output token limit strictly bounded by MAX_OUTPUT_TOKENS (1024).
 * - Fixed timeout with abort guard.
 * - No tool use, no function calling.
 * - No credentials or secret strings in error exceptions.
 */
export async function generateChatCompletion(
  messages: ChatMessage[],
  options?: GenerateChatOptions
): Promise<string> {
  const client = options?.customClient ?? getGroqClient();
  const model = options?.model ?? getGroqModel();
  const maxTokens = Math.min(options?.maxTokens ?? MAX_OUTPUT_TOKENS, MAX_OUTPUT_TOKENS);
  const temperature = options?.temperature ?? AI_TEMPERATURE;
  const timeoutMs = options?.timeoutMs ?? DEFAULT_GROQ_TIMEOUT_MS;

  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await client.chat.completions.create(
      {
        model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: maxTokens,
        temperature,
        stream: false,
      },
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timer);

    const answer = response.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || answer.trim().length === 0) {
      throw new Error("Empty response received from Groq AI provider.");
    }

    return answer.trim();
  } catch (err: unknown) {
    clearTimeout(timer);

    if (err instanceof Error) {
      if (err.name === "AbortError" || err.message.toLowerCase().includes("timeout") || err.message.toLowerCase().includes("aborted")) {
        throw new Error("Request to AI inference provider timed out.");
      }
      // Re-throw with sanitized operational message, avoiding internal SDK secret leaks
      throw new Error(`AI inference failed: ${err.message}`);
    }

    throw new Error("An unexpected error occurred during AI inference.");
  }
}
