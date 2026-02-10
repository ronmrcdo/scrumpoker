"use client";

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
import { useCreateRoom } from "@/lib/hooks/use-create-room";

export function RoomForm() {
  const { form, formError, isSubmitting, isDisabled, handleSubmit } =
    useCreateRoom();

  return (
    <Card className="w-full max-w-md shadow-soft-lg mx-2 sm:mx-0">
      <CardHeader className="text-center px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">Scrum Poker Game</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Create a new planning poker session
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {formError && (
            <div
              role="alert"
              className="p-3 text-xs sm:text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-900"
            >
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
              aria-invalid={!!form.formState.errors.userName}
              aria-describedby={
                form.formState.errors.userName ? "create-name-error" : undefined
              }
              {...form.register("userName")}
            />
            {form.formState.errors.userName && (
              <p id="create-name-error" className="text-xs text-red-500">
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
              aria-invalid={!!form.formState.errors.roomName}
              aria-describedby={
                form.formState.errors.roomName ? "create-room-error" : undefined
              }
              {...form.register("roomName")}
            />
            {form.formState.errors.roomName && (
              <p id="create-room-error" className="text-xs text-red-500">
                {form.formState.errors.roomName.message}
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
            <label htmlFor="create-website">Website</label>
            <input
              id="create-website"
              tabIndex={-1}
              autoComplete="off"
              {...form.register("hp")}
            />
          </div>
          <Button
            type="submit"
            className="w-full h-10 sm:h-11 text-sm sm:text-base"
            disabled={isDisabled}
          >
            {isSubmitting ? "Creating..." : "Create Room"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
