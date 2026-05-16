"use client";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  UserX,
  X,
} from "@repo/ui";
import { memo, useMemo, useState } from "react";
import { type CardSuit, FOLD_VALUE, isRedSuit } from "@/lib/constants/cards";
import type { Player } from "@/lib/types";

const PLAYER_SUITS = [
  "♠",
  "♥",
  "♣",
  "♦",
] as const satisfies readonly CardSuit[];

function getSuitForName(name: string): CardSuit {
  // Deterministic suit assignment from name so the role line stays stable.
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  const idx = hash % PLAYER_SUITS.length;
  return PLAYER_SUITS[idx] ?? "♠";
}

interface PlayerItemProps {
  player: Player;
  isCurrentUser: boolean;
  isRevealed: boolean;
  isFacilitator?: boolean;
  isOnline?: boolean;
  onKick?: (playerId: string) => void;
}

export const PlayerItem = memo(function PlayerItem({
  player,
  isCurrentUser,
  isRevealed,
  isFacilitator,
  isOnline = true,
  onKick,
}: PlayerItemProps) {
  const [isKickDialogOpen, setIsKickDialogOpen] = useState(false);
  const initials = useMemo(
    () =>
      player.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    [player.name],
  );

  const hasVoted = player.vote !== null;
  const hasFolded = player.vote === FOLD_VALUE;
  const canKick = isFacilitator && !isCurrentUser && onKick;
  const suit = getSuitForName(player.name);

  const handleConfirmKick = () => {
    setIsKickDialogOpen(false);
    onKick?.(player.id);
  };

  return (
    <li>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 transition-colors border-b border-rule",
          isCurrentUser && "bg-bone-2",
        )}
      >
        <div className="relative">
          <Avatar className="h-9 w-9 rounded-full border-0">
            <AvatarFallback className="text-sm font-medium bg-bone-2 text-ink-2 rounded-full">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div
            aria-hidden="true"
            className={cn(
              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
              !isOnline
                ? "bg-muted-foreground"
                : hasFolded
                  ? "bg-destructive"
                  : hasVoted
                    ? "bg-success"
                    : "bg-muted-foreground",
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">
              {player.name}
            </span>
            {player.role === "FACILITATOR" && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 uppercase tracking-wider"
              >
                Facilitator
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground leading-tight">
            {player.role === "FACILITATOR" ? "Dealer" : "Player"} ·{" "}
            <span
              aria-hidden="true"
              className={
                isRedSuit(suit) ? "text-destructive" : "text-muted-foreground"
              }
            >
              {suit}
            </span>
          </span>
        </div>

        <span
          className={cn(
            "text-[11px] font-medium tracking-wide",
            !isOnline
              ? "text-muted-foreground"
              : hasFolded
                ? "text-destructive"
                : hasVoted
                  ? "text-success"
                  : "text-muted-foreground",
          )}
        >
          {!isOnline ? (
            "Offline"
          ) : !hasVoted ? (
            <>
              <span aria-hidden="true">?</span>
              <span className="sr-only">Not voted</span>
            </>
          ) : hasFolded ? (
            "Fold"
          ) : isRevealed ? (
            `In · ${player.vote}`
          ) : (
            "In"
          )}
        </span>

        {canKick && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
            onClick={() => setIsKickDialogOpen(true)}
          >
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Remove {player.name} from room</span>
          </Button>
        )}
      </div>

      <Dialog open={isKickDialogOpen} onOpenChange={setIsKickDialogOpen}>
        <DialogContent className="max-w-sm gap-0">
          <DialogHeader className="items-center text-center pb-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 mb-2">
              <UserX className="h-6 w-6 text-destructive/80" />
            </div>
            <DialogTitle>Remove {player.name}?</DialogTitle>
            <DialogDescription className="text-balance">
              They will be removed from the room but can rejoin with the room
              link.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsKickDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleConfirmKick}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
});
