import { beforeEach, describe, expect, it } from "vitest";
import { create, type StoreApi } from "zustand";
import {
  type ConnectionSlice,
  createConnectionSlice,
} from "./connection-slice";

describe("ConnectionSlice", () => {
  let store: StoreApi<ConnectionSlice>;

  beforeEach(() => {
    store = create<ConnectionSlice>()((...a) => createConnectionSlice(...a));
  });

  it("initializes with connecting status", () => {
    expect(store.getState().connectionStatus).toBe("connecting");
  });

  it("setConnectionStatus updates the status", () => {
    store.getState().setConnectionStatus("connected");
    expect(store.getState().connectionStatus).toBe("connected");
    store.getState().setConnectionStatus("reconnecting");
    expect(store.getState().connectionStatus).toBe("reconnecting");
  });

  it("setIsOnline toggles online flag", () => {
    store.getState().setIsOnline(false);
    expect(store.getState().isOnline).toBe(false);
    store.getState().setIsOnline(true);
    expect(store.getState().isOnline).toBe(true);
  });
});
