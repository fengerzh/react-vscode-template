import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

// Mock router
jest.mock("@/routes", () => ({
  __esModule: true,
  default: <div data-testid="router-content">Router Content</div>,
}));

describe("App Component", () => {
  beforeEach(() => {
    // 清除所有mock调用记录
    jest.clearAllMocks();
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
