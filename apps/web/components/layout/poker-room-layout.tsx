"use client";

import { cn } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { usePokerStore } from "@/lib/store/poker-store";
import { ChatPanel } from "../chat/chat-panel";
import { PlayerList } from "../players/player-list";
import { PokerHeader } from "./poker-header";

interface PokerRoomLayoutProps {
  children: React.ReactNode;
}

export function PokerRoomLayout({ children }: PokerRoomLayoutProps) {
  const router = useRouter();
  const room = usePokerStore((s) => s.room);
  const isChatOpen = usePokerStore((s) => s.isChatOpen);
  const isPlayerListOpen = usePokerStore((s) => s.isPlayerListOpen);
  const isHydrated = usePokerStore((s) => s.isHydrated);
  const toggleChat = usePokerStore((s) => s.toggleChat);
  const togglePlayerList = usePokerStore((s) => s.togglePlayerList);
  const chatMessages = usePokerStore((s) => s.chatMessages);
  const sendChatMessage = usePokerStore((s) => s.sendChatMessage);
  const leaveRoom = usePokerStore((s) => s.leaveRoom);
  const kickPlayer = usePokerStore((s) => s.kickPlayer);
  const setChatOpen = usePokerStore((s) => s.setChatOpen);
  const setPlayerListOpen = usePokerStore((s) => s.setPlayerListOpen);
  const initializeUI = usePokerStore((s) => s.initializeUI);
  const currentUserId = usePokerStore((s) => s.currentUserId);
  const currentUserName =
    room?.players.find((p) => p.id === currentUserId)?.name || "You";

  const wasDesktop = useRef(
    typeof window !== "undefined" && window.innerWidth >= 768,
  );

  // Initialize UI state based on screen size (client-side only)
  useEffect(() => {
    if (!isHydrated) {
      initializeUI();
    }
  }, [isHydrated, initializeUI]);

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      if (wasDesktop.current && !isDesktop) {
        setChatOpen(false);
        setPlayerListOpen(false);
      } else if (!wasDesktop.current && isDesktop) {
        setChatOpen(true);
        setPlayerListOpen(true);
      }
      wasDesktop.current = isDesktop;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setChatOpen, setPlayerListOpen]);

  const handleLeave = async () => {
    await leaveRoom();
    router.push("/");
  };

  const isFacilitator = room ? room.facilitatorId === currentUserId : false;

  if (!room) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <PokerHeader
        roomName={room.name}
        roomId={room.id}
        isChatOpen={isChatOpen}
        isPlayerListOpen={isPlayerListOpen}
        onToggleChat={toggleChat}
        onTogglePlayerList={togglePlayerList}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Player sidebar - overlay on mobile, sidebar on desktop */}
        {/* Mobile overlay backdrop with fade animation */}
        <button
          type="button"
          className={cn(
            "fixed inset-0 bg-black/50 z-40 md:hidden cursor-default",
            "transition-opacity duration-300",
            isPlayerListOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
          onClick={togglePlayerList}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              togglePlayerList();
            }
          }}
          aria-label="Close player list"
          tabIndex={-1}
        />
        <aside
          className={cn(
            "border-r border-border bg-card shrink-0 overflow-hidden",
            "transition-all duration-300 ease-in-out",
            // Desktop
            "md:relative md:z-0",
            isPlayerListOpen ? "md:w-64" : "md:w-0 md:border-r-0",
            // Mobile
            "fixed left-0 top-[57px] bottom-0 w-[280px] z-50 md:top-0",
            isPlayerListOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0",
          )}
        >
          <PlayerList
            players={room.players}
            currentUserId={currentUserId}
            isRevealed={room.isRevealed}
            isFacilitator={isFacilitator}
            onLeave={handleLeave}
            onKick={kickPlayer}
          />
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto transition-all duration-300">
          {children}
        </main>

        {/* Chat panel - overlay on mobile, sidebar on desktop */}
        {/* Mobile overlay backdrop with fade animation */}
        <button
          type="button"
          className={cn(
            "fixed inset-0 bg-black/50 z-40 md:hidden cursor-default",
            "transition-opacity duration-300",
            isChatOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
          onClick={toggleChat}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              toggleChat();
            }
          }}
          aria-label="Close chat"
          tabIndex={-1}
        />
        <aside
          className={cn(
            "border-l border-border bg-card shrink-0 overflow-hidden",
            "transition-all duration-300 ease-in-out",
            // Desktop
            "md:relative md:z-0",
            isChatOpen ? "md:w-80" : "md:w-0 md:border-l-0",
            // Mobile
            "fixed right-0 top-[57px] bottom-0 w-full max-w-[340px] z-50 md:top-0",
            isChatOpen ? "translate-x-0" : "translate-x-full md:translate-x-0",
          )}
        >
          <ChatPanel
            messages={chatMessages}
            currentUserId={currentUserId}
            onSend={(text) =>
              sendChatMessage(text, currentUserId, currentUserName)
            }
            onClose={toggleChat}
          />
        </aside>
      </div>
    </div>
  );
}
