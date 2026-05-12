// 全局设置：在测试运行之前执行
export default function setup() {
  // 确保 window 和 global 在全局始终可用
  if (typeof globalThis.window === "undefined") {
    // @ts-expect-error jsdom 环境下 window 应该存在
    globalThis.window = globalThis as unknown as Window & typeof globalThis;
  }
  if (typeof globalThis.document === "undefined") {
    // @ts-expect-error jsdom 环境下 document 应该存在
    globalThis.document = window.document;
  }
  // 确保 global 指向 window（React 19 scheduler 需要）
  // @ts-expect-error 兼容性修复
  if (!globalThis.global) globalThis.global = globalThis;
  // 确保 window.event 始终可用（React 19 scheduler 需要）
  // @ts-expect-error 兼容性修复
  if (!globalThis.window.event) globalThis.window.event = undefined;
}
