import type { NextConfig } from "next";
import { getServerEnv } from "./lib/env";

// Fail fast with a clear message if the environment is misconfigured.
getServerEnv();

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
