"use client";

import { Button, Eye, EyeOff, RotateCcw } from "@repo/ui";

interface ToolbarProps {
  isFacilitator: boolean;
  isRevealed: boolean;
  onToggleReveal: () => void;
  onReset: () => void;
}

export function Toolbar({
  isFacilitator,
  isRevealed,
  onToggleReveal,
  onReset,
}: ToolbarProps) {
  if (!isFacilitator) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap w-full animate-fade-in">
      <Button
        onClick={onToggleReveal}
        variant="default"
        size="sm"
        className="flex-1 sm:flex-none min-w-[100px] transition-all duration-200 hover:scale-105 active:scale-95 animate-scale-in"
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
        size="sm"
        className="flex-1 sm:flex-none min-w-[100px] transition-all duration-200 hover:scale-105 active:scale-95 animate-scale-in"
        style={{ animationDelay: "50ms" }}
      >
        <RotateCcw className="h-4 w-4 mr-1 transition-transform duration-300 hover:rotate-180" />
        Reset
      </Button>
    </div>
  );
}
