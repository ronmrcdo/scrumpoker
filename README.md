# MyScrum

Real-time planning poker for agile teams. Create a room, share the link, and estimate together.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Common Commands](#common-commands)
- [Deployment (Docker)](#deployment-docker)
- [Documentation](#documentation)
- [Contributing](#contributing)

## Tech Stack

| Category | Technology |
|----------|------------|
| Build System | Turborepo, pnpm workspaces |
| Framework | Next.js 16 (App Router) |
| Backend | Supabase (PostgreSQL, Auth, Realtime) |
| UI Components | Radix UI |
| Styling | Tailwind CSS v4 |
| State Management | Zustand (slice pattern) |
| Forms | React Hook Form, Zod |
| Testing | Vitest, Testing Library |
| Code Quality | Biome, TypeScript 5.9 (strict) |
| Analytics | Plausible (self-hosted) |

## Project Structure

```
apps/
  web/                   Next.js planning poker app (port 3000)
packages/
  ui/                    Shared React component library (Radix UI + Tailwind)
  tailwind-config/       Shared Tailwind CSS configuration
  typescript-config/     Shared TypeScript configuration
supabase/
  config.toml            Local Supabase configuration
  migrations/            Database migrations (SQL)
```

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Start local Supabase (requires Docker)
pnpm supabase start

# 3. Create environment file and add keys from step 2
cp apps/web/.env.example apps/web/.env.local

# 4. Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). See the [Local Setup Guide](docs/local-setup.md) for detailed instructions.

## Common Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps and packages |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once (CI mode) |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm check-types` | Type-check all packages |
| `pnpm format-and-lint` | Check formatting and linting (Biome) |
| `pnpm format-and-lint:fix` | Auto-fix formatting and linting issues |
| `pnpm supabase start` | Start local Supabase |
| `pnpm supabase stop` | Stop local Supabase |
| `pnpm supabase db reset` | Reset database and re-run migrations |

## Deployment (Docker)

The repository ships with a `docker-compose.yml` that builds the web app and runs two supporting services:

| Service | Image | Purpose |
|---------|-------|---------|
| `web` | built from `apps/web/Dockerfile` | Next.js app (port 3000) |
| `redis` | `redis:7-alpine` | Persistent Redis for rate-limit state |
| `serverless-redis-http` | [`hiett/serverless-redis-http`](https://github.com/hiett/serverless-redis-http) | Upstash-compatible HTTP layer in front of Redis |

The web app uses `@upstash/ratelimit` pointed at `serverless-redis-http`, so rate limits stay consistent across multiple web instances. If `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are unset, the limiter falls back to an in-process store (single-instance only).

### 1. Configure environment

Copy the example file at the repo root and fill it in:

```bash
cp .env.example .env
```

Required values:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (baked into the client bundle at build time) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL` | Optional — Plausible script URL |
| `SRH_TOKEN` | Shared secret between `web` and `serverless-redis-http` |

### 2. Generate `SRH_TOKEN`

`SRH_TOKEN` authenticates HTTP requests from the web app to `serverless-redis-http`. Generate a strong random value — any of these works:

```bash
# OpenSSL (recommended)
openssl rand -hex 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# /dev/urandom
head -c 32 /dev/urandom | xxd -p -c 64
```

Paste the result into `.env` as `SRH_TOKEN=...`. The same value is sent to the web container as `UPSTASH_REDIS_REST_TOKEN` automatically — you do not need to set that yourself. Rotate the token whenever you'd rotate a database password.

### 3. Bring the stack up

```bash
# Pre-create the external reverse-proxy network (one-time, if it does not exist)
docker network create coolify

docker compose up -d --build
```

The compose file attaches `web` to both `proxy-net` (for your reverse proxy / external traffic) and an internal bridge network shared with Redis and SRH. Redis and SRH are **not** exposed on `proxy-net`.


- **[Database Migrations](docs/migrations.md)** — Creating, running, testing, and pushing migrations
- **[Testing](docs/testing.md)** — Test framework, writing tests, mock factories, and coverage

## Contributing

1. Create a feature branch
2. Write code with tests (every change must have tests)
3. Verify before committing:
   ```bash
   pnpm test:run          # All tests pass
   pnpm check-types       # No type errors
   pnpm format-and-lint   # Code quality passes
   ```
4. Open a pull request
