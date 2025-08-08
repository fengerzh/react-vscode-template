/* global jest, describe, beforeAll, beforeEach, it, expect */
import "./matchMedia.mock";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { App, message } from "antd";
import Login from "./Login";

// mock antd message
jest.mock("antd", () => {
  const antd = jest.requireActual("antd");
  return {
    ...antd,
    message: {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    },
    App: antd.App,
  };
});

describe("<Login /> 组件测试", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("应该有标题栏", () => {
    render(<App><Login /></App>);
    expect(screen.getByText("React Vscode Template")).toBeInTheDocument();
  });

  it("发送验证码", async () => {
    render(<App><Login /></App>);
    const phoneInput = screen.getByPlaceholderText("13912345678");
    await userEvent.type(phoneInput, "13912345678");
    const captchaBtn = screen.getByText("获取验证码");
    await userEvent.click(captchaBtn);
    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith(expect.stringMatching(/验证码发送成功/));
    });
  });

  it("登录成功", async () => {
    render(<App><Login /></App>);
    await userEvent.type(screen.getByPlaceholderText("13912345678"), "13912345678");
    await userEvent.type(screen.getByPlaceholderText("admin"), "admin");
    const submitBtn = screen.getByText("登 录");
    await userEvent.click(submitBtn);
    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith("登录成功");
    });
  });

  it("登录失败", async () => {
    render(<App><Login /></App>);
    await userEvent.type(screen.getByPlaceholderText("13912345678"), "13912345678");
    await userEvent.type(screen.getByPlaceholderText("admin"), "wrong");
    const submitBtn = screen.getByText("登 录");
    await userEvent.click(submitBtn);
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(expect.stringMatching(/登录失败|用户名或密码错误|登录已过期/));
    });
  });
});
