import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/validation";
import { PokerRoomClient } from "./poker-room-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ roomId: string }>;
}): Promise<Metadata> {
  const { roomId } = await params;
  const base: Metadata = { robots: { index: false, follow: false } };
  if (!isValidUUID(roomId)) return base;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("rooms")
      .select("name")
      .eq("id", roomId)
      .single();
    if (data?.name) return { ...base, title: data.name };
    const { data: previewRows } = await supabase.rpc("get_room_preview", {
      p_room_id: roomId,
    });
    const preview = previewRows?.[0];
    if (preview?.name) return { ...base, title: preview.name };
  } catch {
    // fall through to base metadata
  }
  return base;
}

export default async function PokerRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  if (!isValidUUID(roomId)) notFound();

  const supabase = await createServerSupabaseClient();

  // Try full fetch first — RLS restricts SELECT to room members only
  const [roomResult, playersResult] = await Promise.all([
    supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .gt("expires_at", new Date().toISOString())
      .single(),
    supabase.from("players_masked").select("*").eq("room_id", roomId),
  ]);

  if (roomResult.data) {
    const room = roomResult.data;
    const players = playersResult.data;

    return (
      <PokerRoomClient
        initialRoom={{
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
        }}
      />
    );
  }

  // Not a member yet — use preview RPC to check if room exists
  const previewResult = await supabase.rpc("get_room_preview", {
    p_room_id: roomId,
  });

  const preview = previewResult.data?.[0];
  if (!preview || preview.is_expired) notFound();

  // Room exists but user hasn't joined — render with minimal data
  // so the JoinRoomDialog can be shown
  return (
    <PokerRoomClient
      initialRoom={{
        id: roomId,
        name: preview.name,
        isRevealed: false,
        facilitatorId: "",
        players: [],
      }}
    />
  );
}
