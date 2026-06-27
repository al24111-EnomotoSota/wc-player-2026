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
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default withSerwist(nextConfig);
