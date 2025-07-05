import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  
  // Optimize for production builds
  buildDirectory: "build",
  
  // Prerender routes for better SEO and performance
  prerender: ["/"],
} satisfies Config;
