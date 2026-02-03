"use client";

import { usePokerStore } from "@/lib/store/poker-store";
import { MOCK_CURRENT_USER_ID } from "@/lib/mock-data";
import { getVoteStats } from "@/lib/utils";
import { PokerCards } from "@/components/poker/poker-cards";
import { VoteSelection } from "@/components/poker/vote-selection";
import { Toolbar } from "@/components/poker/toolbar";
import { Consensus } from "@/components/poker/metrics/consensus";
import { Overview } from "@/components/poker/metrics/overview";
import { useRouter } from "next/navigation";

export default function PokerRoomPage() {
  const router = useRouter();
  const room = usePokerStore((s) => s.room);
  const castVote = usePokerStore((s) => s.castVote);
  const toggleReveal = usePokerStore((s) => s.toggleReveal);
  const resetVotes = usePokerStore((s) => s.resetVotes);
  const currentUserId = usePokerStore((s) => s.currentUserId) || MOCK_CURRENT_USER_ID;

  if (!room) {
    router.push("/");
    return null;
  }

  const isFacilitator = room.facilitatorId === currentUserId;
  const currentVote = room.members.find((m) => m.id === currentUserId)?.vote ?? null;
  const stats = room.isRevealed ? getVoteStats(room.members) : null;

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
      {/* Session Info */}
      <div className="text-center px-2">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground break-words">{room.name}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {room.isRevealed
            ? "Votes revealed!"
            : `${room.members.filter((m) => m.vote !== null).length}/${room.members.length} voted`}
        </p>
      </div>

      {/* Poker Table with radial cards */}
      <PokerCards
        members={room.members}
        currentUserId={currentUserId}
        isRevealed={room.isRevealed}
      />

      {/* Vote Selection */}
      <div className="w-full max-w-sm px-2">
        <VoteSelection
          currentVote={currentVote}
          isRevealed={room.isRevealed}
          onVote={castVote}
        />
      </div>

      {/* Toolbar */}
      <div className="w-full max-w-sm px-2">
        <Toolbar
          isFacilitator={isFacilitator}
          isRevealed={room.isRevealed}
          onToggleReveal={toggleReveal}
          onReset={resetVotes}
        />
      </div>

      {/* Metrics (shown when revealed) */}
      {room.isRevealed && (
        <div className="w-full max-w-sm px-2 space-y-2 sm:space-y-3">
          <Consensus stats={stats} />
          <Overview stats={stats} />
        </div>
      )}
    </div>
  );
}
