import { describe, expect, it } from "vitest";
import {
  getFaqJsonLd,
  getOrganizationJsonLd,
  getWebApplicationJsonLd,
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
});
