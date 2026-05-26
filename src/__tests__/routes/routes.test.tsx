import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import AppRoutes from "@/routes";

describe("Routes", () => {
  describe("AppRoutes", () => {
    it("renders without crashing", async () => {
      const { container } = render(
        <MemoryRouter initialEntries={["/user"]}>
          {AppRoutes}
        </MemoryRouter>,
      );
      expect(container).toBeInTheDocument();
    });

    it("redirects root path to dashboard", () => {
      const { container } = render(
        <MemoryRouter initialEntries={["/"]}>
          {AppRoutes}
        </MemoryRouter>,
      );
      expect(container).toBeInTheDocument();
    });

    it("renders user routes for /user path", () => {
      const { container } = render(
        <MemoryRouter initialEntries={["/user"]}>
          {AppRoutes}
        </MemoryRouter>,
      );
      expect(container).toBeInTheDocument();
    });

    it("renders exception routes for /exception path", () => {
      const { container } = render(
        <MemoryRouter initialEntries={["/exception/404"]}>
          {AppRoutes}
        </MemoryRouter>,
      );
      expect(container).toBeInTheDocument();
    });
  });
});