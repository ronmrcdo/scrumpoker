"use client";

import { Button, Input, Send, Smile } from "@repo/ui";
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { usePokerStore } from "@/lib/store/poker-store";

interface ChatInputProps {
  onSend: (text: string) => void;
}

const TYPING_TIMEOUT_MS = 3000;

export function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const broadcastTyping = usePokerStore((s) => s.broadcastTyping);
  const currentUserId = usePokerStore((s) => s.currentUserId);
  const room = usePokerStore((s) => s.room);
  const currentUserName =
    room?.players.find((p) => p.id === currentUserId)?.name ?? "";

  // Send typing indicator with debounce
  const sendTypingIndicator = useCallback(
    (isTyping: boolean) => {
      if (!currentUserId || !currentUserName) return;

      if (isTyping && !isTypingRef.current) {
        isTypingRef.current = true;
        broadcastTyping(currentUserId, currentUserName, true);
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator
      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          isTypingRef.current = false;
          broadcastTyping(currentUserId, currentUserName, false);
        }, TYPING_TIMEOUT_MS);
      } else if (isTypingRef.current) {
        isTypingRef.current = false;
        broadcastTyping(currentUserId, currentUserName, false);
      }
    },
    [currentUserId, currentUserName, broadcastTyping],
  );

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);

    // Send typing indicator when there's text
    if (newText.trim()) {
      sendTypingIndicator(true);
    } else {
      sendTypingIndicator(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    sendTypingIndicator(false);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    sendTypingIndicator(true);
  };

  return (
    <div className="relative">
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-full right-0 mb-2 z-50"
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme={Theme.AUTO}
            width={300}
            height={350}
            searchPlaceholder="Search emoji..."
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 p-2 sm:p-3 border-t border-border"
      >
        <Input
          value={text}
          onChange={handleTextChange}
          placeholder="Type a message..."
          className="h-9 sm:h-10 text-sm"
        />
        <Button
          ref={emojiButtonRef}
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 sm:h-10 sm:w-10 shrink-0"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Smile className="h-4 w-4" />
        </Button>
        <Button
          type="submit"
          size="icon"
          className="h-9 w-9 sm:h-10 sm:w-10 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
