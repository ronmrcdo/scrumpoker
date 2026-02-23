"use client";

import { cn } from "@repo/ui";
import { memo } from "react";
import type { ChatMessage as ChatMessageType } from "@/lib/types";

interface ChatMessageProps {
  message: ChatMessageType;
  isOwnMessage: boolean;
}

export const ChatMessage = memo(function ChatMessage({
  message,
  isOwnMessage,
}: ChatMessageProps) {
  if (message.type === "System") {
    return (
      <li className="flex justify-center py-1 animate-fade-in">
        <span className="text-xs text-muted-foreground italic bg-muted px-3 py-1 rounded-full">
          {message.text}
        </span>
      </li>
    );
  }

  return (
    <li
      className={cn(
        "flex flex-col gap-0.5",
        isOwnMessage
          ? "items-end animate-slide-in-right"
          : "items-start animate-slide-in-left",
      )}
    >
      {!isOwnMessage && (
        <span className="text-xs text-muted-foreground font-medium ml-3">
          {message.senderName}
        </span>
      )}
      <div
        className={cn(
          "max-w-[85%] px-3 py-2 rounded-2xl text-sm transition-shadow duration-200",
          "hover:shadow-soft-md break-words",
          isOwnMessage
            ? "bg-primary-100 text-primary-800 rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md",
        )}
        style={{ overflowWrap: "anywhere" }}
      >
        {message.text}
      </div>
      <span className="text-xs text-muted-foreground mx-3">
        {message.timestamp}
      </span>
    </li>
  );
});
