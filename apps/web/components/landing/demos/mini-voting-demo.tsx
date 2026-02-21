"use client";

import { cn } from "@repo/ui";
import { useEffect, useRef, useState } from "react";

interface Voter {
  id: number;
  name: string;
  vote: string | null;
  hasVoted: boolean;
  position: "top" | "bottom";
}

const INITIAL_VOTERS: Voter[] = [
  { id: 1, name: "Josh", vote: null, hasVoted: false, position: "top" },
  { id: 2, name: "Ivan", vote: null, hasVoted: false, position: "bottom" },
];

const VOTE_SEQUENCE = [
  { voterId: 1, vote: "21" },
  { voterId: 2, vote: "21" },
];

const CARD_VALUES = ["1", "2", "3", "5", "8", "13", "21", "☕"];

export function MiniVotingDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [voters, setVoters] = useState<Voter[]>(INITIAL_VOTERS);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [voteIndex, setVoteIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // Track visibility to pause animations when off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry?.isIntersecting ?? false),
      { threshold: 0.1 },
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Don't run animations when not visible
    if (!isVisible) return;

    if (isRevealed) {
      const resetTimeout = setTimeout(() => {
        setVoters(INITIAL_VOTERS);
        setSelectedCard(null);
        setVoteIndex(0);
        setIsRevealed(false);
      }, 3000);
      return () => clearTimeout(resetTimeout);
    }

    if (voteIndex >= VOTE_SEQUENCE.length) {
      const revealTimeout = setTimeout(() => {
        setIsRevealed(true);
      }, 1200);
      return () => clearTimeout(revealTimeout);
    }

    const voteTimeout = setTimeout(() => {
      const voteAction = VOTE_SEQUENCE[voteIndex];
      if (voteAction) {
        const { voterId, vote } = voteAction;
        setVoters((prev) =>
          prev.map((voter) =>
            voter.id === voterId ? { ...voter, vote, hasVoted: true } : voter,
          ),
        );
        if (voterId === 1) {
          setSelectedCard(vote);
        }
      }
      setVoteIndex((prev) => prev + 1);
    }, 1000);

    return () => clearTimeout(voteTimeout);
  }, [voteIndex, isRevealed, isVisible]);

  const votedCount = voters.filter((v) => v.hasVoted).length;

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl overflow-hidden h-[340px] bg-background border border-border shadow-soft-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <span className="text-sm font-semibold text-foreground">Sprint 42</span>
        <span className="text-xs font-medium text-muted-foreground">
          {votedCount}/{voters.length} voted
        </span>
      </div>

      {/* Poker Table Area */}
      <div className="p-4 flex flex-col items-center">
        {/* Mini Poker Table */}
        <div className="relative w-full max-w-[200px] h-[120px] flex items-center justify-center">
          {/* Table surface */}
          <div className="absolute inset-0 rounded-[40px] border-2 border-border bg-card shadow-soft-md" />
          <div className="absolute inset-2 rounded-[32px] border border-border/50 bg-muted/30" />

          {/* Top player */}
          {voters
            .filter((v) => v.position === "top")
            .map((voter) => (
              <div
                key={voter.id}
                className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
              >
                <PokerCardMini
                  vote={voter.vote}
                  hasVoted={voter.hasVoted}
                  isRevealed={isRevealed}
                />
                <span className="text-[10px] font-medium text-primary-600">
                  {voter.name}
                </span>
              </div>
            ))}

          {/* Bottom player */}
          {voters
            .filter((v) => v.position === "bottom")
            .map((voter) => (
              <div
                key={voter.id}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
              >
                <PokerCardMini
                  vote={voter.vote}
                  hasVoted={voter.hasVoted}
                  isRevealed={isRevealed}
                />
                <span className="text-[10px] font-medium text-muted-foreground">
                  {voter.name}
                </span>
              </div>
            ))}
        </div>

        {/* Vote Selection */}
        <div className="mt-6 w-full">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 text-center">
            Choose Your Card
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {CARD_VALUES.map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`Vote ${value} story points`}
                aria-pressed={selectedCard === value}
                className={cn(
                  "h-10 rounded-md border-2 text-xs font-bold transition-all duration-200",
                  selectedCard === value
                    ? "bg-primary-500 text-white border-primary-500 shadow-soft-md -translate-y-0.5"
                    : "bg-card text-foreground border-border hover:border-primary-300",
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PokerCardMini({
  vote,
  hasVoted,
  isRevealed,
}: {
  vote: string | null;
  hasVoted: boolean;
  isRevealed: boolean;
}) {
  return (
    <div
      className={cn(
        "w-8 h-11 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-soft-sm",
        !hasVoted &&
          "border-2 border-dashed border-border bg-card text-muted-foreground",
        hasVoted &&
          !isRevealed &&
          "bg-primary-500 text-white border border-primary-500 shadow-soft-md",
        hasVoted &&
          isRevealed &&
          "bg-card border-2 border-primary-500 text-primary-600 shadow-soft-md",
      )}
    >
      {!hasVoted ? "?" : isRevealed ? vote : "✓"}
    </div>
  );
}
