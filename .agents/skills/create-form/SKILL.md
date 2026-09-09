---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 23869ad2059d2f9bd8217a2b1df9bfc2_c0e6ce4eac2811f18874525400287e28
    ReservedCode1: bERhqlvZHowOUTu2tWXdpY/Gl+T71NI7gljdI8c00orK20Tf0lw+zo3jk52gqPM2U732H1PNdLogjVYosj5RCX4bfQNauUwTGa/HjrXun1lgc9IWoCj8Zsipbxbj4W9YcGOtCST6rv9iKE+iD00QmyYnXw0S3j6jLJ9+DRo8/mOKy38zVwmJ+QdS6Bw=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 23869ad2059d2f9bd8217a2b1df9bfc2_c0e6ce4eac2811f18874525400287e28
    ReservedCode2: bERhqlvZHowOUTu2tWXdpY/Gl+T71NI7gljdI8c00orK20Tf0lw+zo3jk52gqPM2U732H1PNdLogjVYosj5RCX4bfQNauUwTGa/HjrXun1lgc9IWoCj8Zsipbxbj4W9YcGOtCST6rv9iKE+iD00QmyYnXw0S3j6jLJ9+DRo8/mOKy38zVwmJ+QdS6Bw=
---

# 技能：创建表单（create-form）

## name

create-form

## description

创建基于 Ant Design Form 的业务表单，规范字段、校验、提交链路与测试，遵循项目分层与类型安全要求。

## 触发场景

- 用户要求"做一个表单"、"新增表单页"、"添加编辑表单"。

## 输入

- 表单名称与用途（新增/编辑）
- 字段定义：名称、label、控件类型、必填/规则、联动
- 提交目标（Service 方法）与成功后动作

## 规范要求

### Ant Design Form 使用

- 使用 `Form` + `Form.Item` + 对应控件（`Input` / `Select` / `DatePicker` 等），控件类型优先 Ant Design 内置。
- 布局：列表型表单用 `layout="vertical"`，Inline 表单仅用于搜索场景。
- 提交使用 `form.validateFields()` 校验后组装提交数据。

### 校验

- 必填、格式、长度等规则写在 Form.Item `rules` 中，规则清晰可直接执行。
- 后端返回的字段错误需要回显时，用 `form.setFields` 精确回填，避免全表单重校验。

### 提交链路

- 表单提交 → 调用 Service 方法（新增 `create` / 编辑 `update`）→ 成功后提示并回调刷新。
- 禁止组件内直接请求 API，一律走 Service。
- 提交数据与响应类型显式定义（`types.ts`），禁止 `any`。

### 测试

- 组件测试：渲染各字段、必填校验触发、合法值提交调用 Service 的断言。
- 结合 Testing Library 按用户行为（输入、点击提交）断言。

## 模板使用指引

本技能附带一套**可直接复制改名**的大表单骨架（对齐项目真实技术栈 React 19 + TypeScript
6 + Ant Design 6 + Supabase + React Router 8，遵循 `.agents/rules`），位于
`.agents/skills/create-form/templates/ProfileForm/`：

| 文件 | 作用 |
|---|---|
| `types.ts` | 实体 / 表单提交类型 / 枚举下拉 / 动态子项类型 |
| `service.ts` | 基于 `@/lib/supabase` 的详情 + 新增 + 更新 |
| `components/ProfileForm.tsx` | Form + Input / InputNumber / Radio / Select(multiple) / TextArea / Form.List 动态项 + 自定义 validator + 编辑回填 |
| `index.tsx` | 页面入口：加载详情 -> 编辑回填 -> 提交编排 |
| `tests/` | service 单测 + 组件测试（`.tsx` 后缀） |
| `README.md` | 复制改名 / 接线 / 校验要点 |

### 拼装流程

1. `cp -R .agents/skills/create-form/templates/ProfileForm src/pages/<Name>`，全局替换
   `Profile → <Name>`、`profile → <name>`、`profile_list → 实际表名`。
2. `types.ts` 定义实体与 `*FormValues` 提交类型、枚举下拉（禁止 any）。
3. `service.ts` 提供 `getDetail`（编辑回填）/ `create` / `update`，基于 `@/lib/supabase`。
4. `components/ProfileForm.tsx`：字段 + rules（必填/格式/自定义 validator）+ Form.List 动态项 +
   编辑回填（`useEffect(form.setFieldsValue(initialValues))`）+ 受控提交。
5. `index.tsx` 组装：加载详情回填，提交成功消息反馈 + 重置；注册懒加载路由。
6. `tests/` 复制改名，运行验证。

> 后端字段错误回显用 `form.setFields` 精确回填，避免全表单重校验。
> 动态项用 `Form.List`；测试文件用 `.tsx` 后缀（tsconfig 排除 `**/*.test.ts`）。

## 执行步骤

1. 确认字段定义、校验规则与提交目标方法（create / update）。
2. 从 `templates/ProfileForm` 复制改名，类型先行：定义 `types.ts` + `service.ts`。
3. 使用 Ant Design Form 生成表单组件，规则全部写入 `Form.Item rules`（含自定义 validator）。
4. 接入 Service 提交链路与错误回显；编辑态用 `setFieldsValue` 回填。
5. 生成组件测试（`.tsx` 后缀），复制到 `src/pages/_tplcheck` 运行
   `yarn vitest run` / `yarn eslint` / `yarn tsc --noEmit` 验证后删除，不改动既有业务代码。

## 产出物

- `src/pages/<Name>/` 下的表单组件（或表单子组件 + 页面）
- 对应 types、Service 方法（如缺失）
- 组件测试文件
*（内容由AI生成，仅供参考）*
*（内容由AI生成，仅供参考）*
