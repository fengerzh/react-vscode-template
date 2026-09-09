# API 层规范

## 分层定位

- API/HTTP 细节只出现在 `src/lib` 的统一请求实例与 Service 层。
- **页面组件禁止直接发起 HTTP 请求**，一律经由 Service 方法。

## Service 层封装要求

- 每个业务模块对应一个 Service 文件，如 `src/services/customer.ts`。
- Service 方法命名体现动作：`getList`、`getDetail`、`create`、`update`、`remove`、`delete`。
- 方法签名：显式入参类型 + 显式返回类型（来自 `src/types` 或模块 `types.ts`）。

```ts
// 示例
export async function getCustomerList(params: CustomerQuery): Promise<PageResult<Customer>> {
  return request.get<PageResult<Customer>>('/api/customers', { params });
}
```

## 错误处理

- 统一在请求实例（拦截器）中处理：网络错误、非 2xx、业务错误码（如 `code !== 0`）统一抛出或提示。
- Service 层可捕获并按业务需要重抛或转换错误信息，但**不要吞掉错误静默返回**。
- 组件层通过 try/catch 或统一的错误提示组件接收失败反馈。

## 类型化响应

- 使用泛型固定响应结构：`request.get<T>(url)` 中 `T` 必须显式给出，禁止返回 `Promise<any>`。
- 响应包装结构（`ApiResponse<T>` / `PageResult<T>`）若有抽离，统一引用 `src/types/api.ts` 中的定义，不重复声明。

## 其他约定

- 鉴权 token、公共 headers 统一在请求拦截器注入，不在每个调用点重复拼装。
- 请求路径统一相对路径或与后端约定的 baseURL 前缀，避免硬编码主机地址。
- 新增接口时同步补对应 Service 方法，不鼓励组件内联请求逻辑。
*（内容由AI生成，仅供参考）*
