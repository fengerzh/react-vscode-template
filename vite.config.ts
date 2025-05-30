import path from "path";
import { defineConfig } from "vite";
import vitePluginImp from "vite-plugin-imp";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginImp({
      libList: [
        {
          libName: "antd",
          style: (name) => {
            if (name === "col" || name === "row") {
              return "antd/lib/style/index.js";
            }
            return `antd/es/${name}/style/index.js`;
          },
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // 排除 Ant Design 组件的 CSS 导入
        if (id.includes("antd/es") && id.endsWith(".css.js")) {
          return true;
        }
        return false;
      },
    },
  },
  esbuild: {
    jsxInject: "import React from 'react'",
  },
  server: {
    port: 3123,
  },
});
