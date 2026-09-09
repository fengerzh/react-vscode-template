# TypeScript 类型规范

## 禁止 any

- **严禁使用 `any`**（含 `as any`、`@ts-ignore`）。
- 不确定类型时优先并依次尝试：
  1. `unknown` + 类型守卫（`typeof` / `in` / 自定义 `is` 守卫）收敛；
  2. 泛型约束；
  3. 显式联合类型 / 可辨识联合；
  4. 从已知接口推导并显式声明。
- 确属第三方无类型的边界（如部分历史遗留），用精确的最小子集类型 + 注释说明原因，禁止整段 `any`。

## API 响应显式类型

- **所有 API 响应必须有显式类型定义**，不得让请求返回隐式 `any`。
- 类型定义统一放置：
  - 跨模块共享：`src/types/<module>.ts`
  - 单模块内部：与 service 同目录的 `types.ts`
- 分页类响应使用统一泛型结构，例如：

```ts
interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
```

## 命名与声明约定

- 类型/接口使用 PascalCase；interface 用于对象契约，type 用于联合/元组/工具类型。
- 业务实体字段与后端字段对齐，字段语义清晰，不滥用中文注释掩盖命名。
- 函数参数与返回值都必须显式标注类型（禁止依赖 `noImplicitAny` 兜底放任）。
- 使用 `satisfies` 或显式注解而非隐式推导出过宽类型。

## 检查与工具

- 提交前确保 `tsc --noEmit` 通过（项目已在 `tsconfig.json` 开启 strict）。
- 遵守 ESLint 中 `@typescript-eslint/no-explicit-any` 等规则，`yarn eslint` 不应有新增告警。
*（内容由AI生成，仅供参考）*
