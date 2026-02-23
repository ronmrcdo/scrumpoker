"use client";

import { Check } from "@repo/ui";
import { HeroCard } from "./hero-card";
import { HeroForm } from "./hero-form";

const HERO_CARD_VALUES = ["1", "2", "3", "5", "8", "13", "21"];

const TRUST_ITEMS = ["Free forever", "No sign-up", "Real-time sync"];

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative min-h-[calc(100svh-3.5rem)] flex items-center justify-center overflow-hidden pt-14"
    >
      {/* Background — soft gradient that establishes depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-background to-background" />

      {/* Decorative grid — subtle structure, not decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(107,125,230,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(107,125,230,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Text + Form — the focal point */}
          <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4">
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold tracking-tight leading-[1.1] text-foreground"
              >
                Real-time <span className="text-primary">Planning Poker</span>
                <br />
                <span className="text-muted-foreground/70 font-normal text-[0.75em]">
                  for Agile Teams
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed">
                Estimate stories together with your team in real-time. No
                sign-up required — just create a room and start planning.
              </p>
            </div>

            <div className="flex justify-center lg:justify-start">
              <HeroForm />
            </div>

            {/* Trust badges — compact, factual */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2">
              {TRUST_ITEMS.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <Check
                    aria-hidden="true"
                    className="w-3.5 h-3.5 text-accent shrink-0"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Poker Table with Cards */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center">
            {/* Poker Table */}
            <div className="relative w-full max-w-md aspect-[4/3]">
              {/* Table surface */}
              <div className="absolute inset-0 rounded-[40%] bg-gradient-to-br from-neutral-800 to-neutral-900 shadow-soft-xl border-4 border-neutral-700">
                {/* Inner felt */}
                <div className="absolute inset-4 rounded-[35%] bg-gradient-to-br from-emerald-800 to-emerald-900 shadow-inner">
                  {/* Table rim highlight */}
                  <div className="absolute inset-0 rounded-[35%] bg-gradient-to-t from-transparent to-emerald-700/20" />
                </div>
              </div>

              {/* Cards container */}
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
    </section>
  );
}
