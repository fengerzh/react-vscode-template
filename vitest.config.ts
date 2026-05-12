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
    // React 19 scheduler 在 jsdom 环境回收后会产生 "window is not defined" 的
    // unhandled error，这是 React 内部的异步清理行为，不影响测试结果。
    // 将这类特定错误降级为警告而非测试失败。
    onUnhandledError: (err) => {
      if (
        err instanceof ReferenceError
        && err.message === "window is not defined"
      ) {
        console.warn("[vitest] Suppressed unhandled error: window is not defined (React 19 scheduler cleanup)");
        return;
      }
      throw err;
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
