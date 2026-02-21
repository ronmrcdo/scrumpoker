"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trackEvent } from "@/lib/analytics";
import { usePokerStore } from "@/lib/store/poker-store";
import { roomNameSchema, userNameSchema } from "@/lib/validation";

const createRoomSchema = z.object({
  roomName: roomNameSchema,
  userName: userNameSchema,
  hp: z.string(),
});

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;

export function useCreateRoom() {
  const router = useRouter();
  const fetchRoom = usePokerStore((s) => s.fetchRoom);
  const currentUserId = usePokerStore((s) => s.currentUserId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const formLoadedAt = useRef(Date.now());

  const hasTurnstile = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const onTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const onTurnstileError = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  const form = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: { roomName: "", userName: "", hp: "" },
  });

  const onSubmit = async (data: CreateRoomFormData) => {
    if (!currentUserId) return;
    setIsSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: data.roomName,
          userName: data.userName,
          hp: data.hp,
          formLoadedAt: formLoadedAt.current,
          turnstileToken: turnstileToken ?? "",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to create room");
      }

      await fetchRoom(result.roomId);
      trackEvent("room_created", {
        room_id: result.roomId,
        room_name_length: data.roomName.length,
      });
      router.push(`/poker/${result.roomId}`);
    } catch (error) {
      trackEvent("room_create_failed", {
        error_message: error instanceof Error ? error.message : "Unknown error",
      });
      setFormError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    formError,
    isSubmitting,
    isDisabled:
      isSubmitting || !currentUserId || (hasTurnstile && !turnstileToken),
    handleSubmit: form.handleSubmit(onSubmit),
    onTurnstileSuccess,
    onTurnstileError,
  };
}
