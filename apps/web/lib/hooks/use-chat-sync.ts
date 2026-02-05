"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef } from "react";

import { usePokerStore } from "@/lib/store/poker-store";
import { createClient } from "@/lib/supabase/client";
import type {
  ChatBroadcastPayload,
  ChatMessage,
  TypingBroadcastPayload,
} from "@/lib/types";

const CHAT_EVENT = "chat_message";
const TYPING_EVENT = "typing_indicator";

export function useChatSync(roomCode: string | null) {
  const addChatMessage = usePokerStore((s) => s.addChatMessage);
  const setBroadcastCallback = usePokerStore((s) => s.setBroadcastCallback);
  const setTypingBroadcastCallback = usePokerStore(
    (s) => s.setTypingBroadcastCallback,
  );
  const setUserTyping = usePokerStore((s) => s.setUserTyping);
  const clearChat = usePokerStore((s) => s.clearChat);
  const currentUserId = usePokerStore((s) => s.currentUserId);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabaseRef = useRef(createClient());

  // Broadcast function that sends message to all other clients
  const broadcast = useCallback((message: ChatMessage) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: "broadcast",
        event: CHAT_EVENT,
        payload: { type: "chat_message", message } as ChatBroadcastPayload,
      });
    }
  }, []);

  // Broadcast typing indicator
  const broadcastTyping = useCallback(
    (userId: string, name: string, isTyping: boolean) => {
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: TYPING_EVENT,
          payload: {
            type: "typing_indicator",
            userId,
            name,
            isTyping,
          } as TypingBroadcastPayload,
        });
      }
    },
    [],
  );

  useEffect(() => {
    if (!roomCode) return;

    const supabase = supabaseRef.current;
    const channelName = `chat:${roomCode}`;

    // Create channel with broadcast configuration
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: {
          // Don't echo back to sender (we add locally immediately)
          self: false,
        },
      },
    });

    // Listen for incoming chat messages
    channel.on("broadcast", { event: CHAT_EVENT }, (payload) => {
      const data = payload.payload as ChatBroadcastPayload;
      if (data.type === "chat_message" && data.message) {
        // Only add if not from current user (safety check)
        if (data.message.senderId !== currentUserId) {
          addChatMessage(data.message);
        }
      }
    });

    // Listen for typing indicators
    channel.on("broadcast", { event: TYPING_EVENT }, (payload) => {
      const data = payload.payload as TypingBroadcastPayload;
      if (data.type === "typing_indicator" && data.userId !== currentUserId) {
        setUserTyping(data.userId, data.name, data.isTyping);
      }
    });

    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channelRef.current = channel;
        // Set the broadcast callbacks in the store
        setBroadcastCallback(broadcast);
        setTypingBroadcastCallback(broadcastTyping);
      }
    });

    // Cleanup on unmount or room change
    return () => {
      setBroadcastCallback(null);
      setTypingBroadcastCallback(null);
      channelRef.current = null;
      supabase.removeChannel(channel);
      clearChat();
    };
  }, [
    roomCode,
    currentUserId,
    addChatMessage,
    setBroadcastCallback,
    setTypingBroadcastCallback,
    setUserTyping,
    clearChat,
    broadcast,
    broadcastTyping,
  ]);
}
