import React from "react";
import {
  render, screen, fireEvent, waitFor,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { AxiosResponse } from "axios";
import { message } from "antd";
import * as services from "@/services";
import { PaginatedResponse, User } from "@/services";
import Home from "../../pages/home";

const { getUsers } = vi.mocked(services);

// 创建完整的 AxiosResponse mock 辅助函数
const createMockResponse = <T, >(data: T): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config: {} as AxiosResponse<T>["config"],
  request: {},
});

// Mock services
vi.mock("@/services", () => ({
  getUsers: vi.fn(),
  User: {},
}));

// Mock antd message
vi.mock("antd", async () => {
  const actual = await vi.importActual("antd") as Record<string, unknown>;
  return {
    ...actual,
    message: {
      error: vi.fn(),
      success: vi.fn(),
      info: vi.fn(),
    },
  };
});

// 包装组件以提供必要的context
const renderWithRouter = (component: React.ReactElement) => render(
  <BrowserRouter>
    {component}
  </BrowserRouter>,
);

describe("Home Component", () => {
  // 获取mock的引用
  const mockMessage = vi.mocked(message);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("应该正确渲染Home组件", () => {
    // Mock成功的API响应
    getUsers.mockResolvedValue(
      createMockResponse<PaginatedResponse<User>>({
        data: [
          {
            id: 1, name: "张三", age: 18, birthday: "2005-01-01",
          },
          {
            id: 2, name: "李四", age: 20, birthday: "2003-05-15",
          },
        ],
        total: 2,
        success: true,
      }),
    );

    renderWithRouter(<Home />);

    // 检查页面标题
    expect(screen.getByText("用户管理")).toBeInTheDocument();
    expect(screen.getByText(/管理系统用户信息/)).toBeInTheDocument();
  });

  it("应该显示基本页面元素", () => {
    getUsers.mockResolvedValue(
      createMockResponse<PaginatedResponse<User>>({
        data: [],
        total: 0,
        success: true,
      }),
    );

    renderWithRouter(<Home />);

    // 检查页面标题和基本元素
    expect(screen.getByText("用户管理")).toBeInTheDocument();
    expect(screen.getByText(/管理系统用户信息/)).toBeInTheDocument();
    expect(screen.getAllByText("姓名")).toHaveLength(3); // 搜索表单、表格头和内部渲染都有
    expect(screen.getAllByText("年龄")).toHaveLength(3); // 搜索表单、表格头和内部渲染都有
  });

  it("应该显示新建用户按钮", async () => {
    getUsers.mockResolvedValue(
      createMockResponse<PaginatedResponse<User>>({
        data: [],
        total: 0,
        success: true,
      }),
    );

    renderWithRouter(<Home />);

    // 等待组件完全渲染
    await waitFor(() => {
      expect(screen.getByText("新建用户")).toBeInTheDocument();
    });
  });

  it("应该显示面包屑导航", () => {
    getUsers.mockResolvedValue(
      createMockResponse<PaginatedResponse<User>>({
        data: [],
        total: 0,
        success: true,
      }),
    );

    renderWithRouter(<Home />);

    // 检查面包屑
    expect(screen.getByText("网站")).toBeInTheDocument();
    expect(screen.getByText("首页")).toBeInTheDocument();
  });

  it("应该正确调用getUsers API", async () => {
    getUsers.mockResolvedValue(
      createMockResponse<PaginatedResponse<User>>({
        data: [
          { id: 1, name: "张三", age: 18 },
        ],
        total: 1,
        success: true,
      }),
    );

    renderWithRouter(<Home />);

    // 等待API调用
    await waitFor(() => {
      expect(getUsers).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it("应该处理编辑按钮点击", async () => {
    const mockData = [
      {
        id: 1, name: "张三", age: 18, birthday: "2005-01-01", email: "zhangsan@example.com",
      },
    ];

    getUsers.mockResolvedValue(
      createMockResponse<PaginatedResponse<User>>({
        data: mockData,
        total: 1,
        success: true,
      }),
    );

    renderWithRouter(<Home />);

    // 等待数据加载和表格渲染
    await waitFor(() => {
      expect(screen.getByText("张三")).toBeInTheDocument();
    });

    // 查找编辑按钮并点击
    const editButton = screen.getByText("编辑");
    fireEvent.click(editButton);

    // 验证message.info被调用
    expect(mockMessage.info).toHaveBeenCalledWith("编辑用户: 张三");
  });

  it("应该处理删除按钮点击", async () => {
    const mockData = [
      {
        id: 1, name: "张三", age: 18, birthday: "2005-01-01", email: "zhangsan@example.com",
      },
    ];

    getUsers.mockResolvedValue(
      createMockResponse<PaginatedResponse<User>>({
        data: mockData,
        total: 1,
        success: true,
      }),
    );

    renderWithRouter(<Home />);

    // 等待数据加载和表格渲染
    await waitFor(() => {
      expect(screen.getByText("张三")).toBeInTheDocument();
    });

    // 查找删除按钮并点击
    const deleteButton = screen.getByText("删除");
    fireEvent.click(deleteButton);

    // 等待删除操作完成
    await waitFor(() => {
      expect(mockMessage.success).toHaveBeenCalledWith("用户删除成功");
    }, { timeout: 2000 });
  });

  it("应该处理新建用户按钮点击", async () => {
    getUsers.mockResolvedValue(
      createMockResponse<PaginatedResponse<User>>({
        data: [],
        total: 0,
        success: true,
      }),
    );

    renderWithRouter(<Home />);

    // 等待组件完全渲染
    await waitFor(() => {
      expect(screen.getByText("新建用户")).toBeInTheDocument();
    });

    // 点击新建用户按钮
    const addButton = screen.getByText("新建用户");
    fireEvent.click(addButton);

    // 等待添加操作完成
    await waitFor(() => {
      expect(mockMessage.success).toHaveBeenCalledWith("用户添加成功");
    }, { timeout: 2000 });
  });
});