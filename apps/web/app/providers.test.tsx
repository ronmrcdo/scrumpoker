import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePokerStore } from "@/lib/store/poker-store";
import { Providers } from "./providers";

// Override the global Supabase mock from test/setup.tsx with auth methods
// the Providers component depends on.
const getSession = vi.fn();
const getUser = vi.fn();
const signInAnonymously = vi.fn();
const signOut = vi.fn();
const onAuthStateChange = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getSession: (...args: unknown[]) => getSession(...args),
      getUser: (...args: unknown[]) => getUser(...args),
      signInAnonymously: (...args: unknown[]) => signInAnonymously(...args),
      signOut: (...args: unknown[]) => signOut(...args),
      onAuthStateChange: (...args: unknown[]) => onAuthStateChange(...args),
    },
  }),
}));

// follow-redirect-param reads window.location.search; stub it out so we don't
// trigger a navigation during the test render.
vi.mock("@/lib/utils", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/utils")>("@/lib/utils");
  return { ...actual, followRedirectParam: vi.fn() };
});

// Token-refresh runs intervals + visibility listeners; keep it inert here.
vi.mock("@/lib/hooks/use-token-refresh", () => ({
  useTokenRefresh: vi.fn(),
}));

describe("Providers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the zustand session slice between tests.
    usePokerStore.setState({ currentUserId: "", sessionInitialized: false });
    getSession.mockResolvedValue({ data: { session: null }, error: null });
    signInAnonymously.mockResolvedValue({
      data: { user: { id: "anon-user-id" } },
      error: null,
    });
    onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it("renders children immediately so the landing HTML is crawlable", () => {
    render(
      <Providers>
        <main>Landing content</main>
      </Providers>,
    );

    // Children must be in the DOM on the very first paint — before the async
    // anonymous sign-in resolves — otherwise Google sees only a skeleton.
    expect(screen.getByText("Landing content")).toBeInTheDocument();
  });

  it("initializes anonymous auth and marks session ready", async () => {
    render(
      <Providers>
        <div>child</div>
      </Providers>,
    );

    await waitFor(() => {
      expect(usePokerStore.getState().sessionInitialized).toBe(true);
    });
    expect(usePokerStore.getState().currentUserId).toBe("anon-user-id");
    expect(signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it("validates an existing session against the server and reuses it", async () => {
    getSession.mockResolvedValue({
      data: { session: { user: { id: "existing-user" } } },
      error: null,
    });
    getUser.mockResolvedValue({
      data: { user: { id: "existing-user" } },
      error: null,
    });

    render(
      <Providers>
        <div>child</div>
      </Providers>,
    );

    await waitFor(() => {
      expect(usePokerStore.getState().currentUserId).toBe("existing-user");
    });
    expect(usePokerStore.getState().sessionInitialized).toBe(true);
    expect(signInAnonymously).not.toHaveBeenCalled();
  });

  it("clears a stale session and re-authenticates anonymously", async () => {
    getSession.mockResolvedValue({
      data: { session: { user: { id: "stale" } } },
      error: null,
    });
    // Server says the user no longer exists — session is stale.
    getUser.mockResolvedValue({ data: { user: null }, error: null });
    signOut.mockResolvedValue({ error: null });

    render(
      <Providers>
        <div>child</div>
      </Providers>,
    );

    await waitFor(() => {
      expect(usePokerStore.getState().currentUserId).toBe("anon-user-id");
    });
    expect(signOut).toHaveBeenCalledTimes(1);
    expect(signInAnonymously).toHaveBeenCalledTimes(1);
  });
});
