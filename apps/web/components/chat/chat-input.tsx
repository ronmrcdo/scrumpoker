"use client";

import { Button, Input, Send, Smile } from "@repo/ui";
import { type EmojiClickData, Theme } from "emoji-picker-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

const emojiPickerImport = () => import("emoji-picker-react");
const EmojiPicker = dynamic(emojiPickerImport, { ssr: false });

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

  const { broadcastTyping, currentUserId, room } = usePokerStore(
    useShallow((s) => ({
      broadcastTyping: s.broadcastTyping,
      currentUserId: s.currentUserId,
      room: s.room,
    })),
  );
  const currentUserName = useMemo(
    () => room?.players.find((p) => p.id === currentUserId)?.name ?? "",
    [room?.players, currentUserId],
  );

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

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (showEmojiPicker && event.key === "Escape") {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
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
          aria-label="Chat message"
          className="h-9 sm:h-10 text-sm"
        />
        <Button
          ref={emojiButtonRef}
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 sm:h-10 sm:w-10 shrink-0"
          onMouseEnter={() => emojiPickerImport()}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          aria-label="Toggle emoji picker"
          aria-expanded={showEmojiPicker}
        >
          <Smile className="h-4 w-4" />
        </Button>
        <Button
          type="submit"
          size="icon"
          className="h-9 w-9 sm:h-10 sm:w-10 shrink-0"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
