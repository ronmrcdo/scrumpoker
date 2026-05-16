"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { Button, Input, Label } from "@repo/ui";
import { useCreateRoom } from "@/lib/hooks/use-create-room";

export function HeroForm() {
  const {
    form,
    formError,
    isSubmitting,
    isDisabled,
    handleSubmit,
    onTurnstileSuccess,
    onTurnstileError,
  } = useCreateRoom();

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      {formError && (
        <div
          role="alert"
          className="p-3 text-sm bg-destructive/10 dark:bg-destructive/20 text-destructive rounded-lg border border-destructive/30"
        >
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
            autoComplete="name"
            className="h-10 bg-card/50 backdrop-blur-sm border-border/50"
            disabled={isSubmitting}
            aria-invalid={!!form.formState.errors.userName}
            aria-describedby={
              form.formState.errors.userName
                ? "hero-user-name-error"
                : undefined
            }
            {...form.register("userName")}
          />
          {form.formState.errors.userName && (
            <p
              id="hero-user-name-error"
              role="alert"
              className="text-xs text-destructive"
            >
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
            autoComplete="off"
            className="h-10 bg-card/50 backdrop-blur-sm border-border/50"
            disabled={isSubmitting}
            aria-invalid={!!form.formState.errors.roomName}
            aria-describedby={
              form.formState.errors.roomName
                ? "hero-room-name-error"
                : undefined
            }
            {...form.register("roomName")}
          />
          {form.formState.errors.roomName && (
            <p
              id="hero-room-name-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {form.formState.errors.roomName.message}
            </p>
          )}
        </div>
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
        <label htmlFor="hero-website">Website</label>
        <input
          id="hero-website"
          tabIndex={-1}
          autoComplete="off"
          {...form.register("hp")}
        />
      </div>
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          onSuccess={onTurnstileSuccess}
          onError={onTurnstileError}
          onExpire={onTurnstileError}
          options={{ theme: "auto", size: "normal" }}
        />
      )}
      <Button
        type="submit"
        size="lg"
        className="w-full h-12 text-base font-semibold cursor-pointer"
        disabled={isDisabled}
      >
        {isSubmitting ? "Creating Room..." : "Create Room"}
      </Button>
    </form>
  );
}
