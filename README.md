# React Vscode Template

<p align="center">
  <img src="src/logo.png" alt="logo" />
</p>

[![CircleCI](https://circleci.com/gh/fengerzh/react-vscode-template.svg?style=svg)](https://circleci.com/gh/fengerzh/react-vscode-template) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/51b6e97af415445b9c68abc5719051f3)](https://www.codacy.com/gh/fengerzh/react-vscode-template/dashboard?utm_source=github.com&utm_medium=referral&utm_content=fengerzh/react-vscode-template&utm_campaign=Badge_Grade)

用最新的技术，做最好的网站

---

## 主要特性

- 基于 **React 18**、**Ant Design 5.x**、**@ant-design/pro-components 2.x**、**react-router-dom 6.x**、**Yarn 4.x** 全面升级
- 极速开发体验：采用 **Vite** 构建，热更新极快
- UI 体系：Ant Design 5.x + Pro 组件（ProLayout、ProTable、ProForm 等）
- 现代 CSS：**TailwindCSS** 全面支持
- 代码规范：**TypeScript** + **Airbnb Eslint** 规则，零警告、零错误
- 目录清晰，适合中大型项目最佳实践

## 安装和运行

进入项目文件夹，运行依赖安装：

```sh
yarn
```

编译 TailwindCSS：

```sh
yarn css
```

启动开发环境：

```sh
yarn start
```

构建生产包：

```sh
yarn build
```

本地预览生产包：

```sh
yarn serve
```

运行单元测试：

```sh
yarn test
```

## 依赖与兼容性说明

- 已适配 **React 18**，入口采用 `createRoot`，支持并发特性
- UI 体系为 **Ant Design 5.x**，样式采用官方推荐 `import 'antd/dist/reset.css'`，已移除所有 less 样式引入
- Pro 相关依赖全部升级为 `@ant-design/pro-components`，原 `pro-layout` 已废弃
- 路由全面升级为 **react-router-dom v6**，支持嵌套路由、动态重定向
- 支持 **Yarn 4.x**，推荐 node 16+ 环境

## 常见问题与解决方案

- antd icon 类型报错：如遇 `onPointerEnterCapture` 类型报错，直接在报错行前加 `// @ts-expect-error` 注释即可
- 退出登录、跳转等开发环境警告：React 18+ 已消除 setState on unmounted 警告
- 依赖升级建议：定期 `yarn upgrade` 保持依赖最新

## 推荐开发环境

- 推荐使用 **VSCode**，配合 Volar、TypeScript、ESLint 插件获得最佳体验

## 贡献与反馈

- 欢迎提 issue 或 PR，或在禅道/钉钉群内反馈问题
- 本项目长期维护，持续跟进社区最佳实践

---

如有更多问题，欢迎随时交流！
