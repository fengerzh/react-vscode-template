/* eslint-env es2020 */
// 断言扩展（toBeInTheDocument 等）
import "@testing-library/jest-dom";
import { jest } from "@jest/globals";
import { TextEncoder, TextDecoder } from "util";

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
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
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
  value: jest.fn(),
});

// 不直接覆盖 window.location，保持 jsdom 默认实现

// 静音逻辑已提前放到文件顶部
