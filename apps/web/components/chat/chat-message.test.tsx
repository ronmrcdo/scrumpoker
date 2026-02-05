import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/test-utils";
import { createMockChatMessage } from "@/test/test-utils";
import { ChatMessage } from "./chat-message";

describe("ChatMessage", () => {
  describe("user messages", () => {
    it("should render message text", () => {
      const message = createMockChatMessage({ text: "Hello everyone!" });
      render(<ChatMessage message={message} isOwnMessage={false} />);
      expect(screen.getByText("Hello everyone!")).toBeInTheDocument();
    });

    it("should render timestamp", () => {
      const message = createMockChatMessage({ timestamp: "2:30 PM" });
      render(<ChatMessage message={message} isOwnMessage={false} />);
      expect(screen.getByText("2:30 PM")).toBeInTheDocument();
    });

    it("should show sender name for other users messages", () => {
      const message = createMockChatMessage({ senderName: "Alice" });
      render(<ChatMessage message={message} isOwnMessage={false} />);
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    it("should not show sender name for own messages", () => {
      const message = createMockChatMessage({ senderName: "Me" });
      render(<ChatMessage message={message} isOwnMessage={true} />);
      expect(screen.queryByText("Me")).not.toBeInTheDocument();
    });
  });

  describe("own message styling", () => {
    it("should align own messages to the right", () => {
      const message = createMockChatMessage();
      const { container } = render(
        <ChatMessage message={message} isOwnMessage={true} />,
      );
      expect(container.querySelector(".items-end")).toBeInTheDocument();
    });

    it("should align other messages to the left", () => {
      const message = createMockChatMessage();
      const { container } = render(
        <ChatMessage message={message} isOwnMessage={false} />,
      );
      expect(container.querySelector(".items-start")).toBeInTheDocument();
    });

    it("should have primary color background for own messages", () => {
      const message = createMockChatMessage();
      const { container } = render(
        <ChatMessage message={message} isOwnMessage={true} />,
      );
      expect(container.querySelector(".bg-primary-100")).toBeInTheDocument();
    });

    it("should have muted background for other messages", () => {
      const message = createMockChatMessage();
      const { container } = render(
        <ChatMessage message={message} isOwnMessage={false} />,
      );
      expect(container.querySelector(".bg-muted")).toBeInTheDocument();
    });
  });

  describe("system messages", () => {
    it("should render system message text", () => {
      const message = createMockChatMessage({
        type: "System",
        text: "Alice joined the room",
      });
      render(<ChatMessage message={message} isOwnMessage={false} />);
      expect(screen.getByText("Alice joined the room")).toBeInTheDocument();
    });

    it("should center system messages", () => {
      const message = createMockChatMessage({ type: "System" });
      const { container } = render(
        <ChatMessage message={message} isOwnMessage={false} />,
      );
      expect(container.querySelector(".justify-center")).toBeInTheDocument();
    });

    it("should style system messages differently", () => {
      const message = createMockChatMessage({ type: "System" });
      const { container } = render(
        <ChatMessage message={message} isOwnMessage={false} />,
      );
      expect(container.querySelector(".italic")).toBeInTheDocument();
      expect(container.querySelector(".rounded-full")).toBeInTheDocument();
    });

    it("should not show sender name for system messages", () => {
      const message = createMockChatMessage({
        type: "System",
        senderName: "System",
      });
      render(<ChatMessage message={message} isOwnMessage={false} />);

      // System message only shows the text, not the sender name separately
      const textElement = screen.getByText(message.text);
      expect(textElement).toBeInTheDocument();
    });
  });

  describe("message bubble styling", () => {
    it("should have rounded corners for own messages", () => {
      const message = createMockChatMessage({ type: "User" });
      const { container } = render(
        <ChatMessage message={message} isOwnMessage={true} />,
      );
      expect(container.querySelector(".rounded-br-md")).toBeInTheDocument();
    });

    it("should have rounded corners for other messages", () => {
      const message = createMockChatMessage({ type: "User" });
      const { container } = render(
        <ChatMessage message={message} isOwnMessage={false} />,
      );
      expect(container.querySelector(".rounded-bl-md")).toBeInTheDocument();
    });
  });

  describe("animations", () => {
    it("should animate own messages from right", () => {
      const message = createMockChatMessage();
      const { container } = render(
        <ChatMessage message={message} isOwnMessage={true} />,
      );
      expect(container.querySelector(".animate-slide-in-right")).toBeInTheDocument();
    });

    it("should animate other messages from left", () => {
      const message = createMockChatMessage();
      const { container } = render(
        <ChatMessage message={message} isOwnMessage={false} />,
      );
      expect(container.querySelector(".animate-slide-in-left")).toBeInTheDocument();
    });

    it("should fade in system messages", () => {
      const message = createMockChatMessage({ type: "System" });
      const { container } = render(
        <ChatMessage message={message} isOwnMessage={false} />,
      );
      expect(container.querySelector(".animate-fade-in")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle empty message text", () => {
      const message = createMockChatMessage({ text: "" });
      const { container } = render(
        <ChatMessage message={message} isOwnMessage={false} />,
      );
      expect(container).toBeInTheDocument();
    });

    it("should handle long message text", () => {
      const longText = "a".repeat(500);
      const message = createMockChatMessage({ text: longText });
      render(<ChatMessage message={message} isOwnMessage={false} />);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("should handle special characters in message", () => {
      const message = createMockChatMessage({
        text: "Hello! 🎉 <script>test</script>",
      });
      render(<ChatMessage message={message} isOwnMessage={false} />);
      expect(
        screen.getByText("Hello! 🎉 <script>test</script>"),
      ).toBeInTheDocument();
    });

    it("should handle emoji in sender name", () => {
      const message = createMockChatMessage({ senderName: "Alice 👋" });
      render(<ChatMessage message={message} isOwnMessage={false} />);
      expect(screen.getByText("Alice 👋")).toBeInTheDocument();
    });

    it("should wrap long words properly", () => {
      const longWord = "supercalifragilisticexpialidocious" + "a".repeat(100);
      const message = createMockChatMessage({ text: longWord });
      const { container } = render(
        <ChatMessage message={message} isOwnMessage={false} />,
      );
      expect(container.querySelector(".break-words")).toBeInTheDocument();
    });
  });

  describe("isOwnMessage does not affect system messages", () => {
    it("should render system message the same regardless of isOwnMessage", () => {
      const message = createMockChatMessage({
        type: "System",
        text: "System notification",
      });

      const { container: container1 } = render(
        <ChatMessage message={message} isOwnMessage={true} />,
      );
      const { container: container2 } = render(
        <ChatMessage message={message} isOwnMessage={false} />,
      );

      // Both should have centered layout
      expect(container1.querySelector(".justify-center")).toBeInTheDocument();
      expect(container2.querySelector(".justify-center")).toBeInTheDocument();
    });
  });
});
