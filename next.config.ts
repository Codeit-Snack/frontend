import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { hostname: "placehold.co", pathname: "/**" },
      { hostname: "picsum.photos", pathname: "/**" },
    ],
  },
};

export default nextConfig;
