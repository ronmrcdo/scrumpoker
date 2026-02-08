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
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) router.push("/");
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
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
            <div
              role="alert"
              className="p-3 text-xs sm:text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-900"
            >
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
              aria-invalid={!!form.formState.errors.userName}
              aria-describedby={
                form.formState.errors.userName ? "join-name-error" : undefined
              }
              {...form.register("userName")}
            />
            {form.formState.errors.userName && (
              <p id="join-name-error" className="text-xs text-red-500">
                {form.formState.errors.userName.message}
              </p>
            )}
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
              onClick={() => router.push("/")}
              disabled={isSubmitting}
            >
              Go Back
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
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
