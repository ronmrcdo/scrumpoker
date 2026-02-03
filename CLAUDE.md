# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyScrum is a real-time planning poker application for agile teams, built as a Turborepo monorepo with Next.js applications and shared packages.

## Monorepo Structure

```
apps/
  web/        - Main planning poker application (port 3001)
  docs/       - Documentation site (port 3000)
packages/
  ui/         - Shared React component library (Radix UI + Tailwind)
  tailwind-config/  - Shared Tailwind CSS configuration
  typescript-config/ - Shared TypeScript configuration
```

## Common Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev                    # Run all apps in dev mode
cd apps/web && pnpm dev     # Run only web app (port 3001)
cd apps/docs && pnpm dev    # Run only docs app (port 3000)

# Build
pnpm build                  # Build all apps and packages
turbo run build --filter=web  # Build only web app

# Code quality
pnpm format-and-lint        # Check formatting and linting with Biome
pnpm format-and-lint:fix    # Auto-fix formatting and linting issues
pnpm check-types            # Type-check all packages
turbo run lint              # Lint all packages
turbo run check-types       # Type-check all packages

# Individual app commands
cd apps/web
pnpm check-types            # Type-check web app
pnpm lint                   # Lint web app
```

## Tech Stack

- **Build System**: Turborepo with pnpm workspaces
- **Framework**: Next.js 16 (App Router)
- **UI Library**: Radix UI primitives
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Code Quality**: Biome (replaces ESLint + Prettier)
- **Language**: TypeScript 5.9
- **Icons**: Lucide React

## Architecture Patterns

### State Management

The web app uses Zustand stores located in `apps/web/lib/store/`:
- `poker-store.ts` - Main poker room state
- `theme-store.ts` - Theme preferences
- `slices/` - Store slices for modular state management

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
- `poker/` - Planning poker-specific components (room form, voting cards, etc.)
- `players/` - Player/member management components
- `chat/` - Chat functionality components
- `layout/` - Layout components (headers, sidebars)
- `providers/` - Context providers (theme, etc.)

**Shared UI Package** (`packages/ui/src/`):
- Re-exports from `index.ts` for centralized imports
- Built on Radix UI primitives with custom styling
- Components: Button, Card, Dialog, Input, Avatar, Badge, Tabs, etc.
- Utility functions in `utils.ts` (cn helper for class merging)

Import shared components:
```tsx
import { Button, Card, Dialog } from '@repo/ui';
```

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

## Development Workflow

1. **Adding New Features**: Place in appropriate directories:
   - Poker-specific logic → `apps/web/components/poker/`
   - Reusable UI → `packages/ui/src/`
   - State management → `apps/web/lib/store/slices/`

2. **Creating New Components**:
   - Use function components with TypeScript
   - Export shared components from `packages/ui/src/index.ts`
   - Follow Radix UI patterns for accessibility

3. **State Updates**:
   - Keep poker state in Zustand store
   - Use slices pattern for large stores
   - Avoid prop drilling; prefer store access

4. **Testing Changes**:
   - Run `pnpm dev` to test locally
   - Check both apps if changing shared packages
   - Run `pnpm check-types` and `pnpm format-and-lint`

## Important Notes

- **Package Manager**: Must use `pnpm` (version 10.19.0+)
- **Node Version**: Requires Node.js 18+
- **Turborepo Cache**: Uses `.turbo` for build caching
- **Port Conflicts**: Web (3001), Docs (3000)
- **No ESLint**: Project uses Biome exclusively
