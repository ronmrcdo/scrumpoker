-- =============================================================
-- Regression repro for finding #1:
--   players_masked must enforce RLS (security_invoker = on).
-- =============================================================
-- Before migration 012, the view ran with definer privileges, so any
-- authenticated client could `select * from players_masked` and
-- enumerate every player in every room.
--
-- Run with:
--   supabase db reset
--   psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" \
--     -v ON_ERROR_STOP=1 \
--     -f apps/web/test/repro/players-masked-rls.sql
--
-- Expected: exits 0 after migration 012 is applied.
-- To see the failure mode: revert migration 012 (or comment out the
-- `alter view ... security_invoker = on` line) and rerun — the
-- "REGRESSION" raise will fire.

\set ON_ERROR_STOP on

do $repro$
declare
  v_user_a uuid := gen_random_uuid();
  v_user_b uuid := gen_random_uuid();
  v_room_id uuid;
  v_security_invoker text;
  v_leak_count int;
begin
  -- 1. Confirm the view option is set on the deployed view.
  select coalesce(option_value, 'off')
    into v_security_invoker
    from pg_options_to_table(
      (select reloptions from pg_class where relname = 'players_masked' and relkind = 'v')
    )
    where option_name = 'security_invoker';

  if v_security_invoker not in ('on', 'true') then
    raise exception
      'REGRESSION: players_masked is missing security_invoker = on (got: %)',
      coalesce(v_security_invoker, 'unset');
  end if;

  -- 2. Seed a room and one player belonging to user A.
  insert into public.rooms (id, name, facilitator_id)
  values (gen_random_uuid(), 'repro-room', v_user_a)
  returning id into v_room_id;

  insert into public.players (room_id, user_id, name, role)
  values (v_room_id, v_user_a, 'Alice', 'FACILITATOR');

  -- 3. Switch role to "authenticated" and simulate user B's JWT claims.
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claim.sub', v_user_b::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_user_b::text, 'role', 'authenticated')::text, true);

  -- 4. As user B (not a member of v_room_id), reading players_masked
  --    should return zero rows. Before migration 012 it returned the
  --    full row (with name + user_id leaked).
  select count(*) into v_leak_count
  from public.players_masked
  where room_id = v_room_id;

  if v_leak_count > 0 then
    raise exception 'REGRESSION: players_masked leaks % row(s) to non-members', v_leak_count;
  end if;

  -- Reset role for cleanup
  perform set_config('role', 'postgres', true);
  delete from public.rooms where id = v_room_id;
end
$repro$;

\echo 'players_masked RLS repro: PASS'
