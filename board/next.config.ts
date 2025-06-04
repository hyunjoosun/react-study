import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath: "/study/board",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
