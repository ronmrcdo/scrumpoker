"use client";

import { Separator, MessageSquare, X, Button } from "@repo/ui";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { useEffect, useRef } from "react";

interface ChatPanelProps {
  messages: ChatMessageType[];
  currentUserId: string;
  onSend: (text: string) => void;
  onClose: () => void;
}

export function ChatPanel({ messages, currentUserId, onSend, onClose }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Chat</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 md:hidden" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isOwnMessage={msg.senderId === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={onSend} />
    </div>
  );
}
