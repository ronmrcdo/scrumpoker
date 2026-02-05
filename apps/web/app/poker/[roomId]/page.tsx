import { notFound } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PokerRoomClient } from "./poker-room-client";

export default async function PokerRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: room } = await supabase
    .from("rooms")
    .select("*, players(*)")
    .eq("id", roomId)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (!room) notFound();

  const initialRoom = {
    id: room.id,
    code: room.code,
    name: room.name,
    isRevealed: room.is_revealed,
    facilitatorId: room.facilitator_id,
    players: room.players.map(
      (p: {
        user_id: string;
        name: string;
        role: string;
        vote: string | null;
      }) => ({
        id: p.user_id,
        name: p.name,
        role: p.role as "FACILITATOR" | "MEMBER",
        vote: p.vote,
      }),
    ),
  };

  return <PokerRoomClient initialRoom={initialRoom} />;
}
