# create-page 模板总览

本目录提供两类「可直接复制改名」的页面骨架，均对齐项目技术栈
（React 19 + TypeScript 6 + Ant Design 6 + Supabase + React Router 8）并遵循
`.agents/rules` 分层规范（Page → Service → 数据源、禁止 any、类型显式）。

## 两类骨架

| 子目录 | 适用场景 | 结构 | 配套演示实体 |
|---|---|---|---|
| `ListDetail/` | 列表 + 详情查看型（查询、分页、查看详情抽屉），无增删改 | index + ListTable + DetailDrawer + service + types + tests | Order 订单 |
| `SimpleForm/` | 独立路由的简单表单页（收集 + 提交 + 消息反馈） | index + FeedbackForm + service + types + tests | Feedback 反馈 |

## 如何选择

- 需要"列表 + 详情查看"页面 → `ListDetail`
- 需要"独立表单提交页"（如意见反馈、登记）→ `SimpleForm`
- 需要完整 CRUD（查询 + 新增/编辑弹窗 + 删除）→ 用 create-crud 的 Customer 模板
- 需要大型复杂表单（编辑回填、联动、Form.List 动态项）→ 用 create-form 的 ProfileForm 模板

## 验证方式

两种骨架各自的 `README.md` 内含复制改名、接线 route 与测试运行方法；技能验收时
将模板复制到 `src/pages/_tplcheck/` 下执行 `yarn tsc --noEmit` / `yarn vitest run`
/ `yarn eslint` 真实验证后再删除。
*（内容由AI生成，仅供参考）*
