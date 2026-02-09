"use client";

import { Button, Check, Share2, Users } from "@repo/ui";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface InviteBannerProps {
  roomId: string;
}

export function InviteBanner({ roomId }: InviteBannerProps) {
  const [copied, setCopied] = useState(false);

  const shareRoom = () => {
    const url = `${window.location.origin}/poker/${roomId}`;
    navigator.clipboard.writeText(url);
    trackEvent("invite_link_copied", { room_id: roomId, source: "banner" });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-sm px-2 animate-fade-in">
      <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 text-center">
        <Users className="h-5 w-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          You're the only one here. Share the invite link with your team to
          start estimating.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={shareRoom}
          aria-label="Copy invite link"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              Copy invite link
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
