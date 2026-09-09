# React VSCode Template — AI-Native React Starter

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/fengerzh/react-vscode-template/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/fengerzh/react-vscode-template/tree/master) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/51b6e97af415445b9c68abc5719051f3)](https://app.codacy.com/gh/fengerzh/react-vscode-template/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade) [![Codacy Badge](https://app.codacy.com/project/badge/Coverage/51b6e97af415445b9c68abc5719051f3)](https://app.codacy.com/gh/fengerzh/react-vscode-template/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)

一个面向 **AI Coding / AI Agent** 的现代 React 企业级项目模板。它继承了原 `react-vscode-template`（React 19 + Vite + TypeScript + Ant Design 的成熟脚手架），并在 2.0 转型中升级为 **AI-Native React Starter**：为项目注入机器可读的架构声明、可执行技能与 MCP 工具，目标是**帮 AI Agent 更可靠地把一个 React 项目开发出来**——AI 一进入项目即可读懂技术栈、分层规范与可用能力，再配合本地 CLI 脚手架 `create-ai-react` 一键生成新工程。

## 技术栈

- **React 19** - 最新版本的 React，支持并发特性和新的 Hooks（本仓库演示 `useOptimistic` / `startTransition`）
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的构建工具
- **Ant Design** - 企业级 UI 组件库
- **Zustand** - 轻量级状态管理库
- **React Router** - 路由（统一从 `'react-router'` 导入，无 `react-router-dom`）
- **@supabase** - 数据源（统一经 `@/lib/supabase` 访问）
- **Vitest + Testing Library** - 单元/组件测试框架
- **Cypress** - E2E 测试
- **ESLint + Prettier** - 代码规范和格式化
- **yarn 4（Berry）** - 包管理器（nodeLinker 服从 `packageManager` 字段）

> **Tailwind CSS：可选，未内置**。模板不包含 Tailwind 配置文件与依赖，如需使用请自行安装并初始化（同时从本列表移除该条声明）。

> 版本速查（以 `package.json` / 锁文件为准）：React 19 · Vite 8 · TypeScript · Ant Design 6 · Zustand 5 · React Router 8 · Vitest 4 · Cypress 16。

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

## AI 能力

2.0 转型的核心交付：让任何 AI Coding 工具（Claude Code / Codex / Cursor / Qoder / Copilot 等）进入项目即可"一读即懂、照章执行、按需生成"。以下能力均位于仓库内，随项目一起分发。

### AI Rules（规则层）

- `.agents/AGENTS.md`：项目总览 + 硬性规则入口，AI 进入项目的第一读点。
- `.agents/rules/`：分主题规则，共 5 份，任何 AI IDE 进入项目即读：
  - `architecture.md`：目录分层与职责边界（Page → Service → API）
  - `react.md`：React 19 / Hooks / 并发特性编码约定
  - `typescript.md`：类型安全，禁止 `any`、显式响应类型
  - `api.md`：Service/API 层写法与 `@/lib/supabase` 用法
  - `testing.md`：单测 / 组件测试 / E2E 规范

### AI Skills（技能层）

`.agents/skills/` 下 5 个**可直接执行**的 AI 技能，每个技能自带 `templates/` 可复用骨架（对齐项目真实技术栈）：

| 技能 | 作用 | 模板 |
| --- | --- | --- |
| `create-page` | 创建业务页面（列表详情型 / 简单表单型） | `templates/ListDetail`、`templates/SimpleForm` |
| `create-crud` | 创建完整 CRUD 模块（搜索 + 表格 + 编辑弹窗） | `templates/Customer` |
| `create-form` | 创建 Ant Design 表单（校验 / 回填 / 消息反馈） | `templates/ProfileForm` |
| `create-api` | 创建 Service/API 方法（supabase 封装） | `templates/service.ts` 等 |
| `write-test` | 编写测试（Vitest 单测 + RTL 组件 + Cypress E2E） | `templates/unit`、`templates/e2e` |

### Architecture as Code

- `.ai/architecture.yaml`：机器可读的架构声明（技术栈、目录 → 真实路径映射、数据源、硬性规则、可用技能）。AI 无需翻代码即可拿到项目全貌；变更 `src/` 结构 / 依赖 / 规则时需同步更新。

### 自动测试：`yarn ai:test`

一键 AI 测试报告脚本（`scripts/ai-test.mjs`，无外部依赖，不依赖 LLM 即可跑通）：

1. 扫描 `src` 各业务模块，统计测试文件覆盖情况；
2. 全量运行 Vitest（JSON reporter），收集通过 / 失败用例数；
3. 生成 Markdown 报告到 `reports/ai-test-report.md` 并打印执行摘要；
4. 可选扩展：配置 `AI_TEST_LLM_URL` / `AI_TEST_LLM_KEY` 时调用 LLM 分析失败用例并写入修复建议，未配置则跳过。

> **运行前注意**：本机 `node` 可能不在默认 PATH，请先激活 Node 环境（如 `export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"`，或按你本机的 nvm/volta 路径调整），再执行 `yarn ai:test`。

### MCP Server

`.mcp/server.mjs`：零依赖的 MCP（Model Context Protocol）stdio 服务器，将仓库 AI 能力暴露给兼容 MCP 客户端（Cursor / Claude Code 等），配置命令 `node .mcp/server.mjs`。

暴露 6 个工具：

| 工具 | 类型 | 说明 |
| --- | --- | --- |
| `get_project_structure` | 只读 | 返回项目目录树 |
| `get_architecture` | 只读 | 返回 `.ai/architecture.yaml` 内容 |
| `create_page` | 指引型 | 返回 create-page 技能指引 + templates 绝对路径（不落盘） |
| `create_crud` | 指引型 | 返回 create-crud 技能指引 + templates 绝对路径（不落盘） |
| `run_test` | 执行 | 项目根执行 `yarn test`，返回真实 stdout/stderr 与退出码 |
| `run_lint` | 执行 | 项目根执行 `yarn eslint`，返回真实 stdout/stderr 与退出码 |

定位：`create_page` / `create_crud` 为**指引型**工具，只输出 SKILL.md 摘要与模板路径，由 AI Agent 负责落盘，MCP 不向 `src/` 写业务代码；`run_test` / `run_lint` 只执行既有命令，无破坏性操作。详见 `.mcp/README.md`。

## CLI: create-ai-react

本仓库同时作为 **AI-Native React Starter** 的模板源，内置一个本地 CLI 脚手架 `create-ai-react`，可交互式选择特性并生成新项目，将"GitHub 模板"变成"可安装生成项目的工具"。

### 用法

不发布到 npm，采用本地运行：

```bash
# 从仓库根目录本地运行（等价于安装 bin 后的 create-ai-react <dir>）
node packages/create-ai-react/src/index.mjs my-admin
```

或在 `packages/create-ai-react` 目录安装到全局后使用：

```bash
cd packages/create-ai-react
yarn global add file:.
create-ai-react my-admin
```

运行时通过逐项确认式询问（`✔/✘` 风格，回车确认、输入 `n` 关闭）选择以下特性：

| 选项 | 默认 | 说明 |
| --- | --- | --- |
| TypeScript | ✔ | 保留 TS 结构（MVP 不做 JS 剥离） |
| Ant Design | ✔ | 保留 antd（MVP 不做剥离） |
| Zustand | ✔ | 关闭时移除 `zustand` 依赖与 `src/store/` |
| Tailwind | ✔ | 模板未内置 Tailwind 配置，选中仅提示，需自行安装 |
| Testing | ✔ | 关闭时移除 `cypress/`、`cypress.config.ts`、e2e / ai:test 脚本及相关依赖 |
| AI Rules | ✔ | 保留 `.agents/rules/`、`.agents/AGENTS.md` 与 `.ai/architecture.yaml` |
| AI Skills | ✔ | 保留 `.agents/skills/` 下的可复用技能 |

### 生成行为

- 以当前仓库为模板源，复制项目骨架并排除开发/产物目录（`node_modules`、`dist`、`coverage`、`.git`、`reports`、`.DS_Store`、`.env` 等），以及与脚手架无关的 `packages/`、`.circleci/`、`.claude/`、`.qoder/` 等。
- 目标 `package.json` 的 `name` 改为目标目录名，移除不必要的内部脚本（保留基础运行/构建脚本；`e2e`、`ai:test` 视 Testing 选项保留）。
- 展示复制与精简进度，并打印最终生成结构树。

### 生成结构

生成的项目与模板保持一致的分层：

```
my-admin/
├── src/
│   ├── pages/       # 页面组件
│   ├── services/    # API 服务（Service 层）
│   ├── store/       # Zustand 状态管理
│   ├── routes/      # 路由配置
│   └── layout/      # 布局组件
├── .agents/         # AI Rules（rules/）+ AI Skills（skills/，可按选项裁剪）
├── .ai/             # architecture.yaml 机器可读架构声明
├── package.json     # 已精简 name/scripts/deps
└── ...
```

### 受限事项（MVP 边界）

- **不做 npm 发布**：CLI 仅本地 `packages/create-ai-react/` 独立管理，通过相对路径读取模板源。
- **Tailwind 未内置**：选择 Tailwind 只做提示，不写入配置。
- **TypeScript / Ant Design 不可剥离**：模板代码深度依赖，MVP 未内置 JS / 无 antd 改造。

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

# AI 测试报告（扫描覆盖率 + 全量 Vitest + 生成 reports/ai-test-report.md）
yarn ai:test
```

> `yarn ai:test` 生成报告位于 `reports/ai-test-report.md`。若提示 `node` 未找到，请先激活本机 Node 环境（`export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"`，路径按本机实际调整）再执行。

## 项目结构

```
src/
├── pages/           # 页面组件
│   ├── home.tsx     # 用户管理页面 (useOptimistic 示例)
│   ├── Settings/    # 设置页面 (useOptimistic 示例)
│   └── User/        # 用户相关页面
│       └── Login.tsx # 登录页面 (useOptimistic 示例)
├── services/        # API 服务（Service 层）
├── store/          # Zustand 状态管理
├── routes/         # 路由配置
├── types/          # TypeScript 类型定义
└── lib/            # 数据源封装（如 supabase.ts）
.agents/            # AI Rules（AGENTS.md + rules/ 5 份）+ AI Skills（skills/ 5 个，含 templates）
.ai/                # architecture.yaml 机器可读架构声明
.mcp/               # MCP stdio 服务器（server.mjs + package.json + README.md）
packages/
└── create-ai-react/ # 本地 CLI 脚手架（AI-Native React Starter 生成器）
scripts/
└── ai-test.mjs     # yarn ai:test 一键测试报告脚本
reports/            # AI 测试报告产物（如 ai-test-report.md）
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
