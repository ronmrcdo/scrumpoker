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
  X,
} from "@repo/ui";
import { memo, useMemo, useState } from "react";
import { FOLD_VALUE } from "@/lib/constants/cards";
import type { Player } from "@/lib/types";

interface PlayerItemProps {
  player: Player;
  isCurrentUser: boolean;
  isRevealed: boolean;
  isFacilitator?: boolean;
  onKick?: (playerId: string) => void;
}

export const PlayerItem = memo(function PlayerItem({
  player,
  isCurrentUser,
  isRevealed,
  isFacilitator,
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

  const handleConfirmKick = () => {
    setIsKickDialogOpen(false);
    onKick?.(player.id);
  };

  return (
    <li>
      <div
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
          isCurrentUser && "bg-primary-50",
        )}
      >
        <div className="relative">
          <Avatar className="h-8 w-8">
            <AvatarFallback
              className={cn(
                "text-xs",
                isCurrentUser && "bg-primary-100 text-primary-700",
              )}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div
            className={cn(
              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
              hasFolded
                ? "bg-amber-500"
                : hasVoted
                  ? "bg-accent-500"
                  : "bg-muted-foreground/40",
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium truncate",
                isCurrentUser && "text-primary-700",
              )}
            >
              {player.name}
            </span>
            {player.role === "FACILITATOR" && (
              <Badge variant="default" className="text-[10px] px-1.5 py-0">
                The Dealer
              </Badge>
            )}
          </div>
          <span
            className={cn(
              "text-xs",
              hasFolded
                ? "text-amber-600 font-medium"
                : "text-muted-foreground",
            )}
          >
            {!hasVoted
              ? "Thinking..."
              : hasFolded
                ? "Folded"
                : isRevealed
                  ? `Voted: ${player.vote}`
                  : "Voted"}
          </span>
        </div>

        {canKick && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
            onClick={() => setIsKickDialogOpen(true)}
          >
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Kick player</span>
          </Button>
        )}
      </div>

      <Dialog open={isKickDialogOpen} onOpenChange={setIsKickDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kick Player?</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {player.name} from the room? They
              can rejoin with the room code.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsKickDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmKick}>
              Kick Player
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
});
