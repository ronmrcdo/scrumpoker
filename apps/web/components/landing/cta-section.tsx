"use client";

import { Button } from "@repo/ui";
import { Reveal } from "./_motion";

export function CtaSection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="border-b border-border bg-background"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-10 py-20 sm:py-28">
        <Reveal className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-10">
          <h2
            id="cta-heading"
            className="text-4xl sm:text-6xl md:text-7xl font-medium tracking-[-0.02em] text-foreground leading-[0.95] max-w-[14ch]"
          >
            Ready to <span className="italic text-destructive">deal in</span>?
          </h2>
          <div className="flex flex-col items-start md:items-end gap-3">
            <Button asChild size="lg">
              <a href="#hero">Open a Room ↗</a>
            </Button>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Free · No sign-up · Real-time
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
