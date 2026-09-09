---
# ListDetail：列表详情型页面模板使用说明

本目录是 create-page 技能「列表详情型」可复制骨架（订单 Order 示例），落点在
`.agents/skills/create-page/templates/ListDetail/`。配套另一份骨架 `../SimpleForm/`
（简单表单型页面）。

## 一、复制与改名

```bash
cp -R .agents/skills/create-page/templates/ListDetail src/pages/<Name>
# 全局替换：Order -> <Name>（PascalCase）、order -> <name>（camelCase）、order_list -> 实际表名
```

替换后校验：`grep -rn "order\|Order" src/pages/<Name>` 不应再有残留（表名检查除外）。

## 二、文件清单与拼装顺序

| 文件 | 作用 | 复制后需调整 |
|---|---|---|
| `types.ts` | 实体 / 分页查询参数 / 枚举下拉 | 实体字段、`OrderQuery` 搜索条件、`ORDER_STATUSES` |
| `service.ts` | 基于 `@/lib/supabase` 的分页列表 + 详情 | `TABLE` 表名、搜索/筛选字段 |
| `components/ListTable.tsx` | 搜索表单 + 数据表格（分页 + 详情操作列），受控 | 搜索项、列定义、按钮文案 |
| `components/DetailDrawer.tsx` | Drawer 详情展示，受控 | Descriptions 字段 |
| `index.tsx` | 页面入口：状态编排 + 懒加载路由 | 页面标题（无逻辑调整） |

## 三、接线 route（懒加载）

```tsx
import { lazy } from 'react';
const Order = lazy(() => import('@/pages/Order'));
// 在 src/routes/common-router.tsx 的 dashboard children 追加：
// { name: '订单管理', path: 'order', key: 'order', component: Order }
```

> React Router 8，路由组件必须从 `'react-router'` 导入，不存在 `react-router-dom` 包。

## 四、测试

```bash
cp -R .agents/skills/create-page/templates/ListDetail/tests src/pages/<Name>/tests
yarn test src/pages/<Name>
yarn eslint src/pages/<Name>
yarn tsc --noEmit
```

- `tests/service.test.tsx`：mock `@/lib/supabase`（复用 `vitest.setup.ts` 全局 mock，Mock 边界允许 `as any` 并附 eslint-disable）。
- `tests/ListTable.test.tsx`：组件为受控组件，无需 mock service，直接渲染断言回调。

## 五、架构约定（与 `.agents/rules` 对齐）

- 页面只编排状态，数据访问一律走 `service.ts`；禁止页面直接调用 HTTP API。
- 出参入参显式类型，禁止 `any`（测试 mock 边界除外）。
- 页内私密状态留 React 局部状态；跨页共享才入 Zustand。
- UI 统一 Ant Design；详情字段不全时，可在 DetailDrawer 打开时再调 `getDetail` 拉全。
*（内容由AI生成，仅供参考）*
