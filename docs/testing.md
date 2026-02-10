# Testing

MyScrum uses [Vitest](https://vitest.dev/) with [Testing Library](https://testing-library.com/) for unit and component tests. **Every code change must include corresponding tests.**

## Quick Start

```bash
# Watch mode (re-runs on file changes)
pnpm test

# Run once (CI mode)
pnpm test:run

# Run with coverage report
pnpm test:coverage
```

## Test File Location

Tests live **next to the source file** they test:

```
components/poker/poker-card.tsx       -> poker-card.test.tsx
lib/store/slices/chat-slice.ts        -> chat-slice.test.ts
lib/validation.ts                     -> validation.test.ts
lib/hooks/use-reveal-countdown.ts     -> use-reveal-countdown.test.ts
```

## What to Test

| Change | Test Required |
|--------|--------------|
| New component | Create `component-name.test.tsx` |
| New hook or utility | Create `file-name.test.ts` |
| New store slice | Create `slice-name.test.ts` |
| Modified code | Update existing tests or add new cases |
| Bug fix | Add a regression test |
| Deleted code | Remove or update related tests |

## Framework Setup

**Config:** `apps/web/vitest.config.ts`

| Setting | Value |
|---------|-------|
| Environment | `jsdom` |
| Globals | `true` (`describe`, `it`, `expect` available without import) |
| Setup file | `test/setup.tsx` |
| Pattern | `**/*.test.{ts,tsx}` |
| Coverage provider | `v8` |
| Coverage scope | `lib/**/*.ts`, `components/**/*.tsx` |

**Pre-configured mocks** in `test/setup.tsx`:

- Browser APIs — `matchMedia`, `ResizeObserver`, `IntersectionObserver`, `crypto.randomUUID`
- Supabase client — database operations, RPC calls, realtime channels
- Next.js — `useRouter`, `useSearchParams`, `usePathname`, `Link`

## Writing Component Tests

```tsx
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { PokerCard } from "./poker-card";

describe("PokerCard", () => {
  it("renders the card value", () => {
    render(<PokerCard value="5" />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<PokerCard value="5" onClick={handleClick} />);
    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

**Key points:**
- Import `render` and `screen` from `@/test/test-utils` (not `@testing-library/react`)
- Use `userEvent` for interactions (not `fireEvent`)
- Query by role, text, or label — not by class or test ID

## Writing Store Slice Tests

```tsx
import { create } from "zustand";
import { createChatSlice, type ChatSlice } from "./chat-slice";

describe("ChatSlice", () => {
  let store: ReturnType<typeof create<ChatSlice>>;

  beforeEach(() => {
    store = create<ChatSlice>()((...a) => createChatSlice(...a));
  });

  it("has empty messages initially", () => {
    expect(store.getState().messages).toEqual([]);
  });

  it("adds a message", () => {
    const message = { id: "1", text: "Hello", senderId: "u1" };
    store.getState().addMessage(message);
    expect(store.getState().messages).toContainEqual(message);
  });
});
```

**Key points:**
- Create a fresh store in `beforeEach` for isolation
- Access state and actions via `store.getState()`

## Writing Hook Tests

```tsx
import { renderHook, act } from "@testing-library/react";

describe("useRevealCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts down each second", () => {
    const { result } = renderHook(() => useRevealCountdown(3));

    expect(result.current.count).toBe(3);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.count).toBe(2);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.count).toBe(1);
  });
});
```

**Key points:**
- Use `vi.useFakeTimers()` / `vi.useRealTimers()` for timer-based hooks
- Wrap state-changing calls in `act()`

## Writing Utility Tests

```tsx
import { validateRoomName } from "./validation";

describe("validateRoomName", () => {
  it("accepts valid names", () => {
    expect(validateRoomName("Sprint Planning")).toBe(true);
  });

  it("rejects empty strings", () => {
    expect(validateRoomName("")).toBe(false);
  });

  it("rejects names that are too long", () => {
    expect(validateRoomName("x".repeat(101))).toBe(false);
  });
});
```

## Mock Factories

`test/test-utils.tsx` exports factories for creating test data:

```tsx
import {
  createMockPlayer,
  createMockRoom,
  createMockChatMessage,
  createMockVoteStats,
  createPlayersWithVotes,
  resetMockIds,
} from "@/test/test-utils";
```

| Factory | Description |
|---------|-------------|
| `createMockPlayer(overrides?)` | Player with auto-incrementing ID, name, role `"MEMBER"`, null vote |
| `createMockRoom(overrides?)` | Room with 3 default players (1 facilitator, 2 members) |
| `createMockChatMessage(overrides?)` | Chat message with sender, text, timestamp |
| `createMockVoteStats(overrides?)` | Vote stats with average, mode, spread, consensus, distribution |
| `createPlayersWithVotes(votes)` | Array of players with specific vote values |
| `resetMockIds()` | Reset auto-incrementing IDs (call in `beforeEach`) |

**Example:**

```tsx
beforeEach(() => {
  resetMockIds();
});

it("displays all players", () => {
  const room = createMockRoom({ name: "Sprint Planning" });
  // room.players has 3 players by default

  render(<PlayerList players={room.players} />);
  expect(screen.getAllByRole("listitem")).toHaveLength(3);
});
```

## Coverage

Run coverage and open the HTML report:

```bash
pnpm test:coverage
# Open coverage/index.html in your browser
```

Coverage targets `lib/**/*.ts` and `components/**/*.tsx`, excluding `node_modules` and `test/` directories.

## Debugging Tests

**Run a single test file:**

```bash
cd apps/web && pnpm vitest run components/poker/poker-card.test.tsx
```

**Run tests matching a name pattern:**

```bash
cd apps/web && pnpm vitest run -t "renders the card"
```

**Print the DOM for debugging:**

```tsx
it("debugging example", () => {
  render(<MyComponent />);
  screen.debug(); // prints current DOM to console
});
```

## Pre-Commit Checklist

Run all three before committing:

```bash
pnpm test:run          # All tests pass
pnpm check-types       # No type errors
pnpm format-and-lint   # Code quality passes
```
