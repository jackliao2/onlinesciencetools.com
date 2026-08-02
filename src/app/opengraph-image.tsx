import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} — free chemistry & math calculators`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "linear-gradient(135deg, #071019 0%, #0d1824 45%, #134e4a 100%)",
          color: "#e8eef5",
          fontFamily: "Georgia, ui-serif, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            color: "#5eead4",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#0f766e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
            }}
          >
            ⌬
          </div>
          Free science calculators since 2012
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
            {SITE_NAME}
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#93a4b8",
              maxWidth: 900,
              lineHeight: 1.35,
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
            }}
          >
            Stoichiometry · Equilibrium · Phase Portraits · Graphing · GRE Guides
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#5eead4",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
          }}
        >
          <span>onlinesciencetools.com</span>
          <span>Free educational calculators</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
