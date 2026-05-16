-- =============================================================
-- LOCK DOWN players_masked VIEW & RESTORE DB-LEVEL RATE LIMIT
-- =============================================================
-- Closes findings from the Supabase / Database review:
--   #1  players_masked runs with the view owner's privileges, so any
--       authenticated anon-key client can `select * from players_masked`
--       and enumerate every player in every room. Fix: security_invoker.
--   #2  Migration 009 dropped the rate-limited create_room signature and
--       replaced it without restoring the 10-rooms-per-hour body. Fix:
--       re-add the rate-limit check + input length guards.
--  #11  RPC inputs were unbounded text; add length guards consistent with
--       apps/web/lib/validation.ts (max 50 for user names, 100 for room).
--  #14  No automated cleanup of expired rooms — schedule one via pg_cron
--       if the extension is available (no-op otherwise).
--  #17  After migration 011 added the composite (room_id, user_id) index,
--       the old single-column idx_players_room_id became dead weight.

-- 1. Critical: enforce RLS through the players_masked view.
alter view public.players_masked set (security_invoker = on);

-- 2. Restore DB-level rate-limit + input guards on create_room (#2, #11).
create or replace function public.create_room(
  p_name      text,
  p_user_id   uuid,
  p_user_name text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room_id      uuid;
  v_recent_count int;
begin
  if auth.uid() is distinct from p_user_id then
    raise exception 'Unauthorized: user ID mismatch';
  end if;

  -- Length guards mirror apps/web/lib/validation.ts (#11).
  if length(coalesce(trim(p_name), '')) = 0 or length(p_name) > 100 then
    raise exception 'Invalid room name';
  end if;
  if length(coalesce(trim(p_user_name), '')) = 0 or length(p_user_name) > 50 then
    raise exception 'Invalid user name';
  end if;

  -- Defense-in-depth: max 10 rooms per hour per user (#2).
  select count(*) into v_recent_count
  from public.rooms
  where facilitator_id = p_user_id
    and created_at > now() - interval '1 hour';

  if v_recent_count >= 10 then
    raise exception 'Rate limit exceeded: too many rooms created recently';
  end if;

  insert into public.rooms (name, facilitator_id)
  values (p_name, p_user_id)
  returning id into v_room_id;

  insert into public.players (room_id, user_id, name, role)
  values (v_room_id, p_user_id, p_user_name, 'FACILITATOR');

  return v_room_id;
end;
$$;

-- 3. Drop the redundant single-column index now covered by the composite
--    (room_id, user_id) index added in migration 011 (#17).
drop index if exists public.idx_players_room_id;

-- 4. Schedule expired-room cleanup if pg_cron is enabled (#14).
--    Falls back to a no-op when the extension is missing, so this
--    migration remains safe to run on a fresh local DB.
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule(
      'cleanup-expired-rooms',
      '0 * * * *',
      $job$ delete from public.rooms where expires_at < now() $job$
    );
  end if;
end$$;
