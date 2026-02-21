-- =============================================================
-- ADD COMPOSITE INDEX ON players(room_id, user_id)
-- =============================================================
-- The is_room_member() function (migration 010) runs a
-- SELECT EXISTS ... WHERE room_id = $1 AND user_id = auth.uid()
-- on every RLS policy check. Without an index this is a seq scan.

create index if not exists idx_players_room_user
  on public.players (room_id, user_id);
