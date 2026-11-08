import type { NextConfig } from "next";

// v3 (taste-skill build): the site is the static page public/index.html.
const nextConfig: NextConfig = {
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/index.html" }] };
  },
};

export default nextConfig;
