import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      injectRegister: false,
      manifest: false,
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,json,woff2}"],
        globIgnores: ["icons/icon-source.png"],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
  base: "/",
});
