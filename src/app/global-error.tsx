"use client";

export default function GlobalError({ retry, reset }: { error: Error & { digest?: string }; retry?: () => void; reset?: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0, background: "#fbf9f4", color: "#1f2d26" }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>WedPlan is having a moment</h1>
          <p style={{ color: "#5d6b63" }}>Something went wrong. Please try again.</p>
          <button onClick={() => (retry ?? reset)?.()} style={{ marginTop: 16, padding: "10px 18px", borderRadius: 10, border: 0, background: "#3f5f4f", color: "white", cursor: "pointer" }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
