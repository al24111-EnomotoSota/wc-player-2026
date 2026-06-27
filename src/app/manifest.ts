import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "2026 W杯 選手図鑑",
    short_name: "W杯図鑑",
    description:
      "2026 FIFA ワールドカップ出場選手の情報を調べられる日本語図鑑サイト",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    background_color: "#08080A",
    theme_color: "#D4AF37",
    orientation: "portrait",
    lang: "ja",
    dir: "ltr",
    categories: ["sports", "news", "reference"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
