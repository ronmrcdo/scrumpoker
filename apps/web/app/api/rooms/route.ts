import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { validateAntiBot } from "@/lib/anti-bot";
import { getClientIp } from "@/lib/client-ip";
import { roomCreationLimiter } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { roomNameSchema, userNameSchema } from "@/lib/validation";

const createRoomApiSchema = z.object({
  roomName: roomNameSchema,
  userName: userNameSchema,
  hp: z.string().max(500).default(""),
  formLoadedAt: z.number().int().positive(),
});

export async function POST(request: NextRequest) {
  // 1. Rate limit by IP
  const ip = getClientIp(request);
  const rateResult = await roomCreationLimiter.check(ip);

  if (!rateResult.allowed) {
    return NextResponse.json(
      { error: "Too many rooms created. Please try again later." },
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

  const parsed = createRoomApiSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // 3. Anti-bot checks (honeypot + timing + freshness)
  const antiBotResult = validateAntiBot({
    hp: parsed.data.hp,
    formLoadedAt: parsed.data.formLoadedAt,
  });

  if (!antiBotResult.passed) {
    return NextResponse.json(
      { error: "Unable to create room" },
      { status: 422 },
    );
  }

  // 4. Authenticate via Supabase session cookie
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 5. Create room via Supabase RPC
  const { data: roomId, error } = await supabase.rpc("create_room", {
    p_name: parsed.data.roomName,
    p_user_id: user.id,
    p_user_name: parsed.data.userName,
  });

  if (error || !roomId) {
    return NextResponse.json(
      { error: "Failed to create room. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ roomId });
}
