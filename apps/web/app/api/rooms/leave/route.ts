import { NextResponse } from "next/server";

import { getClientIp } from "@/lib/client-ip";
import { leaveRoomLimiter } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/validation";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateResult = leaveRoomLimiter.check(ip);
  if (!rateResult.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil((rateResult.retryAfterMs ?? 10_000) / 1_000),
          ),
        },
      },
    );
  }

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

  const { error } = await supabase.rpc("leave_room", { p_room_id: roomId });
  if (error) {
    return NextResponse.json({ error: "Failed to leave" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
