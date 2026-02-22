"use client";

import {
  AlertTriangle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  LogOut,
  Separator,
  Users,
} from "@repo/ui";
import { useState } from "react";

import { FOLD_VALUE } from "@/lib/constants/cards";
import type { Player } from "@/lib/types";
import { PlayerItem } from "./player-item";

interface PlayerListProps {
  players: Player[];
  currentUserId: string;
  isRevealed: boolean;
  isFacilitator: boolean;
  onlinePlayerIds?: Set<string>;
  onLeave: () => void;
  onKick: (playerId: string) => void;
}

export function PlayerList({
  players,
  currentUserId,
  isRevealed,
  isFacilitator,
  onlinePlayerIds,
  onLeave,
  onKick,
}: PlayerListProps) {
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  let votedCount = 0;
  let foldCount = 0;
  let onlineCount = 0;
  for (const p of players) {
    if (p.vote !== null) votedCount++;
    if (p.vote === FOLD_VALUE) foldCount++;
    if (!onlinePlayerIds || onlinePlayerIds.has(p.id)) onlineCount++;
  }

  const handleConfirmLeave = () => {
    setIsLeaveDialogOpen(false);
    onLeave();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3">
        <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <h2 id="players-heading" className="text-sm font-semibold">
          Players
        </h2>
        <output
          aria-label={`${onlineCount} of ${players.length} online, ${votedCount} voted${foldCount > 0 ? `, ${foldCount} folded` : ""}`}
          className="ml-auto text-xs text-muted-foreground"
        >
          {onlineCount}/{players.length} online · {votedCount} voted
          {foldCount > 0 && (
            <span aria-hidden="true" className="text-amber-700 ml-1">
              ({foldCount} folded)
            </span>
          )}
        </output>
      </div>
      <Separator />
      <ul
        aria-labelledby="players-heading"
        className="flex-1 overflow-y-auto p-2 sm:p-2 space-y-1 list-none"
      >
        {players.map((player) => (
          <PlayerItem
            key={player.id}
            player={player}
            isCurrentUser={player.id === currentUserId}
            isRevealed={isRevealed}
            isFacilitator={isFacilitator}
            isOnline={onlinePlayerIds ? onlinePlayerIds.has(player.id) : true}
            onKick={onKick}
          />
        ))}
      </ul>
      <Separator />
      <div className="p-2 sm:p-3">
        <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground hover:text-destructive transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Leave Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm gap-0">
            <DialogHeader className="items-center text-center pb-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-2">
                <AlertTriangle className="h-6 w-6 text-destructive/80" />
              </div>
              <DialogTitle>Leave this room?</DialogTitle>
              <DialogDescription>
                You'll need the room link to rejoin.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-row gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsLeaveDialogOpen(false)}
              >
                Stay
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleConfirmLeave}
              >
                Leave
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
