"use client";

import { Button, Check, cn, Menu, Share2 } from "@repo/ui";
import { useState } from "react";
import { FxRoomTop } from "@/components/poker/motion-fx";
import { trackEvent } from "@/lib/analytics";
import { ThemeToggle } from "../theme-toggle";

interface PokerHeaderProps {
  roomId: string;
  roomName: string;
  isPlayerListOpen: boolean;
  onTogglePlayerList: () => void;
}

export function PokerHeader({
  roomId,
  roomName,
  isPlayerListOpen,
  onTogglePlayerList,
}: PokerHeaderProps) {
  const [copied, setCopied] = useState(false);

  const shareRoom = () => {
    const url = `${window.location.origin}/poker/${roomId}`;
    navigator.clipboard.writeText(url);
    trackEvent("invite_link_copied", { room_id: roomId, source: "header" });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <FxRoomTop>
      <header
        className={cn(
          "sticky top-0 z-40 bg-card/90 backdrop-blur-sm border-b border-rule",
          "grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-6",
          "px-3 sm:px-6 py-3 sm:py-4",
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant={isPlayerListOpen ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
            onClick={() => {
              trackEvent("player_sidebar_toggled", {
                is_open: !isPlayerListOpen,
                room_id: roomId,
              });
              onTogglePlayerList();
            }}
            aria-label={
              isPlayerListOpen ? "Close player list" : "Open player list"
            }
            aria-expanded={isPlayerListOpen}
            aria-controls="player-sidebar"
          >
            <Menu className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>

        <div className="flex items-baseline justify-center gap-2 sm:gap-3 min-w-0">
          <span
            aria-hidden="true"
            className="hidden sm:inline text-xs font-medium text-muted-foreground tracking-wide whitespace-nowrap"
          >
            The Room —
          </span>
          <h1 className="text-base sm:text-lg md:text-xl font-semibold text-foreground tracking-tight truncate">
            {roomName || "Scrum Poker Game"}
          </h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0 justify-self-end">
          <Button
            variant="outline"
            size="sm"
            className="h-8 sm:h-9 gap-1.5 text-xs sm:text-sm px-2.5 sm:px-3 border-rule"
            onClick={shareRoom}
            aria-label={copied ? "Link copied to clipboard" : "Copy share link"}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Share Link</span>
              </>
            )}
          </Button>

          <ThemeToggle />
        </div>
      </header>
    </FxRoomTop>
  );
}
