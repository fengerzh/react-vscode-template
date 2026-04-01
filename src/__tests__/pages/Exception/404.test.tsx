import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NotFound from "@/pages/Exception/404";

// Mock window.location
Object.defineProperty(window, "location", {
  writable: true,
  value: { href: "" },
});

describe("NotFound", () => {
  it("renders 404 result page", () => {
    render(<NotFound />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("对不起，您访问的页面不存在")).toBeInTheDocument();
  });

  it("renders back to home text", () => {
    render(<NotFound />);

    // Just check that the text exists in the document
    const { container } = render(<NotFound />);
    expect(container.textContent).toContain("回到首页");
  });

  it("has button that navigates to home", () => {
    const { container } = render(<NotFound />);

    // Find button by looking for it in the DOM
    const button = container.querySelector("button");
    expect(button).toBeTruthy();

    if (button) {
      button.click();
    }

    expect(window.location.href).toBe("/");
  });

  it("renders Result component with correct status", () => {
    const { container } = render(<NotFound />);

    // Check for ant-result class which indicates Result component
    const resultElement = container.querySelector(".ant-result");
    expect(resultElement).toBeInTheDocument();
  });
});
