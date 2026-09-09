---
# create-api 模板使用说明

本目录是 create-api 技能的**可直接复制改名骨架**，落点在
`.agents/skills/create-api/templates/`：一份基于 `@/lib/supabase` 的 service 方法集
+ 配套 types + 单测，覆盖现代业务最常用的 7 类方法。

## 一、复制与改名

```bash
# 复制两份到业务模块
cp -R .agents/skills/create-api/templates/service.ts src/services/<name>.ts
cp -R .agents/skills/create-api/templates/types.ts   src/types/<name>.ts
# 全局替换：Task -> <Name>（PascalCase）、task -> <name>（camelCase）、task_list -> 实际表名
```

替换后校验：`grep -rn "task\|Task" src/services/<name>.ts src/types/<name>.ts`
不应再有残留（表名除外）。

## 二、方法清单与 supabase 链式对照

| 方法 | 后端语义 | supabase 链式 | 复制后需调整 |
|---|---|---|---|
| `getXxxList` | 分页 + 筛选 | `select('*',{count:'exact'})` + 条件过滤 + `order` + `range` | 筛选字段与匹配方式（ilike/eq）、排序字段 |
| `getXxxDetail` | 详情 | `select('*').eq('id',id).single()` | — |
| `createXxx` | 新增 | `insert(input).select().single()` | 写入字段 |
| `updateXxx` | 更新 | `update(input).eq('id',id).select().single()` | 更新字段 |
| `removeXxx` | 删除 | `delete().eq('id',id)` | — |
| `batchRemoveXxx` | 批量删除 | `delete().in('id',ids)` | — |
| `batchUpdateXxxStatus` 等 | 批量更新 | `update({...}).in('id',ids)` | 批量字段语义 |

## 三、服务层约定

- 统一入口 `@/lib/supabase`（`src/lib/supabase.ts`），禁止散发热请求封装。
- 统一错误处理：`if (error) throw error`；数据缺失再抛业务异常；不吞错、不空返回。
- 出入参显式类型，统一引用 `src/types/<module>.ts`，**禁止 `Promise<any>`**。
- 方法名统一动词前缀：`getList` / `getDetail` / `createXxx` / `updateXxx` / `removeXxx` /
  `batch*`。
- 分页语义：`current` 从 1 开始，`range` 换算 `(current-1)*pageSize ~ current*pageSize-1`。

## 四、测试

```bash
cp -R .agents/skills/create-api/templates/tests src/services/__tests__  # 或业务模块 tests/
yarn test src/services/<name>   # 按实际路径调整
yarn eslint src/services/<name> src/types/<name>
yarn tsc --noEmit
```

`tests/service.test.tsx` 覆盖每个方法成功分支 + 错误分支，用 mock 链式 builder
注入返回值（Mock 边界允许 `as any` 并附 eslint-disable）。

> 测试文件用 `.tsx` 后缀（tsconfig 排除 `**/*.test.ts`）；空 ID 列表时批量方法
> 短路不请求的守护逻辑已被测试覆盖。
*（内容由AI生成，仅供参考）*
