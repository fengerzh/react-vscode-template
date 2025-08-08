import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Home from "../../pages/home";

// Mock services
jest.mock("@/services", () => ({
  getUsers: jest.fn(),
  User: {},
}));

// Mock antd message
jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  message: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

const { getUsers } = require("@/services");

// 包装组件以提供必要的context
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("应该正确渲染Home组件", () => {
    // Mock成功的API响应
    getUsers.mockResolvedValue({
      data: {
        data: [
          { id: 1, name: "张三", age: 18, birthday: "2005-01-01" },
          { id: 2, name: "李四", age: 20, birthday: "2003-05-15" },
        ],
        total: 2,
        success: true,
      },
    });

    renderWithRouter(<Home />);

    // 检查页面标题
    expect(screen.getByText("用户管理")).toBeInTheDocument();
    expect(screen.getByText("管理系统用户信息")).toBeInTheDocument();
  });

  it("应该显示基本页面元素", () => {
    getUsers.mockResolvedValue({
      data: {
        data: [],
        total: 0,
        success: true,
      },
    });

    renderWithRouter(<Home />);

    // 检查页面标题和基本元素
    expect(screen.getByText("用户管理")).toBeInTheDocument();
    expect(screen.getByText("管理系统用户信息")).toBeInTheDocument();
    expect(screen.getAllByText("姓名")).toHaveLength(2); // 搜索表单和表格头都有
    expect(screen.getAllByText("年龄")).toHaveLength(2); // 搜索表单和表格头都有
  });

  it("应该显示新建用户按钮", async () => {
    getUsers.mockResolvedValue({
      data: {
        data: [],
        total: 0,
        success: true,
      },
    });

    renderWithRouter(<Home />);

    // 等待组件完全渲染
    await waitFor(() => {
      expect(screen.getByText("新建用户")).toBeInTheDocument();
    });
  });

  it("应该显示面包屑导航", () => {
    getUsers.mockResolvedValue({
      data: {
        data: [],
        total: 0,
        success: true,
      },
    });

    renderWithRouter(<Home />);

    // 检查面包屑
    expect(screen.getByText("网站")).toBeInTheDocument();
    expect(screen.getByText("首页")).toBeInTheDocument();
  });

  it("应该正确调用getUsers API", async () => {
    getUsers.mockResolvedValue({
      data: {
        data: [
          { id: 1, name: "张三", age: 18 },
        ],
        total: 1,
        success: true,
      },
    });

    renderWithRouter(<Home />);

    // 等待API调用
    await waitFor(() => {
      expect(getUsers).toHaveBeenCalled();
    }, { timeout: 3000 });
  });
});
