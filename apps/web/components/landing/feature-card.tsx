"use client";

import { cn, type LucideIcon } from "@repo/ui";
import type { ReactNode } from "react";
import { ScrollReveal } from "./scroll-reveal";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  demo?: ReactNode;
  reverse?: boolean;
  delay?: number;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  demo,
  reverse = false,
  delay = 0,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "grid md:grid-cols-2 gap-8 md:gap-12 items-center",
        reverse && "md:[&>*:first-child]:order-2",
      )}
    >
      {/* Demo or Icon Display — no ScrollReveal, demos handle their own animations */}
      <div className="relative">
        {demo ? (
          demo
        ) : (
          <div className="flex items-center justify-center h-64 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-border/50">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-10 h-10 text-primary" />
            </div>
          </div>
        )}
      </div>

      {/* Content — ScrollReveal for the text side only */}
      <ScrollReveal delay={delay}>
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-white/10 rounded-xl shadow-sm">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
            {title}
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}
