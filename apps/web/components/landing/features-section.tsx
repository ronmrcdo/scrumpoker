"use client";

import { Reveal, RevealItem, RevealStagger } from "./_motion";

const HOW_STEPS = [
  {
    n: "01",
    t: "Deal a room",
    d: "Pick a name for yourself and the sprint or story you're sizing. We mint a private link in under a second.",
  },
  {
    n: "02",
    t: "Pass the cards",
    d: "Share the link. Teammates join with no accounts, no email, no setup. Up to 24 around the table.",
  },
  {
    n: "03",
    t: "Show your hand",
    d: "Everyone picks a card face-down. When the facilitator reveals, the hand flips together — no anchoring, no peeking.",
  },
];

const HOUSE_RULES = [
  {
    n: "01",
    title: "Real-time hands",
    body: "Every flip, fold, and reveal syncs across the table in under 80ms. Watch your team's cards land as they're dealt.",
    icon: "♠",
  },
  {
    n: "02",
    title: "No anchoring",
    body: "Cards stay face-down until the facilitator reveals. The loudest engineer can't set the price before the rest of you finish thinking.",
    icon: "♥",
  },
  {
    n: "03",
    title: "Consensus, scored",
    body: "Median, spread, agreement index. We'll tell you when the table is split — and when it's actually time to stop arguing.",
    icon: "♣",
  },
  {
    n: "04",
    title: "Fold without shame",
    body: "The 'need more info' card is a first-class citizen. Folding a story is the cheapest re-deal in the deck.",
    icon: "♦",
  },
];

function SectionHead({
  num,
  title,
  eyebrow,
  headingId,
}: {
  num: string;
  title: string;
  eyebrow: string;
  headingId: string;
}) {
  return (
    <Reveal className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-end gap-4 mb-12 sm:mb-16">
      <div className="space-y-2">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {num} · {eyebrow}
        </div>
        <h2
          id={headingId}
          className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground leading-tight"
        >
          {title}
        </h2>
      </div>
    </Reveal>
  );
}

export function FeaturesSection() {
  return (
    <>
      <section
        id="how"
        aria-labelledby="how-heading"
        className="border-b border-border bg-background"
      >
        <div className="mx-auto max-w-[1320px] px-5 sm:px-10 py-20 sm:py-28">
          <SectionHead
            num="02"
            title="How it plays"
            eyebrow="Three rounds, no chips"
            headingId="how-heading"
          />
          <RevealStagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_STEPS.map((s) => (
              <RevealItem
                key={s.n}
                as="article"
                className="rounded-2xl border border-border bg-card p-8 sm:p-9 flex flex-col gap-4"
              >
                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  № {s.n}
                </div>
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground leading-tight">
                  {s.t}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {s.d}
                </p>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <section
        id="features"
        aria-labelledby="features-heading"
        className="border-b border-border bg-background"
      >
        <div className="mx-auto max-w-[1320px] px-5 sm:px-10 py-20 sm:py-28">
          <SectionHead
            num="03"
            title="The house rules"
            eyebrow="Features, but better named"
            headingId="features-heading"
          />
          <RevealStagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HOUSE_RULES.map((f) => {
              const isRed = f.icon === "♥" || f.icon === "♦";
              return (
                <RevealItem
                  key={f.n}
                  as="article"
                  className="rounded-2xl border border-border bg-card p-8 sm:p-9 flex flex-col gap-4 min-h-[220px]"
                >
                  <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    № {f.n}
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground leading-tight">
                      {f.title}
                    </h3>
                    <span
                      aria-hidden
                      className={
                        isRed
                          ? "text-4xl sm:text-5xl text-destructive leading-none"
                          : "text-4xl sm:text-5xl text-foreground leading-none"
                      }
                    >
                      {f.icon}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {f.body}
                  </p>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </div>
      </section>
    </>
  );
}
