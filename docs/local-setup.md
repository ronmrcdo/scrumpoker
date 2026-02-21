# Local Setup

Get MyScrum running on your machine.

## Prerequisites

| Tool | Version | Check | Install |
|------|---------|-------|---------|
| Node.js | 18+ | `node --version` | [nodejs.org](https://nodejs.org) |
| pnpm | 10.19.0+ | `pnpm --version` | `npm install -g pnpm` |
| Docker | Latest | `docker --version` | [docker.com](https://www.docker.com) |

Docker is required for running Supabase locally.

## Step 1: Install Dependencies

```bash
git clone <repo-url>
cd myscrum
pnpm install
```

## Step 2: Start Supabase

```bash
pnpm supabase start
```

This starts PostgreSQL, Auth, Realtime, and Studio in Docker containers. On first run it will pull the required images — this may take a few minutes.

Once started, the CLI prints credentials. **Save the `anon key`** — you need it next.

```
         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
  S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
        anon key: eyJhbG...  <-- copy this
```

## Step 3: Configure Environment Variables

```bash
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/web/.env.local` and fill in the Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste-anon-key-from-step-2>

# Plausible Analytics (optional for local dev)
NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL=https://plausible.scrumpokergame.com/js/pa-YOUR_KEY.js
```

## Step 4: Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Port Reference

| Service | Port | URL |
|---------|------|-----|
| Web App | 3000 | http://localhost:3000 |
| Supabase API | 54321 | http://127.0.0.1:54321 |
| PostgreSQL | 54322 | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |
| Supabase Studio | 54323 | http://127.0.0.1:54323 |

## Stopping Services

```bash
# Stop Supabase (keeps data)
pnpm supabase stop

# Stop Supabase and reset data
pnpm supabase stop --no-backup
```

## IDE Setup (Optional)

**VS Code** — install the [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) for formatting and linting on save. The project includes `.vscode/settings.json` with pre-configured settings.

## Troubleshooting

**Port already in use:**
```bash
# Find what's using the port
lsof -ti:3000
# Kill the process
lsof -ti:3000 | xargs kill -9
```

**Supabase won't start:**
- Make sure Docker Desktop is running
- Try stopping and restarting: `pnpm supabase stop && pnpm supabase start`

**Missing dependencies after pulling:**
```bash
pnpm install
```

**Type errors:**
```bash
pnpm check-types
```
