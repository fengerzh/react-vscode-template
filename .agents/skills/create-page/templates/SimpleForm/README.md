---
# SimpleForm：简单表单型页面模板使用说明

本目录是 create-page 技能「简单表单型」可复制骨架（反馈 Feedback 示例），落点在
`.agents/skills/create-page/templates/SimpleForm/`。配套另一份骨架 `../ListDetail/`
（列表详情型页面）。

> 定位区分：这是「独立路由表单页」骨架（页面层级），与 create-form 技能的「大表单
> + 编辑回填 + 复杂控件」互补；做完整增删改查模块请直接用 create-crud。

## 一、复制与改名

```bash
cp -R .agents/skills/create-page/templates/SimpleForm src/pages/<Name>
# 全局替换：Feedback -> <Name>（PascalCase）、feedback -> <name>（camelCase）、
# feedback_list -> 实际表名
```

替换后校验：`grep -rn "feedback\|Feedback" src/pages/<Name>` 不应再有残留（表名除外）。

## 二、文件清单与拼装顺序

| 文件 | 作用 | 复制后需调整 |
|---|---|---|
| `types.ts` | 实体 / 表单提交类型 / 枚举下拉 | 实体字段、`FeedbackFormValues`、`FEEDBACK_CATEGORIES` |
| `service.ts` | 基于 `@/lib/supabase` 的提交方法 | `TABLE` 表名、写入字段、方法名 |
| `components/FeedbackForm.tsx` | Ant Design Form + 校验 + 受控提交 | 表单项（控件、rules）、提交按钮文案 |
| `index.tsx` | 页面入口：卡片 + 提交编排 | 页面标题 |

## 三、接线 route（懒加载）

```tsx
const Feedback = lazy(() => import('@/pages/Feedback'));
// { name: '意见反馈', path: 'feedback', key: 'feedback', component: Feedback }
```

## 四、测试

```bash
cp -R .agents/skills/create-page/templates/SimpleForm/tests src/pages/<Name>/tests
yarn test src/pages/<Name>
yarn eslint src/pages/<Name>
yarn tsc --noEmit
```

## 五、架构约定

- 表单只收集值，提交走 `service.ts`；成功动作（消息、重置、跳转）由页面层编排。
- 出入参显式类型，禁止 `any`（测试 mock 边界除外）。
*（内容由AI生成，仅供参考）*
