import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { validateAntiBot } from "@/lib/anti-bot";
import { getClientIp } from "@/lib/client-ip";
import { MAX_PLAYERS } from "@/lib/constants/cards";
import { joinRoomLimiter } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isValidUUID, userNameSchema } from "@/lib/validation";

const joinRoomApiSchema = z.object({
  roomId: z.string().refine(isValidUUID, "Invalid room id"),
  userName: userNameSchema,
  hp: z.string().max(500).default(""),
  formLoadedAt: z.number().int().positive(),
});

export async function POST(request: NextRequest) {
  // 1. Rate limit by IP
  const ip = getClientIp(request);
  const rateResult = await joinRoomLimiter.check(ip);

  if (!rateResult.allowed) {
    return NextResponse.json(
      { error: "Too many join attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil((rateResult.retryAfterMs ?? 60_000) / 1_000),
          ),
        },
      },
    );
  }

  // 2. Parse and validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = joinRoomApiSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // 3. Anti-bot checks (honeypot + timing + freshness)
  const antiBotResult = validateAntiBot({
    hp: parsed.data.hp,
    formLoadedAt: parsed.data.formLoadedAt,
  });

  if (!antiBotResult.passed) {
    return NextResponse.json({ error: "Unable to join room" }, { status: 422 });
  }

  // 4. Authenticate via Supabase session cookie
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 5. Join room via Supabase RPC
  const { error } = await supabase.rpc("join_room", {
    p_room_id: parsed.data.roomId,
    p_user_name: parsed.data.userName,
    p_max_players: MAX_PLAYERS,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to join room" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
