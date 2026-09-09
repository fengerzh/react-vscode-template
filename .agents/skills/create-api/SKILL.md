---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 23869ad2059d2f9bd8217a2b1df9bfc2_c1a927feac2811f18f50525400aeaaa3
    ReservedCode1: ZR9JETF29yQilTFEmSBG+P0PsmOgt+pTjDwr1w/yjhrXlNvdI4qB/du3GIOkIFrGCcbzhRpAVIhA/yb6ZrTybktjKyavDZxBnW4fdNSh+cK5Qpr20HCGeQpbr5H/od+tE44WIxVMa7MVxe3mu2hqt1Ay5p5gtl0KiqFL8xko4LZ24gaxuXXz+I/Oq/0=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 23869ad2059d2f9bd8217a2b1df9bfc2_c1a927feac2811f18f50525400aeaaa3
    ReservedCode2: ZR9JETF29yQilTFEmSBG+P0PsmOgt+pTjDwr1w/yjhrXlNvdI4qB/du3GIOkIFrGCcbzhRpAVIhA/yb6ZrTybktjKyavDZxBnW4fdNSh+cK5Qpr20HCGeQpbr5H/od+tE44WIxVMa7MVxe3mu2hqt1Ay5p5gtl0KiqFL8xko4LZ24gaxuXXz+I/Oq/0=
---

# 技能：创建 API/Service 方法（create-api）

## name

create-api

## description

为业务模块在 services 层创建标准化的请求方法，涵盖分页列表、详情、增删改查，保证类型安全与统一错误处理。

## 触发场景

- 需要新增后端接口对应的前端调用方法。
- 用户要求"加一个接口方法"、"写 Service"、"给 X 模块配 API"。

## 标准写法（基于项目真实数据源 @/lib/supabase）

Service 全部基于 `src/lib/supabase.ts` 导出的 `supabase` 客户端。模板见下方
`templates/service.ts`（Task 示例）与 `templates/types.ts`。

### 分页列表

```ts
export async function getTaskList(params: TaskQuery = {}): Promise<PaginatedResult<Task>> {
  const { current = 1, pageSize = 10 } = params;
  let query = supabase.from(TABLE).select('*', { count: 'exact' });
  if (params.title) query = query.ilike('title', `%${params.title}%`); // 模糊筛选
  if (params.status) query = query.eq('status', params.status);        // 精确筛选
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range((current - 1) * pageSize, current * pageSize - 1);
  if (error) throw error;
  return { data: (data ?? []) as Task[], total: count ?? 0, current, pageSize };
}
```

### 详情

```ts
export async function getTaskDetail(id: number): Promise<Task> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  if (!data) throw new Error(`任务不存在: ${id}`);
  return data as Task;
}
```

### 新增 / 更新 / 删除 / 批量

```ts
export const createTask = async (input: TaskCreateInput): Promise<Task> => {
  const { data, error } = await supabase.from(TABLE).insert(input).select().single();
  if (error) throw error;
  if (!data) throw new Error('新增失败');
  return data as Task;
};

export const updateTask = async (id: number, input: TaskUpdateInput): Promise<Task> => {
  const { data, error } = await supabase.from(TABLE).update(input).eq('id', id).select().single();
  if (error) throw error;
  if (!data) throw new Error(`更新失败: ${id}`);
  return data as Task;
};

export const removeTask = async (id: number): Promise<void> => {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
};

export const batchRemoveTasks = async (ids: number[]): Promise<void> => {
  if (ids.length === 0) return; // 空列表短路，不请求
  const { error } = await supabase.from(TABLE).delete().in('id', ids);
  if (error) throw error;
};
```

## 模板使用指引

本技能附带一套**可直接复制改名**的 service 方法集骨架，位于
`.agents/skills/create-api/templates/`：

| 文件 | 作用 |
|---|---|
| `templates/service.ts` | 7 类标准方法：分页列表 / 详情 / create / update / remove / 批量删除 / 批量更新，含统一错误处理 |
| `templates/types.ts` | 实体 + 分页查询参数 + 分页响应结构 + 枚举下拉，禁止 any |
| `templates/tests/service.test.tsx` | 全方法成功/错误分支单测（mock supabase，`.tsx` 后缀） |
| `templates/README.md` | 复制改名 / 方法与 supabase 链式对照表 / 测试运行 |

### 拼装流程

1. `cp templates/service.ts src/services/<name>.ts`、`cp templates/types.ts src/types/<name>.ts`。
2. 全局替换 `Task → <Name>`、`task → <name>`、`task_list → 实际表名`。
3. `types.ts` 调整实体字段 / 查询筛选参数 / 枚举；`service.ts` 调整筛选字段与匹配方式、排序。
4. 复制 `tests/` 改名（`*.test.tsx`），运行验证。

## 规范

- Service 文件位于 `src/services/<module>.ts`，一个模块一个文件；统一入口 `@/lib/supabase`。
- 方法名统一动词前缀：`getList` / `getDetail` / `createXxx` / `updateXxx` / `removeXxx` / `batch*`。
- 入参、出参显式类型，统一引用 `src/types/<module>.ts` 的类型；**禁止返回 `Promise<any>`**。
- 统一错误处理：`if (error) throw error`，数据缺失再抛业务异常；不吞错、不空返回；
  幂等批量（如批量删除）对空 ID 列表短路。
- 新增方法后，为其补单元测试（mock supabase 链式 builder，断言入参与返回）。

## 执行步骤

1. 确认模块名与数据源表契约（表名、字段、筛选/排序、批量语义）。
2. 从 `templates/` 复制改名，先在 `src/types/<module>.ts` 补齐入参/响应类型。
3. 在 `src/services/<module>.ts` 写入标准方法（supabase 链式，见上）。
4. 复制 `tests/` 补单测，复制到校验目录跑 `yarn vitest run` / `yarn eslint` /
   `yarn tsc --noEmit` 通过后删除，不改动既有业务代码。

## 产出物

- `src/services/<module>.ts` 中的标准方法
- `src/types/<module>.ts` 类型补充
- 对应单元测试
*（内容由AI生成，仅供参考）*
*（内容由AI生成，仅供参考）*
