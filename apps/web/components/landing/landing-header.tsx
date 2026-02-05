"use client";

import { ThemeToggle } from "../theme-toggle";

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-bold text-primary">MySCRUM</span>
          <span className="text-xl font-light text-foreground">Poker</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
