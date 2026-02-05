"use client";

import {
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

import type { Player } from "@/lib/types";
import { PlayerItem } from "./player-item";

interface PlayerListProps {
  players: Player[];
  currentUserId: string;
  isRevealed: boolean;
  isFacilitator: boolean;
  onLeave: () => void;
  onKick: (playerId: string) => void;
}

export function PlayerList({
  players,
  currentUserId,
  isRevealed,
  isFacilitator,
  onLeave,
  onKick,
}: PlayerListProps) {
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const votedCount = players.filter((p) => p.vote !== null).length;

  const handleConfirmLeave = () => {
    setIsLeaveDialogOpen(false);
    onLeave();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold">Players</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {votedCount}/{players.length} voted
        </span>
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto p-2 sm:p-2 space-y-1">
        {players.map((player) => (
          <PlayerItem
            key={player.id}
            player={player}
            isCurrentUser={player.id === currentUserId}
            isRevealed={isRevealed}
            isFacilitator={isFacilitator}
            onKick={onKick}
          />
        ))}
      </div>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Leave Room?</DialogTitle>
              <DialogDescription>
                Are you sure you want to leave this room? You'll need the room
                code to rejoin.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsLeaveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmLeave}>
                Leave Room
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
