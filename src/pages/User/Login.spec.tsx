import "./matchMedia.mock";
import React from "react";
import { render } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

vi.mock("@/services", () => ({
  signIn: vi.fn().mockResolvedValue({ data: { session: {} }, error: null }),
  signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

const renderLogin = () => render(<MemoryRouter><Login /></MemoryRouter>);

describe("<Login /> 组件测试", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("组件正常渲染不崩溃", () => {
    const { container } = renderLogin();
    // 验证表单元素存在
    expect(container.querySelector("form")).toBeInTheDocument();
  });

  it("包含 input 输入框", () => {
    const { container } = renderLogin();
    const inputs = container.querySelectorAll("input");
    expect(inputs.length).toBeGreaterThanOrEqual(2); // email + password
  });

  it("包含提交按钮", () => {
    const { container } = renderLogin();
    const btn = container.querySelector(".ant-btn");
    expect(btn).toBeInTheDocument();
  });
});