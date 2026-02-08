"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePokerStore } from "@/lib/store/poker-store";

const createRoomSchema = z.object({
  roomName: z.string().min(1, "Room name is required").max(100),
  userName: z.string().min(1, "Your name is required").max(50),
  hp: z.string(),
});

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;

export function useCreateRoom() {
  const router = useRouter();
  const fetchRoom = usePokerStore((s) => s.fetchRoom);
  const currentUserId = usePokerStore((s) => s.currentUserId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formLoadedAt = useRef(Date.now());

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
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to create room");
      }

      await fetchRoom(result.roomId);
      router.push(`/poker/${result.roomId}`);
    } catch (error) {
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
    isDisabled: isSubmitting || !currentUserId,
    handleSubmit: form.handleSubmit(onSubmit),
  };
}
