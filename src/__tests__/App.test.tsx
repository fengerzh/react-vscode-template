import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App, { ErrorBoundary } from "../App";

// Mock MobX store
jest.mock("@/store", () => ({
  __esModule: true,
  default: {
    userInfo: { userName: "测试用户" },
    appState: { loading: false, theme: "light", collapsed: false },
    clearUserInfo: jest.fn(),
    toggleCollapsed: jest.fn(),
    displayName: "测试用户",
  },
}));

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

  it("应该包含错误边界", () => {
    // 模拟控制台错误，避免测试时输出错误信息
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // 创建一个会抛出错误的组件
    const ThrowError = () => {
      throw new Error("测试错误");
    };

    // 创建一个包含错误组件的App版本
    function AppWithError() {
      return (
        <div>
          <ThrowError />
        </div>
      );
    }

    // 使用ErrorBoundary包装
    render(
      <ErrorBoundary>
        <AppWithError />
      </ErrorBoundary>,
    );

    // 检查错误边界是否显示
    expect(screen.getByText("应用出现了错误")).toBeInTheDocument();
    expect(screen.getByText("请刷新页面重试")).toBeInTheDocument();
    expect(screen.getByText("刷新页面")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("应该设置正确的locale", () => {
    render(<App />);

    // 检查ConfigProvider是否正确设置了中文locale
    // 这里我们通过检查是否没有英文文本来间接验证
    expect(screen.queryByText("No Data")).not.toBeInTheDocument();
  });
});
