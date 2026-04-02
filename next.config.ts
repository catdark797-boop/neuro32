import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  basePath: "/neuro32",
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
