"use client";

import {
  Badge,
  Button,
  Copy,
  MessageSquare,
  Menu,
} from "@repo/ui";
import { ThemeToggle } from "../theme-toggle";

interface PokerHeaderProps {
  roomName: string;
  roomCode: string;
  isChatOpen: boolean;
  isPlayerListOpen: boolean;
  onToggleChat: () => void;
  onTogglePlayerList: () => void;
}

export function PokerHeader({ roomName, roomCode, isChatOpen, isPlayerListOpen, onToggleChat, onTogglePlayerList }: PokerHeaderProps) {
  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
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
        <Badge
          variant="outline"
          className="font-mono cursor-pointer hover:bg-muted gap-1 text-xs sm:text-sm px-2 py-0.5"
          onClick={copyCode}
        >
          {roomCode}
          <Copy className="h-3 w-3" />
        </Badge>

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
