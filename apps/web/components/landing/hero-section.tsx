"use client";

import { HeroCard } from "./hero-card";
import { HeroForm } from "./hero-form";

const HERO_CARD_VALUES = ["1", "2", "3", "5", "8", "13", "21"];

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="border-b border-border bg-background"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-10 py-16 sm:py-24 lg:py-28">
        <div className="flex items-center gap-4 mb-10 sm:mb-14 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <span className="text-destructive">01</span>
          <span>The Cover Story</span>
          <span className="ml-auto hidden sm:inline">
            For Agile Teams · Real-time · No Sign-up
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-12 sm:mb-16">
          <div className="lg:col-span-8">
            <h1
              id="hero-heading"
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-[6rem] font-medium tracking-[-0.035em] leading-[1.02] text-foreground"
            >
              Estimate
              <br />
              like you
              <br />
              <span className="text-foreground">mean it.</span>
            </h1>
          </div>
          <div className="lg:col-span-4 space-y-6 lg:pt-3">
            <p className="text-xl sm:text-2xl leading-snug text-ink-2">
              Planning poker for product teams who'd rather play a hand than
              argue a number.
            </p>
            <div className="h-px bg-border" />
            <p className="text-base leading-relaxed text-muted-foreground">
              Deal a room, invite your team, and reveal estimates together. No
              accounts, no anchoring, no theatrics — just the cards on the table
              and the conversation that follows.
            </p>
          </div>
        </div>

        <div className="h-px bg-border mb-12 sm:mb-16" />

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground flex items-center gap-3">
              <span className="text-destructive">→</span>
              <span>Deal yourself in</span>
            </div>
            <HeroForm />
            <div className="flex flex-wrap gap-2">
              {[
                { suit: "♠", label: "Free forever" },
                { suit: "♥", label: "No sign-up" },
                { suit: "♦", label: "Real-time" },
              ].map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center px-3 py-1 rounded-full border border-border text-xs text-muted-foreground"
                >
                  <span aria-hidden="true" className="mr-1">
                    {chip.suit}
                  </span>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 flex items-center justify-center min-h-[280px] sm:min-h-[340px]">
            <div className="relative w-full max-w-[480px] h-[280px] sm:h-[340px] flex items-center justify-center">
              {HERO_CARD_VALUES.map((value, index) => (
                <HeroCard
                  key={value}
                  value={value}
                  index={index}
                  totalCards={HERO_CARD_VALUES.length}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
