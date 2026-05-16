"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export const EASE = [0.22, 0.85, 0.25, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  amount?: number;
  delay?: number;
}

export function Reveal({
  children,
  className,
  amount = 0.15,
  delay = 0,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function RevealStagger({ children, className }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ staggerChildren: 0.07 }}
    >
      {children}
    </motion.div>
  );
}

export const revealItemVariants = {
  hidden: { opacity: 0, y: 28 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}

export function RevealItem({
  children,
  className,
  as = "div",
}: RevealItemProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  const MotionTag =
    as === "article" ? motion.article : as === "li" ? motion.li : motion.div;

  return (
    <MotionTag className={className} variants={revealItemVariants}>
      {children}
    </MotionTag>
  );
}
