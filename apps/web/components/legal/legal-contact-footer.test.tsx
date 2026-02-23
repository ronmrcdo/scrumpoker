import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/test-utils";
import { LegalContactFooter } from "./legal-contact-footer";

describe("LegalContactFooter", () => {
  it("should render the email address", () => {
    render(<LegalContactFooter />);
    expect(screen.getByText("info@scrumpokergame.com")).toBeInTheDocument();
  });

  it("should render with default subject when no prop provided", () => {
    render(<LegalContactFooter />);
    expect(
      screen.getByText(/For questions or concerns, please contact us at/),
    ).toBeInTheDocument();
  });

  it("should render with custom subject when provided", () => {
    render(<LegalContactFooter subject="privacy inquiries" />);
    expect(
      screen.getByText(/For privacy inquiries, please contact us at/),
    ).toBeInTheDocument();
  });

  it("should render the Mail icon", () => {
    const { container } = render(<LegalContactFooter />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render response-time note", () => {
    render(<LegalContactFooter />);
    expect(
      screen.getByText(
        "We will make reasonable efforts to respond in a timely manner.",
      ),
    ).toBeInTheDocument();
  });
});
