// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: false,
  // Allow setting a base path at build time for hosting on GitHub Pages under a
  // project repo (e.g. BASE_PATH=/karina-isted/). Defaults to "/" for the
  // Lovable dev preview and custom-domain deploys.
  vite: {
    base: process.env.BASE_PATH || "/",
  },
  tanstackStart: {
    // SSR entry compiled at dist/server/server.js for the preview/prerender server.
    server: { entry: "server" },
    // Prerender every known route to its own index.html for static hosting.
    // SPA shell mode is intentionally disabled — it made "/" emit an empty
    // _shell.html instead of a content-rendered index.html, which tanked LCP
    // and CLS on the home page.
    pages: [
      { path: "/", prerender: { enabled: true } },
      { path: "/om-mig", prerender: { enabled: true } },
      { path: "/min-tilgang", prerender: { enabled: true } },
      { path: "/problemstillinger", prerender: { enabled: true } },
      { path: "/priser-og-vilkaar", prerender: { enabled: true } },
      { path: "/kontakt", prerender: { enabled: true } },
    ],
  },
});
