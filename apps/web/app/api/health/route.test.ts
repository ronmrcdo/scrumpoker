import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/health", () => {
  it("returns 200 with ok status", async () => {
    const res = GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("ok");
    expect(typeof json.timestamp).toBe("string");
  });

  it("disables caching", () => {
    const res = GET();
    expect(res.headers.get("Cache-Control")).toBe(
      "no-store, no-cache, must-revalidate",
    );
  });
});
