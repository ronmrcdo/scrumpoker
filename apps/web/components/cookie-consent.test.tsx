import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { CookieConsent } from "./cookie-consent";

describe("CookieConsent", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("visibility", () => {
    it("should render banner when no consent is stored", () => {
      render(<CookieConsent />);
      expect(
        screen.getByRole("dialog", { name: /security & analytics/i }),
      ).toBeInTheDocument();
    });

    it("should not render when consent is 'accepted'", () => {
      localStorage.setItem("cookie-consent", "accepted");
      render(<CookieConsent />);
      expect(
        screen.queryByRole("dialog", { name: /security & analytics/i }),
      ).not.toBeInTheDocument();
    });

    it("should not render when consent is 'necessary'", () => {
      localStorage.setItem("cookie-consent", "necessary");
      render(<CookieConsent />);
      expect(
        screen.queryByRole("dialog", { name: /security & analytics/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("accept all", () => {
    it("should hide banner when 'Accept all' is clicked", async () => {
      const user = userEvent.setup();
      render(<CookieConsent />);

      await user.click(screen.getByRole("button", { name: /accept all/i }));
      expect(
        screen.queryByRole("dialog", { name: /security & analytics/i }),
      ).not.toBeInTheDocument();
    });

    it("should store 'accepted' in localStorage", async () => {
      const user = userEvent.setup();
      render(<CookieConsent />);

      await user.click(screen.getByRole("button", { name: /accept all/i }));
      expect(localStorage.getItem("cookie-consent")).toBe("accepted");
    });
  });

  describe("necessary only", () => {
    it("should hide banner when 'Necessary only' is clicked", async () => {
      const user = userEvent.setup();
      render(<CookieConsent />);

      await user.click(screen.getByRole("button", { name: /necessary only/i }));
      expect(
        screen.queryByRole("dialog", { name: /security & analytics/i }),
      ).not.toBeInTheDocument();
    });

    it("should store 'necessary' in localStorage", async () => {
      const user = userEvent.setup();
      render(<CookieConsent />);

      await user.click(screen.getByRole("button", { name: /necessary only/i }));
      expect(localStorage.getItem("cookie-consent")).toBe("necessary");
    });
  });

  describe("content", () => {
    it("should contain a Privacy Policy link", () => {
      render(<CookieConsent />);
      const link = screen.getByRole("link", { name: /privacy policy/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/privacy");
    });

    it("should display Security & Analytics heading", () => {
      render(<CookieConsent />);
      expect(screen.getByText("Security & Analytics")).toBeInTheDocument();
    });
  });
});
