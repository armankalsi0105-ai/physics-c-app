import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home directory makes Next infer the wrong
  // workspace root. Pin it to this project so file watching stays scoped here.
  turbopack: {
    root: path.dirname(new URL(import.meta.url).pathname),
  },
};

export default nextConfig;
