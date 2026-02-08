"use client";

import { HeroCard } from "./hero-card";
import { HeroForm } from "./hero-form";

const HERO_CARD_VALUES = ["1", "2", "3", "5", "8", "13", "21"];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(107,125,230,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(107,125,230,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text + Form */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground">
                Real-time <span className="text-primary">Planning Poker</span>
                <br className="hidden sm:block" />
                <span className="text-muted-foreground font-light">
                  {" "}
                  for Agile Teams
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
                Estimate stories together with your team in real-time. No
                sign-up required. Just create a room and start planning.
              </p>
            </div>

            <div className="flex justify-center lg:justify-start">
              <HeroForm />
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  role="presentation"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  role="presentation"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>No sign-up</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  role="presentation"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Real-time sync</span>
              </div>
            </div>
          </div>

          {/* Right: Poker Table with Cards */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center">
            {/* Poker Table */}
            <div className="relative w-full max-w-md aspect-[4/3]">
              {/* Table surface */}
              <div className="absolute inset-0 rounded-[40%] bg-gradient-to-br from-neutral-800 to-neutral-900 shadow-2xl border-4 border-neutral-700">
                {/* Inner felt */}
                <div className="absolute inset-4 rounded-[35%] bg-gradient-to-br from-emerald-800 to-emerald-900 shadow-inner">
                  {/* Table rim highlight */}
                  <div className="absolute inset-0 rounded-[35%] bg-gradient-to-t from-transparent to-emerald-700/20" />
                </div>
              </div>

              {/* Cards container - positioned above the table */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[70%] perspective-1000">
                <div className="relative flex items-end justify-center h-32 sm:h-36 md:h-40">
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

              {/* Ambient glow */}
              <div className="absolute -inset-8 rounded-full bg-primary/5 blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="presentation"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
