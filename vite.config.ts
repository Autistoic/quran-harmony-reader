import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const repoName = process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/`
    : "/";
  const base = process.env.VITE_BASE_PATH || (process.env.GITHUB_PAGES ? repoName : "/");

  return {
    base,
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: false,
        },
        workbox: {
          navigateFallbackDenylist: [/^\/~oauth/],
        },
        manifest: {
          name: "Quran Reader - Recitación del Corán",
          short_name: "Quran Reader",
          description: "Lee y escucha suras del Corán con sincronización de audio y práctica espaciada",
          start_url: base,
          display: "standalone",
          background_color: "#0a0a0a",
          theme_color: "#1a3c2a",
          icons: [
            {
              src: `${base}icon-192.svg`,
              sizes: "192x192",
              type: "image/svg+xml",
            },
            {
              src: `${base}icon-512.svg`,
              sizes: "512x512",
              type: "image/svg+xml",
            },
          ],
        },
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
