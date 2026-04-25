import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@workspace/api-zod": path.resolve(__dirname, "../../lib/api-zod/src/index.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "test/**/*.test.ts"],
    globals: false,
    reporters: ["default"],
  },
});
