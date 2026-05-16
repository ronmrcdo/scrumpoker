"use client";

import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { usePokerStore } from "@/lib/store/poker-store";
import { ConnectionBanner } from "./connection-banner";
import { PlayerSidebar } from "./player-sidebar";
import { PokerHeader } from "./poker-header";

interface PokerRoomLayoutProps {
  children: React.ReactNode;
}

const RESIZE_DEBOUNCE_MS = 150;

export function PokerRoomLayout({ children }: PokerRoomLayoutProps) {
  const {
    room,
    isPlayerListOpen,
    isHydrated,
    togglePlayerList,
    setPlayerListOpen,
    initializeUI,
  } = usePokerStore(
    useShallow((s) => ({
      room: s.room,
      isPlayerListOpen: s.isPlayerListOpen,
      isHydrated: s.isHydrated,
      togglePlayerList: s.togglePlayerList,
      setPlayerListOpen: s.setPlayerListOpen,
      initializeUI: s.initializeUI,
    })),
  );

  const wasDesktop = useRef(
    typeof window !== "undefined" && window.innerWidth >= 768,
  );
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize UI state based on screen size (client-side only)
  useEffect(() => {
    if (!isHydrated) {
      initializeUI();
    }
  }, [isHydrated, initializeUI]);

  useEffect(() => {
    const handleResize = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        const isDesktop = window.innerWidth >= 768;
        if (wasDesktop.current && !isDesktop) {
          setPlayerListOpen(false);
        } else if (!wasDesktop.current && isDesktop) {
          setPlayerListOpen(true);
        }
        wasDesktop.current = isDesktop;
      }, RESIZE_DEBOUNCE_MS);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [setPlayerListOpen]);

  if (!room) {
    return (
      <div className="h-dvh flex flex-col bg-background">
        <main id="main-content" className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col bg-background">
      <PokerHeader
        roomId={room.id}
        roomName={room.name}
        isPlayerListOpen={isPlayerListOpen}
        onTogglePlayerList={togglePlayerList}
      />

      <ConnectionBanner />

      <div className="flex-1 flex overflow-hidden relative">
        <PlayerSidebar />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto transition-all duration-300"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
