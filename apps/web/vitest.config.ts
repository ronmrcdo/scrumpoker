import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.tsx"],
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["lib/**/*.ts", "components/**/*.tsx"],
      exclude: ["**/node_modules/**", "**/test/**"],
      thresholds: {
        statements: 70,
        branches: 65,
        functions: 70,
        lines: 70,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
      "@repo/ui": resolve(__dirname, "../../packages/ui/src"),
    },
  },
});
