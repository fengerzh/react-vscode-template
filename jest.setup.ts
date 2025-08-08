// 添加全局polyfills
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

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

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock scrollTo
Object.defineProperty(window, "scrollTo", {
  value: jest.fn(),
});

// Mock window.location
delete (window as any).location;
(window as any).location = {
  href: "",
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  pathname: "/",
  search: "",
  hash: "",
  host: "localhost",
  hostname: "localhost",
  port: "",
  protocol: "http:",
  origin: "http://localhost",
};

// 静音 React act 的弃用 warning
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("ReactDOMTestUtils.act") ||
     args[0].includes("Not implemented: navigation") ||
     args[0].includes("API请求错误") ||
     args[0].includes("window.matchMedia is not a function") ||
     args[0].includes("window.getComputedStyle"))
  ) {
    return;
  }
  originalError(...args);
};
