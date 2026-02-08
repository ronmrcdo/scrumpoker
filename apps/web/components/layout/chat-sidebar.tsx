"use client";

import { cn } from "@repo/ui";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { usePokerStore } from "@/lib/store/poker-store";
import { ChatPanel } from "../chat/chat-panel";

export function ChatSidebar() {
  const {
    room,
    isChatOpen,
    toggleChat,
    chatMessages,
    sendChatMessage,
    currentUserId,
  } = usePokerStore(
    useShallow((s) => ({
      room: s.room,
      isChatOpen: s.isChatOpen,
      toggleChat: s.toggleChat,
      chatMessages: s.chatMessages,
      sendChatMessage: s.sendChatMessage,
      currentUserId: s.currentUserId,
    })),
  );
  const currentUserName = useMemo(
    () => room?.players.find((p) => p.id === currentUserId)?.name || "You",
    [room?.players, currentUserId],
  );

  if (!room) return null;

  return (
    <>
      {/* Mobile overlay backdrop */}
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
    </>
  );
}
