import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { validateAntiBot } from "@/lib/anti-bot";
import { roomCreationLimiter } from "@/lib/rate-limit";
import { generateRoomCode } from "@/lib/room-utils";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const createRoomApiSchema = z.object({
  roomName: z.string().min(1).max(100),
  userName: z.string().min(1).max(50),
  hp: z.string().max(500).default(""),
  formLoadedAt: z.number().int().positive(),
});

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: NextRequest) {
  // 1. Rate limit by IP
  const ip = getClientIp(request);
  const rateResult = roomCreationLimiter.check(ip);

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

  // 3. Anti-bot checks (honeypot + timing)
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
  const code = generateRoomCode();
  const { data: roomId, error } = await supabase.rpc("create_room", {
    p_name: parsed.data.roomName,
    p_code: code,
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
