import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    qualities: [75, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopifycdn.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
