import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["drone.tattvatech.co.in"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: [
      "@react-three/fiber",
      "@react-three/drei",
      "framer-motion",
      "react-icons",
    ],
  },
};

export default nextConfig;
