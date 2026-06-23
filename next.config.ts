import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export' removed — API routes compile as serverless functions on Vercel
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
