---
# write-test 模板总览

本目录提供**三代测试**的可执行骨架：Vitest 单元测试、Testing Library 组件测试、
Cypress E2E。所有模板都是「复制即用 + 替换业务」级，对齐项目测试约定
（`.tsx` 后缀、antd 双汉字正则、portal 显式 cleanup、waitFor 异步等待）。

## 三份骨架

| 子目录 | 被测对象 | 测试 | 放置位置 |
|---|---|---|---|
| `unit/` | `service.ts` 纯函数（formatStatus / pageSummary） | `service.test.tsx` | 随被测模块 `src/services/` 或 `src/__tests__/` |
| `component/` | `Toggle.tsx`（antd Button 开关） | `Toggle.test.tsx` | 与被测组件同目录 |
| `e2e/` | 登录 + 任务列表主流程 | `todo.cy.ts` | `cypress/e2e/` |

## 三代测试分工

1. **Vitest 单元测试**：测纯逻辑 / Service 层。纯函数直接断言返回值；Service 层
   mock `@/lib/supabase`（完整 supabase 链式 mock 参考
   `../create-api/templates/tests/service.test.tsx` 与 `src/pages/Customer/tests/service.test.tsx`）。
2. **Testing Library 组件测试**：按用户视角断言。覆盖渲染、交互（点击/输入）、
   校验错误（waitFor）、editor 回填、Modal（afterEach cleanup）。
3. **Cypress E2E**：真实浏览器链路。统一 `data-cy` 选择器，覆盖登录-列表-CRUD 主流程。
   **不能在本环境运行**（需真实浏览器 + 可访问 baseUrl），仅作骨架与选择器约定。

## 运行命令

```bash
yarn test            # 单测 + 组件测试（Vitest）
yarn test --coverage # 覆盖率
yarn e2e             # Cypress 交互模式（需浏览器）
yarn e2e:run         # Cypress 无头运行（需浏览器）
```

## 测试约定（与 .agents/rules 对齐）

- 测试文件一律 `.tsx` 后缀（tsconfig `exclude **/*.test.ts`）。
- antd 双汉字按钮自动插空格：`/保\s?存/`、`/已\s?开\s?启/`。
- portal（Modal/Dropdown）测试显式 `afterEach(cleanup)`。
- 异步渲染统一 `waitFor`。
- 不引入 `any` 断言（mock 边界除外，附 eslint-disable）。
*（内容由AI生成，仅供参考）*
