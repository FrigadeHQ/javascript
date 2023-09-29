import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@frigade/reactv2": path.resolve(
        __dirname,
        "../../packages/reactv2/src/index.ts"
      ),
    },
  },
});
