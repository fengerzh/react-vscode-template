import "./matchMedia.mock";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { message } from "antd";
import { MemoryRouter } from "react-router-dom";
import type { AxiosResponse } from "axios";
import type { ApiResponse, LoginResponse } from "@/services/index";
import * as services from "@/services/index";
import Login from "./Login";

// 包装组件，提供 Router 上下文
const renderWithRouter = (component: React.ReactElement) => render(
  <MemoryRouter>
    {component}
  </MemoryRouter>,
);

// mock antd message
vi.mock("antd", async () => {
  const antd = await vi.importActual("antd");
  return {
    ...antd,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
      loading: vi.fn(),
      open: vi.fn(),
      destroy: vi.fn(),
    },
  };
});

describe("<Login /> 组件测试", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("应该有标题栏", () => {
    renderWithRouter(<Login />);
    expect(screen.getByText("欢迎回来")).toBeInTheDocument();
  });

  it("发送验证码", async () => {
    renderWithRouter(<Login />);
    const phoneInput = screen.getByPlaceholderText("13912345678");
    await userEvent.type(phoneInput, "13912345678");
    const captchaBtn = screen.getByText("获取验证码");
    await userEvent.click(captchaBtn);
    // 等待验证码发送的异步操作完成
    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith(expect.stringMatching(/验证码发送成功/));
    }, { timeout: 2000 });
  });

  it("登录成功", async () => {
    // 直接 spy 登录方法，确保触发 onFinish 并返回预期结构
    const loginSpy = vi.spyOn(services, "login").mockResolvedValue({
      status: 200,
      data: {
        success: true,
        data: { userName: "张三", userId: "user_001", token: "mock_token_123456" },
        message: "登录成功",
      },
    } as AxiosResponse<ApiResponse<LoginResponse>>);

    renderWithRouter(<Login />);
    await userEvent.type(screen.getByPlaceholderText("13912345678"), "13912345678");
    await userEvent.type(screen.getByPlaceholderText("admin"), "admin");
    const submitBtn = screen.getByText(/登录|登 录/);
    await userEvent.click(submitBtn);
    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith("登录成功");
      expect(loginSpy).toHaveBeenCalled();
    });
    loginSpy.mockRestore();
  });

  it("登录失败", async () => {
    renderWithRouter(<Login />);
    await userEvent.type(screen.getByPlaceholderText("13912345678"), "13912345678");
    await userEvent.type(screen.getByPlaceholderText("admin"), "wrong");
    const submitBtn = screen.getByText("登 录");
    await userEvent.click(submitBtn);
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(expect.stringMatching(/登录失败|用户名或密码错误|登录已过期/));
    });
  });
});