"use client";

import { Button, cn, Eye, EyeOff, RotateCcw } from "@repo/ui";

interface ToolbarProps {
  isFacilitator: boolean;
  isRevealed: boolean;
  isCounting: boolean;
  onToggleReveal: () => void;
  onReset: () => void;
}

export function Toolbar({
  isFacilitator,
  isRevealed,
  isCounting,
  onToggleReveal,
  onReset,
}: ToolbarProps) {
  if (!isFacilitator) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 w-full",
        "max-sm:flex-col max-sm:gap-2",
      )}
    >
      <Button
        onClick={onToggleReveal}
        disabled={isCounting}
        variant="default"
        size="lg"
        className={cn(
          "max-sm:w-full sm:min-w-[200px] h-12 px-7",
          "rounded-md font-medium text-[15px]",
          "transition-[opacity] duration-150 hover:opacity-90 active:opacity-100",
        )}
      >
        {isRevealed ? (
          <>
            <EyeOff className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Hide
          </>
        ) : (
          <>
            <Eye className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Reveal the Hand
          </>
        )}
      </Button>
      <Button
        onClick={onReset}
        variant="outline"
        disabled={isCounting}
        size="lg"
        className={cn(
          "max-sm:w-full sm:min-w-[140px] h-12 px-6",
          "rounded-md font-medium text-[15px] border-rule",
          "transition-colors duration-150",
        )}
      >
        <RotateCcw className="h-4 w-4 mr-1.5" aria-hidden="true" />
        Reset
      </Button>
    </div>
  );
}
