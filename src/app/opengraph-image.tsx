import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Orasalud · Enfermera a domicilio en San Bernardo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "node_modules/@fontsource/figtree/files");
const [bold, semibold] = await Promise.all([
  readFile(join(fontDir, "figtree-latin-700-normal.woff")),
  readFile(join(fontDir, "figtree-latin-600-normal.woff")),
]);

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#E9F7F8",
          fontFamily: "Figtree",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="96" height="96" viewBox="0 0 48 48">
            <path
              d="M6 22 L24 8 L42 22 V39 a3 3 0 0 1 -3 3 H9 a3 3 0 0 1 -3 -3 Z"
              fill="none"
              stroke="#32BDC7"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path d="M24 23 V35 M18 29 H30" stroke="#32BDC7" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: 72, fontWeight: 700, color: "#1A8C95", letterSpacing: -1 }}>orasalud</div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.08,
            color: "#17323A",
            maxWidth: 980,
            letterSpacing: -1.5,
          }}
        >
          Enfermera a domicilio en San Bernardo
        </div>
        <div style={{ display: "flex", fontSize: 36, fontWeight: 600, color: "#127A82" }}>orasalud.com</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Figtree", data: bold, weight: 700, style: "normal" },
        { name: "Figtree", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
