"use client";

import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  cn,
  X,
} from "@repo/ui";
import type { Member } from "@/lib/types";

interface PlayerItemProps {
  member: Member;
  isCurrentUser: boolean;
  isRevealed: boolean;
  isFacilitator?: boolean;
  onKick?: (playerId: string) => void;
}

export function PlayerItem({ member, isCurrentUser, isRevealed, isFacilitator, onKick }: PlayerItemProps) {
  const [isKickDialogOpen, setIsKickDialogOpen] = useState(false);
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const hasVoted = member.vote !== null;
  const canKick = isFacilitator && !isCurrentUser && onKick;

  const handleConfirmKick = () => {
    setIsKickDialogOpen(false);
    onKick?.(member.id);
  };

  return (
    <>
      <div className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
        isCurrentUser && "bg-primary-50",
      )}>
        <div className="relative">
          <Avatar className="h-8 w-8">
            <AvatarFallback className={cn(
              "text-xs",
              isCurrentUser && "bg-primary-100 text-primary-700",
            )}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div
            className={cn(
              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
              hasVoted ? "bg-accent-500" : "bg-muted-foreground/40",
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm font-medium truncate",
              isCurrentUser && "text-primary-700",
            )}>
              {member.name}
            </span>
            {member.role === "FACILITATOR" && (
              <Badge variant="default" className="text-[10px] px-1.5 py-0">
                Host
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {!hasVoted ? "Thinking..." : isRevealed ? `Voted: ${member.vote}` : "Voted"}
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
              Are you sure you want to remove {member.name} from the room? They can rejoin with the room code.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsKickDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmKick}
            >
              Kick Player
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
