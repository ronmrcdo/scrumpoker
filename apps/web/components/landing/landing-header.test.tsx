import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test/test-utils";
import { LandingHeader } from "./landing-header";

describe("LandingHeader", () => {
  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue("/");
  });

  it("renders the brand wordmark", () => {
    render(<LandingHeader />);
    expect(screen.getByText("Scrum Poker")).toBeInTheDocument();
  });

  it("links the wordmark to the home page", () => {
    render(<LandingHeader />);
    const homeLink = screen.getByRole("link", { name: /scrum poker/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders all primary nav links", () => {
    render(<LandingHeader />);
    expect(screen.getByRole("link", { name: /how it plays/i })).toHaveAttribute(
      "href",
      "#how",
    );
    expect(screen.getByRole("link", { name: /features/i })).toHaveAttribute(
      "href",
      "#features",
    );
    expect(screen.getByRole("link", { name: /the deck/i })).toHaveAttribute(
      "href",
      "#deck",
    );
  });

  it("renders the theme toggle control", () => {
    render(<LandingHeader />);
    expect(
      screen.getByRole("button", { name: /toggle theme/i }),
    ).toBeInTheDocument();
  });

  describe("anchor scroll", () => {
    const scrollToMock = vi.fn();
    const replaceStateMock = vi.fn();
    let originalScrollTo: typeof window.scrollTo;
    let originalReplaceState: typeof history.replaceState;

    beforeEach(() => {
      originalScrollTo = window.scrollTo;
      originalReplaceState = history.replaceState;
      window.scrollTo = scrollToMock as unknown as typeof window.scrollTo;
      history.replaceState =
        replaceStateMock as unknown as typeof history.replaceState;
      scrollToMock.mockClear();
      replaceStateMock.mockClear();
    });

    afterEach(() => {
      window.scrollTo = originalScrollTo;
      history.replaceState = originalReplaceState;
    });

    it("prevents default navigation and scrolls to the target section", async () => {
      const user = userEvent.setup();
      const target = document.createElement("section");
      target.id = "features";
      Object.defineProperty(target, "getBoundingClientRect", {
        value: () => ({ top: 600 }) as DOMRect,
      });
      document.body.appendChild(target);

      render(<LandingHeader />);
      await user.click(screen.getByRole("link", { name: /features/i }));

      expect(scrollToMock).toHaveBeenCalled();
      expect(replaceStateMock).toHaveBeenCalledWith(null, "", "#features");

      document.body.removeChild(target);
    });
  });

  describe("on non-landing pages", () => {
    beforeEach(() => {
      vi.mocked(usePathname).mockReturnValue("/privacy");
    });

    it("rewrites nav links to point back to the landing page hashes", () => {
      render(<LandingHeader />);
      expect(
        screen.getByRole("link", { name: /how it plays/i }),
      ).toHaveAttribute("href", "/#how");
      expect(screen.getByRole("link", { name: /features/i })).toHaveAttribute(
        "href",
        "/#features",
      );
      expect(screen.getByRole("link", { name: /the deck/i })).toHaveAttribute(
        "href",
        "/#deck",
      );
    });

    it("does not intercept the click with the in-page scroll handler", async () => {
      const replaceStateMock = vi.fn();
      const originalReplaceState = history.replaceState;
      history.replaceState =
        replaceStateMock as unknown as typeof history.replaceState;

      const user = userEvent.setup();
      render(<LandingHeader />);

      const link = screen.getByRole("link", { name: /features/i });
      const observedDefaultPrevented = vi.fn();
      link.addEventListener("click", (e) => {
        observedDefaultPrevented(e.defaultPrevented);
        e.preventDefault();
      });
      await user.click(link);

      expect(observedDefaultPrevented).toHaveBeenCalledWith(false);
      expect(replaceStateMock).not.toHaveBeenCalled();

      history.replaceState = originalReplaceState;
    });
  });
});
