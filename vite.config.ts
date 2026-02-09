import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const isGhPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  base: isGhPages ? "/legion-of-titans-3/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});

