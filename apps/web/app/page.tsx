import { Suspense } from "react";

import { KickedAlert } from "@/components/poker/kicked-alert";
import { RoomForm } from "@/components/poker/room-form";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LobbyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Suspense fallback={null}>
        <KickedAlert />
      </Suspense>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <RoomForm />
    </div>
  );
}
