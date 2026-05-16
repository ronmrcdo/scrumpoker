"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { JoinRoomDialog } from "@/components/poker/join-room-dialog";
import { Consensus } from "@/components/poker/metrics/consensus";
import { Overview } from "@/components/poker/metrics/overview";
import { SuggestedEstimate } from "@/components/poker/metrics/suggested-estimate";
import { VoteDistribution } from "@/components/poker/metrics/vote-distribution";
import {
  FxCenterControls,
  FxEyebrow,
  FxFadeUp,
  FxHandLabel,
} from "@/components/poker/motion-fx";
import { PokerCards } from "@/components/poker/poker-cards";
import { Toolbar } from "@/components/poker/toolbar";
import { VoteSelection } from "@/components/poker/vote-selection";
import { trackEvent } from "@/lib/analytics";
import { FOLD_VALUE, isRedSuit, suitFor } from "@/lib/constants/cards";
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

  useRoomSync(initialRoom.id, initialRoom);
  usePresenceSync(room?.id ?? initialRoom.id);

  const {
    countdown: localCountdown,
    isCounting: isLocalCounting,
    start: startLocalCountdown,
  } = useRevealCountdown(toggleReveal);

  const noop = useCallback(() => {}, []);
  const {
    countdown: remoteCountdown,
    isCounting: isRemoteCounting,
    start: startRemoteCountdown,
  } = useRevealCountdown(noop);

  const remoteCountdownTriggerRef = useRef(0);
  useEffect(() => {
    if (remoteCountdownTrigger === 0) return;
    if (remoteCountdownTrigger === remoteCountdownTriggerRef.current) return;
    remoteCountdownTriggerRef.current = remoteCountdownTrigger;
    startRemoteCountdown();
  }, [remoteCountdownTrigger, startRemoteCountdown]);

  const countdown = localCountdown ?? remoteCountdown;
  const isCounting = isLocalCounting || isRemoteCounting;

  useEffect(() => {
    if (wasKicked) {
      setWasKicked(false);
      router.push("/?kicked=true");
    }
  }, [wasKicked, setWasKicked, router]);

  const activeRoom = room ?? initialRoom;
  const isFacilitator = activeRoom.facilitatorId === currentUserId;

  const { isPlayerInRoom, currentVote, foldedCount, votedCount } =
    useMemo(() => {
      let inRoom = false;
      let vote: string | null = null;
      let folded = 0;
      let voted = 0;
      for (const p of activeRoom.players) {
        if (p.id === currentUserId) {
          inRoom = true;
          vote = p.vote ?? null;
        }
        if (p.vote !== null) voted += 1;
        if (p.vote === FOLD_VALUE) folded += 1;
      }
      return {
        isPlayerInRoom: inRoom,
        currentVote: vote,
        foldedCount: folded,
        votedCount: voted,
      };
    }, [activeRoom.players, currentUserId]);

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
        voted_count: votedCount,
        fold_count: foldedCount,
      });
      startLocalCountdown();
      broadcastCountdown();
    }
  }, [
    activeRoom.isRevealed,
    activeRoom.id,
    activeRoom.players.length,
    votedCount,
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

  const voteSuit = suitFor(
    currentVote && currentVote !== FOLD_VALUE ? currentVote : null,
  );
  const voteSuitIsRed = isRedSuit(voteSuit);

  return (
    <div className="flex flex-col items-stretch gap-5 sm:gap-7 md:gap-8 px-3 sm:px-6 md:px-10 pt-4 sm:pt-6 pb-safe-fallback max-w-[1080px] mx-auto w-full">
      {!isPlayerInRoom && currentUserId && (
        <JoinRoomDialog roomId={activeRoom.id} />
      )}

      {/* Eyebrow strip above the table */}
      <FxEyebrow>
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-medium text-muted-foreground tracking-wide">
          <span className="text-foreground/80 font-semibold">02</span>
          <span aria-hidden="true">·</span>
          <span>The Hand</span>
          <span aria-hidden="true">·</span>
          <span>Round —</span>
          <span className="ml-auto text-foreground/80">
            {activeRoom.isRevealed ? "REVEALED" : "CARDS DOWN"}
          </span>
        </div>
      </FxEyebrow>

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {activeRoom.isRevealed
          ? "Votes revealed"
          : `${votedCount} of ${activeRoom.players.length} voted`}
      </span>

      {/* Felt table */}
      <PokerCards
        players={activeRoom.players}
        currentUserId={currentUserId}
        isRevealed={activeRoom.isRevealed}
        countdown={countdown}
      />

      {!activeRoom.isRevealed && foldedCount > 0 && (
        <p
          className="text-xs sm:text-sm text-destructive text-center"
          aria-live="polite"
        >
          {foldedCount} {foldedCount === 1 ? "player" : "players"} folded —
          needs clarification
        </p>
      )}

      {/* Results / metrics when revealed */}
      {activeRoom.isRevealed && (
        <div className="w-full space-y-4 sm:space-y-5">
          <Overview stats={stats} />
          <Consensus stats={stats} />
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <VoteDistribution stats={stats} />
            <SuggestedEstimate stats={stats} />
          </div>
        </div>
      )}

      {/* Center controls */}
      <FxCenterControls className="w-full flex justify-center">
        <div className="w-full max-w-xl">
          <Toolbar
            isFacilitator={isFacilitator}
            isRevealed={activeRoom.isRevealed}
            isCounting={isCounting}
            onToggleReveal={handleReveal}
            onReset={handleReset}
          />
        </div>
      </FxCenterControls>

      {/* Hand block: label + selection + status line */}
      {!activeRoom.isRevealed && (
        <div className="w-full flex flex-col gap-3 sm:gap-4 mt-2 sm:mt-4">
          <FxHandLabel>
            <div className="text-center text-xs font-medium text-muted-foreground tracking-wide">
              — Your hand —
            </div>
          </FxHandLabel>

          <VoteSelection
            currentVote={currentVote}
            isRevealed={activeRoom.isRevealed}
            onVote={handleVote}
          />

          <FxFadeUp>
            <p className="text-center text-xs sm:text-sm text-muted-foreground">
              {currentVote === null && (
                <span>Pick a card to place your bet.</span>
              )}
              {currentVote !== null && currentVote === FOLD_VALUE && (
                <span>
                  You folded —{" "}
                  <span className="text-destructive">need more info</span>.
                </span>
              )}
              {currentVote !== null && currentVote !== FOLD_VALUE && (
                <span>
                  You played{" "}
                  <span className="font-semibold text-foreground">
                    {currentVote}
                    <span
                      aria-hidden="true"
                      className={
                        voteSuitIsRed
                          ? "text-destructive ml-0.5"
                          : "text-muted-foreground ml-0.5"
                      }
                    >
                      {voteSuit}
                    </span>
                  </span>{" "}
                  — face down until reveal.
                </span>
              )}
            </p>
          </FxFadeUp>
        </div>
      )}
    </div>
  );
}
