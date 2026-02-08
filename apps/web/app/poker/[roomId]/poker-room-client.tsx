"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { InviteBanner } from "@/components/poker/invite-banner";
import { JoinRoomDialog } from "@/components/poker/join-room-dialog";
import { Consensus } from "@/components/poker/metrics/consensus";
import { Overview } from "@/components/poker/metrics/overview";
import { SuggestedEstimate } from "@/components/poker/metrics/suggested-estimate";
import { VoteDistribution } from "@/components/poker/metrics/vote-distribution";
import { PokerCards } from "@/components/poker/poker-cards";
import { Toolbar } from "@/components/poker/toolbar";
import { VoteSelection } from "@/components/poker/vote-selection";
import { FOLD_VALUE } from "@/lib/constants/cards";
import { useChatSync } from "@/lib/hooks/use-chat-sync";
import { useRevealCountdown } from "@/lib/hooks/use-reveal-countdown";
import { useRoomSync } from "@/lib/hooks/use-room-sync";
import { usePokerStore } from "@/lib/store/poker-store";
import type { Room } from "@/lib/types";
import { getVoteStats } from "@/lib/utils";

interface PokerRoomClientProps {
  initialRoom: Room;
}

export function PokerRoomClient({ initialRoom }: PokerRoomClientProps) {
  const router = useRouter();
  const {
    room,
    wasKicked,
    setWasKicked,
    castVote,
    toggleReveal,
    resetVotes,
    currentUserId,
  } = usePokerStore(
    useShallow((s) => ({
      room: s.room,
      wasKicked: s.wasKicked,
      setWasKicked: s.setWasKicked,
      castVote: s.castVote,
      toggleReveal: s.toggleReveal,
      resetVotes: s.resetVotes,
      currentUserId: s.currentUserId,
    })),
  );

  // Subscribe to realtime updates and hydrate the store
  useRoomSync(initialRoom.id, initialRoom);

  // Subscribe to chat broadcast channel
  useChatSync(room?.code ?? initialRoom.code);

  // Countdown timer for reveal
  const {
    countdown,
    isCounting,
    start: startCountdown,
  } = useRevealCountdown(toggleReveal);

  // Redirect to home if kicked
  useEffect(() => {
    if (wasKicked) {
      setWasKicked(false);
      router.push("/?kicked=true");
    }
  }, [wasKicked, setWasKicked, router]);

  // Use initialRoom as fallback only if not kicked
  const activeRoom = room ?? initialRoom;

  const isPlayerInRoom = activeRoom.players.some((p) => p.id === currentUserId);
  const isFacilitator = activeRoom.facilitatorId === currentUserId;
  const currentVote =
    activeRoom.players.find((p) => p.id === currentUserId)?.vote ?? null;
  const foldedCount = activeRoom.players.filter(
    (p) => p.vote === FOLD_VALUE,
  ).length;

  // Memoize stats calculation to prevent recalculation on every render
  const stats = useMemo(
    () => (activeRoom.isRevealed ? getVoteStats(activeRoom.players) : null),
    [activeRoom.isRevealed, activeRoom.players],
  );

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
      {!isPlayerInRoom && currentUserId && (
        <JoinRoomDialog roomCode={activeRoom.code} />
      )}
      {/* Session Info */}
      <div className="text-center px-2">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground break-words">
          {activeRoom.name}
        </h1>
        <p
          className="text-xs sm:text-sm text-muted-foreground mt-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {activeRoom.isRevealed
            ? "Votes revealed!"
            : `${activeRoom.players.filter((p) => p.vote !== null).length}/${activeRoom.players.length} voted`}
        </p>
        {!activeRoom.isRevealed && foldedCount > 0 && (
          <p className="text-xs text-amber-600 font-medium mt-0.5">
            {foldedCount} {foldedCount === 1 ? "player" : "players"} folded —
            needs clarification
          </p>
        )}
      </div>

      {/* Poker Table with radial cards */}
      <PokerCards
        players={activeRoom.players}
        currentUserId={currentUserId}
        isRevealed={activeRoom.isRevealed}
        countdown={countdown}
      />

      {/* Invite banner when alone */}
      {activeRoom.players.length === 1 && (
        <InviteBanner roomId={activeRoom.id} />
      )}

      {/* Vote Selection */}
      <div className="w-full max-w-sm px-2">
        <VoteSelection
          currentVote={currentVote}
          isRevealed={activeRoom.isRevealed}
          onVote={castVote}
        />
      </div>

      {/* Toolbar */}
      <div className="w-full max-w-sm px-2">
        <Toolbar
          isFacilitator={isFacilitator}
          isRevealed={activeRoom.isRevealed}
          isCounting={isCounting}
          onToggleReveal={activeRoom.isRevealed ? toggleReveal : startCountdown}
          onReset={resetVotes}
        />
      </div>

      {/* Metrics (shown when revealed) */}
      {activeRoom.isRevealed && (
        <div className="w-full max-w-sm px-2 space-y-2 sm:space-y-3">
          <Consensus stats={stats} />
          <Overview stats={stats} />
          <VoteDistribution stats={stats} />
          <SuggestedEstimate stats={stats} />
        </div>
      )}
    </div>
  );
}
