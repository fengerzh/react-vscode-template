---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 23869ad2059d2f9bd8217a2b1df9bfc2_4c884aedac3011f18874525400287e28
    ReservedCode1: W0PvS24s9zM8eNF0dU+toYIHJZbdUGAy0OMvrtyGJKYosA4UVap1H64GgExCuXzyvaXexnfkGq8t4kt9eR4ESllTZZkSxMTDqp/fb7bEzVlexVkffkUp9/iqEp9teWxZgPAME5NVH8/CX5je9maBGrxNoEQ+kvfj0Y139Sog/oxMT5bLwtqN9Ov5De4=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 23869ad2059d2f9bd8217a2b1df9bfc2_4c884aedac3011f18874525400287e28
    ReservedCode2: W0PvS24s9zM8eNF0dU+toYIHJZbdUGAy0OMvrtyGJKYosA4UVap1H64GgExCuXzyvaXexnfkGq8t4kt9eR4ESllTZZkSxMTDqp/fb7bEzVlexVkffkUp9/iqEp9teWxZgPAME5NVH8/CX5je9maBGrxNoEQ+kvfj0Y139Sog/oxMT5bLwtqN9Ov5De4=
---

# AGENTS.md

本文件为项目级规则总纲，供任意 AI Coding Agent（Claude Code / Codex / Cursor / Qoder / Copilot）进入项目后阅读，理解"这个项目允许怎么写代码"。

## 项目简介

- 技术栈：Vite 8 + React 19 + TypeScript 6 + Ant Design 6 + Zustand + React Router 8
- 包管理器：yarn 4；测试：Vitest + Testing Library + Cypress
- 定位：react-vscode-template，正在向 AI-Native React Starter（2.0）演进，代码需保持"AI 友好、可读、可测试"。

## 架构分层

- 遵循 **Page → Service → API** 三层：页面组件调用 Service 层方法，Service 层封装对 HTTP API 的请求。
- **页面不应直接调用 HTTP API**，不允许在组件内写 `fetch`/`axios` 直接请求后端。
- 跨页共享状态使用 **Zustand**；局部 UI 状态（表单项、弹窗开关等）留在 React 组件内部。
- 目录结构：`src/pages`、`src/services`、`src/store`、`src/types`，详见 `.agents/rules/architecture.md`。

## 组件规范

- UI 优先使用 **Ant Design**，不引入第二套 UI 框架；确需扩展样式时使用 Ant Design 提供的定制或局部 CSS。
- 组件保持小而专一，遵循单一职责；页面组件按业务模块拆分 containers/components。

## TypeScript 规范

- **禁止使用 `any`**：遇到不确定类型必须收敛为显式类型（unknown + 类型守卫、泛型、联合类型）。
- 所有 API 响应必须有**显式类型定义**，统一放在 `src/types` 或与 service 同目录的 `types.ts` 中。
- 详见 `.agents/rules/typescript.md`。

## 测试规范

- 每个新业务模块应包含：单元测试（Service/工具函数）、组件测试（Testing Library）、必要时 E2E 测试（Cypress）。
- 运行命令：`yarn test`（Vitest）、`yarn e2e`（Cypress）。
- 详见 `.agents/rules/testing.md`。

## 规则与技能目录

- `.agents/rules/*.md`：项目编码规则，按主题拆分（architecture / react / typescript / api / testing）。**任何 AI Agent 进入项目后应阅读本总纲及其引用的 rules 文件。**
- `.agents/skills/*/SKILL.md`：可复用工作流技能，Agent 在执行对应任务（如创建页面、创建 CRUD 模块、写测试）时读取并遵循。

### 读取方式约定

1. 先读本文件 `AGENTS.md`。
2. 涉及架构疑问（目录映射 / 分层 / 数据源 / 规则 / 技能路径）时，优先读取 `.ai/architecture.yaml`。
3. 涉及具体编码主题时，读对应 `rules` 文件。
4. 执行创建/生成类任务时，优先查找并遵循 `.agents/skills` 下对应 `SKILL.md`。
*（内容由AI生成，仅供参考）*
*（内容由AI生成，仅供参考）*
