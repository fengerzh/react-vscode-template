# React 19 编码规范

项目现状：Vite 8 + React 19 + TypeScript 6 + Ant Design 6。

## Hooks 规范

- 遵循 React 官方 Hooks 规则：不再循环/条件/嵌套函数中调用 Hooks。
- 状态派生值优先用 `useMemo`/`useCallback`，但**不要过度 memo**——仅在计算昂贵或作为依赖频繁触发重渲染时使用。
- 副作用一律放 `useEffect`，清理函数必须正确返回；`useEffect` 依赖数组必须完整且明确。
- 自定义 Hooks 统一命名 `useXxx`，放在模块内或 `src/lib/hooks`，保持单一职责。

## 组件组织

- 函数组件 + Hooks，**不使用 class 组件**。
- 组件保持小而专一，一个文件一个主要组件；页面按 containers/components 拆分。
- UI 组件优先使用 Ant Design 组件，**不引入第二套 UI 框架**。
- 组件 props 用 TypeScript 定义，命名以 `XxxProps` 结尾。
- 文件命名：组件使用 PascalCase，如 `EditModal.tsx`。

## 性能约束

- 大列表使用 Ant Design 的虚拟滚动或分页承载，避免一次性渲染海量 DOM。
- 请求数据放入 `useEffect` + Service 调用，服务端返回数据用显式类型接收。
- 避免在渲染函数体内创建新对象/数组作为 `useMemo`/`useEffect` 依赖造成死循环。
- 全局状态只取所需子集（Zustand 选择器），避免组件无谓重渲染。

## 交互与可访问性

- 表单与弹窗交互沿用 Ant Design 约定（Form、Modal、Drawer）。
- 为可点击元素提供合理的文字/aria 标注，保障基础可访问性。
*（内容由AI生成，仅供参考）*
