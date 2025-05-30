import path from 'path';
import { defineConfig } from 'vite';
import vitePluginImp from 'vite-plugin-imp';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vitePluginImp({
      libList: [
        // antd 5.x 不再需要按需引入 less 样式，官方推荐全局引入 reset.css
        // 如有其它库需要按需引入样式，可在此添加
        {
          libName: 'antd',
          style: (name) => {
              if (name === 'col' || name === 'row') {
                  return 'antd/lib/style/index.js'
              }
              return `antd/es/${name}/style/index.js`
          },
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      // '~antd': path.resolve(__dirname, '/node_modules/antd'),
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
  build: {
    rollupOptions: {
      external: (id) => {
        // 排除 Ant Design 组件的 CSS 导入
        if (id.includes('antd/es') && id.endsWith('.css.js')) {
          return true;
        }
        return false;
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
