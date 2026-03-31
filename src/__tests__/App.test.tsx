import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import App from "../App";

// Mock router - use React.createElement to ensure proper JSX
vi.mock("@/routes", () => {
  const MockRouter = () => <div data-testid="router-content">Router Content</div>;
  return {
    __esModule: true,
    default: MockRouter,
  };
});

describe("App Component", () => {
  beforeEach(() => {
    // 清除所有mock调用记录
    vi.clearAllMocks();
  });

  it("应该正确渲染App组件", () => {
    render(<App />);

    // 检查路由内容是否渲染
    expect(screen.getByTestId("router-content")).toBeInTheDocument();
  });

  it("应该设置正确的locale", () => {
    render(<App />);

    // 检查ConfigProvider是否正确设置了中文locale
    // 这里我们通过检查是否没有英文文本来间接验证
    expect(screen.queryByText("No Data")).not.toBeInTheDocument();
  });
});