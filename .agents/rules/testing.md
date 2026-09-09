# 测试规范

项目现状：Vitest 4 + Testing Library + jsdom 做单元/组件测试，Cypress 16 做 E2E。

## 适用范围

| 测试类型 | 工具 | 适用对象 | 何时必须写 |
|---|---|---|---|
| 单元测试 | Vitest | Service 方法、工具函数、类型/纯逻辑 | 每个新 Service 方法、新工具函数 |
| 组件测试 | Vitest + Testing Library | 页面/业务组件交互与渲染 | 每个新业务页面/关键组件 |
| E2E 测试 | Cypress | 关键用户链路（登录、创建、CRUD 主流程） | 涉及核心业务闭环时 |

## 目录与命名约定

- 单元/组件测试放 `src/__tests__` 或与被测文件同模块的 `__tests__` 目录，命名 `*.test.ts(x)`。
- E2E 测试放 `cypress/e2e/`，命名 `*.cy.ts`。
- 测试文件与被测代码一一对应，便于定位。

## 编写约定

- 单元测试：对 Service 层的 HTTP 请求用 mock（如 `vi.mock` / MSW 风格拦截）隔离网络，断言入参、返回类型与错误分支。
- 组件测试：优先按用户视角断言（getByRole / getByText 等），对 Ant Design 组件以交互行为为主，避免测试内部实现细节。
- E2E 测试：走真实浏览器流程，覆盖主链路与关键错误提示。
- 每个新业务模块都应包含对应测试；改动既有模块时必须同步更新/新增测试并通过。

## 运行命令

```bash
yarn test        # Vitest 单元/组件测试
yarn test --coverage   # 带覆盖率
yarn e2e         # Cypress 交互模式
yarn e2e:run     # Cypress 无头运行
```

## 质量底线

- 新增代码不允许降低既有覆盖率；`vitest.setup.ts` 中的全局 mock 保持稳定。
- 测试失败视为阻断项，禁止为了过测而使用 `any` 断言或跳过校验。
*（内容由AI生成，仅供参考）*
