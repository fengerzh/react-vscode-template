/* eslint-env es2020 */
// 断言扩展（toBeInTheDocument 等）
import "@testing-library/jest-dom/vitest";
import { vi, afterEach } from "vitest";
import { TextEncoder, TextDecoder } from "util";

// ============================================================
// React 19 + jsdom 兼容性修复：确保 window 在全局始终可用
// 防止 scheduler 异步任务中 window 变为 undefined
// ============================================================
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

// ============================================================

// ResizeObserver polyfill
class ResizeObserverPolyfill {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverPolyfill;

// Setup localStorage mock for zustand persist
const localStorageStore: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => localStorageStore[key] ?? null,
  setItem: (key: string, value: string) => { localStorageStore[key] = String(value); },
  removeItem: (key: string) => { delete localStorageStore[key]; },
  clear: () => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[key]); },
  length: 0,
  key: (_index: number) => null,
};
vi.stubGlobal("localStorage", mockLocalStorage);

// 先静音部分无关紧要的错误，避免在后续 mock 过程中出现噪声
const originalError: typeof console.error = console.error;
const shouldSilenceConsole = (args: unknown[]): boolean => {
  const text = args
    .map((a) => {
      // 更稳健地识别 Error-like 对象（跨 realm 不用 instanceof）
      if (
        a
        && typeof a === "object"
        && (
          Object.prototype.hasOwnProperty.call(a, "message")
          || Object.prototype.hasOwnProperty.call(a, "stack")
        )
      ) {
        const anyA = a as { message?: unknown; stack?: unknown };
        const parts = [anyA.message, anyA.stack]
          .filter((p) => typeof p === "string")
          .join(" ");
        if (parts) return parts as string;
      }
      if (typeof a === "string") return a;
      try {
        return JSON.stringify(a);
      } catch {
        return String(a);
      }
    })
    .join(" ");

  return [
    "ReactDOMTestUtils.act",
    "Not implemented: navigation",
    "API请求错误",
    "window.matchMedia is not a function",
    "window.getComputedStyle",
    // 预期内的接口失败场景（如 401）产生的 AxiosError 输出
    "AxiosError",
    "Request failed with status code 401",
    // React 19 scheduler 相关噪声
    "window is not defined",
  ].some((needle) => text.includes(needle));
};
console.error = (
  ...args: Parameters<typeof console.error>
) => {
  if (shouldSilenceConsole(args)) return;
  originalError(...args);
};

// 对 console.log 也应用相同的静音逻辑，避免噪声
const originalLog: typeof console.log = console.log;
console.log = (
  ...args: Parameters<typeof console.log>
) => {
  if (shouldSilenceConsole(args)) return;
  originalLog(...args);
};

// 添加全局polyfills
const g = global as unknown as {
  TextEncoder: typeof TextEncoder;
  TextDecoder: typeof TextDecoder;
};
g.TextEncoder = TextEncoder;
g.TextDecoder = TextDecoder;

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.getComputedStyle
Object.defineProperty(window, "getComputedStyle", {
  value: () => ({
    getPropertyValue: () => "",
    display: "none",
    visibility: "",
    opacity: "",
    flexDirection: "",
    justifyContent: "",
    alignItems: "",
  }),
});

// Mock scrollTo
Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
});

// 不直接覆盖 window.location，保持 jsdom 默认实现

// 静音逻辑已提前放到文件顶部

// ============================================================
// Supabase mock（全局唯一，所有测试文件复用）
// ============================================================
// 构建可链式调用的 mock query builder
function createMockQueryBuilder() {
  const builder: Record<string, ReturnType<typeof vi.fn>> = {};

  const chainMethods = ["select", "insert", "update", "delete", "upsert", "eq", "ilike", "order"];
  for (const m of chainMethods) {
    builder[m] = vi.fn(() => builder);
  }

  // range 和 single 是终止方法，返回默认结果
  builder.range = vi.fn().mockResolvedValue({ data: [], count: 0, error: null });
  builder.single = vi.fn().mockResolvedValue({ data: null, error: null });

  return builder;
}

const queryBuilder = createMockQueryBuilder();

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn(() => queryBuilder),
    // 暴露 queryBuilder 上的链式方法供 from() 返回
    select: queryBuilder.select,
    insert: queryBuilder.insert,
    update: queryBuilder.update,
    delete: queryBuilder.delete,
    upsert: queryBuilder.upsert,
    eq: queryBuilder.eq,
    ilike: queryBuilder.ilike,
    order: queryBuilder.order,
    range: queryBuilder.range,
    single: queryBuilder.single,
  },
}));

// ============================================================
// 全局测试清理：防止 React 19 scheduler 异步任务导致 unhandled error
// ============================================================
afterEach(() => {
  // 清理所有定时器
  vi.useRealTimers();
});
