"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@repo/ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePokerStore } from "@/lib/store/poker-store";

const joinSchema = z.object({
  userName: z.string().min(1, "Your name is required").max(50),
});

type JoinFormData = z.infer<typeof joinSchema>;

interface JoinRoomDialogProps {
  roomCode: string;
}

export function JoinRoomDialog({ roomCode }: JoinRoomDialogProps) {
  const joinRoom = usePokerStore((s) => s.joinRoom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<JoinFormData>({
    resolver: zodResolver(joinSchema),
    defaultValues: { userName: "" },
  });

  const handleJoin = async (data: JoinFormData) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      await joinRoom(roomCode, data.userName);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to join room",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Join Room</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Enter your name to join this poker session.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleJoin)}
          className="space-y-3 sm:space-y-4"
        >
          {formError && (
            <div className="p-3 text-xs sm:text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-900">
              {formError}
            </div>
          )}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="join-name" className="text-xs sm:text-sm">
              Your Name
            </Label>
            <Input
              id="join-name"
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
          <DialogFooter>
            <Button
              type="submit"
              className="w-full h-10 sm:h-11 text-sm sm:text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Joining..." : "Join Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
