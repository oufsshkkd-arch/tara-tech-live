import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Stamped once at build time — every deploy gets a unique value so mobile
// browsers can't serve a stale cached image for the new bundle.
const BUILD_TS = Date.now();

export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_TS__: JSON.stringify(BUILD_TS),
  },
  server: {
    host: true,
    port: 5173,
  },
});
