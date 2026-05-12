import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["cypress/**/*"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "clover"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.mock.ts",
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
        "src/**/*.spec.ts",
        "src/**/*.spec.tsx",
        "src/**/*.cy.tsx",
        "src/**/*.cy.ts",
        "src/types/**/*",
        "src/index.tsx",
        "src/layout/UserLayout.cy.tsx",
      ],
    },
    // 禁用并行测试，避免 scheduler 异步任务冲突
    pool: "forks",
    singleFork: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
