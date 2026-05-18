import { describe, expect, it } from "vitest";
import {
  getBreadcrumbJsonLd,
  getFaqJsonLd,
  getHowToJsonLd,
  getOrganizationJsonLd,
  getWebApplicationJsonLd,
  getWebSiteJsonLd,
} from "./structured-data";

describe("getWebApplicationJsonLd", () => {
  it("returns valid WebApplication schema", () => {
    const result = getWebApplicationJsonLd();

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("WebApplication");
    expect(result.name).toBe("Scrum Poker Game");
    expect(result.url).toBe("https://scrumpokergame.com");
    expect(result.applicationCategory).toBe("BusinessApplication");
  });

  it("includes a free offer", () => {
    const result = getWebApplicationJsonLd();

    expect(result.offers).toEqual({
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    });
  });

  it("includes feature list", () => {
    const result = getWebApplicationJsonLd();

    expect(result.featureList).toBeInstanceOf(Array);
    expect(result.featureList.length).toBeGreaterThan(0);
  });

  it("declares language and accessibility for AEO", () => {
    const result = getWebApplicationJsonLd();

    expect(result.inLanguage).toBe("en");
    expect(result.isAccessibleForFree).toBe(true);
  });

  it("includes a stable @id for graph linking", () => {
    const result = getWebApplicationJsonLd();

    expect(result["@id"]).toBe("https://scrumpokergame.com#webapp");
  });

  it("exposes alternate names search engines can match", () => {
    const result = getWebApplicationJsonLd();

    expect(result.alternateName).toContain("Planning Poker");
  });
});

describe("getOrganizationJsonLd", () => {
  it("returns valid Organization schema", () => {
    const result = getOrganizationJsonLd();

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("Organization");
    expect(result.name).toBe("Scrum Poker Game");
    expect(result.logo).toContain("scrum-poker.png");
  });

  it("includes contact point with email", () => {
    const result = getOrganizationJsonLd();

    expect(result.contactPoint.email).toBe("info@scrumpokergame.com");
    expect(result.contactPoint.contactType).toBe("customer support");
  });

  it("includes a stable @id for graph linking", () => {
    const result = getOrganizationJsonLd();

    expect(result["@id"]).toBe("https://scrumpokergame.com#org");
  });
});

describe("getWebSiteJsonLd", () => {
  it("returns valid WebSite schema", () => {
    const result = getWebSiteJsonLd();

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("WebSite");
    expect(result.name).toBe("Scrum Poker Game");
    expect(result.url).toBe("https://scrumpokergame.com");
  });

  it("links to the Organization publisher", () => {
    const result = getWebSiteJsonLd();

    expect(result.publisher).toEqual({
      "@id": "https://scrumpokergame.com#org",
    });
  });
});

describe("getHowToJsonLd", () => {
  it("returns valid HowTo schema", () => {
    const result = getHowToJsonLd();

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("HowTo");
    expect(result.name).toBeTruthy();
    expect(result.totalTime).toMatch(/^PT/);
  });

  it("includes ordered, named steps", () => {
    const result = getHowToJsonLd();

    expect(result.step).toBeInstanceOf(Array);
    expect(result.step.length).toBeGreaterThanOrEqual(3);
    for (const [index, step] of result.step.entries()) {
      expect(step["@type"]).toBe("HowToStep");
      expect(step.position).toBe(index + 1);
      expect(step.name).toBeTruthy();
      expect(step.text).toBeTruthy();
    }
  });

  it("declares the activity is free", () => {
    const result = getHowToJsonLd();

    expect(result.estimatedCost.value).toBe("0");
  });
});

describe("getFaqJsonLd", () => {
  it("returns valid FAQPage schema", () => {
    const result = getFaqJsonLd();

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("FAQPage");
    expect(result.mainEntity).toBeInstanceOf(Array);
    expect(result.mainEntity.length).toBeGreaterThan(0);
  });

  it("has valid Question/Answer pairs", () => {
    const result = getFaqJsonLd();

    for (const item of result.mainEntity) {
      expect(item["@type"]).toBe("Question");
      expect(item.name).toBeTruthy();
      expect(item.acceptedAnswer["@type"]).toBe("Answer");
      expect(item.acceptedAnswer.text).toBeTruthy();
    }
  });

  it("covers the most-asked AEO question about the technique", () => {
    const result = getFaqJsonLd();

    const planningPokerQuestion = result.mainEntity.find((q) =>
      q.name.toLowerCase().includes("what is planning poker"),
    );
    expect(planningPokerQuestion).toBeDefined();
  });
});

describe("getBreadcrumbJsonLd", () => {
  it("returns valid BreadcrumbList schema with positions", () => {
    const result = getBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Privacy", path: "/privacy" },
    ]);

    expect(result["@type"]).toBe("BreadcrumbList");
    expect(result.itemListElement).toHaveLength(2);
    expect(result.itemListElement[0]?.position).toBe(1);
    expect(result.itemListElement[1]?.position).toBe(2);
    expect(result.itemListElement[1]?.item).toBe(
      "https://scrumpokergame.com/privacy",
    );
  });
});
