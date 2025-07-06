import type { Config } from "@react-router/dev/config";

export default {
  // Enable SPA mode for better Vercel compatibility
  ssr: false,

  // Build directory
  buildDirectory: "build",

  // No prerendering needed for SPA mode
  // prerender: ["/"],
} satisfies Config;
