-- Defense-in-depth: rate limit room creation at the database level.
-- Even if the API route is bypassed (e.g., direct Supabase RPC calls with
-- the public anon key), this prevents a single user from creating more than
-- 10 rooms per hour.

-- Index to support the rate-limit query efficiently
create index if not exists idx_rooms_facilitator_created
  on public.rooms (facilitator_id, created_at);

-- Replace create_room to include the rate-limit check
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
  v_recent_count int;
begin
  -- Validate caller matches p_user_id
  if auth.uid() is distinct from p_user_id then
    raise exception 'Unauthorized: user ID mismatch';
  end if;

  -- Rate limit: max 10 rooms per hour per user
  select count(*) into v_recent_count
  from public.rooms
  where facilitator_id = p_user_id
    and created_at > now() - interval '1 hour';

  if v_recent_count >= 10 then
    raise exception 'Rate limit exceeded: too many rooms created recently';
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
