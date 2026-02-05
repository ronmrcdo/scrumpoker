-- =============================================================
-- ROOMS TABLE
-- =============================================================
create table public.rooms (
  id             uuid primary key default gen_random_uuid(),
  code           text not null unique,
  name           text not null,
  is_revealed    boolean not null default false,
  facilitator_id uuid not null,
  created_at     timestamptz not null default now(),
  expires_at     timestamptz not null default (now() + interval '24 hours')
);

create index idx_rooms_code on public.rooms (code);
create index idx_rooms_expires_at on public.rooms (expires_at);

-- =============================================================
-- PLAYERS TABLE (vote is a column, not a separate table)
-- =============================================================
create table public.players (
  id         uuid primary key default gen_random_uuid(),
  room_id    uuid not null references public.rooms(id) on delete cascade,
  user_id    uuid not null,
  name       text not null,
  role       text not null default 'MEMBER' check (role in ('FACILITATOR', 'MEMBER')),
  vote       text,
  created_at timestamptz not null default now(),
  unique (room_id, user_id)
);

create index idx_players_room_id on public.players (room_id);
create index idx_players_user_id on public.players (user_id);

-- =============================================================
-- RLS POLICIES
-- =============================================================

alter table public.rooms enable row level security;
alter table public.players enable row level security;

-- ROOMS
create policy "rooms_select" on public.rooms
  for select using (true);

create policy "rooms_insert" on public.rooms
  for insert with check (auth.uid() is not null);

create policy "rooms_update" on public.rooms
  for update using (facilitator_id = auth.uid());

create policy "rooms_delete" on public.rooms
  for delete using (facilitator_id = auth.uid());

-- PLAYERS
create policy "players_select" on public.players
  for select using (true);

create policy "players_insert" on public.players
  for insert with check (auth.uid() = user_id);

create policy "players_update_own" on public.players
  for update using (auth.uid() = user_id);

create policy "players_update_facilitator" on public.players
  for update using (
    exists (
      select 1 from public.rooms
      where rooms.id = players.room_id
        and rooms.facilitator_id = auth.uid()
    )
  );

create policy "players_delete_self" on public.players
  for delete using (auth.uid() = user_id);

create policy "players_delete_facilitator" on public.players
  for delete using (
    exists (
      select 1 from public.rooms
      where rooms.id = players.room_id
        and rooms.facilitator_id = auth.uid()
    )
  );

-- =============================================================
-- FUNCTION: leave_room (security definer for atomic facilitator transfer)
-- =============================================================
create or replace function public.leave_room(p_room_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_user_id uuid := auth.uid();
  v_facilitator_id uuid;
  v_next_player uuid;
begin
  select facilitator_id into v_facilitator_id
    from public.rooms where id = p_room_id;

  -- Remove the player
  delete from public.players
    where room_id = p_room_id and user_id = v_user_id;

  -- If they were facilitator, promote next player
  if v_facilitator_id = v_user_id then
    select user_id into v_next_player
      from public.players
      where room_id = p_room_id
      order by created_at
      limit 1;

    if v_next_player is not null then
      update public.rooms set facilitator_id = v_next_player where id = p_room_id;
      update public.players set role = 'FACILITATOR'
        where room_id = p_room_id and user_id = v_next_player;
    end if;
  end if;
end;
$$;

-- =============================================================
-- ENABLE REALTIME
-- =============================================================
alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.players;
