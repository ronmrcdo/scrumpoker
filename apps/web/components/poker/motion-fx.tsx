"use client";

import {
  type HTMLMotionProps,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react";
import { forwardRef, type ReactNode } from "react";

const EASE_OUT = [0.22, 0.85, 0.25, 1] as const;
const EASE_BACK = [0.34, 1.4, 0.36, 1] as const;

export const motionEase = {
  out: EASE_OUT,
  back: EASE_BACK,
};

interface FXProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children?: ReactNode;
  delay?: number;
}

function makeFx(
  initial: Record<string, number | string>,
  animate: Record<string, number | string>,
  baseTransition: Transition,
) {
  return forwardRef<HTMLDivElement, FXProps>(function Fx(
    { children, delay = 0, transition, ...rest },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    if (prefersReducedMotion) {
      return (
        <div ref={ref} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
          {children}
        </div>
      );
    }
    return (
      <motion.div
        ref={ref}
        initial={initial}
        animate={animate}
        transition={{
          ...baseTransition,
          delay: (baseTransition.delay ?? 0) + delay,
          ...transition,
        }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  });
}

// Top bar: opacity 0→1, y -10→0, 0.5s, delay 0
export const FxRoomTop = makeFx(
  { opacity: 0, y: -10 },
  { opacity: 1, y: 0 },
  { duration: 0.5, ease: EASE_OUT },
);

// Sidebar: opacity 0→1, x -16→0, 0.6s, delay 0.1s
export const FxSidebar = makeFx(
  { opacity: 0, x: -16 },
  { opacity: 1, x: 0 },
  { duration: 0.6, delay: 0.1, ease: EASE_OUT },
);

// Eyebrow above table: opacity 0→1, y -6→0, 0.5s, delay 0.1s
export const FxEyebrow = makeFx(
  { opacity: 0, y: -6 },
  { opacity: 1, y: 0 },
  { duration: 0.5, delay: 0.1, ease: EASE_OUT },
);

// Felt table: opacity 0→1, y 12 scale .985 → y 0 scale 1, 0.7s, delay 0.2s
export const FxFeltTable = makeFx(
  { opacity: 0, y: 12, scale: 0.985 },
  { opacity: 1, y: 0, scale: 1 },
  { duration: 0.7, delay: 0.2, ease: EASE_OUT },
);

// Center controls: opacity 0→1, y 10→0, 0.5s, delay 0.85s
export const FxCenterControls = makeFx(
  { opacity: 0, y: 10 },
  { opacity: 1, y: 0 },
  { duration: 0.5, delay: 0.85, ease: EASE_OUT },
);

// Hand label: opacity 0→1, y 8→0, 0.4s, delay 0.7s
export const FxHandLabel = makeFx(
  { opacity: 0, y: 8 },
  { opacity: 1, y: 0 },
  { duration: 0.4, delay: 0.7, ease: EASE_OUT },
);

// Generic fade-up (for status line, etc.)
export const FxFadeUp = makeFx(
  { opacity: 0, y: 8 },
  { opacity: 1, y: 0 },
  { duration: 0.5, delay: 0.9, ease: EASE_OUT },
);

interface FxSeatProps extends FXProps {
  index: number;
}

export const FxSeat = forwardRef<HTMLDivElement, FxSeatProps>(function FxSeat(
  { children, index, transition, ...rest },
  ref,
) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) {
    return (
      <div ref={ref} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.55,
        delay: 0.5 + index * 0.06,
        ease: EASE_BACK,
        ...transition,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
});

interface FxHandCardProps extends FXProps {
  index: number;
}

export const FxHandCard = forwardRef<HTMLDivElement, FxHandCardProps>(
  function FxHandCard({ children, index, transition, ...rest }, ref) {
    const prefersReducedMotion = useReducedMotion();
    if (prefersReducedMotion) {
      return (
        <div ref={ref} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
          {children}
        </div>
      );
    }
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 36, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.7 + index * 0.05,
          ease: EASE_OUT,
          ...transition,
        }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  },
);

interface FxResultsCellProps extends FXProps {
  index: number;
}

export const FxResultsCell = forwardRef<HTMLDivElement, FxResultsCellProps>(
  function FxResultsCell({ children, index, transition, ...rest }, ref) {
    const prefersReducedMotion = useReducedMotion();
    if (prefersReducedMotion) {
      return (
        <div ref={ref} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
          {children}
        </div>
      );
    }
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.15 + index * 0.07,
          ease: EASE_OUT,
          ...transition,
        }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  },
);

export const FxResultsStrip = makeFx(
  { opacity: 0, y: 14 },
  { opacity: 1, y: 0 },
  { duration: 0.55, ease: EASE_OUT },
);

// Animation variants for a "pick" interaction on the hand
export const handCardInteractions = {
  whileHover: { y: -6 },
  whileTap: { y: -10, scale: 1.04, transition: { duration: 0.18 } },
} as const;
