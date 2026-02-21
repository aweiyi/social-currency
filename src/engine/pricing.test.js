import { describe, it, expect } from "vitest";
import {
  getTopSkill,
  calculateCategoryScarcity,
  calculateMarketPrice,
} from "./pricing.js";

describe("pricing", () => {
  describe("getTopSkill", () => {
    it("returns null for missing or empty skills", () => {
      expect(getTopSkill(null)).toBe(null);
      expect(getTopSkill({})).toBe(null);
      expect(getTopSkill({ skills: {} })).toBe(null);
    });

    it("returns the key with highest skill value", () => {
      const agent = {
        skills: { software_dev: 0.3, design_creative: 0.9, writing_content: 0.1 },
      };
      expect(getTopSkill(agent)).toBe("design_creative");
    });

    it("returns first key when tied", () => {
      const agent = {
        skills: { a: 0.5, b: 0.5 },
      };
      const top = getTopSkill(agent);
      expect(["a", "b"]).toContain(top);
    });
  });

  describe("calculateCategoryScarcity", () => {
    it("returns 0 when no agents or no top skill", () => {
      expect(calculateCategoryScarcity({ skills: {} }, [])).toBe(0);
      expect(calculateCategoryScarcity({ skills: { x: 0.8 } }, [])).toBe(0);
    });

    it("returns higher scarcity when fewer providers have the skill", () => {
      const agent = { skills: { software_dev: 0.8 }, isActive: true };
      const all = [
        agent,
        { id: "2", skills: { software_dev: 0.6 }, isActive: true },
        { id: "3", skills: { software_dev: 0 }, isActive: true },
      ];
      // 2 providers out of 3 active -> 1 - 2/3 = 1/3
      expect(calculateCategoryScarcity(agent, all)).toBeCloseTo(1 / 3);
    });
  });

  describe("calculateMarketPrice", () => {
    it("returns value in [0, 1] with formula weights", () => {
      const agent = {
        reputation: { overall: 0.8 },
        tokens: { issued: 0, redeemed: 1 },
        redemptionSpeed: 0.9,
        skills: { software_dev: 0.9 },
      };
      const all = [agent, { id: "2", skills: { software_dev: 0 }, isActive: true }];
      const price = calculateMarketPrice(agent, all);
      expect(price).toBeGreaterThanOrEqual(0);
      expect(price).toBeLessThanOrEqual(1);
      // reputation 0.4*0.8 + (1-0)*0.25 + 0.2*0.9 + scarcity*0.15
      expect(price).toBeGreaterThan(0.5);
    });

    it("handles missing reputation and tokens", () => {
      const agent = { skills: {}, isActive: true };
      const price = calculateMarketPrice(agent, [agent]);
      expect(price).toBeGreaterThanOrEqual(0);
      expect(price).toBeLessThanOrEqual(1);
    });

    it("uses max(1, redeemed) to avoid division by zero", () => {
      const agent = {
        reputation: { overall: 0.5 },
        tokens: { issued: 5, redeemed: 0 },
        redemptionSpeed: 0.5,
        skills: {},
      };
      const price = calculateMarketPrice(agent, [agent]);
      expect(Number.isFinite(price)).toBe(true);
      expect(price).toBeGreaterThanOrEqual(0);
    });
  });
});
