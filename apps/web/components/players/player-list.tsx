"use client";

import {
  AlertTriangle,
  Button,
  Check,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  LogOut,
  Separator,
  Share2,
} from "@repo/ui";
import { useEffect, useState } from "react";

import { trackEvent } from "@/lib/analytics";
import { FOLD_VALUE } from "@/lib/constants/cards";
import type { Player } from "@/lib/types";
import { PlayerItem } from "./player-item";

interface PlayerListProps {
  players: Player[];
  currentUserId: string;
  isRevealed: boolean;
  isFacilitator: boolean;
  roomId?: string;
  onlinePlayerIds?: Set<string>;
  onLeave: () => void;
  onKick: (playerId: string) => void;
}

export function PlayerList({
  players,
  currentUserId,
  isRevealed,
  isFacilitator,
  roomId,
  onlinePlayerIds,
  onLeave,
  onKick,
}: PlayerListProps) {
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && roomId) {
      setInviteUrl(`${window.location.origin}/poker/${roomId}`);
    }
  }, [roomId]);

  let votedCount = 0;
  let foldCount = 0;
  for (const p of players) {
    if (p.vote !== null) votedCount++;
    if (p.vote === FOLD_VALUE) foldCount++;
  }

  const handleConfirmLeave = () => {
    setIsLeaveDialogOpen(false);
    onLeave();
  };

  const handleCopyInvite = () => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    trackEvent("invite_link_copied", {
      room_id: roomId ?? "",
      source: "sidebar",
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-baseline justify-between px-4 py-4">
        <h2
          id="players-heading"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          At the table
        </h2>
        <output
          aria-label={`${votedCount} of ${players.length} in${foldCount > 0 ? `, ${foldCount} folded` : ""}`}
          className="text-xs font-medium text-muted-foreground tracking-wide"
        >
          {votedCount}/{players.length} In
          {foldCount > 0 && (
            <span aria-hidden="true" className="text-destructive ml-1">
              · {foldCount} Fold
            </span>
          )}
        </output>
      </div>
      <Separator />
      <ul
        aria-labelledby="players-heading"
        className="flex-1 overflow-y-auto list-none"
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

      {roomId && (
        <div className="px-4 py-4 border-t border-rule">
          <div className="text-xs font-medium text-muted-foreground tracking-wide mb-2">
            Invite
          </div>
          <div
            aria-hidden="true"
            className="font-mono text-[11px] px-3 py-2 border border-dashed border-ink-3/40 bg-bone-2 text-ink-2 rounded-md break-all mb-2"
          >
            {inviteUrl || "…"}
          </div>
          <Button
            variant="default"
            size="sm"
            className="w-full gap-1.5"
            onClick={handleCopyInvite}
            aria-label={copied ? "Link copied" : "Copy invite link"}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Copy invite
              </>
            )}
          </Button>
        </div>
      )}

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
