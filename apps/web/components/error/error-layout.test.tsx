import { AlertTriangle, Home } from "@repo/ui";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test/test-utils";
import { ErrorLayout } from "./error-layout";

describe("ErrorLayout", () => {
  const defaultProps = {
    icon: AlertTriangle,
    title: "Something went wrong",
    description: "An error occurred while processing your request.",
    primaryAction: {
      label: "Try Again",
      onClick: vi.fn(),
    },
  };

  describe("basic rendering", () => {
    it("should render title", () => {
      render(<ErrorLayout {...defaultProps} />);
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("should render description", () => {
      render(<ErrorLayout {...defaultProps} />);
      expect(
        screen.getByText("An error occurred while processing your request."),
      ).toBeInTheDocument();
    });

    it("should render icon", () => {
      const { container } = render(<ErrorLayout {...defaultProps} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should apply custom icon className", () => {
      const { container } = render(
        <ErrorLayout {...defaultProps} iconClassName="text-red-500" />,
      );
      expect(container.querySelector(".text-red-500")).toBeInTheDocument();
    });
  });

  describe("suggestion text", () => {
    it("should render suggestion when provided", () => {
      render(
        <ErrorLayout
          {...defaultProps}
          suggestion="Please check your internet connection."
        />,
      );
      expect(
        screen.getByText("Please check your internet connection."),
      ).toBeInTheDocument();
    });

    it("should not render suggestion when not provided", () => {
      render(<ErrorLayout {...defaultProps} />);
      expect(
        screen.queryByText("Please check your internet connection."),
      ).not.toBeInTheDocument();
    });
  });

  describe("primary action", () => {
    it("should render primary action button with label", () => {
      render(<ErrorLayout {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: "Try Again" }),
      ).toBeInTheDocument();
    });

    it("should call onClick when button with onClick is clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <ErrorLayout
          {...defaultProps}
          primaryAction={{ label: "Retry", onClick }}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Retry" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should render as link when href is provided", () => {
      render(
        <ErrorLayout
          {...defaultProps}
          primaryAction={{ label: "Go Home", href: "/" }}
        />,
      );

      expect(screen.getByRole("link", { name: "Go Home" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Go Home" })).toHaveAttribute(
        "href",
        "/",
      );
    });
  });

  describe("secondary action", () => {
    it("should render secondary action when provided", () => {
      render(
        <ErrorLayout
          {...defaultProps}
          secondaryAction={{ label: "Cancel", onClick: vi.fn() }}
        />,
      );
      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeInTheDocument();
    });

    it("should not render secondary action when not provided", () => {
      render(<ErrorLayout {...defaultProps} />);
      expect(
        screen.queryByRole("button", { name: "Cancel" }),
      ).not.toBeInTheDocument();
    });

    it("should call secondary onClick when clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <ErrorLayout
          {...defaultProps}
          secondaryAction={{ label: "Cancel", onClick }}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Cancel" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should render secondary as link when href is provided", () => {
      render(
        <ErrorLayout
          {...defaultProps}
          secondaryAction={{ label: "Learn More", href: "/help" }}
        />,
      );

      expect(
        screen.getByRole("link", { name: "Learn More" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Learn More" })).toHaveAttribute(
        "href",
        "/help",
      );
    });
  });

  describe("both actions", () => {
    it("should render both actions side by side", () => {
      render(
        <ErrorLayout
          {...defaultProps}
          primaryAction={{ label: "Primary", onClick: vi.fn() }}
          secondaryAction={{ label: "Secondary", onClick: vi.fn() }}
        />,
      );

      expect(
        screen.getByRole("button", { name: "Primary" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Secondary" }),
      ).toBeInTheDocument();
    });

    it("should have correct button variants", () => {
      render(
        <ErrorLayout
          {...defaultProps}
          primaryAction={{ label: "Primary", onClick: vi.fn() }}
          secondaryAction={{ label: "Secondary", onClick: vi.fn() }}
        />,
      );

      // Secondary should have outline variant (border + border-border)
      const secondaryButton = screen.getByRole("button", { name: "Secondary" });
      expect(secondaryButton).toHaveClass("border");
      expect(secondaryButton).toHaveClass("border-border");
    });
  });

  describe("layout and styling", () => {
    it("should center content", () => {
      const { container } = render(<ErrorLayout {...defaultProps} />);
      expect(container.querySelector(".justify-center")).toBeInTheDocument();
      expect(container.querySelector(".items-center")).toBeInTheDocument();
    });

    it("should have card styling", () => {
      const { container } = render(<ErrorLayout {...defaultProps} />);
      expect(container.querySelector(".bg-card")).toBeInTheDocument();
      expect(container.querySelector(".rounded-lg")).toBeInTheDocument();
    });

    it("should have animations", () => {
      const { container } = render(<ErrorLayout {...defaultProps} />);
      expect(container.querySelector(".animate-fade-in")).toBeInTheDocument();
      expect(container.querySelector(".animate-scale-in")).toBeInTheDocument();
    });
  });

  describe("different icon types", () => {
    it("should accept different icons", () => {
      const { container } = render(
        <ErrorLayout {...defaultProps} icon={Home} />,
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle long titles", () => {
      render(
        <ErrorLayout
          {...defaultProps}
          title="This is a very long error title that might need to wrap to multiple lines"
        />,
      );
      expect(
        screen.getByText(
          "This is a very long error title that might need to wrap to multiple lines",
        ),
      ).toBeInTheDocument();
    });

    it("should handle long descriptions", () => {
      const longDescription =
        "This is a very long error description that provides detailed information about what went wrong and how the user might be able to fix it.";
      render(<ErrorLayout {...defaultProps} description={longDescription} />);
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it("should handle special characters in text", () => {
      render(
        <ErrorLayout
          {...defaultProps}
          title="Error 404: Page <not> found & missing"
          description="The URL you're looking for doesn't exist. Check the URL & try again."
        />,
      );
      expect(
        screen.getByText("Error 404: Page <not> found & missing"),
      ).toBeInTheDocument();
    });
  });
});
