import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Index-Intelligence-Engine',
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
