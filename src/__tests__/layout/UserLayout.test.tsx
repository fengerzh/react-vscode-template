import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import UserLayout from "@/layout/UserLayout";

describe("UserLayout", () => {
  it("renders outlet content", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<UserLayout />}>
            <Route path="/" element={<div data-testid="login-form">Login Form</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByText("Login Form")).toBeInTheDocument();
  });

  it("applies gradient background", () => {
    const { container } = render(
      <MemoryRouter>
        <Routes>
          <Route element={<UserLayout />}>
            <Route path="/" element={<div>Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    // The layout should have the gradient background container
    const layoutContainer = container.querySelector('[style*="linear-gradient"]');
    expect(layoutContainer).toBeTruthy();
  });

  it("renders decorative background elements", () => {
    const { container } = render(
      <MemoryRouter>
        <Routes>
          <Route element={<UserLayout />}>
            <Route path="/" element={<div>Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    // Should have absolute positioned divs for decoration
    const absoluteDivs = container.querySelectorAll('[style*="position: absolute"]');
    expect(absoluteDivs.length).toBeGreaterThanOrEqual(2);
  });

  it("centers content vertically and horizontally", () => {
    const { container } = render(
      <MemoryRouter>
        <Routes>
          <Route element={<UserLayout />}>
            <Route path="/" element={<div>Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    // Should have flex centering
    const flexContainer = container.querySelector('[style*="display: flex"]');
    expect(flexContainer).toBeTruthy();
  });
});
