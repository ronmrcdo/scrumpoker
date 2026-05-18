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

  it("includes a sitemap URL", () => {
    const result = robots();
    expect(result.sitemap).toBe("https://scrumpokergame.com/sitemap.xml");
  });

  it("declares the canonical host", () => {
    const result = robots();
    expect(result.host).toBe("https://scrumpokergame.com");
  });

  it.each([
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "anthropic-ai",
    "PerplexityBot",
    "Google-Extended",
    "Applebot-Extended",
  ])("explicitly allows AI crawler %s", (agent) => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const rule = rules.find((r) => r.userAgent === agent);
    expect(rule).toBeDefined();
    expect(rule?.allow).toContain("/");
  });

  it("keeps poker rooms private from AI crawlers too", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const aiRule = rules.find((r) => r.userAgent === "GPTBot");
    expect(aiRule?.disallow).toContain("/poker/");
  });
});
