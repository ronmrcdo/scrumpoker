"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Label } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePokerStore } from "@/lib/store/poker-store";

const createSchema = z.object({
  roomName: z.string().min(1, "Room name is required").max(100),
  userName: z.string().min(1, "Your name is required").max(50),
});

type CreateFormData = z.infer<typeof createSchema>;

export function HeroForm() {
  const router = useRouter();
  const createRoom = usePokerStore((s) => s.createRoom);
  const currentUserId = usePokerStore((s) => s.currentUserId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<CreateFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: { roomName: "", userName: "" },
  });

  const handleCreate = async (data: CreateFormData) => {
    if (!currentUserId) return;
    setIsSubmitting(true);
    setFormError(null);

    try {
      const roomId = await createRoom(data.roomName, data.userName);

      if (!roomId) {
        throw new Error("Failed to create room. Please try again.");
      }

      router.push(`/poker/${roomId}`);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleCreate)}
      className="w-full max-w-md space-y-4"
    >
      {formError && (
        <div className="p-3 text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900">
          {formError}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="hero-user-name" className="text-sm font-medium">
            Your Name
          </Label>
          <Input
            id="hero-user-name"
            placeholder="Enter your name"
            className="h-11 bg-card/50 backdrop-blur-sm border-border/50"
            disabled={isSubmitting}
            {...form.register("userName")}
          />
          {form.formState.errors.userName && (
            <p className="text-xs text-red-500">
              {form.formState.errors.userName.message}
            </p>
          )}
        </div>

        <div className="flex-1 space-y-1.5">
          <Label htmlFor="hero-room-name" className="text-sm font-medium">
            Room Name
          </Label>
          <Input
            id="hero-room-name"
            placeholder="e.g., Sprint 42"
            className="h-11 bg-card/50 backdrop-blur-sm border-border/50"
            disabled={isSubmitting}
            {...form.register("roomName")}
          />
          {form.formState.errors.roomName && (
            <p className="text-xs text-red-500">
              {form.formState.errors.roomName.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full h-12 text-base font-semibold cursor-pointer"
        disabled={isSubmitting || !currentUserId}
      >
        {isSubmitting ? "Creating Room..." : "Create Room"}
      </Button>
    </form>
  );
}
