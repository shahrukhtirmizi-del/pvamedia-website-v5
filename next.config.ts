import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // there is a stray lockfile in the parent directory; pin the root so the
  // build never walks up out of the repository looking for one
  turbopack: { root: __dirname },
};

export default nextConfig;
