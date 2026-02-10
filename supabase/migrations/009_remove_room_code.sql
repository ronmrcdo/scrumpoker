-- Remove room code: rooms are shared via UUID URLs, making codes redundant.

-- 0. Drop old function overloads (superseded by new signatures below)
drop function if exists public.create_room(text, text, uuid, text);
drop function if exists public.join_room(text, text, int);

-- 1. Replace create_room RPC (remove p_code parameter)
create or replace function public.create_room(
  p_name text,
  p_user_id uuid,
  p_user_name text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room_id uuid;
begin
  -- Validate caller matches p_user_id
  if auth.uid() is distinct from p_user_id then
    raise exception 'Unauthorized: user ID mismatch';
  end if;

  -- Insert room
  insert into public.rooms (name, facilitator_id)
  values (p_name, p_user_id)
  returning id into v_room_id;

  -- Insert facilitator player (same transaction)
  insert into public.players (room_id, user_id, name, role)
  values (v_room_id, p_user_id, p_user_name, 'FACILITATOR');

  return v_room_id;
end;
$$;

-- 2. Replace join_room RPC (accept room ID instead of code)
create or replace function public.join_room(
  p_room_id uuid,
  p_user_name text,
  p_max_players int default 10
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_count int;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Verify room exists and is not expired
  if not exists (
    select 1 from public.rooms
    where id = p_room_id
      and expires_at > now()
  ) then
    raise exception 'Room not found';
  end if;

  -- Lock the players rows for this room to prevent concurrent inserts
  perform 1 from public.players where room_id = p_room_id for update;

  -- Count current players
  select count(*) into v_count
  from public.players
  where room_id = p_room_id;

  -- Allow if user is already in room (rejoin) or under limit
  if not exists (
    select 1 from public.players
    where room_id = p_room_id and user_id = v_user_id
  ) and v_count >= p_max_players then
    raise exception 'Room is full (max % players)', p_max_players;
  end if;

  -- Upsert the player
  insert into public.players (room_id, user_id, name, role)
  values (p_room_id, v_user_id, p_user_name, 'MEMBER')
  on conflict (room_id, user_id) do update set name = excluded.name;

  return p_room_id;
end;
$$;

-- 3. Drop code column and index
drop index if exists idx_rooms_code;
alter table public.rooms drop column if exists code;
