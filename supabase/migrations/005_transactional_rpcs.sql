-- Transactional RPCs for atomic multi-table operations

-- create_room: Atomically creates a room and its facilitator player
create or replace function public.create_room(
  p_name text,
  p_code text,
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
  insert into public.rooms (name, code, facilitator_id)
  values (p_name, p_code, p_user_id)
  returning id into v_room_id;

  -- Insert facilitator player (same transaction)
  insert into public.players (room_id, user_id, name, role)
  values (v_room_id, p_user_id, p_user_name, 'FACILITATOR');

  return v_room_id;
end;
$$;

-- reset_votes: Atomically resets reveal state and clears all votes
create or replace function public.reset_votes(p_room_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only facilitator can reset
  if not exists (
    select 1 from public.rooms
    where id = p_room_id and facilitator_id = auth.uid()
  ) then
    raise exception 'Only the facilitator can reset votes';
  end if;

  -- Reset room reveal state
  update public.rooms
  set is_revealed = false
  where id = p_room_id;

  -- Clear all player votes
  update public.players
  set vote = null
  where room_id = p_room_id;
end;
$$;
