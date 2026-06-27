import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

// Serwist は Turbopack と未対応のため、Webpack モードでのみ有効化
// https://github.com/serwist/serwist/issues/54
const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Turbopack を明示的に有効化（空オブジェクトで衝突警告を抑制）
  turbopack: {},
  images: {
    // 最新フォーマットで配信（AVIF 優先 → WebP フォールバック）
    formats: ["image/avif", "image/webp"],
    // 最適化済み画像のキャッシュ保持（外部画像の再取得を抑制）
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 日
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "media.api-sports.io" },
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default withSerwist(nextConfig);
