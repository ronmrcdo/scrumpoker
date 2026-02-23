import { Lock, Shield } from "@repo/ui";
import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/test-utils";
import { LegalTableOfContents } from "./legal-table-of-contents";

const items = [
  { id: "intro", title: "Introduction", icon: Shield },
  { id: "security", title: "Security", icon: Lock },
];

describe("LegalTableOfContents", () => {
  it("should render 'Table of Contents' heading", () => {
    render(<LegalTableOfContents items={items} />);
    expect(screen.getByText("Table of Contents")).toBeInTheDocument();
  });

  it("should render all TOC items", () => {
    render(<LegalTableOfContents items={items} />);
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
  });

  it("should render anchor links with correct href", () => {
    render(<LegalTableOfContents items={items} />);
    const introLink = screen.getByRole("link", { name: /Introduction/ });
    expect(introLink).toHaveAttribute("href", "#intro");
    const securityLink = screen.getByRole("link", { name: /Security/ });
    expect(securityLink).toHaveAttribute("href", "#security");
  });

  it("should render numbered items", () => {
    render(<LegalTableOfContents items={items} />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
  });

  it("should have navigation landmark", () => {
    render(<LegalTableOfContents items={items} />);
    expect(
      screen.getByRole("navigation", { name: /table of contents/i }),
    ).toBeInTheDocument();
  });

  it("should not render icons in TOC items", () => {
    const { container } = render(<LegalTableOfContents items={items} />);
    const svgs = container.querySelectorAll("nav svg");
    expect(svgs).toHaveLength(0);
  });

  it("should handle empty items array", () => {
    render(<LegalTableOfContents items={[]} />);
    expect(
      screen.getByRole("navigation", { name: /table of contents/i }),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("should handle single item", () => {
    render(
      <LegalTableOfContents
        items={[{ id: "only", title: "Only Section", icon: Shield }]}
      />,
    );
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("Only Section")).toBeInTheDocument();
    expect(screen.queryByText("02")).not.toBeInTheDocument();
  });
});
