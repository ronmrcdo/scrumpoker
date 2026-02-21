import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("returns entries for all public pages", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://scrumpokergame.com");
    expect(urls).toContain("https://scrumpokergame.com/privacy");
    expect(urls).toContain("https://scrumpokergame.com/terms");
    expect(urls).toContain("https://scrumpokergame.com/disclaimer");
  });

  it("does not include poker room pages", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    for (const url of urls) {
      expect(url).not.toContain("/poker/");
    }
  });

  it("does not include API routes", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    for (const url of urls) {
      expect(url).not.toContain("/api/");
    }
  });

  it("sets homepage as highest priority", () => {
    const entries = sitemap();
    const homepage = entries.find(
      (entry) => entry.url === "https://scrumpokergame.com",
    );

    expect(homepage?.priority).toBe(1.0);
  });

  it("includes lastModified for all entries", () => {
    const entries = sitemap();

    for (const entry of entries) {
      expect(entry.lastModified).toBeDefined();
    }
  });
});
