-- =============================================================
-- Enable REPLICA IDENTITY FULL for players table
-- This ensures DELETE events include the full row data in realtime
-- Required for detecting when a specific user is kicked
-- =============================================================
alter table public.players replica identity full;
