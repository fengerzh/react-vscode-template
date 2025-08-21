# React VSCode Template

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/fengerzh/react-vscode-template/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/fengerzh/react-vscode-template/tree/master) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/51b6e97af415445b9c68abc5719051f3)](https://app.codacy.com/gh/fengerzh/react-vscode-template/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade) [![Codacy Badge](https://app.codacy.com/project/badge/Coverage/51b6e97af415445b9c68abc5719051f3)](https://app.codacy.com/gh/fengerzh/react-vscode-template/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)

一个基于 React 19 的现代化前端项目模板，集成了最新的技术栈和开发工具。

## 技术栈

- **React 19.0.0** - 最新版本的 React，支持并发特性和新的 Hooks
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的构建工具
- **Ant Design** - 企业级 UI 组件库
- **Tailwind CSS** - 原子化 CSS 框架
- **Jest + Testing Library** - 测试框架
- **Cypress** - E2E 测试
- **ESLint + Prettier** - 代码规范和格式化

## React 19 新特性应用

### useOptimistic Hook

本项目展示了 React 19 新引入的 `useOptimistic` Hook 的使用方法。这个 Hook 用于实现乐观更新（Optimistic Updates），提供更好的用户体验。

#### 特性说明

`useOptimistic` 允许你在异步操作（如 API 调用）完成之前立即更新 UI，如果操作失败会自动回滚到原始状态。

#### 在项目中的应用

1. **用户管理页面** (`src/pages/home.tsx`)

   - 用户删除操作：点击删除按钮后立即从列表中移除用户
   - 用户添加操作：点击添加按钮后立即在列表中显示新用户
   - 显示乐观更新状态指示器

2. **设置页面** (`src/pages/Settings/index.tsx`)

   - 表单提交：提交后立即显示新的表单值
   - 按钮状态：显示加载状态和进度指示

3. **登录页面** (`src/pages/User/Login.tsx`)
   - 登录表单：提交后立即显示登录状态
   - 按钮文本：动态显示"登录中..."状态

#### 使用示例

```typescript
import { useOptimistic, startTransition } from "react";

function MyComponent() {
  const [optimisticData, addOptimisticData] = useOptimistic<DataType[]>(
    [] // 初始状态
  );

  const handleSubmit = async (data: DataType) => {
    // 乐观更新：立即更新 UI
    startTransition(() => {
      addOptimisticData((prev) => [...prev, data]);
    });

    try {
      // 异步操作
      await apiCall(data);
      // 成功：清除乐观更新状态
      startTransition(() => {
        addOptimisticData((prev) => prev.filter((item) => item.id !== data.id));
      });
    } catch (error) {
      // 失败：自动回滚到原始状态
      startTransition(() => {
        addOptimisticData((prev) => prev.filter((item) => item.id !== data.id));
      });
    }
  };

  return (
    <div>
      {/* 显示乐观更新状态 */}
      {optimisticData.length > 0 && <div>正在处理中...</div>}

      {/* 其他 UI 组件 */}
    </div>
  );
}
```

#### 优势

1. **即时反馈**：用户操作后立即看到界面变化
2. **自动回滚**：操作失败时自动恢复到原始状态
3. **类型安全**：完整的 TypeScript 支持
4. **并发安全**：与 React 的并发特性完全兼容

## 快速开始

### 安装依赖

```bash
yarn install
```

### 开发模式

```bash
yarn start
```

### 构建生产版本

```bash
yarn build
```

### 运行测试

```bash
# 单元测试
yarn test

# E2E 测试
yarn e2e
```

## 项目结构

```
src/
├── pages/           # 页面组件
│   ├── home.tsx     # 用户管理页面 (useOptimistic 示例)
│   ├── Settings/    # 设置页面 (useOptimistic 示例)
│   └── User/        # 用户相关页面
│       └── Login.tsx # 登录页面 (useOptimistic 示例)
├── services/        # API 服务
├── store/          # 状态管理
├── routes/         # 路由配置
└── types/          # TypeScript 类型定义
```

## 开发规范

### Git 提交规范

遵循约定式提交（Conventional Commits）规范：

- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建工具或辅助工具的变动

示例：

```
feat: 添加用户登录功能
fix: 修复登录页面显示异常
docs: 更新 API 文档
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加新特性'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
