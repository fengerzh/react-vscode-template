import { describe, it, expect } from "vitest";
import App from "../App";

describe("App Component", () => {
  it("App component should be defined", () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe("function");
  });
});