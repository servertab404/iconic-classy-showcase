// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Public (safe-to-ship) backend address + publishable key, baked into the build so
// external hosts like Vercel need no environment variables.
const BACKEND_URL = "https://gyhwxpoptcvqdfxxvxhn.supabase.co";
const BACKEND_KEY = "sb_publishable_oLZ-u9Gn5gdIp1PaY250fQ_d7jjOoQn";
process.env["VITE_SUPABASE_URL"] ||= BACKEND_URL;
process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||= BACKEND_KEY;
process.env["VITE_SUPABASE_PROJECT_ID"] ||= "gyhwxpoptcvqdfxxvxhn";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  vite: {
    define: {
      "process.env.SUPABASE_URL": JSON.stringify(BACKEND_URL),
      "process.env.SUPABASE_PUBLISHABLE_KEY": JSON.stringify(BACKEND_KEY),
      "process.env['SUPABASE_URL']": JSON.stringify(BACKEND_URL),
      "process.env['SUPABASE_PUBLISHABLE_KEY']": JSON.stringify(BACKEND_KEY),
      'process.env["SUPABASE_URL"]': JSON.stringify(BACKEND_URL),
      'process.env["SUPABASE_PUBLISHABLE_KEY"]': JSON.stringify(BACKEND_KEY),
    },
  },
  // When building on Vercel, output Vercel's format (Lovable builds ignore this).
  ...(process.env["VERCEL"] ? { nitro: { preset: "vercel" } } : {}),
});
