import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { AxiosResponse } from "axios";
import { message } from "antd";
import * as services from "@/services";
import { PaginatedResponse, User } from "@/services";
import Home from "../../pages/home";

const { getUsers } = vi.mocked(services);

const createMockResponse = <T, >(data: T): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config: {} as AxiosResponse<T>["config"],
  request: {},
});

vi.mock("@/services", () => ({
  getUsers: vi.fn(),
  User: {},
}));

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

const renderWithRouter = (component: React.ReactElement) => render(
  <BrowserRouter>{component}</BrowserRouter>,
);

describe("Home Component", () => {
  const mockMessage = vi.mocked(message);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("应该正确渲染Home组件", () => {
    getUsers.mockResolvedValue(
      createMockResponse<PaginatedResponse<User>>({
        data: [{ id: 1, name: "张三", age: 18, birthday: "2005-01-01" }],
        total: 1,
        success: true,
      }),
    );
    renderWithRouter(<Home />);
    expect(screen.getAllByText("用户管理").length).toBeGreaterThan(0);
  });

  it("应该正确调用getUsers API", async () => {
    getUsers.mockResolvedValue(
      createMockResponse<PaginatedResponse<User>>({
        data: [{ id: 1, name: "张三", age: 18 }],
        total: 1,
        success: true,
      }),
    );
    renderWithRouter(<Home />);
    await waitFor(() => expect(getUsers).toHaveBeenCalled(), { timeout: 3000 });
  });

  it("应该处理编辑按钮点击", async () => {
    getUsers.mockResolvedValue(
      createMockResponse<PaginatedResponse<User>>({
        data: [{ id: 1, name: "张三", age: 18, birthday: "2005-01-01", email: "test@test.com" }],
        total: 1,
        success: true,
      }),
    );
    renderWithRouter(<Home />);
    await waitFor(() => expect(screen.getAllByText("张三").length).toBeGreaterThan(0));
    const editButtons = screen.getAllByText("编辑");
    editButtons[0].click();
    expect(mockMessage.info).toHaveBeenCalledWith("编辑用户: 张三");
  });

  it("应该处理删除按钮点击", async () => {
    getUsers.mockResolvedValue(
      createMockResponse<PaginatedResponse<User>>({
        data: [{ id: 1, name: "张三", age: 18, birthday: "2005-01-01", email: "test@test.com" }],
        total: 1,
        success: true,
      }),
    );
    renderWithRouter(<Home />);
    await waitFor(() => expect(screen.getAllByText("张三").length).toBeGreaterThan(0));
    const deleteButtons = screen.getAllByText("删除");
    deleteButtons[0].click();
    await waitFor(() => expect(mockMessage.success).toHaveBeenCalledWith("用户删除成功"), { timeout: 2000 });
  });

  it("应该处理新建用户按钮点击", async () => {
    getUsers.mockResolvedValue(
      createMockResponse<PaginatedResponse<User>>({ data: [], total: 0, success: true }),
    );
    renderWithRouter(<Home />);
    await waitFor(() => expect(screen.getAllByText("新建用户").length).toBeGreaterThan(0));
    const addButtons = screen.getAllByText("新建用户");
    addButtons[0].click();
    await waitFor(() => expect(mockMessage.success).toHaveBeenCalledWith("用户添加成功"), { timeout: 2000 });
  });
});