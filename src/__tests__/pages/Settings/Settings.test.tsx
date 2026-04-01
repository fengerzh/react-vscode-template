import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Settings from "@/pages/Settings";
import * as antd from "antd";

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
    expect(screen.getByText("管理个人资料与偏好")).toBeInTheDocument();
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

  it("renders with initial empty values", () => {
    const { container } = render(<Settings />);

    const displayNameInput = container.querySelector('input[id="displayName"]') as HTMLInputElement;
    const emailInput = container.querySelector('input[id="email"]') as HTMLInputElement;

    expect(displayNameInput?.value).toBe("");
    expect(emailInput?.value).toBe("");
  });

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
