---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 23869ad2059d2f9bd8217a2b1df9bfc2_78cbe5d9ac1b11f18874525400287e28
    ReservedCode1: 7bAV72ntLp3TcQcxbCSP/l2R5AH2fZZHVVQy3j9mJ9nVk83AgWc359wNMHIexZsgOaxLNdRucRy2982UMDz4rz+sK4nqLYPY1+cpVrfwh+fnCSm0qhtcobSkj6OLjnxkm9auEDtLbP342k0Ns0A0ihrYSNorqwi2KBNR4/YrsSgs980NDZK3LQ5uQII=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 23869ad2059d2f9bd8217a2b1df9bfc2_78cbe5d9ac1b11f18874525400287e28
    ReservedCode2: 7bAV72ntLp3TcQcxbCSP/l2R5AH2fZZHVVQy3j9mJ9nVk83AgWc359wNMHIexZsgOaxLNdRucRy2982UMDz4rz+sK4nqLYPY1+cpVrfwh+fnCSm0qhtcobSkj6OLjnxkm9auEDtLbP342k0Ns0A0ihrYSNorqwi2KBNR4/YrsSgs980NDZK3LQ5uQII=
---

# 技能：创建 CRUD 模块（create-crud）

## name

create-crud

## description

基于字段定义，一键生成一个完整的 Customer 风格 CRUD 模块（列表查询 + 搜索 + 新增/编辑弹窗 + 删除），并补齐 route/API/mock/test/E2E，遵循项目分层与 Ant Design 规范。

## 触发场景

- 用户要求"做一个 CRUD 模块"、"对 X 做增删改查"、"像 Customer 那样做一个模块"。

## 输入

- 模块名（如 `customer`）
- 字段定义列表：字段名、类型、是否必填、是否用于搜索、表单控件类型（Input/Select/DatePicker 等）、选项来源（枚举/接口）
- 分页与排序要求

## 自动生成范围（Customer 风格结构）

```
src/pages/<Name>/
├── index.tsx                  # 页面入口：组合搜索、表格、编辑弹窗
├── types.ts                   # 本模块类型（实体、查询、表单）
├── components/
│   ├── SearchForm.tsx         # 搜索表单
│   ├── Table.tsx              # 数据表格（含分页、操作列）
│   └── EditModal.tsx          # 新增/编辑弹窗（Ant Design Modal + Form）
└── service.ts                 # 增删改查 + 分页查询的 Service 方法
```

## 生成约定

- **route**：在 `src/routes` 注册 `/pages/<Name>`，懒加载。
- **API/service**：`service.ts` 提供 `getList`（分页）、`getDetail`、`create`、`update`、`remove`，方法签名显式类型，禁止 `any`。
- **types**：`types.ts` 定义实体、查询参数（含分页）、表单提交类型；可选 enum 选项。
- **mock**：若后端未就绪，可在测试或开发态提供 mock 数据源，标注清楚，不混入生产请求。
- **test**：为 `service.ts` 与 `Table.tsx`/`EditModal.tsx` 生成 Vitest + Testing Library 测试。
- **E2E**：为增删改查主链路生成 Cypress 测试（`cypress/e2e/<name>.cy.ts`）。

## 模板使用指引

本技能附带一套**可直接复制改名**的 Customer 风格完整骨架，位于 `.agents/skills/create-crud/templates/Customer/`，全部代码对齐项目真实技术栈（React 19 + TypeScript 6 + Ant Design 6 + Supabase + React Router 8 + yarn 4），并严格遵循 `.agents/rules`（禁止 any、类型显式、Page→Service→API 分层）。

### 模板文件清单

| 模板文件 | 作用 |
|---|---|
| `templates/Customer/index.tsx` | 页面入口，组合 SearchForm + Table + EditModal，负责状态与数据加载 |
| `templates/Customer/types.ts` | 实体 / 查询参数（含分页）/ 表单类型，禁止 any |
| `templates/Customer/components/SearchForm.tsx` | Ant Design Form 搜索表单，受控回调（onSearch / onReset） |
| `templates/Customer/components/Table.tsx` | Ant Design Table 分页 + 操作列 + Popconfirm 删除，受控展示 |
| `templates/Customer/components/EditModal.tsx` | Modal + Form 新增/编辑弹窗，受控提交（onOk） |
| `templates/Customer/service.ts` | 基于 `@/lib/supabase` 的分页列表 / 详情 / 增删改查，显式类型 |
| `templates/Customer/tests/` | service 单测 + Table / EditModal 组件测试（Vitest + Testing Library） |
| `templates/Customer/README.md` | 替换改名 + 接线 route / API 的说明 |

### 拼装流程

1. 复制 `templates/Customer/` 整体到 `src/pages/<Name>/`（如 `src/pages/Order/`）。
2. 全局替换标识符：`Customer` → `<Name>`（PascalCase）、`customer` → `<name>`（camelCase）、`customer_list` → 实际数据表名。
3. 改 `types.ts` 字段为业务实体；再同步改 `service.ts` 搜索/写入字段、`SearchForm.tsx` 搜索项、`Table.tsx` 列定义、`EditModal.tsx` 表单字段。
4. 按下方"执行步骤"接线路由并运行测试 / 静态检查。

## 执行步骤（逐个文件生成顺序）

按以下顺序生成，先类型后实现、先数据后视图，保证每步静态可校验：

1. **复制模板**：`cp -R .agents/skills/create-crud/templates/Customer src/pages/<Name>`，并全局替换 `Customer`→`<Name>`、`customer`→`<name>`、`customer_list`→数据表名。
2. **types.ts**：定义实体 `Customer`、查询参数 `CustomerQuery`（继承 `current/pageSize` 分页）、表单类型 `CustomerFormValues`、分页结果 `PaginatedResult<T>`；禁止 `any`。
3. **service.ts**：基于 `@/lib/supabase` 实现 `getList`（分页）/`getDetail`/`create`/`update`/`remove`，方法签名显式入参出参类型、错误直接抛出。
4. **components/SearchForm.tsx**：Ant Design Form，仅渲染搜索字段，提交回调 `onSearch(values)`、重置回调 `onReset()`。
5. **components/Table.tsx**：Ant Design Table，操作列含「编辑」（onEdit）与「删除」（Popconfirm，onDelete）；分页由 `pagination` 受控对接 `getList` 的 `current/pageSize`。
6. **components/EditModal.tsx**：Modal + Form，`record` 非空时回填为编辑态、否则新增态；`onOk` 先 `validateFields` 再回调提交。
7. **index.tsx**：组装前三者；页内状态（查询/分页/弹窗）留在 React 局部状态，用 `getList` 拉数据；跨页共享状态才入 Zustand。
8. **route**：在 `src/routes` 对应 router（如 `common-router.tsx`）注册 `/dashboard/<name>`，用 `lazy(() => import('@/pages/<Name>'))` 懒加载。
9. **test**：复制 `Customer/tests/` 到 `src/pages/<Name>/tests/`，按新模块改断言与字段。
10. **验证**：`yarn test` 通过；`yarn eslint src/pages/<Name>` 无新增告警；`yarn tsc --noEmit` 通过。

## 产出物

- 上述 Customer 风格模块全部文件
- 路由、Service、types、mock、单测、E2E 各就位
*（内容由AI生成，仅供参考）*
*（内容由AI生成，仅供参考）*
