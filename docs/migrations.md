# Database Migrations

MyScrum uses [Supabase CLI](https://supabase.com/docs/reference/cli) to manage PostgreSQL migrations. Migration files live in `supabase/migrations/` and are applied in order.

## Current Migrations

```
supabase/migrations/
  001_initial_schema.sql
  002_players_replica_identity.sql
  003_leave_room_search_path.sql
  004_mask_votes_before_reveal.sql
  005_transactional_rpcs.sql
  006_rate_limit_room_creation.sql
  007_expose_fold_before_reveal.sql
  008_join_room_rpc.sql
  009_remove_room_code.sql
```

## Naming Convention

Files use **manual sequential numbering**:

```
{NNN}_{descriptive_name}.sql
```

- `NNN` — 3-digit zero-padded number (001, 002, ...)
- `descriptive_name` — snake_case description of the change

## Creating a Migration

### 1. Find the Next Number

```bash
ls supabase/migrations/
```

If the latest file is `009_remove_room_code.sql`, the next file should start with `010`.

### 2. Create the File

```bash
touch supabase/migrations/010_your_migration_name.sql
```

Alternatively, use the Supabase CLI to scaffold the file:

```bash
pnpm supabase migration new your_migration_name
```

> **Note:** The CLI creates a timestamp-based name. Rename the file to match the sequential numbering convention.

### 3. Write Your SQL

```sql
-- 010_add_voting_history.sql
-- Add table for persisting voting rounds

CREATE TABLE IF NOT EXISTS voting_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  player_id uuid NOT NULL,
  vote text,
  voted_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE voting_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view voting history"
  ON voting_history FOR SELECT
  USING (true);
```

## Running Migrations Locally

**Reset database and run all migrations from scratch:**

```bash
pnpm supabase db reset
```

This drops the local database, recreates it, and applies all migration files in order.

**Check which migrations have been applied:**

```bash
pnpm supabase migration list
```

## Testing a Migration

1. Write the migration file
2. Run `pnpm supabase db reset`
3. Open [Supabase Studio](http://127.0.0.1:54323) to inspect the schema
4. Start the app with `pnpm dev` and verify functionality

## Pushing to Production

### First-Time Setup

Link your local project to the remote Supabase project:

```bash
pnpm supabase link --project-ref <your-project-ref>
```

Find your project ref in the Supabase Dashboard under **Project Settings > General**.

### Push Migrations

```bash
pnpm supabase db push
```

This applies any pending migrations to the remote database. **Always test locally with `db reset` before pushing.**

## Common Patterns

### Add a Column

```sql
ALTER TABLE rooms
ADD COLUMN IF NOT EXISTS description text;
```

### Create an RPC Function

```sql
CREATE OR REPLACE FUNCTION do_something(p_room_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- your logic here
  UPDATE rooms SET updated_at = now() WHERE id = p_room_id;
END;
$$;
```

### Add a Row-Level Security Policy

```sql
CREATE POLICY "policy_name"
  ON table_name
  FOR SELECT
  USING (auth.uid() = user_id);
```

### Create a View

```sql
CREATE OR REPLACE VIEW my_view AS
SELECT id, name, created_at
FROM rooms
WHERE created_at > now() - interval '30 days';
```

## Best Practices

- **Don't modify pushed migrations.** Once a migration has been applied to production, create a new migration for changes.
- **Use `IF NOT EXISTS` / `IF EXISTS`** for idempotent operations where possible.
- **Enable RLS** on every new table (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).
- **Use `SECURITY DEFINER`** on RPC functions that need elevated privileges.
- **Set `search_path = public`** on functions to avoid schema resolution issues.
- **Test locally** with `pnpm supabase db reset` before pushing to production.

## Command Reference

| Command | Description |
|---------|-------------|
| `pnpm supabase start` | Start local Supabase |
| `pnpm supabase stop` | Stop local Supabase |
| `pnpm supabase status` | Show status and credentials |
| `pnpm supabase db reset` | Reset DB and run all migrations |
| `pnpm supabase migration new <name>` | Create a new migration file |
| `pnpm supabase migration list` | List migration status |
| `pnpm supabase link --project-ref <ref>` | Link to remote project |
| `pnpm supabase db push` | Push migrations to production |
