"use client";

import {
  animate,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useCallback, useState } from "react";
import { ThemeToggle } from "../theme-toggle";
import { EASE } from "./_motion";

const SCROLL_OFFSET = 72;

function scrollToHash(hash: string, smooth: boolean) {
  const id = hash.replace(/^#/, "");
  const target = document.getElementById(id);
  if (!target) return;

  const top =
    target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;

  if (!smooth) {
    window.scrollTo({ top, behavior: "auto" });
    return;
  }

  animate(window.scrollY, top, {
    duration: 0.8,
    ease: EASE,
    onUpdate: (value) => window.scrollTo({ top: value, behavior: "auto" }),
  });
}

const NAV_LINKS = [
  { hash: "#how", label: "How it plays" },
  { hash: "#features", label: "Features" },
  { hash: "#deck", label: "The Deck" },
];

export function LandingHeader() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 8);
  });

  const initial = reduce ? false : { y: -24, opacity: 0 };
  const animate = reduce ? undefined : { y: 0, opacity: 1 };

  return (
    <motion.header
      initial={initial}
      animate={animate}
      transition={{ duration: 0.6, ease: EASE }}
      className={`sticky top-0 left-0 right-0 z-50 border-b transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border shadow-sm"
          : "bg-background border-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-10 h-14 sm:h-16 grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
            Scrum Poker
          </span>
        </Link>
        <nav className="hidden sm:flex items-center justify-center gap-6 text-sm text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.hash}
              hash={link.hash}
              label={link.label}
              isLandingPage={isLandingPage}
            />
          ))}
        </nav>
        <div className="flex items-center justify-end gap-2">
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}

function NavLink({
  hash,
  label,
  isLandingPage,
}: {
  hash: string;
  label: string;
  isLandingPage: boolean;
}) {
  const reduce = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const href = isLandingPage ? hash : `/${hash}`;

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (!isLandingPage) return;
      event.preventDefault();
      scrollToHash(hash, !reduce);
      history.replaceState(null, "", hash);
    },
    [hash, reduce, isLandingPage],
  );

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className="relative hover:text-foreground transition-colors"
    >
      {label}
      <motion.span
        aria-hidden
        className="absolute left-0 -bottom-1 h-px bg-foreground origin-left"
        initial={false}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.25, ease: EASE }}
        style={{ width: "100%" }}
      />
    </a>
  );
}
