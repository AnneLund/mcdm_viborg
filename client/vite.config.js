import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "MediaCollege Denmark",
        short_name: "MCD",
        start_url: "/",
        display: "standalone",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "/icons/icon-512x512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
      },
    }),
  ],
  build: {
    outDir: "dist",
  },
  server: {
    proxy: {
      "/api": {
        target: "https://mcd-viborg-om232.ondigitalocean.app",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  define: {
    "process.env": import.meta.env,
  },
  rules: {
    "react/prop-types": "off",
    "no-unused-vars": "warn",
  },
});
