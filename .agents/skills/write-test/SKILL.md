---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 23869ad2059d2f9bd8217a2b1df9bfc2_c270a0aaac2811f18874525400287e28
    ReservedCode1: q36dDlmhWzWeaFJfvVMPHnDUuOoFOl65V/nx0ADszGVQ+dpyZo0HkJsHpU2pMIEN0glw0NRvoazzlMrDhYbCMNoTcFq/kHveVb2w9BLE0/HYiaKemhPDBcpFpp+u307zKE2FBQm2txrvakXAekCwBZassiMrSveGlQXqTw9YcfoX4BoKKiQea25yBEc=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 23869ad2059d2f9bd8217a2b1df9bfc2_c270a0aaac2811f18874525400287e28
    ReservedCode2: q36dDlmhWzWeaFJfvVMPHnDUuOoFOl65V/nx0ADszGVQ+dpyZo0HkJsHpU2pMIEN0glw0NRvoazzlMrDhYbCMNoTcFq/kHveVb2w9BLE0/HYiaKemhPDBcpFpp+u307zKE2FBQm2txrvakXAekCwBZassiMrSveGlQXqTw9YcfoX4BoKKiQea25yBEc=
---

# 技能：编写测试（write-test）

## name

write-test

## description

为项目代码生成并运行测试，覆盖单元测试（Vitest）、组件测试（Testing Library）与 E2E 测试（Cypress），遵循项目测试约定。

## 触发场景

- 新增模块/方法/组件后需要补测试。
- 用户要求"写测试"、"补测试"、"给 X 加单测/E2E"。
- 修改既有模块后需同步更新测试。

## 生成约定

### 单元测试（Vitest）

- 位置：`src/__tests__` 或与源码同模块的 `__tests__`，命名 `*.test.tsx`（**必须 `.tsx` 后缀**，
  tsconfig `exclude **/*.test.ts`）。
- Service/纯逻辑：直接断言返回值；Service 层用 mock 链式 builder（mock `@/lib/supabase`，
  参考 `src/pages/Customer/tests/service.test.tsx`），断言入参、响应返回值、错误分支。

### 组件测试（Vitest + Testing Library）

- 命名 `*.test.tsx`。
- 按用户视角断言（`getByRole` / `getByText` / `userEvent` 交互），避免断言实现细节。
- 对 Ant Design 组件以交互行为为主（点击、输入、弹窗出现/关闭）。
- antd 双汉字按钮自动插空格：`/保\s?存/`、`/已\s?开\s?启/` 正则匹配；
  Modal 等 portal 渲染需显式 `afterEach(cleanup)`；异步渲染（校验错误/回填）用 `waitFor`。

### E2E 测试（Cypress）

- 位置：`cypress/e2e/`，命名 `*.cy.ts`。
- 覆盖关键用户链路（登录、列表、CRUD 主流程），使用真实浏览器流程与稳定选择器（`data-cy`）。
- **注意**：E2E 需真实浏览器 + 可访问 baseUrl，CI/无浏览器环境无法运行，仅交付骨架与选择器约定。

## 模板使用指引

本技能附带**三代测试骨架**，位于 `.agents/skills/write-test/templates/`：

| 子目录 | 内容 | 放置位置 |
|---|---|---|
| `templates/unit/` | 纯函数 service + Vitest 单测（正常/边界/空分支） | `src/services/` 随模块 |
| `templates/component/` | antd Button 开关组件 + RTL 组件测试（渲染/交互/往返） | 与被测组件同目录 |
| `templates/e2e/` | 登录 + 任务列表 CRUD 主流程（`data-cy` 选择器） | `cypress/e2e/` |
| `templates/README.md` | 三代分工 / 运行命令 / 测试约定总览 | — |

### 拼装流程

1. 确认被测对象归属哪一层：纯逻辑/Service -> unit；组件 -> component；端到端闭环 -> e2e。
2. `cp -R` 对应子目录到目标位置，按被测代码替换 `service.ts` / `Toggle.tsx` / `todo.cy.ts`。
3. Service 层如需 mock supabase，参考 create-api `templates/tests/service.test.tsx` 的链式 builder。
4. 运行验证：unit/component 用 `yarn vitest run`（可复制到校验目录跑通后删）;
   E2E 无法在本环境运行，交付时注明。

## 执行步骤

1. 确认被测代码范围与已有测试模式（参考 `src/pages/Customer/tests/` 现有用例风格）。
2. 按上面模板为每个新业务模块补单元 + 组件测试，核心闭环补 E2E（E2E 作为骨架交付并注明不可本地跑）。
3. 运行对应命令确保全部通过；修复失败的测试（除非失败源于真实 bug，此时反馈问题）。
4. 提交前提：新增测试通过、不引入 `any` 断言、覆盖率不下降。

## 产出物

- 新增/更新的单元、组件、E2E 测试文件
- 通过 `yarn test`（必要时 `yarn e2e:run`）验证的运行结果
*（内容由AI生成，仅供参考）*
*（内容由AI生成，仅供参考）*
