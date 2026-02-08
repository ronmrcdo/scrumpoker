"use client";

import { Button, Eye, EyeOff, RotateCcw } from "@repo/ui";

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
    <div className="flex items-center gap-2 flex-wrap w-full">
      <Button
        onClick={onToggleReveal}
        disabled={isCounting}
        variant="default"
        size="sm"
        className="flex-1 sm:flex-none min-w-[100px] transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        {isRevealed ? (
          <>
            <EyeOff className="h-4 w-4 mr-1" />
            Hide
          </>
        ) : (
          <>
            <Eye className="h-4 w-4 mr-1" />
            Reveal
          </>
        )}
      </Button>
      <Button
        onClick={onReset}
        variant="outline"
        disabled={isCounting}
        size="sm"
        className="flex-1 sm:flex-none min-w-[100px] transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        <RotateCcw className="h-4 w-4 mr-1 transition-transform duration-300 hover:rotate-180" />
        Reset
      </Button>
    </div>
  );
}
