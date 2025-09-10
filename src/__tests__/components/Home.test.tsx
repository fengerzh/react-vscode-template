import React from "react";
import {
  render, screen, fireEvent, waitFor,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import {
  jest, describe, it, expect, beforeEach,
} from "@jest/globals";
import { AxiosResponse } from "axios";
import { message } from "antd";
import * as services from "@/services";
import { PaginatedResponse, User } from "@/services";
import Home from "../../pages/home";

// 辅助函数来处理jest-dom断言
const expectToBeInDocument = (element: HTMLElement) => {
  (expect(element) as unknown as { toBeInTheDocument(): void }).toBeInTheDocument();
};

const { getUsers } = jest.mocked(services);

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
jest.mock("@/services", () => ({
  getUsers: jest.fn(),
  User: {},
}));

// Mock antd message
jest.mock("antd", () => {
  const actual = jest.requireActual("antd") as Record<string, unknown>;
  return {
    ...actual,
    message: {
      error: jest.fn(),
      success: jest.fn(),
      info: jest.fn(),
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
  const mockMessage = jest.mocked(message);

  beforeEach(() => {
    jest.clearAllMocks();
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
    expectToBeInDocument(screen.getByText("用户管理"));
    expectToBeInDocument(screen.getByText(/管理系统用户信息/));
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
    expectToBeInDocument(screen.getByText("用户管理"));
    expectToBeInDocument(screen.getByText(/管理系统用户信息/));
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
      expectToBeInDocument(screen.getByText("新建用户"));
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
    expectToBeInDocument(screen.getByText("网站"));
    expectToBeInDocument(screen.getByText("首页"));
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
      expectToBeInDocument(screen.getByText("张三"));
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
      expectToBeInDocument(screen.getByText("张三"));
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
      expectToBeInDocument(screen.getByText("新建用户"));
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
