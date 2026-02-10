"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/scrum-poker.png"
            alt="Scrum Poker Game"
            width={32}
            height={32}
            priority
            className="rounded-md"
          />
          <span className="text-xl font-bold text-primary">Scrum</span>
          <span className="text-xl font-light text-foreground">Poker Game</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
