"use client";

import { cn } from "@repo/ui";
import { isRedSuit } from "@/lib/constants/cards";
import { Reveal, RevealItem, RevealStagger } from "./_motion";

const FIB = [
  { v: "1", s: "♠" },
  { v: "2", s: "♥" },
  { v: "3", s: "♣" },
  { v: "5", s: "♦" },
  { v: "8", s: "♠" },
  { v: "13", s: "♥" },
  { v: "21", s: "♣" },
  { v: "☕", s: "♦" },
];

function DeckCard({ value, suit }: { value: string; suit: string }) {
  const isRed = isRedSuit(suit);
  return (
    <div
      className={cn(
        "relative w-[88px] sm:w-[110px] aspect-[5/7]",
        "rounded border border-border bg-card text-card-foreground",
        "shadow-soft-md",
        "flex flex-col justify-between px-3 py-2.5",
      )}
    >
      <div className="flex flex-col items-start leading-[0.92]">
        <span className="text-[18px] sm:text-[22px] font-semibold text-foreground">
          {value}
        </span>
        <span
          className={cn(
            "text-xs sm:text-sm",
            isRed ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {suit}
        </span>
      </div>

      <div
        aria-hidden
        className={cn(
          "absolute inset-0 grid place-items-center pointer-events-none",
          "text-5xl sm:text-6xl",
          isRed ? "text-destructive/20" : "text-bone-3",
        )}
      >
        {suit}
      </div>

      <div className="flex flex-col items-start leading-[0.92] self-end rotate-180">
        <span className="text-[18px] sm:text-[22px] font-semibold text-foreground">
          {value}
        </span>
        <span
          className={cn(
            "text-xs sm:text-sm",
            isRed ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {suit}
        </span>
      </div>
    </div>
  );
}

export function DeckSection() {
  return (
    <section
      id="deck"
      aria-labelledby="deck-heading"
      className="border-b border-border bg-bone-2"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-10 py-20 sm:py-28">
        <Reveal className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-end gap-4 mb-12 sm:mb-16">
          <div className="space-y-2">
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              04 · Fibonacci, with personality
            </div>
            <h2
              id="deck-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground leading-tight"
            >
              The deck
            </h2>
          </div>
        </Reveal>

        <RevealStagger className="flex flex-wrap justify-center gap-4 sm:gap-5 py-4">
          {FIB.map((c) => (
            <RevealItem key={`${c.v}-${c.s}`} aria-hidden="true">
              <DeckCard value={c.v} suit={c.s} />
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-12 sm:mt-16 items-start">
          <div className="space-y-3">
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              An Aside
            </div>
            <p className="text-2xl sm:text-3xl leading-snug text-foreground max-w-[24ch]">
              &ldquo;If you can&rsquo;t tell whether a story is a 5 or an 8,
              just pick the bigger one. It always grows.&rdquo;
            </p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              — Every Senior Engineer, eventually
            </p>
          </div>
          <div className="space-y-5">
            <div className="border-t border-border" />
            <p className="text-base leading-relaxed text-muted-foreground">
              The Fibonacci sequence isn&rsquo;t a math trick — it&rsquo;s a
              confidence ladder. As estimates grow, so does the uncertainty
              between them. There&rsquo;s no card between 8 and 13 because,
              honestly, you don&rsquo;t know the difference and neither does
              anyone else at the table.
            </p>
            <div className="border-t border-border" />
            <p className="text-base leading-relaxed text-muted-foreground">
              The <em>coffee</em> card is for &ldquo;I need a break.&rdquo; The{" "}
              <em>?</em> card is for &ldquo;I need more info.&rdquo; Both are
              honest answers and neither makes you look bad.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
