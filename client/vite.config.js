import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "index.html",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://mcd-viborg-om232.ondigitalocean.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    host: "localhost",
    port: 5176,
    hmr: {
      protocol: "ws",
      clientPort: 5176,
    },
    headers: {
      "Service-Worker-Allowed": "/",
      "Cache-Control": "no-store",
    },
  },
  publicDir: "public",
});
