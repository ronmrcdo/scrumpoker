-- =============================================================
-- RESTRICT ROOM & PLAYER SELECT TO ROOM MEMBERS ONLY
-- =============================================================
-- Previously rooms_select and players_select used `using (true)`,
-- allowing any user (even with just the anon key) to:
--   1. Enumerate ALL rooms in the system
--   2. Read raw votes from the players table (bypassing players_masked)
--
-- This migration restricts SELECT to room members only and adds a
-- lightweight preview RPC for the join page.

-- 1. Helper: check room membership (security definer to avoid RLS recursion)
create or replace function public.is_room_member(p_room_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.players
    where room_id = p_room_id
      and user_id = auth.uid()
  );
$$;

-- 2. Drop the old permissive SELECT policies
drop policy if exists "rooms_select" on public.rooms;
drop policy if exists "players_select" on public.players;

-- 3. Create restricted SELECT policies
create policy "rooms_select_member" on public.rooms
  for select using (public.is_room_member(id));

create policy "players_select_member" on public.players
  for select using (public.is_room_member(room_id));

-- 4. Preview RPC for the join page (returns room name only)
-- This allows the server component to check if a room exists and
-- show its name before the user has joined.
create or replace function public.get_room_preview(p_room_id uuid)
returns table(name text, is_expired boolean)
language sql
security definer
set search_path = public
stable
as $$
  select r.name, r.expires_at <= now() as is_expired
  from public.rooms r
  where r.id = p_room_id;
$$;
