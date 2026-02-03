"use client";

import { Button, Input, Send } from "@repo/ui";
import { useState } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-2 sm:p-3 border-t border-border">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="h-9 sm:h-10 text-sm"
      />
      <Button type="submit" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 shrink-0">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
