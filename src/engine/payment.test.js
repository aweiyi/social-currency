import { describe, it, expect } from "vitest";
import { decidePaymentMethod } from "./payment.js";
import { SKILL_CATEGORIES } from "../data/categories.js";

function makeRequester(overrides = {}) {
  return {
    fiatPreference: 0.5,
    fiatBalance: 1000,
    reputation: { overall: 0.5 },
    marketPrice: 0.5,
    personality: { social_drive: 0.5 },
    tokens: { remainingCapacity: 5 },
    ...overrides,
  };
}

function makeProvider(overrides = {}) {
  return {
    fiatPreference: 0.5,
    ...overrides,
  };
}

describe("payment", () => {
  it("returns social_token or fiat with amount and fiatEquivalent", () => {
    const requester = makeRequester({ fiatPreference: 0.1 });
    const provider = makeProvider({ fiatPreference: 0.1 });
    const cat = Object.keys(SKILL_CATEGORIES)[0];
    const result = decidePaymentMethod(requester, provider, cat, 1, SKILL_CATEGORIES);
    expect(["social_token", "fiat"]).toContain(result.method);
    expect(typeof result.amount).toBe("number");
    expect(result.amount).toBeGreaterThan(0);
    if (result.method === "social_token") {
      expect(result.fiatEquivalent).toBeGreaterThan(0);
    }
  });

  it("favours social_token when both prefer low fiat and high reputation", () => {
    const requester = makeRequester({
      fiatPreference: 0.1,
      reputation: { overall: 0.8 },
      personality: { social_drive: 0.9 },
    });
    const provider = makeProvider({ fiatPreference: 0.1 });
    const cat = "mentorship_advice";
    const result = decidePaymentMethod(requester, provider, cat, 1, SKILL_CATEGORIES);
    expect(result.method).toBe("social_token");
    expect(result.amount).toBe(1);
  });

  it("favours fiat when requester has high fiatPreference", () => {
    const requester = makeRequester({ fiatPreference: 0.95 });
    const provider = makeProvider({ fiatPreference: 0.9 });
    const cat = "software_dev";
    const result = decidePaymentMethod(requester, provider, cat, 1, SKILL_CATEGORIES);
    expect(result.method).toBe("fiat");
    expect(result.amount).toBeGreaterThan(0);
  });

  it("uses category fiatEquivalent for fiat cost", () => {
    const requester = makeRequester({ fiatPreference: 0.99 });
    const provider = makeProvider();
    const cat = "software_dev"; // 50 per hour
    const result = decidePaymentMethod(requester, provider, cat, 2, SKILL_CATEGORIES);
    expect(result.method).toBe("fiat");
    expect(result.amount).toBe(100);
  });
});
