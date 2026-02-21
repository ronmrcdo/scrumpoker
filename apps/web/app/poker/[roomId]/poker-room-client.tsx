"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
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
import { trackEvent } from "@/lib/analytics";
import { FOLD_VALUE } from "@/lib/constants/cards";
import { useChatSync } from "@/lib/hooks/use-chat-sync";
import { usePresenceSync } from "@/lib/hooks/use-presence-sync";
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
    broadcastCountdown,
    remoteCountdownTrigger,
  } = usePokerStore(
    useShallow((s) => ({
      room: s.room,
      wasKicked: s.wasKicked,
      setWasKicked: s.setWasKicked,
      castVote: s.castVote,
      toggleReveal: s.toggleReveal,
      resetVotes: s.resetVotes,
      currentUserId: s.currentUserId,
      broadcastCountdown: s.broadcastCountdown,
      remoteCountdownTrigger: s.remoteCountdownTrigger,
    })),
  );

  // Subscribe to realtime updates and hydrate the store
  useRoomSync(initialRoom.id, initialRoom);

  // Subscribe to chat broadcast channel
  useChatSync(room?.id ?? initialRoom.id);

  // Subscribe to presence channel for online/offline detection
  usePresenceSync(room?.id ?? initialRoom.id);

  // Local countdown for facilitator (triggers toggleReveal on completion)
  const {
    countdown: localCountdown,
    isCounting: isLocalCounting,
    start: startLocalCountdown,
  } = useRevealCountdown(toggleReveal);

  // Remote countdown for non-facilitators (visual only)
  const noop = useCallback(() => {}, []);
  const {
    countdown: remoteCountdown,
    isCounting: isRemoteCounting,
    start: startRemoteCountdown,
  } = useRevealCountdown(noop);

  // Start remote countdown when a broadcast is received
  const remoteCountdownTriggerRef = useRef(0);
  useEffect(() => {
    if (remoteCountdownTrigger === 0) return;
    if (remoteCountdownTrigger === remoteCountdownTriggerRef.current) return;
    remoteCountdownTriggerRef.current = remoteCountdownTrigger;
    startRemoteCountdown();
  }, [remoteCountdownTrigger, startRemoteCountdown]);

  // Merge local and remote countdown for display
  const countdown = localCountdown ?? remoteCountdown;
  const isCounting = isLocalCounting || isRemoteCounting;

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

  const handleVote = useCallback(
    (value: string | null) => {
      if (value === null) {
        trackEvent("vote_cleared", {
          room_id: activeRoom.id,
          previous_value: currentVote ?? "",
        });
      } else if (value === FOLD_VALUE) {
        trackEvent("vote_folded", {
          room_id: activeRoom.id,
          player_count: activeRoom.players.length,
        });
      } else {
        trackEvent("vote_cast", {
          room_id: activeRoom.id,
          vote_value: value,
          is_change: currentVote !== null,
          player_count: activeRoom.players.length,
        });
      }
      castVote(value);
    },
    [activeRoom.id, activeRoom.players.length, currentVote, castVote],
  );

  const handleReveal = useCallback(() => {
    if (activeRoom.isRevealed) {
      toggleReveal();
    } else {
      trackEvent("votes_revealed", {
        room_id: activeRoom.id,
        player_count: activeRoom.players.length,
        voted_count: activeRoom.players.filter((p) => p.vote !== null).length,
        fold_count: foldedCount,
      });
      startLocalCountdown();
      broadcastCountdown();
    }
  }, [
    activeRoom.isRevealed,
    activeRoom.id,
    activeRoom.players,
    foldedCount,
    toggleReveal,
    startLocalCountdown,
    broadcastCountdown,
  ]);

  const handleReset = useCallback(() => {
    trackEvent("votes_reset", {
      room_id: activeRoom.id,
      player_count: activeRoom.players.length,
      had_consensus: stats?.consensus ?? false,
    });
    resetVotes();
  }, [activeRoom.id, activeRoom.players.length, stats?.consensus, resetVotes]);

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
      {!isPlayerInRoom && currentUserId && (
        <JoinRoomDialog roomId={activeRoom.id} />
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

      {/* Vote Selection (hidden when revealed) */}
      {!activeRoom.isRevealed && (
        <div className="w-full max-w-sm px-2">
          <VoteSelection
            currentVote={currentVote}
            isRevealed={activeRoom.isRevealed}
            onVote={handleVote}
          />
        </div>
      )}

      {/* Metrics (shown when revealed, above toolbar) */}
      {activeRoom.isRevealed && (
        <div className="w-full max-w-sm px-2 space-y-2 sm:space-y-3">
          <Consensus stats={stats} />
          <Overview stats={stats} />
          <VoteDistribution stats={stats} />
          <SuggestedEstimate stats={stats} />
        </div>
      )}

      {/* Toolbar */}
      <div className="w-full max-w-sm px-2">
        <Toolbar
          isFacilitator={isFacilitator}
          isRevealed={activeRoom.isRevealed}
          isCounting={isCounting}
          onToggleReveal={handleReveal}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}
