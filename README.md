# MyScrum

Real-time planning poker for agile teams. Create a room, share the link, and estimate together.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Common Commands](#common-commands)
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
| Analytics | PostHog |

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

## Documentation

- **[Local Setup](docs/local-setup.md)** — Prerequisites, installation, environment configuration, and troubleshooting
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
