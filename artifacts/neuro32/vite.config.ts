import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { copyFileSync } from "fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { sentryVitePlugin } from "@sentry/vite-plugin";

const isBuild = process.env.NODE_ENV === "production" || process.argv.includes("build");

const rawPort = process.env.PORT;
if (!isBuild && !rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}
const port = rawPort ? Number(rawPort) : 5173;
if (!isBuild && (Number.isNaN(port) || port <= 0)) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? "/";

// Plugin: after every production build, copy index.html → 404.html so that
// Yandex Object Storage (static site mode) serves the SPA shell on unknown paths.
const spa404Plugin = {
  name: "spa-404",
  closeBundle() {
    const outDir = path.resolve(import.meta.dirname, "dist/public");
    try {
      copyFileSync(`${outDir}/index.html`, `${outDir}/404.html`);
    } catch { /* ignore if outDir doesn't exist yet */ }
  },
};

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    spa404Plugin,
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
    // Sentry: upload source-maps so prod stack traces show real file:line.
    // `disable` skips the upload step in any environment without a token —
    // local builds, PR CI, e2e jobs all stay quiet. `sourcemap: 'hidden'`
    // (below) generates the .map files but keeps the //# sourceMappingURL
    // comment OUT of bundles, so end-users never see them in DevTools.
    // Combined with the .htaccess deny-rule + scripts/zip-for-regru.mjs
    // stripping .map from the deploy zip, the maps stay private to Sentry.
    sentryVitePlugin({
      org: "neuro-32",
      project: "neuro32-frontend",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      disable: !process.env.SENTRY_AUTH_TOKEN,
      release: {
        name: process.env.VITE_SENTRY_RELEASE,
        // Don't auto-create deploy events — keep release wiring lean.
        deploy: undefined,
      },
      sourcemaps: {
        // Wipe local .map files after upload as belt-and-suspenders against
        // the deploy script accidentally including them. The .htaccess deny
        // rule still catches the case where this step is skipped.
        filesToDeleteAfterUpload: ["**/*.js.map"],
      },
      telemetry: false,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // 'hidden' = generate .map files for Sentry upload but DO NOT add
    // //# sourceMappingURL comments to bundles. End-users hitting prod
    // never see source-maps; only Sentry has them after upload.
    sourcemap: "hidden",
    // 500 KB was triggering the "chunks larger than 500 kB" warning. Our
    // manualChunks below keeps the main bundle under that — raise the bar a
    // bit so admin-only chunks don't cause noise.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        // Split large third-party libraries into dedicated chunks so the main
        // bundle (index-*.js) stays small and cache-friendly. Users don't
        // re-download framer / radix / sentry on every deploy.
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("@sentry")) return "vendor-sentry";
          if (id.includes("framer-motion") || id.includes("motion-dom") || id.includes("motion-utils")) {
            return "vendor-motion";
          }
          if (id.includes("@radix-ui")) return "vendor-radix";
          if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts";
          if (id.includes("lucide-react") || id.includes("react-icons")) return "vendor-icons";
          if (id.includes("@tanstack")) return "vendor-query";
          return undefined;
        },
      },
    },
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
