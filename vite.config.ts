import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "lovelace-shutter-card.js",
    },
    outDir: "dist",
    sourcemap: true,
  },
});
