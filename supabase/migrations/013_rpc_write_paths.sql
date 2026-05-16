-- =============================================================
-- NARROW WRITE PATHS TO TYPED SECURITY DEFINER RPCs
-- =============================================================
-- Closes findings from the Supabase / Database review:
--   #3  Row-level RLS let an authenticated user `update players` and
--       rewrite their own role, others' votes, or the room's expires_at.
--       Fix: revoke direct INSERT/UPDATE/DELETE on rooms+players from
--       anon/authenticated and force all writes through narrow RPCs.
--   #4  players.vote was unconstrained text; deck-membership was only
--       checked in the client. Fix: CHECK constraint mirrors
--       apps/web/lib/constants/cards.ts.
--   #5  Direct delete-from-players let a facilitator silently rewrite
--       relationships. Fix: kick_player RPC with explicit auth checks.
--  #11  join_room had no length guards on p_user_name. Fix added inline.
--  #12  toggleReveal wrote `rooms.is_revealed` directly. Fix:
--       set_room_revealed RPC with facilitator check.
--  #21  leave_room is intentionally silent on "not a member" — beacon
--       paths must not error. Documented inline.

-- =============================================================
-- 1. Vote CHECK constraint (#4)
-- =============================================================
-- Mirrors CARD_VALUES + FOLD_VALUE in apps/web/lib/constants/cards.ts.
-- The deck is small and stable; keeping the literal list inline avoids
-- the complexity of a config table for ~9 values.
alter table public.players
  add constraint players_vote_check
  check (vote is null or vote in ('1','2','3','5','8','13','21','☕','FOLD'));

-- =============================================================
-- 2. join_room: add length guards (#11)
-- =============================================================
create or replace function public.join_room(
  p_room_id     uuid,
  p_user_name   text,
  p_max_players int default 10
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_count   int;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if length(coalesce(trim(p_user_name), '')) = 0 or length(p_user_name) > 50 then
    raise exception 'Invalid user name';
  end if;

  if not exists (
    select 1 from public.rooms
    where id = p_room_id and expires_at > now()
  ) then
    raise exception 'Room not found';
  end if;

  perform 1 from public.players where room_id = p_room_id for update;

  select count(*) into v_count
  from public.players
  where room_id = p_room_id;

  if not exists (
    select 1 from public.players
    where room_id = p_room_id and user_id = v_user_id
  ) and v_count >= p_max_players then
    raise exception 'Room is full (max % players)', p_max_players;
  end if;

  insert into public.players (room_id, user_id, name, role)
  values (p_room_id, v_user_id, p_user_name, 'MEMBER')
  on conflict (room_id, user_id) do update set name = excluded.name;

  return p_room_id;
end;
$$;

-- =============================================================
-- 3. cast_vote RPC (#3)
-- =============================================================
-- Replaces direct `update players set vote = …` from the client.
-- The CHECK constraint enforces deck membership; this function only
-- needs to scope the update to the caller's row.
create or replace function public.cast_vote(
  p_room_id uuid,
  p_vote    text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  update public.players
    set vote = p_vote
    where room_id = p_room_id
      and user_id = auth.uid();
end;
$$;

-- =============================================================
-- 4. set_room_revealed RPC (#12)
-- =============================================================
-- Replaces direct `update rooms set is_revealed = …` from the client.
create or replace function public.set_room_revealed(
  p_room_id  uuid,
  p_revealed boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.rooms
    where id = p_room_id and facilitator_id = auth.uid()
  ) then
    raise exception 'Only the facilitator can change reveal state';
  end if;

  update public.rooms set is_revealed = p_revealed where id = p_room_id;
end;
$$;

-- =============================================================
-- 5. kick_player RPC (#5)
-- =============================================================
-- Replaces direct `delete from players` from the client. The facilitator
-- check here is the only enforcement once the row-level UPDATE/DELETE
-- privileges are revoked below.
create or replace function public.kick_player(
  p_room_id        uuid,
  p_target_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.rooms
    where id = p_room_id and facilitator_id = auth.uid()
  ) then
    raise exception 'Only the facilitator can kick';
  end if;

  if p_target_user_id = auth.uid() then
    raise exception 'Use leave_room to leave';
  end if;

  delete from public.players
    where room_id = p_room_id and user_id = p_target_user_id;
end;
$$;

-- =============================================================
-- 6. Revoke direct write access (#3, #5, #12)
-- =============================================================
-- SELECT remains gated by RLS via is_room_member() (migration 010);
-- INSERT/UPDATE/DELETE must now go through the SECURITY DEFINER RPCs
-- above. This is the actual teeth — without these revokes, the RPCs are
-- only a convention.
revoke insert, update, delete on public.rooms   from anon, authenticated;
revoke insert, update, delete on public.players from anon, authenticated;

-- =============================================================
-- 7. leave_room "not a member" handling (#21)
-- =============================================================
-- The leave_room function from migration 001/003 is already a no-op when
-- the caller is not a member (the DELETE simply affects zero rows). The
-- beacon path on tab close depends on this silence — do not add an
-- exception here.
