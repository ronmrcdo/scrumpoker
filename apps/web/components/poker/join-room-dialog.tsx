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
  Users,
} from "@repo/ui";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trackEvent } from "@/lib/analytics";
import { usePokerStore } from "@/lib/store/poker-store";
import { userNameSchema } from "@/lib/validation";

const joinSchema = z.object({
  userName: userNameSchema,
  hp: z.string(),
});

type JoinFormData = z.infer<typeof joinSchema>;

interface JoinRoomDialogProps {
  roomId: string;
}

export function JoinRoomDialog({ roomId }: JoinRoomDialogProps) {
  const router = useRouter();
  const joinRoom = usePokerStore((s) => s.joinRoom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formLoadedAt = useRef(Date.now());

  const form = useForm<JoinFormData>({
    resolver: zodResolver(joinSchema),
    defaultValues: { userName: "", hp: "" },
  });

  const handleJoin = async (data: JoinFormData) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      await joinRoom(roomId, data.userName, data.hp, formLoadedAt.current);
      trackEvent("room_joined", { room_id: roomId });
    } catch (error) {
      trackEvent("room_join_failed", {
        error_message: error instanceof Error ? error.message : "Unknown error",
      });
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
        className="max-w-sm gap-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="items-center text-center pb-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 mb-2">
            <Users className="h-6 w-6 text-primary/80" />
          </div>
          <DialogTitle>Join Room</DialogTitle>
          <DialogDescription>
            Enter your name to join this poker session.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleJoin)}
          className="space-y-3 pt-4"
        >
          {formError && (
            <div
              role="alert"
              className="p-3 text-sm bg-destructive/10 text-destructive rounded-lg border border-destructive/20"
            >
              {formError}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="join-name" className="text-sm">
              Your Name
            </Label>
            <Input
              id="join-name"
              placeholder="Enter your name"
              maxLength={50}
              autoComplete="name"
              className="h-10 text-sm"
              disabled={isSubmitting}
              aria-invalid={!!form.formState.errors.userName}
              aria-describedby={
                form.formState.errors.userName ? "join-name-error" : undefined
              }
              {...form.register("userName")}
            />
            {form.formState.errors.userName && (
              <p
                id="join-name-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {form.formState.errors.userName.message}
              </p>
            )}
          </div>
          {/* Honeypot — hidden from humans, traps bots */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-9999px",
              top: "-9999px",
              width: 0,
              height: 0,
              overflow: "hidden",
            }}
          >
            <label htmlFor="join-website">Website</label>
            <input
              id="join-website"
              tabIndex={-1}
              autoComplete="off"
              {...form.register("hp")}
            />
          </div>
          <DialogFooter className="flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/")}
              disabled={isSubmitting}
            >
              Go Back
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Joining..." : "Join Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
