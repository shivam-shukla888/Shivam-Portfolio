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
          backgroundColor: "#000000",
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
            border: "1px solid #1F1F1F",
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
                width: "10px",
                height: "10px",
                backgroundColor: "#2C3480",
              }}
            />
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#FFFFFF",
                letterSpacing: "0.14em",
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
              color: "#888888",
              letterSpacing: "0.08em",
            }}
          >
            DIGITAL HEADQUARTERS
          </span>
        </div>

        {/* Central Core Identity */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 400,
              color: "#FFFFFF",
              margin: 0,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            SHIVAM SHUKLA
          </h1>
          <p
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#8E9BFF",
              margin: 0,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            AI Agents · AI Security · Digital Products
          </p>
          <p
            style={{
              fontSize: 18,
              color: "#888888",
              margin: 0,
              maxWidth: "780px",
              lineHeight: 1.5,
            }}
          >
            Personal digital headquarters, system architecture monographs, and independent engineering studio releases.
          </p>
        </div>

        {/* Bottom Colophon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #1F1F1F",
            paddingTop: "24px",
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontFamily: "monospace",
              color: "#888888",
              letterSpacing: "0.04em",
            }}
          >
            https://shivsastra.vercel.app
          </span>
          <span
            style={{
              fontSize: 14,
              color: "#FFFFFF",
              fontWeight: 500,
            }}
          >
            Studio &amp; Architectural Releases →
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
