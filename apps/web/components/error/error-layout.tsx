"use client";

import { Button, cn, type LucideIcon } from "@repo/ui";
import Link from "next/link";

interface ErrorLayoutProps {
  icon: LucideIcon;
  iconClassName?: string;
  title: string;
  description: string;
  suggestion?: string;
  primaryAction: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function ErrorLayout({
  icon: Icon,
  iconClassName,
  title,
  description,
  suggestion,
  primaryAction,
  secondaryAction,
}: ErrorLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center animate-fade-in">
        {/* Card container */}
        <div className="bg-card rounded-lg border border-border shadow-soft-lg p-8 sm:p-10">
          {/* Icon container with soft background */}
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted flex items-center justify-center mb-6 animate-scale-in">
            <Icon className={cn("w-10 h-10 sm:w-12 sm:h-12", iconClassName)} />
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
            {title}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-muted-foreground mb-2">
            {description}
          </p>

          {/* Suggestion (optional) */}
          {suggestion && (
            <p className="text-xs sm:text-sm text-muted-foreground/80 mb-6">
              {suggestion}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            {primaryAction.href ? (
              <Button asChild className="w-full sm:w-auto">
                <Link href={primaryAction.href}>{primaryAction.label}</Link>
              </Button>
            ) : (
              <Button
                onClick={primaryAction.onClick}
                className="w-full sm:w-auto"
              >
                {primaryAction.label}
              </Button>
            )}

            {secondaryAction &&
              (secondaryAction.href ? (
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link href={secondaryAction.href}>
                    {secondaryAction.label}
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={secondaryAction.onClick}
                  className="w-full sm:w-auto"
                >
                  {secondaryAction.label}
                </Button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
