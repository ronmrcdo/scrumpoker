import { Shield } from "@repo/ui";
import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/test-utils";
import { LegalSectionCard } from "./legal-section-card";

describe("LegalSectionCard", () => {
  it("should render the section title as h2", () => {
    render(
      <LegalSectionCard id="test" icon={Shield} title="Test Section">
        <p>Content</p>
      </LegalSectionCard>,
    );
    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Test Section",
    });
    expect(heading).toBeInTheDocument();
  });

  it("should render children content", () => {
    render(
      <LegalSectionCard id="test" icon={Shield} title="Test">
        <p>Section content here</p>
      </LegalSectionCard>,
    );
    expect(screen.getByText("Section content here")).toBeInTheDocument();
  });

  it("should have the correct id for anchor linking", () => {
    const { container } = render(
      <LegalSectionCard id="my-section" icon={Shield} title="Test">
        <p>Content</p>
      </LegalSectionCard>,
    );
    expect(container.querySelector("#my-section")).toBeInTheDocument();
  });

  it("should apply uniform primary border", () => {
    const { container } = render(
      <LegalSectionCard id="test" icon={Shield} title="Test">
        <p>Content</p>
      </LegalSectionCard>,
    );
    const card = container.querySelector("#test");
    expect(card?.className).toContain("border-l-primary/30");
  });

  it("should have scroll-mt for fixed header offset", () => {
    const { container } = render(
      <LegalSectionCard id="test" icon={Shield} title="Test">
        <p>Content</p>
      </LegalSectionCard>,
    );
    const card = container.querySelector("#test");
    expect(card?.className).toContain("scroll-mt-24");
  });

  it("should render the icon", () => {
    const { container } = render(
      <LegalSectionCard id="test" icon={Shield} title="Test">
        <p>Content</p>
      </LegalSectionCard>,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should apply tinted primary icon badge", () => {
    const { container } = render(
      <LegalSectionCard id="test" icon={Shield} title="Test">
        <p>Content</p>
      </LegalSectionCard>,
    );
    const iconBadge = container.querySelector("svg")?.parentElement;
    expect(iconBadge?.className).toContain("bg-primary");
  });
});
