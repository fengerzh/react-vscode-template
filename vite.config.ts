import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import vitePluginImp from 'vite-plugin-imp';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    vitePluginImp({
      libList: [
        // antd 5.x 不再需要按需引入 less 样式，官方推荐全局引入 reset.css
        // 如有其它库需要按需引入样式，可在此添加
      ],
    }),
  ],
  resolve: {
    alias: {
      '~antd': path.resolve(__dirname, '/node_modules/antd'),
      '@': path.resolve(__dirname, '/src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  esbuild: {
    jsxInject: 'import React from \'react\'',
  },
  server: {
    port: 3123,
  },
});
