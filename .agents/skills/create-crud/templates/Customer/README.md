---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 23869ad2059d2f9bd8217a2b1df9bfc2_79abb9f4ac1b11f18039525400461939
    ReservedCode1: Q1hT1sK/+vlxsoLsVyPcUX61U0uUBl9VtypZT+6RmcQnxSTeo+jbEywynC+UsLpTQCn2O8SgwMuZdvbVy5zGtRTyqFtEgWb/EXHF/ziLNUhJVhi68LMWQ8sJtMGQFfnwBsp+28Xoop5ygXG5eol69aODYwa5KpBbLjTdHFk0ToqcIoFpVleuZxxv6h0=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 23869ad2059d2f9bd8217a2b1df9bfc2_79abb9f4ac1b11f18039525400461939
    ReservedCode2: Q1hT1sK/+vlxsoLsVyPcUX61U0uUBl9VtypZT+6RmcQnxSTeo+jbEywynC+UsLpTQCn2O8SgwMuZdvbVy5zGtRTyqFtEgWb/EXHF/ziLNUhJVhi68LMWQ8sJtMGQFfnwBsp+28Xoop5ygXG5eol69aODYwa5KpBbLjTdHFk0ToqcIoFpVleuZxxv6h0=
---

# Customer CRUD 模板使用说明

本目录是 create-crud 技能的**可直接复制改名骨架**，落点在 `.agents/skills/create-crud/templates/Customer/`。整套代码对齐项目技术栈（React 19 + TypeScript 6 + Ant Design 6 + Supabase + React Router 8），并遵循 `.agents/rules` 分层规范（Page → Service → API/数据源、禁止 any、类型显式）。

## 一、复制与改名

```bash
# 1. 复制模板到业务模块目录（<Name> 为 PascalCase，如 Order）
cp -R .agents/skills/create-crud/templates/Customer src/pages/<Name>

# 2. 全局替换三处标识符
#    Customer       -> <Name>         （PascalCase，文件名与类型名）
#    customer       -> <name>         （camelCase，校验提示/变量）
#    customer_list  -> 实际数据表名   （Supabase 表名）
```

替换后校验：`grep -rn "customer\|Customer" src/pages/<Name>` 不应再有残留（`customer_list` 对应的表名替换除外）。

## 二、字段调整对照表

| 文件 | 需同步调整的内容 |
|---|---|
| `types.ts` | 实体字段、`CustomerQuery` 搜索条件、`CustomerFormValues` 表单字段、`CUSTOMER_STATUSES` 枚举 |
| `service.ts` | `TABLE` 表名、`getList` 的搜索/排序字段、`create/update` 写入字段 |
| `components/SearchForm.tsx` | 搜索项（name/age）与其控件类型 |
| `components/Table.tsx` | 表格列定义（dataIndex、render）、操作列按钮文案 |
| `components/EditModal.tsx` | 表单项（控件、校验 rules、是否必填） |
| `index.tsx` | 页面标题、无逻辑调整 |

## 三、接线 route

在 `src/routes/common-router.tsx`（或在对应 router 配置）注册路由并懒加载：

```tsx
import { lazy } from 'react';
import { TeamOutlined } from '@ant-design/icons';

const Customer = lazy(() => import('@/pages/Customer'));

// 在 children 数组中追加：
{
  name: '客户管理',
  path: 'customer',
  key: 'customer',
  icon: <TeamOutlined />,
  component: Customer,
}
```

> 注意：本项目为 React Router 8，路由组件必须从 `'react-router'` 导入，不存在 `react-router-dom` 包。

## 四、后端 API / 数据表

- 本项目 Service 层直接使用 `@/lib/supabase`（`src/services/index.ts` 同款写法），没有独立 HTTP request 封装。
- 需要后端存在表 `customer_list`，且字段与 `types.ts` 实体一致；表结构由后端/迁移脚本维护。
- 若后续项目引入统一 request 封装，可仅将 `service.ts` 内部实现替换为 `request.get('/xx')`，签名与组件层不动。

## 五、测试运行

```bash
cp -R .agents/skills/create-crud/templates/Customer/tests src/pages/<Name>/tests
yarn test src/pages/<Name>        # 运行本模块单测
yarn eslint src/pages/<Name>      # 静态检查无新增告警
yarn tsc --noEmit                 # 类型检查
```

测试说明：

- `tests/service.test.tsx`：mock `@/lib/supabase`（复用 `vitest.setup.ts` 全局 mock，写法对齐 `src/__tests__/services.test.tsx`，Mock 边界允许 `as any` 并附 eslint-disable）。
- `tests/Table.test.tsx` / `tests/EditModal.test.tsx`：组件为**受控组件**（数据与回调走 props），测试无需 mock service，直接渲染并断言回调。

## 六、架构约定（与 .agents/rules 对齐）

- 页面组件只负责状态与编排，不直接拼 SQL/写数据；数据访问一律走 `service.ts`。
- 业务方法出参入参全部显式类型，禁止 `any`（测试的 mock 边界除外）。
- 页内私密状态（搜索条件、分页、弹窗开关）留在 React 局部状态；跨页共享（登录态、主题等）才入 Zustand。
- UI 统一 Ant Design，不引入第二套组件库。
*（内容由AI生成，仅供参考）*
