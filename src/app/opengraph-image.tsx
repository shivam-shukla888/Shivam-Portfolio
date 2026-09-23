import { ImageResponse } from "next/og";

export const alt = "Shivam Shukla — Backend Systems, Agentic AI & AI Security";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#111112",
          padding: "60px 70px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle Inset Border */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: "1px solid #262628",
            pointerEvents: "none",
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#D45A2A",
              }}
            />
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#FAF9F6",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              SHIVSASTRA
            </span>
          </div>

          <span
            style={{
              fontSize: 13,
              fontFamily: "monospace",
              color: "#8E8D88",
              letterSpacing: "0.08em",
            }}
          >
            STUDIO MONOGRAPH
          </span>
        </div>

        {/* Central Core Identity */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 400,
              color: "#FAF9F6",
              margin: 0,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            SHIVAM SHUKLA
          </h1>
          <p
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: "#D45A2A",
              margin: 0,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Backend Systems · Agentic AI · AI Security
          </p>
          <p
            style={{
              fontSize: 18,
              color: "#8E8D88",
              margin: 0,
              maxWidth: "780px",
              lineHeight: 1.5,
            }}
          >
            Personal digital headquarters, system architecture monographs, and independent digital studio releases.
          </p>
        </div>

        {/* Bottom Colophon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #262628",
            paddingTop: "24px",
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontFamily: "monospace",
              color: "#8E8D88",
              letterSpacing: "0.04em",
            }}
          >
            https://shivsastra.com
          </span>
          <span
            style={{
              fontSize: 14,
              color: "#FAF9F6",
              fontWeight: 500,
            }}
          >
            Studio & Architectural Releases →
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
