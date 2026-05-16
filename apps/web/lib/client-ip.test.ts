import { describe, expect, it } from "vitest";
import { getClientIp } from "./client-ip";

function makeRequest(headers: Record<string, string>): Request {
  return new Request("http://localhost", { headers });
}

describe("getClientIp", () => {
  it("prefers cf-connecting-ip", () => {
    const req = makeRequest({
      "cf-connecting-ip": "1.2.3.4",
      "x-forwarded-for": "9.9.9.9, 8.8.8.8",
    });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip", () => {
    const req = makeRequest({ "x-real-ip": "5.6.7.8" });
    expect(getClientIp(req)).toBe("5.6.7.8");
  });

  it("uses rightmost non-private XFF entry", () => {
    const req = makeRequest({
      "x-forwarded-for": "1.1.1.1, 192.168.0.1, 10.0.0.1",
    });
    expect(getClientIp(req)).toBe("1.1.1.1");
  });

  it("returns the last entry if all are private", () => {
    const req = makeRequest({
      "x-forwarded-for": "10.0.0.1, 192.168.0.5",
    });
    expect(getClientIp(req)).toBe("192.168.0.5");
  });

  it("ignores spoofed leftmost XFF when followed by trusted proxy entries", () => {
    const req = makeRequest({
      "x-forwarded-for": "evil-spoof, 1.2.3.4, 10.0.0.1",
    });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("returns unknown when no headers present", () => {
    const req = makeRequest({});
    expect(getClientIp(req)).toBe("unknown");
  });
});
