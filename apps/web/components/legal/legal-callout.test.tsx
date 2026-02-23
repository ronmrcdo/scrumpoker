import { Info } from "@repo/ui";
import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/test-utils";
import { LegalCallout } from "./legal-callout";

describe("LegalCallout", () => {
  it("should render children content", () => {
    render(<LegalCallout variant="info">Important notice here</LegalCallout>);
    expect(screen.getByText("Important notice here")).toBeInTheDocument();
  });

  it("should render title when provided", () => {
    render(
      <LegalCallout variant="info" title="Notice:">
        Content
      </LegalCallout>,
    );
    expect(screen.getByText("Notice:")).toBeInTheDocument();
  });

  it("should not render title when omitted", () => {
    render(<LegalCallout variant="info">Content</LegalCallout>);
    expect(screen.queryByText(/Notice/)).not.toBeInTheDocument();
  });

  it("should render icon when provided", () => {
    const { container } = render(
      <LegalCallout variant="info" icon={Info}>
        Content
      </LegalCallout>,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should not render icon container when icon and title are omitted", () => {
    const { container } = render(
      <LegalCallout variant="info">Content</LegalCallout>,
    );
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("should apply info variant classes", () => {
    const { container } = render(
      <LegalCallout variant="info">Content</LegalCallout>,
    );
    const callout = container.querySelector("aside");
    expect(callout?.className).toContain("bg-primary-50");
  });

  it("should apply success variant classes", () => {
    const { container } = render(
      <LegalCallout variant="success">Content</LegalCallout>,
    );
    const callout = container.querySelector("aside");
    expect(callout?.className).toContain("bg-accent-50");
  });

  it("should apply warning variant classes", () => {
    const { container } = render(
      <LegalCallout variant="warning">Content</LegalCallout>,
    );
    const callout = container.querySelector("aside");
    expect(callout?.className).toContain("bg-warm-50");
  });

  it("should render as aside element for accessibility", () => {
    const { container } = render(
      <LegalCallout variant="info">Content</LegalCallout>,
    );
    expect(container.querySelector("aside")).toBeInTheDocument();
  });
});
