# 架构分层规则

## 三层职责边界

### Page 层（页面/视图）

- 位于 `src/pages`，按路由模块组织。
- 职责：组合 UI 组件、绑定用户交互、消费 Service 层返回值渲染视图。
- 禁止：直接调用 HTTP API、直接操作全局请求封装。

### Service 层（业务服务）

- 位于 `src/services`。
- 职责：封装对 HTTP API 的请求，处理参数组装、鉴权头、响应/错误归一化，返回类型化的结果。
- 页面/组件只依赖 Service 层接口，不感知请求细节。

### API 层（请求基础）

- 位于 `src/lib` 或由统一的请求实例（如 `src/lib/request.ts`）承担。
- 职责：HTTP 客户端配置、拦截器（token、统一错误提示）、基础类型（分页响应、通用响应结构）。

## 数据流

```
Component/Page  →  Service 方法  →  API/HTTP 客户端  →  后端接口
                     ↑                    ↓
                  类型化返回  ←  类型化响应（src/types）
```

- 数据一律"向下发起、向上返回类型化结果"。
- 页面不关心 HTTP 细节；Service 不关心 UI 细节。

## 状态管理分界

- **Zustand（`src/store`）**：跨页共享的全局状态，如用户信息、全局配置、跨模块缓存数据。
- **React 局部状态（`useState` / `useReducer`）**：仅组件内部需要的 UI 状态，如表单值、弹窗开关、选中项。**禁止**把局部状态塞进全局 store。

## 目录结构约定

```
src/
├── pages/       # 路由页面组件
├── services/    # 各模块 Service（封装请求）
├── store/       # Zustand 全局状态
├── types/       # 全局共享类型定义
├── lib/         # 基础设施（请求实例、工具函数）
├── routes/      # 路由配置
└── components/  # 可复用组件
```

- 新增业务模块时，页面放 `src/pages/<Module>/`，Service 放 `src/services/<module>.ts`，类型放 `src/types/<module>.ts`。
*（内容由AI生成，仅供参考）*
