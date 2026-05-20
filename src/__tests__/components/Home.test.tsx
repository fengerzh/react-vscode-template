import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import * as services from "@/services";
import Home from "../../pages/home";

vi.mock("@/services", () => ({
  getUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
  signUp: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  getProfile: vi.fn(),
  upsertProfile: vi.fn(),
}));

// 复用 vitest.setup.ts 中的全局 supabase mock，不重复 mock

vi.mock("antd", async () => {
  const antd = await vi.importActual("antd") as Record<string, unknown>;
  return { ...antd, message: { error: vi.fn(), success: vi.fn(), info: vi.fn() } };
});

const { getUsers } = vi.mocked(services);

const mockUsers = [
  { id: 1, name: "张三", age: 18, birthday: "2005-01-01", email: "zhangsan@test.com" },
];

const renderHome = () => render(<BrowserRouter><Home /></BrowserRouter>);

describe("Home Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUsers.mockResolvedValue({ data: mockUsers, total: 1, current: 1, pageSize: 10 });
  });

  it("渲染 Home 组件标题", async () => {
    renderHome();
    expect(screen.getByText("用户管理")).toBeInTheDocument();
    await waitFor(() => expect(getUsers).toHaveBeenCalled());
  });

  it("显示新建用户按钮", () => {
    renderHome();
    const btns = screen.getAllByText("新建用户");
    expect(btns.length).toBeGreaterThan(0);
  });
});