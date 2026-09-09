---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 23869ad2059d2f9bd8217a2b1df9bfc2_bfe8e890ac2811f18039525400461939
    ReservedCode1: 1eGSiFTylUdCOQ2qDP9tQrq2TkwlmHaFT2NgPyTHHQK06UcPNYBV/PmH+TlXcYbKjXg/Rko6RMLNKs10Ye0nK6JNMgVihTTqciZXr/hAFXQbckJOSLaCWHIQ6ESUa4UG735og3WMugg43PgGSXBw7xE8eXhZMbRGmiWh/my96FTwGzvH7+Sh66ZpkVc=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 23869ad2059d2f9bd8217a2b1df9bfc2_bfe8e890ac2811f18039525400461939
    ReservedCode2: 1eGSiFTylUdCOQ2qDP9tQrq2TkwlmHaFT2NgPyTHHQK06UcPNYBV/PmH+TlXcYbKjXg/Rko6RMLNKs10Ye0nK6JNMgVihTTqciZXr/hAFXQbckJOSLaCWHIQ6ESUa4UG735og3WMugg43PgGSXBw7xE8eXhZMbRGmiWh/my96FTwGzvH7+Sh66ZpkVc=
---

# 技能：创建页面（create-page）

## name

create-page

## description

在项目中创建一个新的业务页面（Page），自动补全从路由到组件、Service、类型与测试的完整闭环，遵循 Page → Service → API 分层。

## 触发场景

- 用户要求"新增一个页面"、"做一个 Xxx 页面"、"添加路由页面"。
- 新业务入口需要独立页面承载时。

## 输入

- 页面名称（如 `customer`）
- 页面路由路径（如 `/customer`）
- 页面功能要点（展示/查询什么数据）

## 自动生成范围

1. **routes**：在 `src/routes` 中注册路由（含懒加载，`React.lazy`）。
2. **page**：在 `src/pages/<Name>/` 创建主页面组件 `index.tsx`（PascalCase 组件名）。
3. **components**：若页面含可拆分块，创建 `src/pages/<Name>/components/` 下的子组件。
4. **service**：在 `src/services/<name>.ts` 生成页面所需请求方法（若有数据请求）。
5. **types**：在 `src/types/<name>.ts` 生成页面用到的响应/入参类型。
6. **test**：在 `src/pages/<Name>/__tests__/` 生成组件测试。

## 模板使用指引

本技能附带两套**可直接复制改名**的页面骨架（对齐项目真实技术栈 React 19 + TypeScript 6
+ Ant Design 6 + Supabase + React Router 8，遵循 `.agents/rules`），位于
`.agents/skills/create-page/templates/`：

| 子目录 | 适用场景 | 骨架文件 |
|---|---|---|
| `templates/ListDetail/` | 列表 + 详情查看型页面 | `index.tsx` + `components/ListTable.tsx` + `components/DetailDrawer.tsx` + `service.ts` + `types.ts` + `tests/` + `README.md` |
| `templates/SimpleForm/` | 独立路由的简单表单页 | `index.tsx` + `components/FeedbackForm.tsx` + `service.ts` + `types.ts` + `tests/` + `README.md` |
| `templates/README.md` | 两类骨架选择说明 | 总览 |

### 列表详情型（ListDetail）拼装流程

1. `cp -R .agents/skills/create-page/templates/ListDetail src/pages/<Name>`，全局替换
   `Order → <Name>`、`order → <name>`、`order_list → 实际表名`。
2. `types.ts` 定义实体 / 分页查询参数 / 枚举下拉（禁止 any）。
3. `service.ts` 基于 `@/lib/supabase` 实现 `getList`（分页+筛选）与 `getDetail`。
4. `components/ListTable.tsx`：搜索表单 + Table，受控回调（onSearch / onReset / onPageChange / onView）。
5. `components/DetailDrawer.tsx`：Drawer 详情展示，受控（open / record / onClose）。
6. `index.tsx` 组装：页内状态（查询/分页/详情开关）留 React 局部状态，用 `getList` 拉数据。
7. `src/routes` 注册路由（`lazy(() => import('@/pages/<Name>'))` 懒加载；React Router 8 从 `'react-router'` 导入）。
8. `tests/` 复制改名，运行验证（见步骤）。

### 简单表单型（SimpleForm）拼装流程

1. `cp -R .agents/skills/create-page/templates/SimpleForm src/pages/<Name>`，全局替换
   `Feedback → <Name>`、`feedback → <name>`、`feedback_list → 实际表名`。
2. `types.ts` 定义实体与表单提交类型、枚举下拉。
3. `service.ts` 提供提交方法（基于 `@/lib/supabase`）。
4. `components/FeedbackForm.tsx`：Form + 校验 rules + 受控提交（onSubmit）。
5. `index.tsx` 组装：提交成功消息反馈 + 重置表单；注册懒加载路由。

> 每个模板目录内 `README.md` 附完整接线与字段调整对照表。

## 执行步骤

1. 确认页面名称/路由路径/页面形态（列表详情型 or 简单表单型），按 PascalCase 生成组件名。
2. 从上方对应模板复制改名，先 `types.ts` 后 `service.ts` 再视图，保证每步静态可校验。
3. 页面组件只做组合与状态管理，数据通过 Service 获取，禁止直接调用 HTTP API；UI 复用 Ant Design。
4. 生成对应类型定义，禁止 `any`；回调参数名契约加局部 `eslint-disable no-unused-vars`。
5. 注册懒加载路由；复制 `tests/` 为页面生成测试（测试文件用 `.tsx` 后缀，tsconfig 排除 `**/*.test.ts`）。
6. 验证：`cp -R` 到 `src/pages/_tplcheck` 后 `yarn tsc --noEmit`（只看模板路径）、`yarn vitest run`、
   `yarn eslint` 通过；确认后删除校验目录，不改动既有业务代码。

## 产出物

- 新增路由配置
- `src/pages/<Name>/index.tsx`（+ 可选子组件）
- `src/services/<name>.ts`（如有请求）
- `src/types/<name>.ts`（如有类型）
- 对应组件测试文件
*（内容由AI生成，仅供参考）*
*（内容由AI生成，仅供参考）*
