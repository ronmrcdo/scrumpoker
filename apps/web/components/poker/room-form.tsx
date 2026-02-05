"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@repo/ui";
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

export function RoomForm() {
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
    <Card className="w-full max-w-md shadow-soft-lg mx-2 sm:mx-0">
      <CardHeader className="text-center px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">MySCRUM Poker</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Create a new planning poker session
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-6">
        <form
          onSubmit={form.handleSubmit(handleCreate)}
          className="space-y-3 sm:space-y-4"
        >
          {formError && (
            <div className="p-3 text-xs sm:text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-900">
              {formError}
            </div>
          )}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="create-name" className="text-xs sm:text-sm">
              Your Name
            </Label>
            <Input
              id="create-name"
              placeholder="Enter your name"
              className="h-10 sm:h-11 text-sm sm:text-base"
              disabled={isSubmitting}
              {...form.register("userName")}
            />
            {form.formState.errors.userName && (
              <p className="text-xs text-red-500">
                {form.formState.errors.userName.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="create-room" className="text-xs sm:text-sm">
              Room Name
            </Label>
            <Input
              id="create-room"
              placeholder="e.g., Sprint 42: API Refactoring"
              className="h-10 sm:h-11 text-sm sm:text-base"
              disabled={isSubmitting}
              {...form.register("roomName")}
            />
            {form.formState.errors.roomName && (
              <p className="text-xs text-red-500">
                {form.formState.errors.roomName.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full h-10 sm:h-11 text-sm sm:text-base"
            disabled={isSubmitting || !currentUserId}
          >
            {isSubmitting ? "Creating..." : "Create Room"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
