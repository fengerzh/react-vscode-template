---
# ProfileForm：大表单模板使用说明（create-form）

本目录是 create-form 技能的**可直接复制改名骨架**，落点在
`.agents/skills/create-form/templates/ProfileForm/`。演示了 Ant Design Form 页面骨架：
Form + 校验规则 + 提交链路 Page→Service→API、编辑回填、消息反馈、动态字段（Form.List）。
整套代码对齐项目技术栈（React 19 + TypeScript 6 + Ant Design 6 + Supabase + React Router 8）。

## 一、复制与改名

```bash
cp -R .agents/skills/create-form/templates/ProfileForm src/pages/<Name>
# 全局替换：Profile -> <Name>（PascalCase）、profile -> <name>（camelCase）、
# profile_list -> 实际表名
```

替换后校验：`grep -rn "profile\|Profile" src/pages/<Name>` 不应再有残留（表名除外）。

## 二、文件清单与拼装顺序

| 文件 | 作用 | 复制后需调整 |
|---|---|---|
| `types.ts` | 实体 / 表单提交类型 / 枚举下拉 / 动态子项类型 | 字段、`ProfileFormValues`、`PROFILE_ROLES` |
| `service.ts` | 基于 `@/lib/supabase` 的详情 + 增改 | `TABLE` 表名、写入字段、方法名 |
| `components/ProfileForm.tsx` | Form（控件/校验/Form.List/回填/受控提交） | 表单项、rules、动态字段名 |
| `index.tsx` | 页面入口：加载详情回填 + 提交编排 | 页面标题、编辑 id 来源 |

## 三、接线 route（懒加载）

```tsx
const Profile = lazy(() => import('@/pages/Profile'));
// { name: '个人资料', path: 'profile', key: 'profile', component: Profile }
```

> 示例中 `EDIT_ID = 1` 写死做编辑回填；真实业务改为从路由参数（React Router useParams）读取。

## 四、校验规则与回填要点

- 必填/格式/自定义校验全部写在 `Form.Item rules`；自定义校验用 `validator`（如"姓名不能为 admin"）。
- 编辑回填：页面加载详情后通过 `initialValues` 传入，`ProfileForm` 内
  `useEffect(() => form.setFieldsValue(initialValues))` 精确回填，避免全表单重校验。
- 动态项用 `Form.List`（如技能清单），支持增删行；后端错误回显可改用 `form.setFields` 精确回填。
- 提交链路：`onSubmit` 上抛校验后的值 → 页面调 service（create/update）→ 成功消息 + 重置。

## 五、测试

```bash
cp -R .agents/skills/create-form/templates/ProfileForm/tests src/pages/<Name>/tests
yarn test src/pages/<Name>
yarn eslint src/pages/<Name>
yarn tsc --noEmit
```

- `tests/service.test.tsx`：mock `@/lib/supabase`（复用 `vitest.setup.ts` 全局 mock）。
- `tests/ProfileForm.test.tsx`：覆盖编辑回填、必填校验、自定义校验、合法提交、Form.List 增行。
- 测试文件一律 `.tsx` 后缀（tsconfig 排除 `**/*.test.ts`）。

## 六、架构约定

- 表单只收集值，提交走 `service.ts`；页面层负责消息反馈与重置/跳转。
- 出入参显式类型，禁止 `any`（测试 mock 边界除外）。
- 页内状态留 React 局部状态，跨页共享才入 Zustand。
*（内容由AI生成，仅供参考）*
