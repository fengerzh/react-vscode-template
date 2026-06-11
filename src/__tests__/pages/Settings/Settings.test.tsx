import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Settings from "@/pages/Settings";

// Mock antd message
vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    message: {
      success: vi.fn(),
    },
  };
});

describe("Settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders settings page with title", () => {
    render(<Settings />);

    expect(screen.getByText("个人设置")).toBeInTheDocument();
    expect(screen.getByText("管理个人资料与偏好（useOptimistic 演示）")).toBeInTheDocument();
  });

  it("renders form fields", () => {
    render(<Settings />);

    expect(screen.getByLabelText("显示名称")).toBeInTheDocument();
    expect(screen.getByLabelText("邮箱")).toBeInTheDocument();
  });

  it("renders form with inputs", () => {
    const { container } = render(<Settings />);

    // Find inputs by their ids
    const displayNameInput = container.querySelector('input[id="displayName"]');
    const emailInput = container.querySelector('input[id="email"]');

    expect(displayNameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
  });

  it("allows entering data in form fields", () => {
    const { container } = render(<Settings />);

    const displayNameInput = container.querySelector('input[id="displayName"]') as HTMLInputElement;
    const emailInput = container.querySelector('input[id="email"]') as HTMLInputElement;

    if (displayNameInput && emailInput) {
      fireEvent.change(displayNameInput, { target: { value: "Test User" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      expect(displayNameInput.value).toBe("Test User");
      expect(emailInput.value).toBe("test@example.com");
    }
  });

  it("renders with initial values from saved data", () => {
    const { container } = render(<Settings />);

    const displayNameInput = container.querySelector('input[id="displayName"]') as HTMLInputElement;
    const emailInput = container.querySelector('input[id="email"]') as HTMLInputElement;

    // Inputs should be initialized from saved data
    expect(displayNameInput?.value).toBe("张三");
    expect(emailInput?.value).toBe("zhangsan@example.com");

    // The optimistic display card should also reflect the same initial saved data
    const cardBody = container.querySelectorAll(".ant-card")[1]; // inner card
    expect(cardBody).toBeTruthy();
    expect(cardBody?.textContent).toContain("当前生效的设置（乐观更新）");
    expect(cardBody?.textContent).toContain("张三");
    expect(cardBody?.textContent).toContain("zhangsan@example.com");
  });

  it("optimistically updates card on submit before async save resolves", async () => {
    // This test uses real timers because antd form.validateFields() relies on
    // microtask scheduling that doesn't resolve properly with fake timers.
    vi.useRealTimers();

    const { container } = render(<Settings />);

    const displayNameInput = container.querySelector('input[id="displayName"]') as HTMLInputElement;
    const emailInput = container.querySelector('input[id="email"]') as HTMLInputElement;

    // Fill form with new values
    fireEvent.change(displayNameInput, { target: { value: "李四" } });
    fireEvent.change(emailInput, { target: { value: "lisi@example.com" } });

    // Submit the form
    const submitButton = container.querySelector("button.ant-btn-primary") as HTMLButtonElement;
    expect(submitButton).toBeTruthy();
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Optimistic update: card should reflect new values while the 2s save is in-flight
    const getCardText = () => container.querySelectorAll(".ant-card")[1]?.textContent || "";
    await waitFor(() => {
      expect(getCardText()).toContain("李四");
      expect(getCardText()).toContain("lisi@example.com");
    }, { timeout: 1000 });
  }, 10000);

  it("renders card component", () => {
    const { container } = render(<Settings />);

    // Check for ant-card class
    const cardElement = container.querySelector(".ant-card");
    expect(cardElement).toBeTruthy();
  });

  it("renders page container", () => {
    const { container } = render(<Settings />);

    // Check for pro-page-container class
    const pageContainer = container.querySelector(".ant-pro-page-container");
    expect(pageContainer).toBeTruthy();
  });
});
