"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group transition-opacity hover:opacity-80"
        >
          <Image
            src="/scrum-poker.png"
            alt=""
            width={28}
            height={28}
            priority
            className="rounded-md"
          />
          <span className="text-base font-bold tracking-tight text-foreground">
            Scrum<span className="text-primary"> Poker</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <a
            href="#features"
            className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted/60"
          >
            Features
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
