import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("/llms.txt", () => {
  it("responds 200 with plain text", () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/plain");
  });

  it("starts with the standard llms.txt H1 + blockquote summary", async () => {
    const response = GET();
    const body = await response.text();

    const lines = body.split("\n").filter((line) => line.trim().length > 0);
    expect(lines[0]).toBe("# Scrum Poker Game");
    expect(lines[1]?.startsWith(">")).toBe(true);
  });

  it("describes the core product facts an answer engine needs", async () => {
    const response = GET();
    const body = await response.text();

    expect(body).toContain("planning poker");
    expect(body).toContain("no sign-up");
    expect(body).toContain("https://scrumpokergame.com");
    expect(body).toContain("Fibonacci");
  });

  it("is cacheable", () => {
    const response = GET();
    expect(response.headers.get("Cache-Control")).toContain("max-age");
  });
});
