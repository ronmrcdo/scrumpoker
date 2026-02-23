import { Shield } from "@repo/ui";
import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/test-utils";
import { LegalPageHeader } from "./legal-page-header";

const defaultProps = {
  icon: Shield,
  title: "Privacy Policy",
  description: "How we handle your data",
  documentType: "Privacy Policy",
  effectiveDate: "February 16, 2026",
  version: "1.0",
};

describe("LegalPageHeader", () => {
  it("should render the page title", () => {
    render(<LegalPageHeader {...defaultProps} />);
    expect(
      screen.getByRole("heading", { name: "Privacy Policy" }),
    ).toBeInTheDocument();
  });

  it("should render the description", () => {
    render(<LegalPageHeader {...defaultProps} />);
    expect(screen.getByText("How we handle your data")).toBeInTheDocument();
  });

  it("should render document type badge", () => {
    render(<LegalPageHeader {...defaultProps} documentType="Legal Document" />);
    expect(screen.getByText("Legal Document")).toBeInTheDocument();
  });

  it("should render effective date badge", () => {
    render(<LegalPageHeader {...defaultProps} />);
    expect(
      screen.getByText(/Effective: February 16, 2026/),
    ).toBeInTheDocument();
  });

  it("should render version badge when provided", () => {
    render(<LegalPageHeader {...defaultProps} />);
    expect(screen.getByText("Version 1.0")).toBeInTheDocument();
  });

  it("should not render version badge when omitted", () => {
    const { version: _, ...propsWithoutVersion } = defaultProps;
    render(<LegalPageHeader {...propsWithoutVersion} />);
    expect(screen.queryByText(/Version/)).not.toBeInTheDocument();
  });

  it("should render breadcrumb with Home link", () => {
    render(<LegalPageHeader {...defaultProps} />);
    const homeLink = screen.getByRole("link", { name: /Home/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("should render breadcrumb navigation landmark", () => {
    render(<LegalPageHeader {...defaultProps} />);
    expect(
      screen.getByRole("navigation", { name: /breadcrumb/i }),
    ).toBeInTheDocument();
  });

  it("should render the icon", () => {
    const { container } = render(<LegalPageHeader {...defaultProps} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render reading time badge when provided", () => {
    render(<LegalPageHeader {...defaultProps} readingTimeMinutes={5} />);
    expect(screen.getByText(/~5 min read/)).toBeInTheDocument();
  });

  it("should not render reading time badge when omitted", () => {
    render(<LegalPageHeader {...defaultProps} />);
    expect(screen.queryByText(/min read/)).not.toBeInTheDocument();
  });
});
