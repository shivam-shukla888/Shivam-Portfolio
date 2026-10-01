"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { SafeMarkdown } from "./SafeMarkdown";
import { ShivSastraMascot } from "./ShivSastraMascot";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "Explain Yojna Setu.",
  "What projects has Shivam built?",
  "Show me the security work.",
  "What technologies were used?",
  "What is available in the store?",
];

export function ShivSastraAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "error" | "rate_limited"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);

  // Auto-scroll to bottom of message list on updates
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, status, isOpen, scrollToBottom]);

  const wasOpenRef = useRef(false);

  // Focus management and Escape key handling
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else if (wasOpenRef.current) {
      // Return focus to trigger button when closed
      triggerButtonRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputValue).trim();
    if (!text || status === "sending") return;

    messageIdCounter.current += 1;
    const userMessage: Message = {
      id: `user-${messageIdCounter.current}`,
      role: "user",
      content: text,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setStatus("sending");
    setErrorMessage(null);

    // Prepare client-side conversation history (max 12 turns)
    const historyPayload = messages.slice(-12).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          conversation: historyPayload,
        }),
      });

      if (res.status === 429) {
        setStatus("rate_limited");
        setErrorMessage(
          "Transmission limit reached. Please wait a few moments before sending another message."
        );
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMessage(
          errorData.error ||
            "Unable to retrieve response from ShivSastra AI. Please try again."
        );
        return;
      }

      const data = await res.json();
      messageIdCounter.current += 1;
      const assistantMessage: Message = {
        id: `assistant-${messageIdCounter.current}`,
        role: "assistant",
        content: data.answer || "I don't have that information published on ShivSastra yet.",
      };

      setMessages([...newMessages, assistantMessage]);
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMessage(
        "Network connection interrupted. Please verify your connection and try again."
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setStatus("idle");
    setErrorMessage(null);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Global "Ask SHIVSASTRA" Companion Trigger */}
      {/* Desktop Mascot Trigger: Subtle bounded wander near bottom-right */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
        <button
          ref={triggerButtonRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="shivsastra-ai-dialog"
          aria-label={isOpen ? "Close SHIVSASTRA Assistant" : "Ask SHIVSASTRA"}
          className={cn(
            "group relative flex flex-col items-end gap-1.5 focus-visible:outline-none",
            "animate-mascot-wander cursor-pointer select-none"
          )}
        >
          {/* Subtle Speech Pill / Indicator */}
          <div
            className={cn(
              "px-3 py-1.5 bg-white border border-[#E5E5E5]",
              "group-hover:border-[#2C3480] shadow-sm",
              "flex items-center gap-1.5 transition-all duration-200",
              "text-[#000000] font-mono text-[10px] uppercase tracking-wider",
              isOpen && "border-[#2C3480] text-[#2C3480]"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 bg-[#2C3480] inline-block transition-transform duration-200",
                isOpen ? "rotate-45" : "rotate-0"
              )}
              aria-hidden="true"
            />
            <span>{isOpen ? "Close" : "Ask SHIVSASTRA"}</span>
          </div>

          {/* Original SHIVSASTRA mascot */}
          <div
            className={cn(
              "relative transition-transform duration-200 group-hover:scale-105 group-active:scale-95",
              isOpen && "opacity-90"
            )}
          >
            <ShivSastraMascot isOpen={isOpen} size="md" />
          </div>
        </button>
      </div>

      {/* Mobile Mascot Trigger: Compact, clean floating pill */}
      <div className="fixed bottom-4 right-4 z-40 sm:hidden">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="shivsastra-ai-dialog"
          aria-label={isOpen ? "Close SHIVSASTRA Assistant" : "Ask SHIVSASTRA"}
          className={cn(
            "h-10 px-3 flex items-center gap-2",
            "bg-white border border-[#E5E5E5]",
            "text-[#000000] font-mono text-[10px] tracking-wider uppercase",
            "active:scale-95 shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2C3480]",
            isOpen && "border-[#2C3480] text-[#2C3480]"
          )}
        >
          <ShivSastraMascot isOpen={isOpen} size="sm" />
          <span>{isOpen ? "Close" : "Ask SHIVSASTRA"}</span>
        </button>
      </div>

      {/* 3.2 Architectural Chat Panel */}
      {isOpen && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shivsastra-ai-title"
          id="shivsastra-ai-dialog"
          className={cn(
            "fixed z-50 flex flex-col",
            "bottom-20 right-5 sm:bottom-22 sm:right-8",
            "w-[calc(100vw-2.5rem)] sm:w-[440px] max-w-[480px]",
            "h-[560px] max-h-[calc(100vh-7rem)]",
            "bg-white border border-[#E5E5E5]",
            "shadow-2xl"
          )}
        >
          {/* Panel Header */}
          <header className="px-5 py-4 border-b border-[#E5E5E5] bg-white flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 bg-[#2C3480] inline-block"
                  aria-hidden="true"
                />
                <span className="font-mono text-[10px] text-[#2C3480] tracking-widest uppercase font-semibold">
                  AI Assistant
                </span>
              </div>
              <h2
                id="shivsastra-ai-title"
                className="font-display text-base text-[#000000] font-normal tracking-tight mt-0.5"
              >
                Portfolio Assistant
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearChat}
                  className="text-[10px] font-mono text-[#555555] hover:text-[#000000] px-2 py-1 border border-transparent hover:border-[#E5E5E5] transition-colors"
                  title="Clear conversation"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Assistant"
                className="w-8 h-8 flex items-center justify-center border border-[#E5E5E5] text-[#555555] hover:border-[#2C3480] hover:text-[#2C3480] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2C3480]"
              >
                <span className="text-sm leading-none font-mono">✕</span>
              </button>
            </div>
          </header>

          {/* Panel Messages Area */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-white">
            {/* 3.3 Initial Editorial State */}
            {messages.length === 0 && (
              <div className="py-4 space-y-4">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#555555]">
                    Ask a Question
                  </span>
                  <p className="font-display text-sm italic text-[#000000]">
                    Ask a question about my work, projects, or services.
                  </p>
                  <p className="text-xs text-[#555555] leading-relaxed pt-1">
                    Grounded in verified SHIVSASTRA portfolio content, with unknown information explicitly handled instead of invented.
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#555555] block font-semibold">
                    Suggested Questions
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleSendMessage(prompt)}
                        className="text-left px-3 py-2 text-xs font-sans bg-[#F8F9FA] hover:bg-[#F4F5FB] text-[#000000] border border-[#E5E5E5] hover:border-[#2C3480] transition-colors duration-150 flex items-center justify-between group"
                      >
                        <span>{prompt}</span>
                        <span className="text-[10px] font-mono text-[#2C3480] opacity-70 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Conversation Flow */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "space-y-1",
                  msg.role === "user" ? "ml-6" : "mr-2"
                )}
              >
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#555555] uppercase tracking-wider">
                  {msg.role === "user" ? (
                    <span className="ml-auto font-semibold text-[#2C3480]">Visitor</span>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 bg-[#2C3480] inline-block" />
                      <span>Assistant</span>
                    </>
                  )}
                </div>

                <div
                  className={cn(
                    "p-3.5 border",
                    msg.role === "user"
                      ? "bg-[#2C3480] border-[#2C3480] text-white"
                      : "bg-[#F8F9FA] border-[#E5E5E5] text-[#111111]"
                  )}
                >
                  {msg.role === "user" ? (
                    <p className="text-xs font-sans whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                  ) : (
                    <SafeMarkdown content={msg.content} />
                  )}
                </div>
              </div>
            ))}

            {/* 3.4 Sending State Indicator */}
            {status === "sending" && (
              <div className="space-y-1 mr-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#2C3480] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-[#2C3480] inline-block animate-pulse" />
                  <span>Thinking...</span>
                </div>
                <div className="p-3.5 bg-[#F8F9FA] border border-[#E5E5E5]">
                  <div className="flex items-center gap-1.5 py-1">
                    <span className="w-1.5 h-1.5 bg-[#2C3480]/60 animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#2C3480]/60 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-[#2C3480]/60 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {/* Error & Rate Limit Alerts */}
            {errorMessage && (
              <div
                role="alert"
                className="p-3 bg-[#F8F9FA] border border-[#2C3480] text-xs text-[#000000] space-y-1"
              >
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#2C3480] font-semibold">
                  {status === "rate_limited" ? "Rate Limited" : "Notice"}
                </div>
                <p>{errorMessage}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Panel Input Area */}
          <footer className="p-3 border-t border-[#E5E5E5] bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="space-y-2"
            >
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about my work..."
                  maxLength={2000}
                  rows={2}
                  disabled={status === "sending"}
                  aria-label="Your question for ShivSastra AI"
                  className={cn(
                    "w-full p-2.5 text-xs font-sans resize-none",
                    "bg-white border border-[#E5E5E5]",
                    "text-[#000000] placeholder:text-[#888888]",
                    "focus:border-[#2C3480] focus-visible:outline-none",
                    "disabled:opacity-50"
                  )}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#555555]">
                <span>Enter ↵ to send • Shift+Enter for newline</span>
                <button
                  type="submit"
                  disabled={!inputValue.trim() || status === "sending"}
                  className={cn(
                    "px-3.5 py-1.5 border font-mono text-[10px] uppercase tracking-wider",
                    "transition-colors duration-150",
                    inputValue.trim() && status !== "sending"
                      ? "bg-[#2C3480] text-white border-[#2C3480] hover:bg-[#000000] hover:border-[#000000] cursor-pointer"
                      : "border-[#E5E5E5] opacity-40 cursor-not-allowed"
                  )}
                >
                  {status === "sending" ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </footer>
        </div>
      )}
    </>
  );
}
