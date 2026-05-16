import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/test-utils";
import { CtaSection } from "./cta-section";

describe("CtaSection", () => {
  it("renders the 'Ready to deal in?' headline", () => {
    render(<CtaSection />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent(/ready to deal in\?/i);
  });

  it("renders an 'Open a Room' link pointing to the hero anchor", () => {
    render(<CtaSection />);
    const link = screen.getByRole("link", { name: /open a room/i });
    expect(link).toHaveAttribute("href", "#hero");
  });

  it("renders the supporting eyebrow text", () => {
    render(<CtaSection />);
    expect(
      screen.getByText(/free · no sign-up · real-time/i),
    ).toBeInTheDocument();
  });
});
