import { describe, it, expect } from "vitest";
import {
  createPool,
  addLevy,
  computeHealthScore,
  getDefaultedTokenIds,
  attemptAbsorption,
} from "./pool.js";
import { SKILL_KEYS } from "../data/categories.js";

describe("pool", () => {
  describe("createPool", () => {
    it("returns pool with totalCapacity 0 and byCategory for all skill keys", () => {
      const pool = createPool();
      expect(pool.totalCapacity).toBe(0);
      expect(pool.healthScore).toBe(1);
      expect(pool.claimsProcessed).toBe(0);
      expect(Object.keys(pool.byCategory).length).toBe(SKILL_KEYS.length);
      SKILL_KEYS.forEach((k) => {
        expect(pool.byCategory[k]).toBe(0);
      });
    });
  });

  describe("addLevy", () => {
    it("adds 10% of amount to category and totalCapacity", () => {
      const pool = createPool();
      const cat = SKILL_KEYS[0];
      const next = addLevy(pool, 2, cat);
      expect(next.totalCapacity).toBe(0.2);
      expect(next.byCategory[cat]).toBe(0.2);
      expect(next).not.toBe(pool);
    });

    it("does not mutate original pool", () => {
      const pool = createPool();
      const cat = SKILL_KEYS[0];
      addLevy(pool, 2, cat);
      expect(pool.totalCapacity).toBe(0);
    });

    it("returns same pool for unknown category", () => {
      const pool = createPool();
      const next = addLevy(pool, 2, "unknown_category");
      expect(next).toBe(pool);
    });
  });

  describe("computeHealthScore", () => {
    it("returns 1 when totalOutstanding is 0", () => {
      const pool = { totalCapacity: 10 };
      expect(computeHealthScore(pool, 0)).toBe(1);
    });

    it("returns capacity / outstanding when both positive", () => {
      const pool = { totalCapacity: 20 };
      expect(computeHealthScore(pool, 10)).toBe(2);
      expect(computeHealthScore(pool, 40)).toBe(0.5);
    });
  });

  describe("getDefaultedTokenIds", () => {
    it("returns ids of active tokens issued by agent", () => {
      const tokens = [
        { id: "t1", issuer: "a1", status: "active" },
        { id: "t2", issuer: "a1", status: "active" },
        { id: "t3", issuer: "a2", status: "active" },
        { id: "t4", issuer: "a1", status: "redeemed" },
      ];
      expect(getDefaultedTokenIds("a1", tokens)).toEqual(["t1", "t2"]);
    });
  });

  describe("attemptAbsorption", () => {
    it("with volunteer returns redeemed and unchanged pool", () => {
      const pool = createPool();
      const token = { id: "t1", category: SKILL_KEYS[0], amount: 1 };
      const volunteer = {};
      const result = attemptAbsorption(token, volunteer, pool);
      expect(result.tokenStatus).toBe("redeemed");
      expect(result.pool).toBe(pool);
      expect(result.volunteerRepBonus).toBe(1.5);
    });

    it("without volunteer uses pool balance and deducts", () => {
      let pool = createPool();
      pool = addLevy(pool, 10, SKILL_KEYS[0]);
      const token = { id: "t1", category: SKILL_KEYS[0], amount: 1 };
      const result = attemptAbsorption(token, null, pool);
      expect(result.tokenStatus).toBe("pooled");
      expect(result.pool.totalCapacity).toBe(pool.totalCapacity - 0.1);
      expect(result.pool.claimsProcessed).toBe(1);
    });

    it("without volunteer and insufficient pool leaves token defaulted", () => {
      const pool = createPool();
      const token = { id: "t1", category: SKILL_KEYS[0], amount: 5 };
      const result = attemptAbsorption(token, null, pool);
      expect(result.tokenStatus).toBe("defaulted");
      expect(result.pool.totalCapacity).toBe(0);
    });
  });
});
