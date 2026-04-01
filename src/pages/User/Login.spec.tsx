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

const renderWithRouter = (component: React.ReactElement) => render(
  <MemoryRouter>{component}</MemoryRouter>,
);

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
    const phoneInput = screen.getAllByPlaceholderText("13912345678")[0];
    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, "13912345678");
    const verifyButtons = screen.getAllByText("获取验证码");
    await userEvent.click(verifyButtons[0]);
    await waitFor(
      () => expect(message.success).toHaveBeenCalledWith(expect.stringMatching(/验证码发送成功/)),
      { timeout: 2000 },
    );
  });

  it("登录成功", async () => {
    const loginSpy = vi.spyOn(services, "login").mockResolvedValue({
      status: 200,
      data: {
        success: true,
        data: { userName: "张三", userId: "user_001", token: "mock_token" },
        message: "登录成功",
      },
    } as AxiosResponse<ApiResponse<LoginResponse>>);

    renderWithRouter(<Login />);
    const phoneInput = screen.getAllByPlaceholderText("13912345678")[0];
    const passwordInput = screen.getAllByPlaceholderText("admin")[0];
    await userEvent.clear(phoneInput);
    await userEvent.clear(passwordInput);
    await userEvent.type(phoneInput, "13912345678");
    await userEvent.type(passwordInput, "admin");
    const loginButtons = screen.getAllByText(/登录|登 录/);
    await userEvent.click(loginButtons[0]);
    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith("登录成功");
      expect(loginSpy).toHaveBeenCalled();
    }, { timeout: 3000 });
    loginSpy.mockRestore();
  });

  it("登录失败", async () => {
    renderWithRouter(<Login />);
    const phoneInput = screen.getAllByPlaceholderText("13912345678")[0];
    const passwordInput = screen.getAllByPlaceholderText("admin")[0];
    await userEvent.clear(phoneInput);
    await userEvent.clear(passwordInput);
    await userEvent.type(phoneInput, "13912345678");
    await userEvent.type(passwordInput, "wrong");
    const loginButtons = screen.getAllByText("登 录");
    await userEvent.click(loginButtons[0]);
    await waitFor(
      () => expect(message.error).toHaveBeenCalledWith(expect.stringMatching(/登录失败|用户名或密码错误|登录已过期/)),
      { timeout: 3000 },
    );
  });
});