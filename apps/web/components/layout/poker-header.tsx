"use client";

import { Button, Check, Menu, MessageSquare, Share2 } from "@repo/ui";
import { useState } from "react";
import { ThemeToggle } from "../theme-toggle";

interface PokerHeaderProps {
  roomName: string;
  roomId: string;
  isChatOpen: boolean;
  isPlayerListOpen: boolean;
  onToggleChat: () => void;
  onTogglePlayerList: () => void;
}

export function PokerHeader({
  roomName,
  roomId,
  isChatOpen,
  isPlayerListOpen,
  onToggleChat,
  onTogglePlayerList,
}: PokerHeaderProps) {
  const [copied, setCopied] = useState(false);

  const shareRoom = () => {
    const url = `${window.location.origin}/poker/${roomId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
        <Button
          variant={isPlayerListOpen ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
          onClick={onTogglePlayerList}
          aria-label="Toggle player list"
        >
          <Menu className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
        <span className="text-xs sm:text-sm font-medium text-foreground truncate max-w-[140px] sm:max-w-[220px] md:max-w-[320px]">
          {roomName}
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="h-8 sm:h-9 gap-1.5 text-xs sm:text-sm px-2.5 sm:px-3"
          onClick={shareRoom}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Share</span>
            </>
          )}
        </Button>

        <ThemeToggle />

        <Button
          variant={isChatOpen ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 sm:h-9 sm:w-9"
          onClick={onToggleChat}
        >
          <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </header>
  );
}
