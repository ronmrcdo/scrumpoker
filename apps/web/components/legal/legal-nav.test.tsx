import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/test-utils";
import { LegalNav } from "./legal-nav";

describe("LegalNav", () => {
  it("should render all three legal page links", () => {
    render(<LegalNav currentPath="/privacy" />);
    expect(
      screen.getByRole("link", { name: /Privacy Policy/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Terms of Service/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Disclaimer/ }),
    ).toBeInTheDocument();
  });

  it("should have correct href attributes", () => {
    render(<LegalNav currentPath="/privacy" />);
    expect(
      screen.getByRole("link", { name: /Privacy Policy/ }),
    ).toHaveAttribute("href", "/privacy");
    expect(
      screen.getByRole("link", { name: /Terms of Service/ }),
    ).toHaveAttribute("href", "/terms");
    expect(screen.getByRole("link", { name: /Disclaimer/ })).toHaveAttribute(
      "href",
      "/disclaimer",
    );
  });

  it("should render link text for all pages", () => {
    render(<LegalNav currentPath="/terms" />);
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
    expect(screen.getByText("Disclaimer")).toBeInTheDocument();
  });

  it("should have navigation landmark", () => {
    render(<LegalNav currentPath="/privacy" />);
    expect(
      screen.getByRole("navigation", { name: /legal documents/i }),
    ).toBeInTheDocument();
  });

  it("should render with different currentPath values", () => {
    const { rerender } = render(<LegalNav currentPath="/privacy" />);
    expect(screen.getAllByRole("link")).toHaveLength(3);

    rerender(<LegalNav currentPath="/terms" />);
    expect(screen.getAllByRole("link")).toHaveLength(3);

    rerender(<LegalNav currentPath="/disclaimer" />);
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });
});
