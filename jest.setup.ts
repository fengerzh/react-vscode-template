// 静音 React act 的弃用 warning
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string"
    && args[0].includes("ReactDOMTestUtils.act")
  ) {
    return;
  }
  originalError(...args);
};
