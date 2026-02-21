import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows crawling the root path", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const mainRule = rules.find((r) => r.userAgent === "*");
    expect(mainRule?.allow).toContain("/");
  });

  it("disallows crawling poker rooms", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const mainRule = rules.find((r) => r.userAgent === "*");
    expect(mainRule?.disallow).toContain("/poker/");
  });

  it("disallows crawling API routes", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const mainRule = rules.find((r) => r.userAgent === "*");
    expect(mainRule?.disallow).toContain("/api/");
  });
});
