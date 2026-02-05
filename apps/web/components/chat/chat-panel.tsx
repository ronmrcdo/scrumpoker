"use client";

import { Button, MessageSquare, Separator, X } from "@repo/ui";
import { useEffect, useRef } from "react";

import { usePokerStore } from "@/lib/store/poker-store";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";

interface ChatPanelProps {
  messages: ChatMessageType[];
  currentUserId: string;
  onSend: (text: string) => void;
  onClose: () => void;
}

function TypingIndicator() {
  const typingUsers = usePokerStore((s) => s.typingUsers);
  const typingUsersArray = Array.from(typingUsers.values());

  if (typingUsersArray.length === 0) return null;

  const firstUser = typingUsersArray[0];
  const text =
    typingUsersArray.length === 1 && firstUser
      ? `${firstUser.name} is typing`
      : "Multiple users are typing";

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground animate-fade-in">
      <span>{text}</span>
      <span className="flex gap-0.5">
        <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:300ms]" />
      </span>
    </div>
  );
}

export function ChatPanel({
  messages,
  currentUserId,
  onSend,
  onClose,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(messages.length);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevLengthRef.current = messages.length;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Chat</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 md:hidden"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-3 space-y-2 sm:space-y-3">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isOwnMessage={msg.senderId === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <TypingIndicator />
      <ChatInput onSend={onSend} />
    </div>
  );
}
