"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Global uncaught exception:", error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#FAF9F6",
          color: "#111112",
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "540px",
            padding: "40px 24px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#D45A2A",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontFamily: "monospace",
                color: "#D45A2A",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 600,
              }}
            >
              System Error
            </span>
          </div>

          <h1
            style={{
              fontSize: "36px",
              fontWeight: 400,
              margin: "0 0 16px 0",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Something went wrong.
          </h1>

          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#6E6D68",
              marginBottom: "28px",
            }}
          >
            An unrecoverable application error occurred. You can attempt to refresh the page or return to the main site.
          </p>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "10px 18px",
                backgroundColor: "#111112",
                color: "#FAF9F6",
                border: "none",
                fontSize: "12px",
                fontFamily: "monospace",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Try Again ↺
            </button>
            <Link
              href="/"
              style={{
                padding: "10px 18px",
                backgroundColor: "transparent",
                color: "#111112",
                border: "1px solid #E6E3DC",
                fontSize: "12px",
                fontFamily: "monospace",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Back Home →
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
