"use client";

import { cn, MessageSquare, Send, Smile } from "@repo/ui";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: number;
  senderName: string;
  text: string;
  timestamp: string;
  isOwnMessage: boolean;
}

const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    senderName: "Sarah",
    text: "I think this is a 5, similar to the auth refactor",
    timestamp: "2:34 PM",
    isOwnMessage: false,
  },
  {
    id: 2,
    senderName: "You",
    text: "Agreed, but we need to account for API changes",
    timestamp: "2:35 PM",
    isOwnMessage: true,
  },
  {
    id: 3,
    senderName: "Alex",
    text: "Good point! Maybe an 8 then?",
    timestamp: "2:35 PM",
    isOwnMessage: false,
  },
  {
    id: 4,
    senderName: "You",
    text: "Let's vote and discuss after reveal",
    timestamp: "2:36 PM",
    isOwnMessage: true,
  },
];

export function MiniChatDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Track visibility to pause animations when off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry?.isIntersecting ?? false),
      { threshold: 0.1 },
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Don't run animations when not visible
    if (!isVisible) return;

    if (currentIndex >= DEMO_MESSAGES.length) {
      const resetTimeout = setTimeout(() => {
        setVisibleMessages([]);
        setCurrentIndex(0);
      }, 4000);
      return () => clearTimeout(resetTimeout);
    }

    setIsTyping(true);
    const typingTimeout = setTimeout(() => {
      setIsTyping(false);
      const message = DEMO_MESSAGES[currentIndex];
      if (message) {
        setVisibleMessages((prev) => [...prev, message]);
      }
      setCurrentIndex((prev) => prev + 1);
    }, 1500);

    return () => clearTimeout(typingTimeout);
  }, [currentIndex, isVisible]);

  const nextMessage = DEMO_MESSAGES[currentIndex];

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl overflow-hidden h-[340px] bg-background border border-border shadow-soft-lg flex flex-col"
    >
      {/* Chat Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">Chat</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden p-3 space-y-2">
        {visibleMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex flex-col gap-0.5 animate-in",
              msg.isOwnMessage
                ? "items-end slide-in-from-right-2"
                : "items-start slide-in-from-left-2",
            )}
          >
            {!msg.isOwnMessage && (
              <span className="text-[10px] text-muted-foreground font-medium ml-3">
                {msg.senderName}
              </span>
            )}
            <div
              className={cn(
                "max-w-[85%] px-3 py-2 rounded-2xl text-xs",
                msg.isOwnMessage
                  ? "bg-primary-100 text-primary-800 rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md",
              )}
            >
              {msg.text}
            </div>
            <span className="text-[9px] text-muted-foreground mx-3">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && nextMessage && (
          <div
            className={cn(
              "flex flex-col gap-0.5 animate-in fade-in",
              nextMessage.isOwnMessage ? "items-end" : "items-start",
            )}
          >
            {!nextMessage.isOwnMessage && (
              <span className="text-[10px] text-muted-foreground font-medium ml-3">
                {nextMessage.senderName}
              </span>
            )}
            <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3 border-t border-border">
        <div className="flex-1 h-9 px-3 rounded-md border border-border bg-card flex items-center">
          <span className="text-xs text-muted-foreground">
            Type a message...
          </span>
        </div>
        <button
          type="button"
          aria-label="Open emoji picker"
          className="h-9 w-9 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Smile aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
        </button>
        <button
          type="button"
          aria-label="Send message"
          className="h-9 w-9 rounded-md bg-primary-500 flex items-center justify-center"
        >
          <Send aria-hidden="true" className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
}
