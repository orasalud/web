import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS adds its own rounded corners, so the icon fills the whole square.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#32BDC7",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 48 48">
          <path
            d="M6 22 L24 8 L42 22 V39 a3 3 0 0 1 -3 3 H9 a3 3 0 0 1 -3 -3 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path d="M24 23 V35 M18 29 H30" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
