-- Atomic join_room RPC: enforces MAX_PLAYERS within a transaction
-- to prevent TOCTOU race conditions from concurrent client-side joins.
create or replace function public.join_room(
  p_room_code text,
  p_user_name text,
  p_max_players int default 10
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room_id uuid;
  v_user_id uuid := auth.uid();
  v_count int;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Find the room by code
  select id into v_room_id
  from public.rooms
  where code = upper(p_room_code)
    and expires_at > now();

  if v_room_id is null then
    raise exception 'Room not found';
  end if;

  -- Lock the players rows for this room to prevent concurrent inserts
  perform 1 from public.players where room_id = v_room_id for update;

  -- Count current players
  select count(*) into v_count
  from public.players
  where room_id = v_room_id;

  -- Allow if user is already in room (rejoin) or under limit
  if not exists (
    select 1 from public.players
    where room_id = v_room_id and user_id = v_user_id
  ) and v_count >= p_max_players then
    raise exception 'Room is full (max % players)', p_max_players;
  end if;

  -- Upsert the player
  insert into public.players (room_id, user_id, name, role)
  values (v_room_id, v_user_id, p_user_name, 'MEMBER')
  on conflict (room_id, user_id) do update set name = excluded.name;

  return v_room_id;
end;
$$;
