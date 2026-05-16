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
    // .maybeSingle() returns data: null (no error) when the caller isn't a
    // member of this room (RLS hides it). .single() would surface PGRST116
    // as an error and force a noisier branch here.
    const { data } = await supabase
      .from("rooms")
      .select("name")
      .eq("id", roomId)
      .maybeSingle();
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

  // Try full fetch first — RLS restricts SELECT to room members only.
  // .maybeSingle() gives us data: null cleanly when the caller isn't a
  // member; PGRST116 from .single() would otherwise be swallowed alongside
  // real errors here.
  const [roomResult, playersResult] = await Promise.all([
    supabase
      .from("rooms")
      .select("id, name, is_revealed, facilitator_id")
      .eq("id", roomId)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle(),
    supabase
      .from("players_masked")
      .select("user_id, name, role, vote")
      .eq("room_id", roomId),
  ]);

  // Surface unexpected DB errors instead of silently falling through to
  // the preview branch (#9).
  if (roomResult.error) {
    throw new Error(`Failed to load room: ${roomResult.error.message}`);
  }

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
          players: (players ?? []).map((p) => ({
            id: p.user_id ?? "",
            name: p.name ?? "",
            role: p.role === "FACILITATOR" ? "FACILITATOR" : "MEMBER",
            vote: p.vote,
          })),
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
