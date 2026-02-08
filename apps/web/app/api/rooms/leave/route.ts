import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const roomId =
    body && typeof body === "object" && "roomId" in body
      ? (body as { roomId: unknown }).roomId
      : null;

  if (typeof roomId !== "string" || !isValidUUID(roomId)) {
    return NextResponse.json({ error: "Invalid roomId" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  await supabase.rpc("leave_room", { p_room_id: roomId });

  return NextResponse.json({ ok: true });
}
