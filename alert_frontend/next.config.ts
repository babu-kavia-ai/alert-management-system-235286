import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Static export (no Node server at runtime).
   * This project uses the App Router under `src/app`.
   */
  output: "export",

  /**
   * Helps ensure routes are exported consistently as directories with `index.html`,
   * which is the most reliable shape for static hosts and avoids certain export-time
   * route resolution edge cases.
   */
  trailingSlash: true,
};

export default nextConfig;
