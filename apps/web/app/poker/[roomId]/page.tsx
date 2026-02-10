import { notFound } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/validation";
import { PokerRoomClient } from "./poker-room-client";

export default async function PokerRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  if (!isValidUUID(roomId)) notFound();

  const supabase = await createServerSupabaseClient();

  // Run both queries in parallel to halve latency
  const [roomResult, playersResult] = await Promise.all([
    supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .gt("expires_at", new Date().toISOString())
      .single(),
    supabase.from("players_masked").select("*").eq("room_id", roomId),
  ]);

  const room = roomResult.data;
  if (!room) notFound();

  const players = playersResult.data;

  const initialRoom = {
    id: room.id,
    name: room.name,
    isRevealed: room.is_revealed,
    facilitatorId: room.facilitator_id,
    players: (players ?? []).map(
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
