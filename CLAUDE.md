# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyScrum is a real-time planning poker application for agile teams, built as a Turborepo monorepo with Next.js, Supabase (auth, database, realtime), and shared packages.

## Monorepo Structure

```
apps/
  web/            - Main planning poker application (port 3000)
packages/
  ui/             - Shared React component library (Radix UI + Tailwind)
  tailwind-config/     - Shared Tailwind CSS configuration
  typescript-config/   - Shared TypeScript configuration
supabase/
  config.toml     - Local Supabase configuration
  migrations/     - Database migrations (SQL)
```

## Common Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev                    # Run all apps in dev mode
cd apps/web && pnpm dev     # Run only web app (port 3000)

# Build
pnpm build                  # Build all apps and packages
turbo run build --filter=web  # Build only web app

# Testing
pnpm test                   # Run all tests (Vitest, watch mode)
pnpm test:run               # Run all tests once (CI mode)
pnpm test:coverage          # Run tests with v8 coverage report

# Code quality
pnpm format-and-lint        # Check formatting and linting with Biome
pnpm format-and-lint:fix    # Auto-fix formatting and linting issues
pnpm check-types            # Type-check all packages
turbo run lint              # Lint all packages
turbo run check-types       # Type-check all packages
```

## Tech Stack

- **Build System**: Turborepo with pnpm workspaces
- **Framework**: Next.js 16 (App Router)
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **UI Library**: Radix UI primitives
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (slice pattern)
- **Form Handling**: React Hook Form + Zod
- **Testing**: Vitest + @testing-library/react
- **Code Quality**: Biome (replaces ESLint + Prettier)
- **Language**: TypeScript 5.9
- **Analytics**: PostHog
- **Icons**: Lucide React

## Architecture Patterns

### State Management

The web app uses Zustand stores located in `apps/web/lib/store/`:
- `poker-store.ts` - Root store combining all slices
- `theme-store.ts` - Theme preferences (separate store)
- `slices/session-slice.ts` - User session state
- `slices/room-slice.ts` - Room & players state
- `slices/chat-slice.ts` - Chat messages & typing indicators
- `slices/ui-slice.ts` - Modal/panel visibility
- `slices/connection-slice.ts` - Connection status

Access stores in components:
```tsx
import { usePokerStore } from '@/lib/store/poker-store';

const MyComponent = () => {
  const { room, updateRoom } = usePokerStore();
  // ...
};
```

### Component Organization

**Web App Components** (`apps/web/components/`):
- `poker/` - Planning poker-specific components (room form, voting cards, toolbar)
- `poker/metrics/` - Voting metrics (consensus, distribution, overview, suggested estimate)
- `players/` - Player/member management components
- `chat/` - Chat functionality components
- `layout/` - Layout components (headers, sidebars, room layout)
- `landing/` - Landing page components (hero, features, demos)
- `error/` - Error boundary and error layout components
- `providers/` - Context providers (PostHog analytics)
- `cookie-consent.tsx` - Cookie consent banner

**Shared UI Package** (`packages/ui/src/`):
- Re-exports from `index.ts` for centralized imports
- Built on Radix UI primitives with custom styling
- Components: Button, Card, Dialog, Input, Avatar, Badge, Tabs, Tooltip, etc.
- Utility functions in `utils.ts` (cn helper for class merging)

Import shared components:
```tsx
import { Button, Card, Dialog } from '@repo/ui';
```

### App Routes

```
app/
  page.tsx                    - Landing page
  layout.tsx                  - Root layout
  not-found.tsx               - 404 page
  middleware.ts               - Auth token refresh
  (legal)/                    - Legal pages (grouped route)
    privacy/page.tsx          - Privacy policy
    terms/page.tsx            - Terms of service
    disclaimer/page.tsx       - Disclaimer
  api/rooms/route.ts          - POST: Create room (rate-limited, anti-bot)
  api/rooms/leave/route.ts    - POST: Leave room (beacon API)
  poker/[roomId]/page.tsx     - Poker room (server component)
  poker/[roomId]/poker-room-client.tsx - Room client component
```

### Hooks

Custom hooks in `apps/web/lib/hooks/`:
- `use-session.ts` - Anonymous auth initialization
- `use-token-refresh.ts` - Custom token refresh with bounded retry
- `use-room-sync.ts` - Realtime room state sync via Supabase postgres_changes
- `use-chat-sync.ts` - Realtime chat via Supabase broadcast channels
- `use-create-room.ts` - Room creation form logic
- `use-reveal-countdown.ts` - Vote reveal countdown timer

### Realtime Architecture

- **Room state**: Supabase postgres_changes on `rooms` and `players` tables
- **Chat/typing**: Supabase broadcast channels (`chat:${roomId}`)
- **Connection management**: Unique channel IDs, proper unsubscribe on unmount
- **Reconnection**: Auto-reconnect with tab visibility detection

### Supabase Backend

Database migrations in `supabase/migrations/` (001-009):
- Tables: `rooms`, `players` with RLS policies
- RPC functions: `create_room()`, `join_room()`, `leave_room()`, vote/reveal transactions
- Views: `players_masked` (hides votes before reveal)
- Auth: Anonymous sign-ins, JWT with bounded token refresh
- Rooms are identified by UUID URLs (no room codes)

### Security

- `lib/anti-bot.ts` - Honeypot + form submission timing validation
- `lib/rate-limit.ts` - IP-based token bucket rate limiter
- `lib/validation.ts` - Zod schemas for input validation
- Server-side auth checks in API routes
- RLS policies on all database tables

### Type Definitions

Core types are in `apps/web/lib/types.ts`:
- `Member` - Room participant with role and vote
- `Room` - Poker room state
- `ChatMessage` - Chat message structure
- `VoteStats` - Voting statistics and analysis

### Styling Conventions

- Uses Tailwind CSS v4 with shared configuration
- Shared styles in `packages/tailwind-config/shared-styles.css`
- Theme system supports light/dark modes
- CSS variables for colors: `bg-background`, `text-foreground`, etc.

### Path Aliases

Web app uses `@/` for absolute imports:
```tsx
import { RoomForm } from '@/components/poker/room-form';
import { usePokerStore } from '@/lib/store/poker-store';
import type { Member, Room } from '@/lib/types';
```

## Code Quality Standards

### Biome Configuration

- Root `biome.json` applies to entire monorepo
- Individual apps can have local overrides
- Enforces 2-space indentation, double quotes
- Auto-organizes imports on save

### Type Safety

- All apps and packages use TypeScript strict mode
- Run `pnpm check-types` before committing
- Next.js typegen is run automatically during type-check

## Testing Requirements (MANDATORY)

### Rule: Every Change Must Have Tests

**Every code change MUST include corresponding test updates.** This is non-negotiable. When making any change:

1. **New components** → Create a `component-name.test.tsx` file alongside the component
2. **New utility functions / hooks** → Create a `file-name.test.ts` file alongside the source
3. **New store slices** → Create a `slice-name.test.ts` file alongside the slice
4. **Modified components / functions** → Update existing tests to cover the changes, or add new test cases
5. **Bug fixes** → Add a regression test that reproduces the bug before the fix
6. **Deleted code** → Remove or update tests that reference the deleted code

### Test Framework & Configuration

- **Framework**: Vitest with jsdom environment
- **Config**: `apps/web/vitest.config.ts`
- **Setup**: `apps/web/test/setup.tsx` (browser API mocks, Supabase mock, Next.js mocks)
- **Utilities**: `apps/web/test/test-utils.tsx` (custom render, mock factories)
- **Coverage**: v8 provider covering `lib/**/*.ts` and `components/**/*.tsx`

### Test File Location

Tests live next to the source file they test:
```
components/poker/poker-card.tsx        → components/poker/poker-card.test.tsx
lib/store/slices/chat-slice.ts         → lib/store/slices/chat-slice.test.ts
lib/validation.ts                      → lib/validation.test.ts
lib/hooks/use-reveal-countdown.ts      → lib/hooks/use-reveal-countdown.test.ts
```

### Test Patterns

**Component tests** use @testing-library/react:
```tsx
import { render, screen, createMockPlayer } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";

describe("ComponentName", () => {
  it("should render correctly", () => {
    render(<ComponentName />);
    expect(screen.getByText("expected text")).toBeInTheDocument();
  });

  it("should handle user interaction", async () => {
    const user = userEvent.setup();
    render(<ComponentName />);
    await user.click(screen.getByRole("button"));
    expect(/* assertion */).toBe(true);
  });
});
```

**Zustand store slice tests** create an isolated store:
```tsx
import { create } from "zustand";
import { createMySlice, type MySlice } from "./my-slice";

describe("MySlice", () => {
  let store: ReturnType<typeof create<MySlice>>;

  beforeEach(() => {
    store = create<MySlice>()((...a) => createMySlice(...a));
  });

  it("should update state", () => {
    store.getState().someAction("value");
    expect(store.getState().someField).toBe("value");
  });
});
```

**Utility/hook tests**:
```tsx
import { renderHook, act } from "@testing-library/react";
import { myFunction } from "./my-util";

describe("myFunction", () => {
  it("should return expected result", () => {
    expect(myFunction(input)).toBe(expectedOutput);
  });
});
```

### Mock Factories (from test-utils.tsx)

Use the provided factories to create test data:
- `createMockPlayer(overrides?)` - Creates a mock player
- `createMockRoom(overrides?)` - Creates a mock room with 3 default players
- `createMockChatMessage(overrides?)` - Creates a mock chat message
- `createMockVoteStats(overrides?)` - Creates mock vote statistics
- `createPlayersWithVotes(votes)` - Creates players with specific vote values
- `resetMockIds()` - Resets auto-incrementing IDs between tests

### Test Verification

After making changes, always run:
```bash
pnpm test:run          # Verify all tests pass
pnpm check-types       # Verify type safety
pnpm format-and-lint   # Verify code quality
```

## Development Workflow

1. **Adding New Features**: Place in appropriate directories:
   - Poker-specific logic → `apps/web/components/poker/`
   - Reusable UI → `packages/ui/src/`
   - State management → `apps/web/lib/store/slices/`
   - Hooks → `apps/web/lib/hooks/`
   - API routes → `apps/web/app/api/`
   - Database changes → `supabase/migrations/`

2. **Creating New Components**:
   - Use function components with TypeScript
   - Export shared components from `packages/ui/src/index.ts`
   - Follow Radix UI patterns for accessibility
   - **Create test file alongside the component**

3. **State Updates**:
   - Keep poker state in Zustand store
   - Use slices pattern for large stores
   - Avoid prop drilling; prefer store access
   - **Add or update slice tests**

4. **Verification Checklist** (run before considering work complete):
   - `pnpm test:run` - All tests pass
   - `pnpm check-types` - No type errors
   - `pnpm format-and-lint` - Code quality passes
   - `pnpm dev` - App runs without errors

## Important Notes

- **Package Manager**: Must use `pnpm` (version 10.19.0+)
- **Node Version**: Requires Node.js 18+
- **Turborepo Cache**: Uses `.turbo` for build caching
- **Port Conflicts**: Web (3000), Supabase API (54321), Supabase DB (54322), Supabase Studio (54323)
- **No ESLint**: Project uses Biome exclusively
- **No Room Codes**: Rooms use UUID URLs for sharing
