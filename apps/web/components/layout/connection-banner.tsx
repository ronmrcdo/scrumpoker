"use client";

import { Wifi, WifiOff } from "@repo/ui";
import { usePokerStore } from "@/lib/store/poker-store";

export function ConnectionBanner() {
  const connectionStatus = usePokerStore((s) => s.connectionStatus);
  const isOnline = usePokerStore((s) => s.isOnline);

  if (connectionStatus === "connected") return null;

  const isDisconnected = connectionStatus === "disconnected";

  const message = isDisconnected
    ? isOnline
      ? "Connection lost. Trying to reconnect..."
      : "You are offline. Changes will sync when you reconnect."
    : connectionStatus === "reconnecting"
      ? "Reconnecting..."
      : "Connecting...";

  const Icon = isDisconnected ? WifiOff : Wifi;

  const colorClasses = isDisconnected
    ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900"
    : "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900";

  return (
    <output
      aria-live="polite"
      aria-atomic="true"
      className={`flex items-center justify-center gap-2 px-3 py-1.5 text-xs sm:text-sm border-b ${colorClasses} animate-fade-in`}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
      <span>{message}</span>
    </output>
  );
}
