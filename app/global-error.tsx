"use client";

// app/global-error.tsx
// Catches errors that happen inside the root layout itself.
// Must include <html> and <body> tags since the layout may have failed.

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global app error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#faf7f2",
          fontFamily: "Arial, Helvetica, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 400, padding: "0 16px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: "#2a2a1e",
              marginBottom: 12,
            }}
          >
            Kavin Organics
          </h1>
          <p style={{ color: "#7a7a68", marginBottom: 24, lineHeight: 1.6 }}>
            A critical error occurred. Please refresh the page or call us at{" "}
            <a
              href="tel:+919876543210"
              style={{ color: "#3d6b35", fontWeight: 700 }}
            >
              +91 98765 43210
            </a>
            .
          </p>
          {error.digest && (
            <p
              style={{
                fontSize: 11,
                color: "#a8a090",
                fontFamily: "monospace",
                marginBottom: 20,
              }}
            >
              Error: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              background: "#3d6b35",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "14px 32px",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            🔄 Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}