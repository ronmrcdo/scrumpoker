"use client";

import { FxResultsCell, FxResultsStrip } from "@/components/poker/motion-fx";
import type { VoteStats } from "@/lib/types";

interface OverviewProps {
  stats: VoteStats | null;
}

const CELL_BASE = "px-4 py-5 sm:px-6 sm:py-6 border-rule flex flex-col gap-1.5";
const LABEL_CLS =
  "text-[11px] sm:text-xs font-medium text-muted-foreground tracking-wide";
const VALUE_CLS =
  "text-2xl sm:text-3xl md:text-[36px] font-medium tracking-tight text-foreground leading-none";

export function Overview({ stats }: OverviewProps) {
  if (!stats) return null;

  const consensus = stats.consensus
    ? "Tight"
    : stats.spread <= 5
      ? "Mixed"
      : "Wide";

  return (
    <FxResultsStrip className="w-full">
      <dl
        aria-label="Voting results"
        className="grid grid-cols-2 sm:grid-cols-4 border-y border-rule"
      >
        <FxResultsCell
          index={0}
          className={`${CELL_BASE} border-r sm:border-r border-b sm:border-b-0`}
        >
          <dt className={LABEL_CLS}>Average</dt>
          <dd className={VALUE_CLS}>{stats.average.toFixed(1)}</dd>
        </FxResultsCell>
        <FxResultsCell
          index={1}
          className={`${CELL_BASE} sm:border-r border-b sm:border-b-0`}
        >
          <dt className={LABEL_CLS}>Mode</dt>
          <dd className={VALUE_CLS}>{stats.mode}</dd>
        </FxResultsCell>
        <FxResultsCell
          index={2}
          className={`${CELL_BASE} border-r sm:border-r`}
        >
          <dt className={LABEL_CLS}>Spread</dt>
          <dd className={VALUE_CLS}>±{stats.spread}</dd>
        </FxResultsCell>
        <FxResultsCell index={3} className={CELL_BASE}>
          <dt className={LABEL_CLS}>Consensus</dt>
          <dd className={VALUE_CLS}>{consensus}</dd>
        </FxResultsCell>
      </dl>
    </FxResultsStrip>
  );
}
