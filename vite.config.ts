import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/lib/index.js"),
      name: "react-hyper-pagination",
      fileName: (format) => `react-hyper-pagination.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
  plugins: [
    react(),
    dts({ insertTypesEntry: true, exclude: ["**/__test__/**"] }),
  ],
  test: {
    environment: "jsdom",
  },
});
