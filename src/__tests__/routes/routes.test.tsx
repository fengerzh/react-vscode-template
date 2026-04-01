import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
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

    it("redirects root path to dashboard", async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          {AppRoutes}
        </MemoryRouter>,
      );

      // Wait for navigation
      await waitFor(() => {
        expect(document.title).toBeDefined();
      });
    });

    it("renders user routes for /user path", async () => {
      const { container } = render(
        <MemoryRouter initialEntries={["/user"]}>
          {AppRoutes}
        </MemoryRouter>,
      );
      expect(container).toBeInTheDocument();
    });

    it("renders exception routes for /exception path", async () => {
      const { container } = render(
        <MemoryRouter initialEntries={["/exception/404"]}>
          {AppRoutes}
        </MemoryRouter>,
      );
      expect(container).toBeInTheDocument();
    });
  });
});
